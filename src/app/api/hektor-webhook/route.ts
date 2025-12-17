import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';
import { parseStringPromise } from 'xml2js';

export async function POST(request: NextRequest) {
  try {
    // Vérifier le secret
    const authHeader = request.headers.get('authorization');
    const expectedAuth = `Bearer ${process.env.WEBHOOK_SECRET}`;
    
    if (authHeader !== expectedAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const xmlFile = formData.get('xml') as File;
    
    if (!xmlFile) {
      return NextResponse.json({ error: 'No XML file provided' }, { status: 400 });
    }

    const xmlContent = await xmlFile.text();
    
    // Nettoyer le XML de manière plus agressive pour déséchapper les entités
    let cleanedXml = xmlContent
      // Supprimer les caractères de contrôle d'abord
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
      // Déséchapper les entités HTML communes (dans l'ordre inverse pour éviter les conflits)
      // D'abord les entités doublement échappées
      .replace(/&amp;quot;/g, '"')
      .replace(/&amp;gt;/g, '>')
      .replace(/&amp;lt;/g, '<')
      .replace(/&amp;amp;/g, '&')
      // Ensuite les entités simplement échappées
      .replace(/&quot;/g, '"')
      .replace(/&gt;/g, '>')
      .replace(/&lt;/g, '<')
      // Échapper uniquement les & non échappés restants (pas dans les entités valides)
      .replace(/&(?![a-zA-Z]+;|#\d+;|#x[0-9a-fA-F]+;)/g, '&amp;');
    
    // Parser le XML Hektor avec gestion d'erreur améliorée
    let parsed;
    try {
      parsed = await parseStringPromise(cleanedXml, {
        explicitArray: true,
        mergeAttrs: true,
        trim: true,
        normalize: true,
        explicitCharkey: false,
        ignoreAttrs: false,
        explicitRoot: true,
        attrkey: '_',
        charkey: '_',
        // Options supplémentaires pour plus de tolérance
        async: false,
        attrNameProcessors: [],
        attrValueProcessors: [],
        tagNameProcessors: [],
        valueProcessors: []
      });
    } catch (parseError) {
      console.error('Erreur parsing XML:', parseError);
      // Log les lignes autour de l'erreur pour debug
      const errorMsg = parseError instanceof Error ? parseError.message : 'Unknown parse error';
      const lineMatch = errorMsg.match(/Line:\s*(\d+)/);
      const colMatch = errorMsg.match(/Column:\s*(\d+)/);
      
      let preview = cleanedXml.substring(0, 1000);
      if (lineMatch) {
        const lineNum = parseInt(lineMatch[1]);
        const lines = cleanedXml.split('\n');
        const start = Math.max(0, lineNum - 3);
        const end = Math.min(lines.length, lineNum + 3);
        preview = lines.slice(start, end).join('\n');
      }
      
      console.error('Preview XML autour de l\'erreur:', preview);
      return NextResponse.json(
        { 
          error: 'XML parsing failed', 
          details: errorMsg,
          preview: preview,
          xmlLength: cleanedXml.length
        }, 
        { status: 400 }
      );
    }
    
    if (!parsed.hektor || !parsed.hektor.ad) {
      return NextResponse.json({ error: 'Invalid Hektor XML format' }, { status: 400 });
    }

    const ads = Array.isArray(parsed.hektor.ad) ? parsed.hektor.ad : [parsed.hektor.ad];
    
    // Extraire les propriétés du XML Hektor
    const properties = ads.map((ad: any) => extractPropertyFromHektor(ad));
    
    // Filtrer uniquement les ventes (type_offre_code = 0 ou "0")
    const ventes = properties.filter((p: any) => 
      p.type_offre_code === '0' || p.type_offre_code === 0 || p.type_offre_code === 'Vente'
    );
    
    // Mettre à jour Supabase
    const supabase = await supabaseServer();
    let processed = 0;
    
    for (const property of ventes) {
      try {
        // Vérifier si la propriété existe déjà (par external_id)
        const { data: existing } = await supabase
          .from('properties')
          .select('id')
          .eq('external_id', property.external_id)
          .single();

        if (existing) {
          // Mettre à jour
          const { type_offre_code, ...propertyData } = property; // Retirer type_offre_code
          const { error } = await supabase
            .from('properties')
            .update({
              ...propertyData,
              updated_at: new Date().toISOString()
            })
            .eq('id', existing.id);
          
          if (!error) processed++;
        } else {
          // Créer
          const { type_offre_code, ...propertyData } = property; // Retirer type_offre_code
          const { error } = await supabase
            .from('properties')
            .insert(propertyData);
          
          if (!error) processed++;
        }
      } catch (err) {
        console.error(`Erreur pour propriété ${property.external_id}:`, err);
      }
    }

    return NextResponse.json({ 
      success: true, 
      processed,
      total: ventes.length
    });
    
  } catch (error) {
    console.error('Erreur traitement XML:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' }, 
      { status: 500 }
    );
  }
}

function extractPropertyFromHektor(ad: any): any {
  // Extraire l'ID et la clé mandat
  const id = ad.id?._ || ad.id?.[0] || '';
  const mandateKey = ad.id?.mandateKey || ad.id?.[0] || '';
  const reference = ad.reference_client?.[0] || ad.reference?.[0] || '';
  
  // Mapper le statut Hektor vers votre statut
  const statusMap: Record<string, string> = {
    '2': 'a_vendre',  // Actif
    '3': 'sous_compromis',  // Sous Offre
    '4': 'sous_compromis',  // Sous Compromis
    '5': 'vendu',  // Vendu
  };
  const hektorStatus = ad.status?.[0] || '2';
  const status = statusMap[hektorStatus] || 'a_vendre';
  
  // Extraire les photos
  const photos = ad.photos?.[0]?.photo || [];
  const photoArray = Array.isArray(photos) ? photos : [photos];
  const photoUrls = photoArray
    .map((p: any) => typeof p === 'string' ? p : p._ || p.url || p)
    .filter(Boolean);
  
  // Extraire les prestations
  const prestations: any = {};
  
  // Parking/Garage
  if (ad.nb_places_parking?.[0]) {
    prestations.parking = parseInt(ad.nb_places_parking[0]) || 0;
  }
  if (ad.nb_places_garage?.[0]) {
    prestations.garage = parseInt(ad.nb_places_garage[0]) || 0;
  }
  
  // Équipements
  prestations.ascenseur = ad.ascenseur?.[0] === 'true' || ad.ascenseur?.[0] === '1';
  prestations.balcon = ad.balcon?.[0] === 'true' || ad.balcon?.[0] === '1';
  prestations.terrasse = ad.terrasse?.[0] === 'true' || ad.terrasse?.[0] === '1';
  prestations.cave = ad.cave?.[0] === 'true' || ad.cave?.[0] === '1';
  prestations.piscine = ad.piscine?.[0] === 'true' || ad.piscine?.[0] === '1';
  prestations.jardin = ad.jardin?.[0] === 'true' || ad.jardin?.[0] === '1';
  
  // Chauffage
  const formatChauffage = ad.format_chauffage?.[0] || '';
  const energieChauffage = ad.energie_chauffage?.[0] || '';
  if (formatChauffage.includes('INDIVIDUEL')) {
    prestations.chauffage = 'individuel';
  } else if (formatChauffage.includes('COLLECTIF')) {
    prestations.chauffage = 'collectif';
  } else if (energieChauffage.includes('ELECTRIQUE')) {
    prestations.chauffage = 'electrique';
  } else if (energieChauffage.includes('GAZ')) {
    prestations.chauffage = 'gaz';
  }
  
  // Localisation
  const ville = ad.ville?.[0] || '';
  const cp = ad.code_postal?.[0] || '';
  const location = ville && cp ? `${ville} ${cp}` : (ville || cp || 'Non spécifié');
  
  return {
    external_id: mandateKey || id || reference, // ID unique depuis Hektor
    type_offre_code: ad.type_offre_code?.[0] || ad.type_offre?.[0] || '0', // Pour le filtrage
    title: ad.titre?.[0] || 'Sans titre',
    price: parseFloat(ad.prix?.[0] || '0'),
    location: location,
    image: photoUrls[0] || '/placeholder.jpg',
    photo_principale: photoUrls[0] || null,
    photos: photoUrls,
    beds: parseInt(ad.nb_pieces?.[0] || '0'),
    baths: parseInt(ad.nb_chambres?.[0] || ad.nb_sdb?.[0] || '0'),
    area: parseInt(ad.surface?.[0] || ad.surface_habitable?.[0] || '0'),
    description: ad.corps?.[0] || '',
    status: status,
    prestations: prestations,
    surface_totale: parseFloat(ad.surface?.[0] || ad.surface_habitable?.[0] || '0') || null,
    surface_terrasse: parseFloat(ad.surface_terrasse?.[0] || '0') || null,
    surface_balcon: parseFloat(ad.surface_balcon?.[0] || '0') || null,
    surface_cave: parseFloat(ad.surface_cave?.[0] || '0') || null,
    surface_garage: parseFloat(ad.surface_garage?.[0] || '0') || null,
    surface_jardin: parseFloat(ad.surface_jardin?.[0] || '0') || null,
    dpe_consommation: ad.dpe_consommation?.[0] || null,
    dpe_ges: ad.dpe_ges?.[0] || null,
  };
}
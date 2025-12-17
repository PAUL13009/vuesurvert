import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';
import { XMLParser } from 'fast-xml-parser';

export async function POST(request: NextRequest) {
  try {
    // Vérifier le secret
    const authHeader = request.headers.get('authorization');
    const expectedAuth = `Bearer ${process.env.WEBHOOK_SECRET}`;
    
    if (authHeader !== expectedAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Accepter le XML directement dans le body (texte brut) ou via FormData pour compatibilité
    let xmlContent: string;
    
    const contentType = request.headers.get('content-type') || '';
    
    if (contentType.includes('application/xml') || contentType.includes('text/xml')) {
      // XML envoyé directement dans le body en texte brut
      xmlContent = await request.text();
    } else {
      // Fallback sur FormData pour compatibilité
      const formData = await request.formData();
      const xmlFile = formData.get('xml') as File;
      
      if (!xmlFile) {
        return NextResponse.json({ error: 'No XML file provided' }, { status: 400 });
      }
      
      xmlContent = await xmlFile.text();
    }
    
    if (!xmlContent || xmlContent.trim().length === 0) {
      return NextResponse.json({ error: 'Empty XML content' }, { status: 400 });
    }
    
    // Utiliser fast-xml-parser qui est beaucoup plus tolérant avec les XML mal formés
    // Il gère automatiquement les entités échappées
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '',
      textNodeName: '_text',
      parseTagValue: true,
      trimValues: true,
      processEntities: true, // Important : traite les entités automatiquement
      htmlEntities: true, // Traite les entités HTML
      isArray: (name, jPath, isLeafNode, isAttribute) => {
        // Retourner true pour les éléments qui doivent être des tableaux
        if (name === 'ad') return true;
        if (name === 'photo' || name === 'image') return true;
        return false;
      }
    });
    
    let parsed;
    try {
      // fast-xml-parser peut parser même des XML avec des entités échappées
      parsed = parser.parse(xmlContent);
    } catch (parseError) {
      console.error('Erreur parsing XML:', parseError);
      const errorMsg = parseError instanceof Error ? parseError.message : 'Unknown parse error';
      return NextResponse.json(
        { 
          error: 'XML parsing failed', 
          details: errorMsg,
          preview: xmlContent.substring(0, 500)
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
  // Helper pour extraire la valeur (gère _text, tableaux, strings)
  const getValue = (field: any): string => {
    if (!field) return '';
    if (typeof field === 'string') return field;
    if (Array.isArray(field)) {
      const first = field[0];
      if (typeof first === 'string') return first;
      return first?._text || first || '';
    }
    return field._text || field || '';
  };
  
  // Helper pour extraire un nombre
  const getNumber = (field: any, defaultValue: number = 0): number => {
    const value = getValue(field);
    return parseInt(value) || defaultValue;
  };
  
  // Helper pour extraire un float
  const getFloat = (field: any, defaultValue: number = 0): number => {
    const value = getValue(field);
    return parseFloat(value) || defaultValue;
  };
  
  // Extraire l'ID et la clé mandat (fast-xml-parser met les attributs directement sur l'objet)
  const idElement = ad.id;
  let id = '';
  let mandateKey = '';
  
  if (idElement) {
    if (typeof idElement === 'object') {
      id = idElement._text || idElement || '';
      mandateKey = idElement.mandateKey || idElement._text || idElement || '';
    } else {
      id = String(idElement);
      mandateKey = String(idElement);
    }
  }
  
  const reference = getValue(ad.reference_client || ad.reference);
  
  // Mapper le statut Hektor vers votre statut
  const statusMap: Record<string, string> = {
    '2': 'a_vendre',  // Actif
    '3': 'sous_compromis',  // Sous Offre
    '4': 'sous_compromis',  // Sous Compromis
    '5': 'vendu',  // Vendu
  };
  const hektorStatus = getValue(ad.status) || '2';
  const status = statusMap[hektorStatus] || 'a_vendre';
  
  // Extraire les photos (gérer images et photos)
  let photoUrls: string[] = [];
  
  // Nouveau format : <images><image>...</image></images>
  if (ad.images?.image) {
    const images = Array.isArray(ad.images.image) ? ad.images.image : [ad.images.image];
    photoUrls = images
      .map((img: any) => {
        const url = getValue(img);
        return url;
      })
      .filter(Boolean);
  }
  
  // Ancien format : <photos><photo>...</photo></photos>
  if (photoUrls.length === 0 && ad.photos?.photo) {
    const photos = Array.isArray(ad.photos.photo) ? ad.photos.photo : [ad.photos.photo];
    photoUrls = photos
      .map((p: any) => getValue(p))
      .filter(Boolean);
  }
  
  // Extraire les prestations
  const prestations: any = {};
  
  // Parking/Garage
  const parking = getNumber(ad.nb_places_parking);
  if (parking > 0) prestations.parking = parking;
  
  const garage = getNumber(ad.nb_places_garage);
  if (garage > 0) prestations.garage = garage;
  
  // Équipements
  prestations.ascenseur = getValue(ad.ascenseur) === 'true' || getValue(ad.ascenseur) === '1';
  prestations.balcon = getValue(ad.balcon) === 'true' || getValue(ad.balcon) === '1';
  prestations.terrasse = getValue(ad.terrasse) === 'true' || getValue(ad.terrasse) === '1';
  prestations.cave = getValue(ad.cave) === 'true' || getValue(ad.cave) === '1';
  prestations.piscine = getValue(ad.piscine) === 'true' || getValue(ad.piscine) === '1';
  prestations.jardin = getValue(ad.jardin) === 'true' || getValue(ad.jardin) === '1';
  
  // Chauffage
  const formatChauffage = getValue(ad.format_chauffage);
  const energieChauffage = getValue(ad.energie_chauffage);
  if (formatChauffage.includes('INDIVIDUEL')) {
    prestations.chauffage = 'individuel';
  } else if (formatChauffage.includes('COLLECTIF')) {
    prestations.chauffage = 'collectif';
  } else if (energieChauffage.includes('ELECTRIQUE')) {
    prestations.chauffage = 'electrique';
  } else if (energieChauffage.includes('GAZ')) {
    prestations.chauffage = 'gaz';
  }
  
  // Localisation (gérer cp et code_postal)
  const ville = getValue(ad.ville);
  const cp = getValue(ad.cp || ad.code_postal);
  const location = ville && cp ? `${ville} ${cp}` : (ville || cp || 'Non spécifié');
  
  // Détecter le type d'offre (gérer type_offre et type_offre_code)
  let typeOffreCode = '0';
  const typeOffreCodeValue = getValue(ad.type_offre_code);
  const typeOffreValue = getValue(ad.type_offre);
  
  if (typeOffreCodeValue) {
    typeOffreCode = typeOffreCodeValue;
  } else if (typeOffreValue) {
    // Si type_offre contient "Vente", c'est une vente
    const typeOffre = String(typeOffreValue).toLowerCase();
    if (typeOffre.includes('vente') || typeOffre === 'vente') {
      typeOffreCode = '0';
    } else {
      typeOffreCode = '1'; // Location
    }
  }
  
  return {
    external_id: mandateKey || id || reference, // ID unique depuis Hektor
    type_offre_code: typeOffreCode, // Pour le filtrage
    title: getValue(ad.titre) || 'Sans titre',
    price: getFloat(ad.prix),
    location: location,
    image: photoUrls[0] || '/placeholder.jpg',
    photo_principale: photoUrls[0] || null,
    photos: photoUrls,
    beds: getNumber(ad.nb_pieces),
    baths: getNumber(ad.chambres || ad.nb_chambres || ad.sde || ad.nb_sdb),
    area: getNumber(ad.surface_habitable || ad.surface),
    description: getValue(ad.corps) || '',
    status: status,
    prestations: prestations,
    surface_totale: getFloat(ad.surface_habitable || ad.surface) || null,
    surface_terrasse: getFloat(ad.surface_terrasse) || null,
    surface_balcon: getFloat(ad.surface_balcon) || null,
    surface_cave: getFloat(ad.surface_cave) || null,
    surface_garage: getFloat(ad.surface_garage) || null,
    surface_jardin: getFloat(ad.surface_jardin) || null,
    dpe_consommation: getValue(ad.dpe_consommation) || null,
    dpe_ges: getValue(ad.dpe_ges) || null,
  };
}
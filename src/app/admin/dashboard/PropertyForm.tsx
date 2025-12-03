"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";
import PhotoUpload from "./PhotoUpload";
import type { Property } from "@/components/PropertyCard";
import { createProperty, updateProperty, type PropertyPayload } from "./actions";

interface PropertyFormProps {
  property?: Property | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function PropertyForm({ property, onSuccess, onCancel }: PropertyFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const uploadPhotosRef = useRef<((propertyId?: string) => Promise<string[]>) | null>(null);
  
  // Données de base
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    location: "",
    image: "",
    beds: "",
    baths: "",
    area: "",
    status: "a_vendre" as "a_vendre" | "vendu" | "sous_compromis",
  });

  // Prestations
  const [prestations, setPrestations] = useState({
    parking: false,
    parkingPlaces: "",
    ascenseur: false,
    balcon: false,
    terrasse: false,
    cave: false,
    garage: false,
    garagePlaces: "",
    piscine: false,
    jardin: false,
    climatisation: false,
    chauffage: "" as "" | "individuel" | "collectif" | "electrique" | "gaz" | "autre",
    internet: false,
    fibre: false,
    interphone: false,
    digicode: false,
    gardien: false,
    local_velo: false,
    autres: "",
  });

  // Surfaces
  const [surfaces, setSurfaces] = useState({
    surface_totale: "",
    surface_terrasse: "",
    surface_balcon: "",
    surface_cave: "",
    surface_garage: "",
    surface_jardin: "",
  });

  // DPE
  const [dpe, setDpe] = useState({
    dpe_consommation: "" as "" | "A" | "B" | "C" | "D" | "E" | "F" | "G",
    dpe_ges: "" as "" | "A" | "B" | "C" | "D" | "E" | "F" | "G",
  });

  useEffect(() => {
    if (property) {
      setFormData({
        title: property.title,
        price: String(property.price),
        location: property.location,
        image: property.image,
        beds: String(property.beds),
        baths: String(property.baths),
        area: String(property.area),
        status: property.status || "a_vendre",
      });
      setDescription(property.description || "");
      setPhotos(property.photos || []);
      
      // Charger les prestations
      if (property.prestations) {
        setPrestations({
          parking: !!property.prestations.parking,
          parkingPlaces: property.prestations.parking ? String(property.prestations.parking) : "",
          ascenseur: property.prestations.ascenseur || false,
          balcon: property.prestations.balcon || false,
          terrasse: property.prestations.terrasse || false,
          cave: property.prestations.cave || false,
          garage: !!property.prestations.garage,
          garagePlaces: property.prestations.garage ? String(property.prestations.garage) : "",
          piscine: property.prestations.piscine || false,
          jardin: property.prestations.jardin || false,
          climatisation: property.prestations.climatisation || false,
          chauffage: property.prestations.chauffage || "",
          internet: property.prestations.internet || false,
          fibre: property.prestations.fibre || false,
          interphone: property.prestations.interphone || false,
          digicode: property.prestations.digicode || false,
          gardien: property.prestations.gardien || false,
          local_velo: property.prestations.local_velo || false,
          autres: property.prestations.autres || "",
        });
      }
      
      // Charger les surfaces
      setSurfaces({
        surface_totale: property.surface_totale ? String(property.surface_totale) : "",
        surface_terrasse: property.surface_terrasse ? String(property.surface_terrasse) : "",
        surface_balcon: property.surface_balcon ? String(property.surface_balcon) : "",
        surface_cave: property.surface_cave ? String(property.surface_cave) : "",
        surface_garage: property.surface_garage ? String(property.surface_garage) : "",
        surface_jardin: property.surface_jardin ? String(property.surface_jardin) : "",
      });
      
      // Charger le DPE
      setDpe({
        dpe_consommation: property.dpe_consommation || "",
        dpe_ges: property.dpe_ges || "",
      });
    } else {
      // Reset form
      setFormData({
        title: "",
        price: "",
        location: "",
        image: "",
        beds: "",
        baths: "",
        area: "",
        status: "a_vendre",
      });
      setDescription("");
      setPhotos([]);
      setPrestations({
        parking: false,
        parkingPlaces: "",
        ascenseur: false,
        balcon: false,
        terrasse: false,
        cave: false,
        garage: false,
        garagePlaces: "",
        piscine: false,
        jardin: false,
        climatisation: false,
        chauffage: "",
        internet: false,
        fibre: false,
        interphone: false,
        digicode: false,
        gardien: false,
        local_velo: false,
        autres: "",
      });
      setSurfaces({
        surface_totale: "",
        surface_terrasse: "",
        surface_balcon: "",
        surface_cave: "",
        surface_garage: "",
        surface_jardin: "",
      });
      setDpe({
        dpe_consommation: "",
        dpe_ges: "",
      });
    }
    setMessage(null);
  }, [property]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const supabase = supabaseBrowser();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setMessage("Non authentifié. Veuillez vous reconnecter.");
      setIsSubmitting(false);
      return;
    }

    // Valider qu'au moins une photo est présente
    if (photos.length === 0 && !uploadPhotosRef.current) {
      setMessage("Veuillez sélectionner au moins une photo.");
      setIsSubmitting(false);
      return;
    }

    // Validation : surface totale >= surface habitable
    if (surfaces.surface_totale && Number(surfaces.surface_totale) < Number(formData.area)) {
      setMessage("La surface totale doit être supérieure ou égale à la surface habitable.");
      setIsSubmitting(false);
      return;
    }

    try {
      // Uploader les nouvelles photos si nécessaire
      let finalPhotos = photos;
      if (uploadPhotosRef.current) {
        finalPhotos = await uploadPhotosRef.current(property?.id);
      }

      if (finalPhotos.length === 0) {
        setMessage("Veuillez sélectionner au moins une photo.");
        setIsSubmitting(false);
        return;
      }

      // Construire l'objet prestations
      const prestationsData: any = {};
      if (prestations.parking) {
        prestationsData.parking = Number(prestations.parkingPlaces) || 1;
      }
      if (prestations.ascenseur) prestationsData.ascenseur = true;
      if (prestations.balcon) prestationsData.balcon = true;
      if (prestations.terrasse) prestationsData.terrasse = true;
      if (prestations.cave) prestationsData.cave = true;
      if (prestations.garage) {
        prestationsData.garage = Number(prestations.garagePlaces) || 1;
      }
      if (prestations.piscine) prestationsData.piscine = true;
      if (prestations.jardin) prestationsData.jardin = true;
      if (prestations.climatisation) prestationsData.climatisation = true;
      if (prestations.chauffage) prestationsData.chauffage = prestations.chauffage;
      if (prestations.internet) prestationsData.internet = true;
      if (prestations.fibre) prestationsData.fibre = true;
      if (prestations.interphone) prestationsData.interphone = true;
      if (prestations.digicode) prestationsData.digicode = true;
      if (prestations.gardien) prestationsData.gardien = true;
      if (prestations.local_velo) prestationsData.local_velo = true;
      if (prestations.autres) prestationsData.autres = prestations.autres;

      const payload: any = {
        title: formData.title,
        price: Number(formData.price) || 0,
        location: formData.location,
        image: finalPhotos[0] || formData.image,
        beds: Number(formData.beds) || 0,
        baths: Number(formData.baths) || 0,
        area: Number(formData.area) || 0,
        status: formData.status,
        prestations: prestationsData,
      };

      // Ajouter description si elle existe
      if (description) {
        payload.description = description;
      }

      // Ajouter photos (array PostgreSQL)
      if (finalPhotos.length > 0) {
        payload.photos = finalPhotos;
        payload.photo_principale = finalPhotos[0];
      }

      // Ajouter les surfaces si renseignées
      if (surfaces.surface_totale) {
        payload.surface_totale = Number(surfaces.surface_totale);
      }
      if (surfaces.surface_terrasse) {
        payload.surface_terrasse = Number(surfaces.surface_terrasse);
      }
      if (surfaces.surface_balcon) {
        payload.surface_balcon = Number(surfaces.surface_balcon);
      }
      if (surfaces.surface_cave) {
        payload.surface_cave = Number(surfaces.surface_cave);
      }
      if (surfaces.surface_garage) {
        payload.surface_garage = Number(surfaces.surface_garage);
      }
      if (surfaces.surface_jardin) {
        payload.surface_jardin = Number(surfaces.surface_jardin);
      }

      // Ajouter le DPE si renseigné
      if (dpe.dpe_consommation) {
        payload.dpe_consommation = dpe.dpe_consommation;
      }
      if (dpe.dpe_ges) {
        payload.dpe_ges = dpe.dpe_ges;
      }

      // Construire le payload complet pour la server action
      const propertyPayload: PropertyPayload = {
        title: payload.title,
        price: payload.price,
        location: payload.location,
        image: payload.image,
        beds: payload.beds,
        baths: payload.baths,
        area: payload.area,
        status: payload.status,
        prestations: payload.prestations,
        description: payload.description,
        photos: payload.photos,
        photo_principale: payload.photo_principale,
        surface_totale: payload.surface_totale,
        surface_terrasse: payload.surface_terrasse,
        surface_balcon: payload.surface_balcon,
        surface_cave: payload.surface_cave,
        surface_garage: payload.surface_garage,
        surface_jardin: payload.surface_jardin,
        dpe_consommation: payload.dpe_consommation,
        dpe_ges: payload.dpe_ges,
      };

      if (property) {
        // Update via server action
        const result = await updateProperty(property.id, propertyPayload);
        if (!result.success) {
          throw new Error(result.error || "Erreur lors de la mise à jour");
        }
      } else {
        // Create via server action
        const result = await createProperty(propertyPayload);
        if (!result.success) {
          throw new Error(result.error || "Erreur lors de la création");
        }
        
        // Si on a créé une nouvelle propriété et qu'il y a des photos à uploader, les ré-uploader avec le bon ID
        if (uploadPhotosRef.current && result.data && finalPhotos.length > 0) {
          try {
            await uploadPhotosRef.current(result.data.id);
            // Revalider après l'upload des photos
            router.refresh();
          } catch (uploadError) {
            console.error("Photo re-upload error:", uploadError);
          }
        }
      }

      router.refresh();
      setMessage(property ? "Modifications enregistrées avec succès." : "Annonce créée avec succès.");
      
      // Reset form
      if (!property) {
        setFormData({
          title: "",
          price: "",
          location: "",
          image: "",
          beds: "",
          baths: "",
          area: "",
          status: "a_vendre",
        });
        setDescription("");
        setPhotos([]);
        setPrestations({
          parking: false,
          parkingPlaces: "",
          ascenseur: false,
          balcon: false,
          terrasse: false,
          cave: false,
          garage: false,
          garagePlaces: "",
          piscine: false,
          jardin: false,
          climatisation: false,
          chauffage: "",
          internet: false,
          fibre: false,
          interphone: false,
          digicode: false,
          gardien: false,
          local_velo: false,
          autres: "",
        });
        setSurfaces({
          surface_totale: "",
          surface_terrasse: "",
          surface_balcon: "",
          surface_cave: "",
          surface_garage: "",
          surface_jardin: "",
        });
        setDpe({
          dpe_consommation: "",
          dpe_ges: "",
        });
      }
      if (onSuccess) {
        setTimeout(() => onSuccess(), 1000);
      }
    } catch (err) {
      console.error("Form submission error:", err);
      const errorMessage = err instanceof Error ? err.message : "Erreur inconnue";
      setMessage(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-6">
        {property ? "Modifier l'annonce" : "Ajouter une annonce"}
      </h2>
      <form onSubmit={onSubmit} className="space-y-8">
        {/* Informations de base */}
        <div>
          <h3 className="text-md font-semibold text-zinc-800 mb-4 pb-2 border-b border-zinc-200">
            Informations de base
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-zinc-800" htmlFor="title">
                Titre
              </label>
              <input
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none ring-emerald-600 focus:ring-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-800" htmlFor="price">
                Prix (€)
              </label>
              <input
                id="price"
                name="price"
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none ring-emerald-600 focus:ring-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-800" htmlFor="location">
                Localisation
              </label>
              <input
                id="location"
                name="location"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none ring-emerald-600 focus:ring-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-800" htmlFor="status">
                Statut
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none ring-emerald-600 focus:ring-2"
              >
                <option value="a_vendre">À Vendre</option>
                <option value="vendu">Vendu</option>
                <option value="sous_compromis">Sous Compromis</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-zinc-800" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none ring-emerald-600 focus:ring-2"
                placeholder="Décrivez le bien en détail..."
              />
            </div>
          </div>
        </div>

        {/* Caractéristiques principales */}
        <div>
          <h3 className="text-md font-semibold text-zinc-800 mb-4 pb-2 border-b border-zinc-200">
            Caractéristiques principales
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-zinc-800" htmlFor="beds">
                Chambres
              </label>
              <input
                id="beds"
                name="beds"
                type="number"
                required
                value={formData.beds}
                onChange={(e) => setFormData({ ...formData, beds: e.target.value })}
                className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none ring-emerald-600 focus:ring-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-800" htmlFor="baths">
                Salles de bain
              </label>
              <input
                id="baths"
                name="baths"
                type="number"
                required
                value={formData.baths}
                onChange={(e) => setFormData({ ...formData, baths: e.target.value })}
                className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none ring-emerald-600 focus:ring-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-800" htmlFor="area">
                Surface habitable (m²)
              </label>
              <input
                id="area"
                name="area"
                type="number"
                required
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none ring-emerald-600 focus:ring-2"
              />
            </div>
          </div>
        </div>

        {/* Prestations */}
        <div>
          <h3 className="text-md font-semibold text-zinc-800 mb-4 pb-2 border-b border-zinc-200">
            Prestations
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="parking"
                checked={prestations.parking}
                onChange={(e) => setPrestations({ ...prestations, parking: e.target.checked })}
                className="rounded border-zinc-300 text-emerald-600 focus:ring-emerald-600"
              />
              <label htmlFor="parking" className="text-sm text-zinc-800">
                Parking
              </label>
              {prestations.parking && (
                <input
                  type="number"
                  placeholder="Places"
                  value={prestations.parkingPlaces}
                  onChange={(e) => setPrestations({ ...prestations, parkingPlaces: e.target.value })}
                  className="ml-2 w-20 rounded-lg border border-zinc-300 px-2 py-1 text-sm outline-none ring-emerald-600 focus:ring-1"
                />
              )}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="ascenseur"
                checked={prestations.ascenseur}
                onChange={(e) => setPrestations({ ...prestations, ascenseur: e.target.checked })}
                className="rounded border-zinc-300 text-emerald-600 focus:ring-emerald-600"
              />
              <label htmlFor="ascenseur" className="text-sm text-zinc-800">
                Ascenseur
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="balcon"
                checked={prestations.balcon}
                onChange={(e) => setPrestations({ ...prestations, balcon: e.target.checked })}
                className="rounded border-zinc-300 text-emerald-600 focus:ring-emerald-600"
              />
              <label htmlFor="balcon" className="text-sm text-zinc-800">
                Balcon
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="terrasse"
                checked={prestations.terrasse}
                onChange={(e) => setPrestations({ ...prestations, terrasse: e.target.checked })}
                className="rounded border-zinc-300 text-emerald-600 focus:ring-emerald-600"
              />
              <label htmlFor="terrasse" className="text-sm text-zinc-800">
                Terrasse
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="cave"
                checked={prestations.cave}
                onChange={(e) => setPrestations({ ...prestations, cave: e.target.checked })}
                className="rounded border-zinc-300 text-emerald-600 focus:ring-emerald-600"
              />
              <label htmlFor="cave" className="text-sm text-zinc-800">
                Cave
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="garage"
                checked={prestations.garage}
                onChange={(e) => setPrestations({ ...prestations, garage: e.target.checked })}
                className="rounded border-zinc-300 text-emerald-600 focus:ring-emerald-600"
              />
              <label htmlFor="garage" className="text-sm text-zinc-800">
                Garage
              </label>
              {prestations.garage && (
                <input
                  type="number"
                  placeholder="Places"
                  value={prestations.garagePlaces}
                  onChange={(e) => setPrestations({ ...prestations, garagePlaces: e.target.value })}
                  className="ml-2 w-20 rounded-lg border border-zinc-300 px-2 py-1 text-sm outline-none ring-emerald-600 focus:ring-1"
                />
              )}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="piscine"
                checked={prestations.piscine}
                onChange={(e) => setPrestations({ ...prestations, piscine: e.target.checked })}
                className="rounded border-zinc-300 text-emerald-600 focus:ring-emerald-600"
              />
              <label htmlFor="piscine" className="text-sm text-zinc-800">
                Piscine
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="jardin"
                checked={prestations.jardin}
                onChange={(e) => setPrestations({ ...prestations, jardin: e.target.checked })}
                className="rounded border-zinc-300 text-emerald-600 focus:ring-emerald-600"
              />
              <label htmlFor="jardin" className="text-sm text-zinc-800">
                Jardin
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="climatisation"
                checked={prestations.climatisation}
                onChange={(e) => setPrestations({ ...prestations, climatisation: e.target.checked })}
                className="rounded border-zinc-300 text-emerald-600 focus:ring-emerald-600"
              />
              <label htmlFor="climatisation" className="text-sm text-zinc-800">
                Climatisation
              </label>
            </div>
            <div className="sm:col-span-2 lg:col-span-1">
              <label className="block text-sm font-medium text-zinc-800 mb-1" htmlFor="chauffage">
                Chauffage
              </label>
              <select
                id="chauffage"
                value={prestations.chauffage}
                onChange={(e) => setPrestations({ ...prestations, chauffage: e.target.value as any })}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none ring-emerald-600 focus:ring-2"
              >
                <option value="">Non renseigné</option>
                <option value="individuel">Individuel</option>
                <option value="collectif">Collectif</option>
                <option value="electrique">Électrique</option>
                <option value="gaz">Gaz</option>
                <option value="autre">Autre</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="internet"
                checked={prestations.internet}
                onChange={(e) => setPrestations({ ...prestations, internet: e.target.checked })}
                className="rounded border-zinc-300 text-emerald-600 focus:ring-emerald-600"
              />
              <label htmlFor="internet" className="text-sm text-zinc-800">
                Internet
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="fibre"
                checked={prestations.fibre}
                onChange={(e) => setPrestations({ ...prestations, fibre: e.target.checked })}
                className="rounded border-zinc-300 text-emerald-600 focus:ring-emerald-600"
              />
              <label htmlFor="fibre" className="text-sm text-zinc-800">
                Fibre optique
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="interphone"
                checked={prestations.interphone}
                onChange={(e) => setPrestations({ ...prestations, interphone: e.target.checked })}
                className="rounded border-zinc-300 text-emerald-600 focus:ring-emerald-600"
              />
              <label htmlFor="interphone" className="text-sm text-zinc-800">
                Interphone
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="digicode"
                checked={prestations.digicode}
                onChange={(e) => setPrestations({ ...prestations, digicode: e.target.checked })}
                className="rounded border-zinc-300 text-emerald-600 focus:ring-emerald-600"
              />
              <label htmlFor="digicode" className="text-sm text-zinc-800">
                Digicode
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="gardien"
                checked={prestations.gardien}
                onChange={(e) => setPrestations({ ...prestations, gardien: e.target.checked })}
                className="rounded border-zinc-300 text-emerald-600 focus:ring-emerald-600"
              />
              <label htmlFor="gardien" className="text-sm text-zinc-800">
                Gardien
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="local_velo"
                checked={prestations.local_velo}
                onChange={(e) => setPrestations({ ...prestations, local_velo: e.target.checked })}
                className="rounded border-zinc-300 text-emerald-600 focus:ring-emerald-600"
              />
              <label htmlFor="local_velo" className="text-sm text-zinc-800">
                Local vélo
              </label>
            </div>
            <div className="sm:col-span-2 lg:col-span-3">
              <label className="block text-sm font-medium text-zinc-800 mb-1" htmlFor="autres">
                Autres prestations
              </label>
              <input
                type="text"
                id="autres"
                value={prestations.autres}
                onChange={(e) => setPrestations({ ...prestations, autres: e.target.value })}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none ring-emerald-600 focus:ring-2"
                placeholder="Autres prestations..."
              />
            </div>
          </div>
        </div>

        {/* Surfaces détaillées */}
        <div>
          <h3 className="text-md font-semibold text-zinc-800 mb-4 pb-2 border-b border-zinc-200">
            Surfaces détaillées
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-zinc-800" htmlFor="surface_totale">
                Surface totale (m²)
              </label>
              <input
                type="number"
                id="surface_totale"
                value={surfaces.surface_totale}
                onChange={(e) => setSurfaces({ ...surfaces, surface_totale: e.target.value })}
                className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none ring-emerald-600 focus:ring-2"
              />
            </div>
            {prestations.terrasse && (
              <div>
                <label className="block text-sm font-medium text-zinc-800" htmlFor="surface_terrasse">
                  Terrasse (m²)
                </label>
                <input
                  type="number"
                  id="surface_terrasse"
                  value={surfaces.surface_terrasse}
                  onChange={(e) => setSurfaces({ ...surfaces, surface_terrasse: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none ring-emerald-600 focus:ring-2"
                />
              </div>
            )}
            {prestations.balcon && (
              <div>
                <label className="block text-sm font-medium text-zinc-800" htmlFor="surface_balcon">
                  Balcon (m²)
                </label>
                <input
                  type="number"
                  id="surface_balcon"
                  value={surfaces.surface_balcon}
                  onChange={(e) => setSurfaces({ ...surfaces, surface_balcon: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none ring-emerald-600 focus:ring-2"
                />
              </div>
            )}
            {prestations.cave && (
              <div>
                <label className="block text-sm font-medium text-zinc-800" htmlFor="surface_cave">
                  Cave (m²)
                </label>
                <input
                  type="number"
                  id="surface_cave"
                  value={surfaces.surface_cave}
                  onChange={(e) => setSurfaces({ ...surfaces, surface_cave: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none ring-emerald-600 focus:ring-2"
                />
              </div>
            )}
            {prestations.garage && (
              <div>
                <label className="block text-sm font-medium text-zinc-800" htmlFor="surface_garage">
                  Garage (m²)
                </label>
                <input
                  type="number"
                  id="surface_garage"
                  value={surfaces.surface_garage}
                  onChange={(e) => setSurfaces({ ...surfaces, surface_garage: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none ring-emerald-600 focus:ring-2"
                />
              </div>
            )}
            {prestations.jardin && (
              <div>
                <label className="block text-sm font-medium text-zinc-800" htmlFor="surface_jardin">
                  Jardin (m²)
                </label>
                <input
                  type="number"
                  id="surface_jardin"
                  value={surfaces.surface_jardin}
                  onChange={(e) => setSurfaces({ ...surfaces, surface_jardin: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none ring-emerald-600 focus:ring-2"
                />
              </div>
            )}
          </div>
        </div>

        {/* DPE */}
        <div>
          <h3 className="text-md font-semibold text-zinc-800 mb-4 pb-2 border-b border-zinc-200">
            Diagnostic de Performance Énergétique (DPE)
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-zinc-800 mb-1" htmlFor="dpe_consommation">
                Consommation énergétique
              </label>
              <select
                id="dpe_consommation"
                value={dpe.dpe_consommation}
                onChange={(e) => setDpe({ ...dpe, dpe_consommation: e.target.value as any })}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none ring-emerald-600 focus:ring-2"
              >
                <option value="">Non renseigné</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="E">E</option>
                <option value="F">F</option>
                <option value="G">G</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-800 mb-1" htmlFor="dpe_ges">
                Émissions de GES
              </label>
              <select
                id="dpe_ges"
                value={dpe.dpe_ges}
                onChange={(e) => setDpe({ ...dpe, dpe_ges: e.target.value as any })}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none ring-emerald-600 focus:ring-2"
              >
                <option value="">Non renseigné</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="E">E</option>
                <option value="F">F</option>
                <option value="G">G</option>
              </select>
            </div>
          </div>
        </div>

        {/* Photos */}
        <div>
          <h3 className="text-md font-semibold text-zinc-800 mb-4 pb-2 border-b border-zinc-200">
            Photos
          </h3>
          <PhotoUpload
            photos={photos}
            onPhotosChange={setPhotos}
            maxPhotos={10}
            onUploadReady={(fn) => {
              uploadPhotosRef.current = fn;
            }}
          />
        </div>

        {/* Boutons */}
        <div className="flex gap-3 pt-4 border-t border-zinc-200">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-60"
          >
            {isSubmitting
              ? property
                ? "Enregistrement…"
                : "Ajout en cours…"
              : property
                ? "Enregistrer les modifications"
                : "Publier"}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
            >
              Annuler
            </button>
          )}
        </div>
        {message ? (
          <p className={`text-center text-sm ${message.includes("succès") ? "text-emerald-700" : "text-red-600"}`}>
            {message}
          </p>
        ) : null}
      </form>
    </div>
  );
}

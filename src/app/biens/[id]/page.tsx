import { notFound } from "next/navigation";
import Link from "next/link";
import { supabaseAnon } from "@/lib/supabase/anon";
import type { Property } from "@/components/PropertyCard";
import PropertyImageGallery from "./PropertyImageGallery";
import PropertyInfoSection from "./PropertyInfoSection";
import AgentCTA from "./AgentCTA";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = supabaseAnon();
  
  const { data: property, error } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !property) {
    notFound();
  }

  const prop: Property = {
    id: property.id,
    title: property.title,
    price: typeof property.price === "string" ? Number(property.price) : property.price,
    location: property.location,
    image: property.image,
    beds: property.beds,
    baths: property.baths,
    area: property.area,
    description: property.description,
    photos: property.photos || [],
    photo_principale: property.photo_principale,
    status: property.status || "a_vendre",
    prestations: property.prestations || undefined,
    surface_totale: property.surface_totale ? Number(property.surface_totale) : undefined,
    surface_terrasse: property.surface_terrasse ? Number(property.surface_terrasse) : undefined,
    surface_balcon: property.surface_balcon ? Number(property.surface_balcon) : undefined,
    surface_cave: property.surface_cave ? Number(property.surface_cave) : undefined,
    surface_garage: property.surface_garage ? Number(property.surface_garage) : undefined,
    surface_jardin: property.surface_jardin ? Number(property.surface_jardin) : undefined,
    dpe_consommation: property.dpe_consommation || undefined,
    dpe_ges: property.dpe_ges || undefined,
  };
  const photos = prop.photos && prop.photos.length > 0 ? prop.photos : [prop.photo_principale || prop.image].filter(Boolean);
  const mainImage = prop.photo_principale || prop.photos?.[0] || prop.image;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="mb-4 sm:mb-6 inline-flex items-center text-xs sm:text-sm text-emerald-700 hover:text-emerald-800"
      >
        ← Retour à l'accueil
      </Link>

      {/* Version mobile : structure verticale */}
      <div className="block lg:hidden space-y-6">
        {/* Titre */}
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900">{prop.title}</h1>
          <p className="mt-1 text-sm sm:text-base text-zinc-600">{prop.location}</p>
          <p className="mt-2 text-xl sm:text-2xl font-semibold" style={{ color: "#00E09E" }}>
            {new Intl.NumberFormat("fr-FR", {
              style: "currency",
              currency: "EUR",
              maximumFractionDigits: 0,
            }).format(prop.price)}
          </p>
        </div>

        {/* Carrousel de photos */}
        <PropertyImageGallery photos={photos} title={prop.title} />

        {/* Description */}
        {prop.description && (
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-lg font-semibold text-zinc-900 mb-3">Description</h2>
            <p className="text-sm sm:text-base text-zinc-700 whitespace-pre-line leading-relaxed">{prop.description}</p>
          </div>
        )}

        {/* Informations */}
        <div className="max-w-2xl mx-auto">
          <PropertyInfoSection property={prop} />
        </div>
      </div>

      {/* Version desktop : structure en 2 colonnes */}
      <div className="hidden lg:grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Colonne gauche : Image principale + Galerie + Information */}
        <div>
          <PropertyImageGallery photos={photos} title={prop.title} />
          <PropertyInfoSection property={prop} />
        </div>

        {/* Colonne droite : Informations */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-extrabold text-zinc-900">{prop.title}</h1>
            <p className="mt-2 text-lg text-zinc-600">{prop.location}</p>
            <p className="mt-4 text-3xl font-semibold" style={{ color: "#00E09E" }}>
              {new Intl.NumberFormat("fr-FR", {
                style: "currency",
                currency: "EUR",
                maximumFractionDigits: 0,
              }).format(prop.price)}
            </p>
          </div>

          <div className="flex items-center gap-6 border-y border-zinc-200 py-4">
            <div>
              <span className="text-sm text-zinc-600">Chambres</span>
              <p className="text-lg font-semibold">{prop.beds}</p>
            </div>
            <div>
              <span className="text-sm text-zinc-600">Salles de bain</span>
              <p className="text-lg font-semibold">{prop.baths}</p>
            </div>
            <div>
              <span className="text-sm text-zinc-600">Surface</span>
              <p className="text-lg font-semibold">{prop.area} m²</p>
            </div>
          </div>

          {prop.description && (
            <div>
              <p className="text-zinc-700 whitespace-pre-line leading-relaxed">{prop.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* Section CTA Agent */}
      <AgentCTA />
    </div>
  );
}


import HomeClient from "./HomeClient";
import ContactSection from "@/components/ContactSection";
import { supabaseAnon } from "@/lib/supabase/anon";

export default async function Home() {
  const supabase = supabaseAnon();
  const { data } = await supabase
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false });

  const properties = (data ?? []).map((p: any) => ({
    id: p.id,
    title: p.title,
    price: typeof p.price === "string" ? Number(p.price) : p.price,
    location: p.location,
    image: p.image,
    beds: p.beds,
    baths: p.baths,
    area: p.area,
    description: p.description,
    photos: p.photos || [],
    photo_principale: p.photo_principale,
    status: p.status || "a_vendre", // Par défaut "A Vendre"
    prestations: p.prestations || undefined,
    surface_totale: p.surface_totale ? Number(p.surface_totale) : undefined,
    surface_terrasse: p.surface_terrasse ? Number(p.surface_terrasse) : undefined,
    surface_balcon: p.surface_balcon ? Number(p.surface_balcon) : undefined,
    surface_cave: p.surface_cave ? Number(p.surface_cave) : undefined,
    surface_garage: p.surface_garage ? Number(p.surface_garage) : undefined,
    surface_jardin: p.surface_jardin ? Number(p.surface_jardin) : undefined,
    dpe_consommation: p.dpe_consommation || undefined,
    dpe_ges: p.dpe_ges || undefined,
  }));

  // Récupérer les collaborateurs
  const { data: collaboratorsData } = await supabase
    .from("collaborators")
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  const collaborators = (collaboratorsData ?? []).map((c: any) => ({
    id: c.id,
    name: c.name,
    role: c.role,
    photo_url: c.photo_url,
    presentation: c.presentation || undefined,
  }));

  return <HomeClient properties={properties} collaborators={collaborators} />;
}

import Image from "next/image";
import { supabaseAnon } from "@/lib/supabase/anon";

export default async function Logo({ width = 200, height = 150 }: { width?: number; height?: number }) {
  const supabase = supabaseAnon();
  
  // Récupérer l'URL du logo depuis la configuration
  let logoUrl = "/logo.png"; // Valeur par défaut
  
  try {
    const { data } = await supabase
      .from("site_config")
      .select("value")
      .eq("key", "logo_url")
      .single();

    if (data?.value) {
      logoUrl = data.value;
    }
  } catch (error) {
    // En cas d'erreur, utiliser le logo par défaut
    console.error("Erreur lors du chargement du logo:", error);
  }

  return (
    <Image
      src={logoUrl}
      alt="Vue Sur Vert"
      width={width}
      height={height}
      className="object-contain"
      priority
    />
  );
}


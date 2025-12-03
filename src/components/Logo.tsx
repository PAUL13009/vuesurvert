import Image from "next/image";
import { supabaseAnon } from "@/lib/supabase/anon";

export default async function Logo({ width = 200, height = 150 }: { width?: number; height?: number }) {
  const supabase = supabaseAnon();
  
  // Récupérer l'URL du logo depuis la configuration
  let logoUrl = "/logo.png"; // Valeur par défaut
  
  try {
    const { data, error } = await supabase
      .from("site_config")
      .select("value")
      .eq("key", "logo_url")
      .maybeSingle(); // Utiliser maybeSingle() au lieu de single() pour éviter les erreurs si la table n'existe pas

    if (!error && data?.value) {
      logoUrl = data.value;
    }
  } catch (error: any) {
    // En cas d'erreur (table n'existe pas, etc.), utiliser le logo par défaut
    // Ne pas logger l'erreur si c'est juste que la table n'existe pas encore
    if (error?.code !== "42P01") { // 42P01 = relation does not exist
      console.error("Erreur lors du chargement du logo:", error);
    }
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


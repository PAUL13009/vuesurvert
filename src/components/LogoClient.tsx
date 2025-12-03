"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { supabaseBrowser } from "@/lib/supabase/client";

export default function LogoClient({ width = 200, height = 150 }: { width?: number; height?: number }) {
  const [logoUrl, setLogoUrl] = useState<string>("/logo.png");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLogoUrl() {
      const supabase = supabaseBrowser();
      try {
        const { data } = await supabase
          .from("site_config")
          .select("value")
          .eq("key", "logo_url")
          .single();

        if (data?.value) {
          setLogoUrl(data.value);
        }
      } catch (error) {
        // En cas d'erreur, utiliser le logo par défaut
        console.error("Erreur lors du chargement du logo:", error);
      } finally {
        setLoading(false);
      }
    }
    loadLogoUrl();
  }, []);

  if (loading) {
    return (
      <div style={{ width, height }} className="flex items-center justify-center">
        <div className="w-full h-full bg-zinc-100 animate-pulse rounded" />
      </div>
    );
  }

  return (
    <Image
      src={logoUrl}
      alt="Vue Sur Vert"
      width={width}
      height={height}
      className="object-contain"
      priority
      onError={() => setLogoUrl("/logo.png")}
    />
  );
}


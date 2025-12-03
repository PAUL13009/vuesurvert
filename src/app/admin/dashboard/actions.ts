"use server";

import { revalidatePath } from "next/cache";
import { supabaseServer } from "@/lib/supabase/server";

// Type pour le payload complet d'une propriété
export type PropertyPayload = {
  title: string;
  price: number;
  location: string;
  image: string;
  beds: number;
  baths: number;
  area: number;
  description?: string;
  photos?: string[];
  photo_principale?: string;
  status?: "a_vendre" | "vendu" | "sous_compromis";
  prestations?: {
    parking?: number;
    ascenseur?: boolean;
    balcon?: boolean;
    terrasse?: boolean;
    cave?: boolean;
    garage?: number;
    piscine?: boolean;
    jardin?: boolean;
    climatisation?: boolean;
    chauffage?: "individuel" | "collectif" | "electrique" | "gaz" | "autre";
    internet?: boolean;
    fibre?: boolean;
    interphone?: boolean;
    digicode?: boolean;
    gardien?: boolean;
    local_velo?: boolean;
    autres?: string;
  };
  surface_totale?: number;
  surface_terrasse?: number;
  surface_balcon?: number;
  surface_cave?: number;
  surface_garage?: number;
  surface_jardin?: number;
  dpe_consommation?: "A" | "B" | "C" | "D" | "E" | "F" | "G";
  dpe_ges?: "A" | "B" | "C" | "D" | "E" | "F" | "G";
};

export async function createProperty(payload: PropertyPayload) {
  try {
    const supabase = await supabaseServer();
    const { data: auth, error: authError } = await supabase.auth.getUser();
    if (authError || !auth?.user) {
      return { success: false, error: "Non authentifié" };
    }

    const { data, error } = await supabase
      .from("properties")
      .insert(payload)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin/dashboard");
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Erreur inconnue" };
  }
}

export async function updateProperty(id: string, payload: PropertyPayload) {
  try {
    const supabase = await supabaseServer();
    const { data: auth, error: authError } = await supabase.auth.getUser();
    if (authError || !auth?.user) {
      return { success: false, error: "Non authentifié" };
    }

    const { error } = await supabase.from("properties").update(payload).eq("id", id);
    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin/dashboard");
    revalidatePath(`/biens/${id}`);
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Erreur inconnue" };
  }
}

export async function deleteProperty(id: string) {
  try {
    const supabase = await supabaseServer();
    const { data: auth, error: authError } = await supabase.auth.getUser();
    if (authError || !auth?.user) {
      return { success: false, error: "Non authentifié" };
    }

    const { error } = await supabase.from("properties").delete().eq("id", id);
    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Erreur inconnue" };
  }
}



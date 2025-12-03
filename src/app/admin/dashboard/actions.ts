"use server";

import { revalidatePath } from "next/cache";
import { supabaseServer } from "@/lib/supabase/server";

export async function createProperty(formData: FormData) {
  try {
    const supabase = await supabaseServer();
    const { data: auth, error: authError } = await supabase.auth.getUser();
    if (authError || !auth?.user) {
      return { success: false, error: "Non authentifié" };
    }

    const payload = {
      title: String(formData.get("title") || ""),
      price: Number(formData.get("price") || 0),
      location: String(formData.get("location") || ""),
      image: String(formData.get("image") || ""),
      beds: Number(formData.get("beds") || 0),
      baths: Number(formData.get("baths") || 0),
      area: Number(formData.get("area") || 0),
    };

    const { error } = await supabase.from("properties").insert(payload);
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

export async function updateProperty(id: string, formData: FormData) {
  try {
    const supabase = await supabaseServer();
    const { data: auth, error: authError } = await supabase.auth.getUser();
    if (authError || !auth?.user) {
      return { success: false, error: "Non authentifié" };
    }

    const payload = {
      title: String(formData.get("title") || ""),
      price: Number(formData.get("price") || 0),
      location: String(formData.get("location") || ""),
      image: String(formData.get("image") || ""),
      beds: Number(formData.get("beds") || 0),
      baths: Number(formData.get("baths") || 0),
      area: Number(formData.get("area") || 0),
    };

    const { error } = await supabase.from("properties").update(payload).eq("id", id);
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



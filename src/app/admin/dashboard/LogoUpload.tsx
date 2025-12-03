"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { supabaseBrowser } from "@/lib/supabase/client";

export default function LogoUpload() {
  const [logoUrl, setLogoUrl] = useState<string>("/logo.png");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("/logo.png");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Charger l'URL du logo actuel depuis Supabase
  useEffect(() => {
    async function loadLogoUrl() {
      const supabase = supabaseBrowser();
      try {
        const { data, error } = await supabase
          .from("site_config")
          .select("value")
          .eq("key", "logo_url")
          .maybeSingle(); // Utiliser maybeSingle() au lieu de single() pour éviter les erreurs si la table n'existe pas

        if (!error && data) {
          setLogoUrl(data.value);
          setPreview(data.value);
        }
      } catch (err: any) {
        // Ne pas logger l'erreur si c'est juste que la table n'existe pas encore
        if (err?.code !== "42P01") { // 42P01 = relation does not exist
          console.error("Erreur lors du chargement du logo:", err);
        }
      } finally {
        setLoading(false);
      }
    }
    loadLogoUrl();
  }, []);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vérifier que c'est une image
    if (!file.type.startsWith("image/")) {
      setMessage("Veuillez sélectionner un fichier image.");
      return;
    }

    setSelectedFile(file);
    setMessage(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreview(result);
    };
    reader.readAsDataURL(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleUpload() {
    if (!selectedFile) {
      setMessage("Veuillez sélectionner un fichier.");
      return;
    }

    setUploading(true);
    setMessage(null);
    const supabase = supabaseBrowser();

    try {
      // Vérifier l'authentification
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Non authentifié. Veuillez vous reconnecter.");
      }

      // Uploader le logo vers Supabase Storage
      const fileName = `logo-${Date.now()}.${selectedFile.name.split('.').pop()}`;
      const filePath = `site/logo/${fileName}`;

      // Supprimer l'ancien logo si ce n'est pas le logo par défaut
      if (logoUrl && !logoUrl.startsWith("/") && logoUrl.includes("supabase.co")) {
        try {
          const oldPath = logoUrl.split("/").slice(-2).join("/"); // Extraire le chemin depuis l'URL
          await supabase.storage
            .from("property-photos")
            .remove([oldPath]);
        } catch (err) {
          console.warn("Impossible de supprimer l'ancien logo:", err);
        }
      }

      // Uploader le nouveau logo
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("property-photos")
        .upload(filePath, selectedFile, {
          contentType: selectedFile.type,
          upsert: true,
        });

      if (uploadError) {
        throw new Error(`Erreur lors de l'upload: ${uploadError.message}`);
      }

      // Récupérer l'URL publique
      const { data: { publicUrl } } = supabase.storage
        .from("property-photos")
        .getPublicUrl(uploadData.path);

      // Mettre à jour la configuration dans la base de données
      const { error: configError } = await supabase
        .from("site_config")
        .upsert({
          key: "logo_url",
          value: publicUrl,
        }, {
          onConflict: "key",
        });

      if (configError) {
        throw new Error(`Erreur lors de la mise à jour: ${configError.message}`);
      }

      setLogoUrl(publicUrl);
      setPreview(publicUrl);
      setSelectedFile(null);
      setMessage("Logo mis à jour avec succès !");
      
      // Recharger la page après 1 seconde pour voir le nouveau logo
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Erreur:", error);
      setMessage(error instanceof Error ? error.message : "Erreur lors de l'upload du logo");
    } finally {
      setUploading(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-12 text-center">
        <p className="text-zinc-600">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6">
      <h3 className="text-lg font-semibold text-zinc-900 mb-4">Modification du logo</h3>
      
      <div className="space-y-6">
        {/* Aperçu du logo actuel */}
        <div>
          <label className="block text-sm font-medium text-zinc-800 mb-2">
            Logo actuel
          </label>
          <div className="flex items-center justify-center w-full border-2 border-zinc-200 rounded-lg p-6 bg-zinc-50">
            <div className="relative" style={{ width: "200px", height: "150px" }}>
              <Image
                src={preview}
                alt="Logo Vue Sur Vert"
                fill
                className="object-contain"
                sizes="200px"
                onError={() => setPreview("/logo.png")}
              />
            </div>
          </div>
          <p className="text-xs text-zinc-500 mt-2 text-center">
            Dimensions : 200px × 150px (sera conservées)
          </p>
        </div>

        {/* Sélection du fichier */}
        <div>
          <label className="block text-sm font-medium text-zinc-800 mb-2">
            Sélectionner un nouveau logo
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={uploading}
            className="hidden"
            id="logo-upload"
          />
          <label
            htmlFor="logo-upload"
            className={`inline-flex items-center justify-center rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 cursor-pointer ${
              uploading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {uploading ? "Upload en cours..." : selectedFile ? "Changer le fichier" : "Sélectionner un fichier"}
          </label>
          {selectedFile && (
            <p className="text-xs text-zinc-500 mt-2">
              Fichier sélectionné : {selectedFile.name}
            </p>
          )}
        </div>

        {/* Message */}
        {message && (
          <div className={`p-3 rounded-lg text-sm ${
            message.includes("succès") 
              ? "bg-emerald-50 text-emerald-700" 
              : "bg-red-50 text-red-700"
          }`}>
            {message}
          </div>
        )}

        {/* Bouton d'upload */}
        {selectedFile && (
          <div className="flex justify-end">
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? "Upload en cours..." : "Mettre à jour le logo"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";
import SinglePhotoUpload from "./SinglePhotoUpload";

export type Collaborator = {
  id: string;
  name: string;
  role: string;
  photo_url: string;
  presentation?: string;
  display_order?: number;
  created_at?: string;
};

interface CollaboratorFormProps {
  collaborator?: Collaborator | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function CollaboratorForm({ collaborator, onSuccess, onCancel }: CollaboratorFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState("");
  const [originalPhotoUrl, setOriginalPhotoUrl] = useState("");
  const uploadPhotoRef = useRef<((collaboratorId?: string) => Promise<string>) | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    photo_url: "",
    presentation: "",
    display_order: "0",
  });

  useEffect(() => {
    if (collaborator) {
      setFormData({
        name: collaborator.name,
        role: collaborator.role,
        photo_url: collaborator.photo_url,
        presentation: collaborator.presentation || "",
        display_order: String(collaborator.display_order || 0),
      });
      setPhotoUrl(collaborator.photo_url);
      setOriginalPhotoUrl(collaborator.photo_url);
    } else {
      setFormData({
        name: "",
        role: "",
        photo_url: "",
        presentation: "",
        display_order: "0",
      });
      setPhotoUrl("");
      setOriginalPhotoUrl("");
    }
    setMessage(null);
  }, [collaborator]);

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

    // Validation
    if (!formData.name || !formData.role || !photoUrl) {
      setMessage("Veuillez remplir tous les champs obligatoires et sélectionner une photo.");
      setIsSubmitting(false);
      return;
    }

    try {
      // Uploader la photo si nécessaire (nouvelle photo sélectionnée)
      // On détecte une nouvelle photo si l'URL commence par "data:" (preview locale)
      let finalPhotoUrl = photoUrl;
      
      if (photoUrl && photoUrl.startsWith("data:")) {
        // C'est une preview locale, on doit uploader
        if (uploadPhotoRef.current) {
          finalPhotoUrl = await uploadPhotoRef.current(collaborator?.id);
        } else {
          setMessage("Erreur : impossible d'uploader la photo.");
          setIsSubmitting(false);
          return;
        }
      }

      if (!finalPhotoUrl) {
        setMessage("Veuillez sélectionner une photo.");
        setIsSubmitting(false);
        return;
      }

      const payload: any = {
        name: formData.name,
        role: formData.role,
        photo_url: finalPhotoUrl,
        display_order: Number(formData.display_order) || 0,
      };

      if (formData.presentation) {
        payload.presentation = formData.presentation;
      }

      if (collaborator) {
        // Update
        const { error } = await supabase
          .from("collaborators")
          .update(payload)
          .eq("id", collaborator.id);
        if (error) {
          console.error("Supabase update error:", error);
          throw new Error(error.message || "Erreur lors de la mise à jour");
        }
      } else {
        // Create
        const { data, error } = await supabase
          .from("collaborators")
          .insert(payload)
          .select()
          .single();
        if (error) {
          console.error("Supabase insert error:", error);
          throw new Error(error.message || "Erreur lors de la création");
        }
        
        // Si on a créé un nouveau collaborateur et que la photo était en temp, la ré-uploader avec le bon ID
        if (uploadPhotoRef.current && data && finalPhotoUrl.includes("/temp/")) {
          try {
            const newUrl = await uploadPhotoRef.current(data.id);
            // Mettre à jour avec la nouvelle URL
            await supabase
              .from("collaborators")
              .update({ photo_url: newUrl })
              .eq("id", data.id);
          } catch (uploadError) {
            console.error("Photo re-upload error:", uploadError);
          }
        }
      }

      router.refresh();
      setMessage(collaborator ? "Collaborateur modifié avec succès." : "Collaborateur ajouté avec succès.");

      // Reset form
      if (!collaborator) {
        setFormData({
          name: "",
          role: "",
          photo_url: "",
          presentation: "",
          display_order: "0",
        });
        setPhotoUrl("");
        setOriginalPhotoUrl("");
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
        {collaborator ? "Modifier le collaborateur" : "Ajouter un collaborateur"}
      </h2>
      <form onSubmit={onSubmit} className="space-y-6">
        {/* Nom */}
        <div>
          <label className="block text-sm font-medium text-zinc-800 mb-1" htmlFor="name">
            Nom complet
          </label>
          <input
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none ring-emerald-600 focus:ring-2"
            placeholder="Ex: Floris Van Lidth"
          />
        </div>

        {/* Fonction */}
        <div>
          <label className="block text-sm font-medium text-zinc-800 mb-1" htmlFor="role">
            Fonction
          </label>
          <input
            id="role"
            name="role"
            required
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none ring-emerald-600 focus:ring-2"
            placeholder="Ex: Directeur d'agence"
          />
        </div>

        {/* Sélection de la photo */}
        <div>
          <SinglePhotoUpload
            photoUrl={photoUrl}
            onPhotoChange={(url) => {
              setPhotoUrl(url);
              setFormData({ ...formData, photo_url: url });
            }}
            onUploadReady={(fn) => {
              uploadPhotoRef.current = fn;
            }}
          />
        </div>

        {/* Présentation */}
        <div>
          <label className="block text-sm font-medium text-zinc-800 mb-1" htmlFor="presentation">
            Texte de présentation
          </label>
          <textarea
            id="presentation"
            name="presentation"
            rows={6}
            value={formData.presentation}
            onChange={(e) => setFormData({ ...formData, presentation: e.target.value })}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none ring-emerald-600 focus:ring-2"
            placeholder="Texte de présentation du collaborateur..."
          />
        </div>

        {/* Ordre d'affichage */}
        <div>
          <label className="block text-sm font-medium text-zinc-800 mb-1" htmlFor="display_order">
            Ordre d'affichage
          </label>
          <input
            id="display_order"
            name="display_order"
            type="number"
            value={formData.display_order}
            onChange={(e) => setFormData({ ...formData, display_order: e.target.value })}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none ring-emerald-600 focus:ring-2"
            placeholder="0"
          />
          <p className="mt-1 text-xs text-zinc-500">
            Ordre d'affichage dans le carrousel (0 = premier, 1 = deuxième, etc.)
          </p>
        </div>

        {/* Boutons */}
        <div className="flex gap-3 pt-4 border-t border-zinc-200">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-60"
          >
            {isSubmitting
              ? collaborator
                ? "Enregistrement…"
                : "Ajout…"
              : collaborator
                ? "Enregistrer les modifications"
                : "Ajouter le collaborateur"}
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


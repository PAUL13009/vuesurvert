"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";

export type Article = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  created_at?: string;
};

interface ArticleFormProps {
  article?: Article | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const categories = [
  "Investissement",
  "Construction",
  "Rénovation",
  "Architecture",
  "Certification",
  "Aménagement",
  "Énergie",
  "Durabilité",
];

export default function ArticleForm({ article, onSuccess, onCancel }: ArticleFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    category: "",
    content: "",
  });

  // Compteur de mots
  const wordCount = formData.content.trim().split(/\s+/).filter(word => word.length > 0).length;

  useEffect(() => {
    if (article) {
      setFormData({
        title: article.title,
        excerpt: article.excerpt,
        category: article.category,
        content: article.content,
      });
    } else {
      setFormData({
        title: "",
        excerpt: "",
        category: "",
        content: "",
      });
    }
    setMessage(null);
  }, [article]);

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
    if (!formData.title || !formData.excerpt || !formData.category || !formData.content) {
      setMessage("Veuillez remplir tous les champs.");
      setIsSubmitting(false);
      return;
    }

    if (wordCount < 100) {
      setMessage("L'article doit contenir au moins 100 mots.");
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = {
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        category: formData.category,
      };

      if (article) {
        // Update
        const { error } = await supabase
          .from("articles")
          .update(payload)
          .eq("id", article.id);
        if (error) {
          console.error("Supabase update error:", error);
          throw new Error(error.message || "Erreur lors de la mise à jour");
        }
      } else {
        // Create
        const { error } = await supabase
          .from("articles")
          .insert(payload)
          .select()
          .single();
        if (error) {
          console.error("Supabase insert error:", error);
          throw new Error(error.message || "Erreur lors de la création");
        }
      }

      router.refresh();
      setMessage(article ? "Article modifié avec succès." : "Article publié avec succès.");

      // Reset form
      if (!article) {
        setFormData({
          title: "",
          excerpt: "",
          category: "",
          content: "",
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
        {article ? "Modifier l'article" : "Créer un nouvel article"}
      </h2>
      <form onSubmit={onSubmit} className="space-y-6">
        {/* Titre */}
        <div>
          <label className="block text-sm font-medium text-zinc-800 mb-1" htmlFor="title">
            Titre
          </label>
          <input
            id="title"
            name="title"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none ring-emerald-600 focus:ring-2"
            placeholder="Titre de l'article"
          />
        </div>

        {/* Catégorie */}
        <div>
          <label className="block text-sm font-medium text-zinc-800 mb-1" htmlFor="category">
            Catégorie
          </label>
          <select
            id="category"
            name="category"
            required
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none ring-emerald-600 focus:ring-2"
          >
            <option value="">Sélectionner une catégorie</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Extrait */}
        <div>
          <label className="block text-sm font-medium text-zinc-800 mb-1" htmlFor="excerpt">
            Extrait (affiché sur la carte)
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            required
            rows={3}
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none ring-emerald-600 focus:ring-2"
            placeholder="Court extrait qui apparaîtra sur la carte de l'article..."
            maxLength={300}
          />
          <p className="mt-1 text-xs text-zinc-500">
            {formData.excerpt.length}/300 caractères
          </p>
        </div>

        {/* Contenu de l'article */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-zinc-800" htmlFor="content">
              Contenu de l'article
            </label>
            <span className="text-xs text-zinc-500">
              {wordCount} {wordCount === 1 ? "mot" : "mots"}
            </span>
          </div>
          <textarea
            id="content"
            name="content"
            required
            rows={20}
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none ring-emerald-600 focus:ring-2 font-mono"
            placeholder="Rédigez votre article ici..."
          />
          <p className="mt-1 text-xs text-zinc-500">
            Minimum 100 mots recommandé pour un bon référencement
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
              ? article
                ? "Enregistrement…"
                : "Publication…"
              : article
                ? "Enregistrer les modifications"
                : "Publier l'article"}
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


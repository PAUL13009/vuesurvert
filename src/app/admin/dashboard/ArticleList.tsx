"use client";

import type { Article } from "./ArticleForm";

interface ArticleListProps {
  articles: Article[];
  onEdit: (article: Article) => void;
  onDelete: (id: string) => void;
}

export default function ArticleList({ articles, onEdit, onDelete }: ArticleListProps) {
  if (articles.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-12 text-center">
        <p className="text-zinc-600">Aucun article pour le moment.</p>
      </div>
    );
  }

  // Formater la date
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "Date non disponible";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <article
          key={article.id}
          className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm"
        >
          <div className="p-4">
            <div className="mb-2">
              <span className="inline-block px-2 py-1 text-xs font-medium text-zinc-600 bg-zinc-100 rounded-full">
                {article.category}
              </span>
            </div>
            <h3 className="line-clamp-2 text-base font-semibold mb-2">{article.title}</h3>
            <p className="line-clamp-3 text-sm text-zinc-600 mb-3">{article.excerpt}</p>
            <p className="text-xs text-zinc-500 mb-4">{formatDate(article.created_at)}</p>
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(article)}
                className="flex-1 rounded-lg border border-emerald-600 px-3 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-50"
                aria-label={`Modifier ${article.title}`}
              >
                Modifier
              </button>
              <button
                onClick={() => onDelete(article.id)}
                className="flex-1 rounded-lg border border-red-600 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50"
                aria-label={`Supprimer ${article.title}`}
              >
                Supprimer
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}


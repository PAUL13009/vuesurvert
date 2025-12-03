"use client";

import Image from "next/image";
import type { Collaborator } from "./CollaboratorForm";

interface CollaboratorListProps {
  collaborators: Collaborator[];
  onEdit: (collaborator: Collaborator) => void;
  onDelete: (id: string) => void;
}

export default function CollaboratorList({ collaborators, onEdit, onDelete }: CollaboratorListProps) {
  if (collaborators.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-12 text-center">
        <p className="text-zinc-600">Aucun collaborateur pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {collaborators.map((collaborator) => (
        <article
          key={collaborator.id}
          className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm"
        >
          <div className="p-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full overflow-hidden relative flex-shrink-0">
                <Image
                  src={collaborator.photo_url}
                  alt={collaborator.name}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold truncate">{collaborator.name}</h3>
                <p className="text-sm text-zinc-600 truncate">{collaborator.role}</p>
              </div>
            </div>
            {collaborator.presentation && (
              <p className="text-sm text-zinc-600 line-clamp-3 mb-4">
                {collaborator.presentation}
              </p>
            )}
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(collaborator)}
                className="flex-1 rounded-lg border border-emerald-600 px-3 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-50"
                aria-label={`Modifier ${collaborator.name}`}
              >
                Modifier
              </button>
              <button
                onClick={() => onDelete(collaborator.id)}
                className="flex-1 rounded-lg border border-red-600 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50"
                aria-label={`Supprimer ${collaborator.name}`}
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


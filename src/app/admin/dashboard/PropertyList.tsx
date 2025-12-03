"use client";

import Image from "next/image";
import type { Property } from "@/components/PropertyCard";

interface PropertyListProps {
  properties: Property[];
  onEdit: (property: Property) => void;
  onDelete: (id: string) => void;
}

export default function PropertyList({ properties, onEdit, onDelete }: PropertyListProps) {
  if (properties.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-12 text-center">
        <p className="text-zinc-600">Aucune annonce pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {properties.map((property) => (
        <article
          key={property.id}
          className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm"
        >
          <div className="relative aspect-[4/3] w-full">
            <Image
              src={property.image}
              alt={`${property.title} à ${property.location}`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover"
            />
          </div>
          <div className="p-4">
            <h3 className="line-clamp-1 text-base font-semibold">{property.title}</h3>
            <p className="mt-1 text-sm text-zinc-600">{property.location}</p>
            <p className="mt-2 text-emerald-700 font-semibold">
              {new Intl.NumberFormat("fr-FR", {
                style: "currency",
                currency: "EUR",
                maximumFractionDigits: 0,
              }).format(property.price)}
            </p>
            <div className="mt-3 flex items-center gap-3 text-xs text-zinc-700">
              <span>{property.beds} ch</span>
              <span aria-hidden="true">•</span>
              <span>{property.baths} sdb</span>
              <span aria-hidden="true">•</span>
              <span>{property.area} m²</span>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => onEdit(property)}
                className="flex-1 rounded-lg border border-emerald-600 px-3 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-50"
                aria-label={`Modifier ${property.title}`}
              >
                Modifier
              </button>
              <button
                onClick={() => onDelete(property.id)}
                className="flex-1 rounded-lg border border-red-600 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50"
                aria-label={`Supprimer ${property.title}`}
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


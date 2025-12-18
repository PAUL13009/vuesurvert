"use client";

import { useState } from "react";

export type FilterValues = {
  type?: string;
  location?: string;
  priceMin?: string;
  priceMax?: string;
  beds?: string;
};

type PropertyFilterBarProps = {
  onFilterChange: (filters: FilterValues) => void;
};

export default function PropertyFilterBar({ onFilterChange }: PropertyFilterBarProps) {
  const [filters, setFilters] = useState<FilterValues>({
    type: "",
    location: "",
    priceMin: "",
    priceMax: "",
    beds: "",
  });

  const handleChange = (key: keyof FilterValues, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSearch = () => {
    // Déclencher la recherche avec les valeurs actuelles (pour une meilleure UX)
    onFilterChange(filters);
  };

  const handleReset = () => {
    const emptyFilters: FilterValues = {
      type: "",
      location: "",
      priceMin: "",
      priceMax: "",
      beds: "",
    };
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  return (
    <div className="mt-0 sm:mt-8 w-full max-w-5xl mx-auto">
      <div className="bg-white/95 backdrop-blur-sm rounded-lg border shadow-lg p-2.5 sm:p-4 lg:p-6" style={{ borderColor: 'rgba(255, 255, 255, 0.3)', borderWidth: '1px' }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-4">
          {/* Type de bien */}
          <div>
            <label htmlFor="type" className="block text-[10px] sm:text-xs font-medium text-zinc-700 mb-0.5 sm:mb-1">
              Type
            </label>
            <select
              id="type"
              value={filters.type || ""}
              onChange={(e) => handleChange("type", e.target.value)}
              className="w-full rounded-md border-0 bg-white px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Tous</option>
              <option value="immeuble">Immeuble</option>
              <option value="maison">Maison</option>
              <option value="appartement">Appartement</option>
              <option value="terrain">Terrain</option>
              <option value="locaux_activite">Locaux d'activité</option>
            </select>
          </div>

          {/* Localisation */}
          <div>
            <label htmlFor="location" className="block text-[10px] sm:text-xs font-medium text-zinc-700 mb-0.5 sm:mb-1">
              Localisation
            </label>
            <input
              id="location"
              type="text"
              placeholder="Ville, quartier..."
              value={filters.location || ""}
              onChange={(e) => handleChange("location", e.target.value)}
              className="w-full rounded-md border-0 bg-white px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Prix min */}
          <div>
            <label htmlFor="priceMin" className="block text-[10px] sm:text-xs font-medium text-zinc-700 mb-0.5 sm:mb-1">
              Prix min
            </label>
            <input
              id="priceMin"
              type="number"
              placeholder="Min"
              value={filters.priceMin || ""}
              onChange={(e) => handleChange("priceMin", e.target.value)}
              className="w-full rounded-md border-0 bg-white px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Prix max */}
          <div>
            <label htmlFor="priceMax" className="block text-[10px] sm:text-xs font-medium text-zinc-700 mb-0.5 sm:mb-1">
              Prix max
            </label>
            <input
              id="priceMax"
              type="number"
              placeholder="Max"
              value={filters.priceMax || ""}
              onChange={(e) => handleChange("priceMax", e.target.value)}
              className="w-full rounded-md border-0 bg-white px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Chambres */}
          <div>
            <label htmlFor="beds" className="block text-[10px] sm:text-xs font-medium text-zinc-700 mb-0.5 sm:mb-1">
              Chambres
            </label>
            <select
              id="beds"
              value={filters.beds || ""}
              onChange={(e) => handleChange("beds", e.target.value)}
              className="w-full rounded-md border-0 bg-white px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Toutes</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
              <option value="5">5+</option>
            </select>
          </div>
        </div>

        {/* Boutons Rechercher et Réinitialiser */}
        <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row justify-center gap-2 sm:gap-3">
          <button
            onClick={handleSearch}
            className="rounded-md px-5 py-2 sm:px-6 sm:py-2.5 text-xs sm:text-sm font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{ backgroundColor: "#00E09E" }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#00C08A"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#00E09E"}
          >
            Rechercher
          </button>
          <button
            onClick={handleReset}
            className="rounded-md px-5 py-2 sm:px-6 sm:py-2.5 text-xs sm:text-sm font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{ backgroundColor: "#00E09E" }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#00C08A"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#00E09E"}
          >
            Réinitialiser
          </button>
        </div>
      </div>
    </div>
  );
}


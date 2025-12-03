"use client";

import { useEffect, useRef } from "react";
import PropertyCard, { type Property } from "./PropertyCard";
import { type FilterValues } from "./PropertyFilterBar";

export default function PropertyGridWrapper({ 
  properties,
  filters 
}: { 
  properties: ReadonlyArray<Property>;
  filters?: FilterValues;
}) {
  const gridRef = useRef<HTMLDivElement>(null);

  // Filtrer les propriétés selon les critères
  const filteredProperties = properties.filter((property) => {
    if (!filters) return true;

    // Filtre par type (basé sur le titre)
    if (filters.type) {
      const typeLower = filters.type.toLowerCase();
      const titleLower = property.title.toLowerCase();
      if (!titleLower.includes(typeLower)) return false;
    }

    // Filtre par localisation
    if (filters.location) {
      const locationLower = filters.location.toLowerCase();
      const propertyLocationLower = property.location.toLowerCase();
      if (!propertyLocationLower.includes(locationLower)) return false;
    }

    // Filtre par prix minimum
    if (filters.priceMin) {
      const minPrice = Number(filters.priceMin);
      if (property.price < minPrice) return false;
    }

    // Filtre par prix maximum
    if (filters.priceMax) {
      const maxPrice = Number(filters.priceMax);
      if (property.price > maxPrice) return false;
    }

    // Filtre par nombre de chambres
    if (filters.beds) {
      const minBeds = Number(filters.beds);
      if (property.beds < minBeds) return false;
    }

    return true;
  });

  useEffect(() => {
    if (!gridRef.current) return;
    
    const updateCentering = () => {
      const grid = gridRef.current;
      if (!grid) return;
      
      const cards = grid.children;
      const totalCards = cards.length;
      
      if (totalCards === 0) return;
      
      // Vérifier les breakpoints
      const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
      const isTablet = window.matchMedia("(min-width: 640px)").matches;
      
      // Réinitialiser toutes les colonnes
      Array.from(cards).forEach((card) => {
        (card as HTMLElement).style.gridColumn = "";
      });
      
      // Si une seule carte au total, la centrer selon le breakpoint
      if (totalCards === 1) {
        const card = cards[0] as HTMLElement;
        if (isDesktop) {
          // Sur desktop (3 colonnes), centrer sur la colonne 2
          card.style.gridColumn = "2";
        } else if (isTablet) {
          // Sur tablette (2 colonnes), centrer sur la colonne 2
          card.style.gridColumn = "2";
        }
        // Sur mobile (1 colonne), pas besoin de centrer
        return;
      }
      
      // Si on n'est pas sur desktop, ne pas centrer les autres cas
      if (!isDesktop) {
        return;
      }
      
      // Calculer le nombre de cartes sur la dernière ligne (3 colonnes sur desktop)
      const cardsPerRow = 3;
      const cardsOnLastRow = totalCards % cardsPerRow;
      
      // Si 1 carte sur la dernière ligne, la centrer (colonne 2)
      if (cardsOnLastRow === 1) {
        const lastCard = cards[totalCards - 1] as HTMLElement;
        lastCard.style.gridColumn = "2";
      } 
      // Si 2 cartes sur la dernière ligne, les centrer (colonnes 2 et 3)
      else if (cardsOnLastRow === 2) {
        const secondLastCard = cards[totalCards - 2] as HTMLElement;
        const lastCard = cards[totalCards - 1] as HTMLElement;
        secondLastCard.style.gridColumn = "2";
        lastCard.style.gridColumn = "3";
      }
    };
    
    updateCentering();
    
    // Réécouter les changements de taille d'écran
    const mediaQueryDesktop = window.matchMedia("(min-width: 1024px)");
    const mediaQueryTablet = window.matchMedia("(min-width: 640px)");
    const handleResize = () => updateCentering();
    mediaQueryDesktop.addEventListener("change", handleResize);
    mediaQueryTablet.addEventListener("change", handleResize);
    window.addEventListener("resize", handleResize);
    
    // Cleanup
    return () => {
      mediaQueryDesktop.removeEventListener("change", handleResize);
      mediaQueryTablet.removeEventListener("change", handleResize);
      window.removeEventListener("resize", handleResize);
      if (gridRef.current) {
        Array.from(gridRef.current.children).forEach((card) => {
          (card as HTMLElement).style.gridColumn = "";
        });
      }
    };
  }, [filteredProperties.length]);

  if (filteredProperties.length === 0) {
    return <p className="text-center text-zinc-600">Aucun bien ne correspond à vos critères de recherche.</p>;
  }

  return (
    <div ref={gridRef} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {filteredProperties.map((p) => (
        <PropertyCard key={p.id} property={p} />
      ))}
    </div>
  );
}


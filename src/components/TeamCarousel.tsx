"use client";

import { useState } from "react";
import Image from "next/image";

type Collaborator = {
  id: string;
  name: string;
  role: string;
  photo_url: string;
  presentation?: string;
};

interface TeamCarouselProps {
  collaborators: Collaborator[];
}

export default function TeamCarousel({ collaborators }: TeamCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [nextIndex, setNextIndex] = useState<number | null>(null);

  // Si pas de collaborateurs, ne rien afficher
  if (collaborators.length === 0) {
    return null;
  }

  const goToNext = () => {
    if (isTransitioning) return;
    const newIndex = (currentIndex + 1) % collaborators.length;
    setNextIndex(newIndex);
    setIsTransitioning(true);
    setExpandedIndex(null);
    
    // Laisser la transition CSS se faire, puis mettre à jour l'index
    setTimeout(() => {
      setCurrentIndex(newIndex);
      setNextIndex(null);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 500);
  };

  const goToPrev = () => {
    if (isTransitioning) return;
    const newIndex = (currentIndex - 1 + collaborators.length) % collaborators.length;
    setNextIndex(newIndex);
    setIsTransitioning(true);
    setExpandedIndex(null);
    
    // Laisser la transition CSS se faire, puis mettre à jour l'index
    setTimeout(() => {
      setCurrentIndex(newIndex);
      setNextIndex(null);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 500);
  };

  const goToIndex = (index: number) => {
    if (isTransitioning || index === currentIndex) return;
    setNextIndex(index);
    setIsTransitioning(true);
    setExpandedIndex(null);
    
    setTimeout(() => {
      setCurrentIndex(index);
      setNextIndex(null);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 500);
  };

  // Calculer la position relative de chaque collaborateur
  const getCollaboratorPosition = (index: number) => {
    if (collaborators.length === 1) {
      return { translateX: 0, scale: 1, opacity: 1, zIndex: 20 };
    }

    // Calculer la position relative par rapport à currentIndex
    let relativeIndex = index - currentIndex;
    
    // Gérer le wrap-around
    if (relativeIndex > collaborators.length / 2) {
      relativeIndex -= collaborators.length;
    } else if (relativeIndex < -collaborators.length / 2) {
      relativeIndex += collaborators.length;
    }

    // Pendant la transition, ajuster les positions pour créer l'effet de glissement
    if (isTransitioning && nextIndex !== null) {
      const nextRelativeIndex = index - nextIndex;
      let adjustedRelativeIndex = nextRelativeIndex;
      
      // Gérer le wrap-around pour nextIndex
      if (adjustedRelativeIndex > collaborators.length / 2) {
        adjustedRelativeIndex -= collaborators.length;
      } else if (adjustedRelativeIndex < -collaborators.length / 2) {
        adjustedRelativeIndex += collaborators.length;
      }

      // Position actuelle (centre) -> va vers la gauche
      if (relativeIndex === 0) {
        return { translateX: -100, scale: 0.7, opacity: 0.25, zIndex: 5 };
      }
      
      // Position suivante (droite) -> va vers le centre
      if (relativeIndex === 1) {
        return { translateX: 0, scale: 1, opacity: 1, zIndex: 20 };
      }
      
      // Position précédente (gauche) -> reste à gauche ou sort
      if (relativeIndex === -1) {
        return { translateX: -150, scale: 0.6, opacity: 0, zIndex: 1 };
      }

      // Autres positions
      return { translateX: relativeIndex > 0 ? 150 : -150, scale: 0.6, opacity: 0, zIndex: 1 };
    }

    // Position actuelle (centre)
    if (relativeIndex === 0) {
      return { translateX: 0, scale: 1, opacity: 1, zIndex: 20 };
    }
    
    // Position suivante (droite)
    if (relativeIndex === 1) {
      return { translateX: 50, scale: 0.8, opacity: 0.4, zIndex: 10 };
    }
    
    // Position précédente (gauche)
    if (relativeIndex === -1) {
      return { translateX: -100, scale: 0.7, opacity: 0.25, zIndex: 5 };
    }

    // Autres positions (hors écran)
    return { translateX: relativeIndex > 0 ? 150 : -150, scale: 0.6, opacity: 0, zIndex: 1 };
  };

  return (
    <div className="relative max-w-6xl mx-auto">
      {/* Flèches de navigation */}
      {collaborators.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/90 hover:bg-white border border-zinc-200 shadow-md flex items-center justify-center transition-all hover:scale-110 opacity-70 hover:opacity-100"
            aria-label="Collaborateur précédent"
            disabled={isTransitioning}
          >
            <svg
              className="w-5 h-5 text-zinc-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/90 hover:bg-white border border-zinc-200 shadow-md flex items-center justify-center transition-all hover:scale-110 opacity-70 hover:opacity-100"
            aria-label="Collaborateur suivant"
            disabled={isTransitioning}
          >
            <svg
              className="w-5 h-5 text-zinc-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Container du carrousel */}
      <div className="relative min-h-[550px] flex items-center justify-center overflow-visible py-12">
        <div className="relative w-full flex items-center justify-center" style={{ minHeight: '550px' }}>
          {collaborators.map((collaborator, index) => {
            const position = getCollaboratorPosition(index);
            const isCurrent = index === currentIndex && !isTransitioning;

            return (
              <div
                key={collaborator.id}
                className="absolute w-full flex items-center justify-center"
                style={{
                  transform: `translateX(${position.translateX}%) scale(${position.scale})`,
                  opacity: position.opacity,
                  zIndex: position.zIndex,
                  pointerEvents: isCurrent ? "auto" : "none",
                  transition: isTransitioning 
                    ? "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s ease-in-out, scale 0.5s ease-in-out" 
                    : "transform 0.3s ease-out, opacity 0.3s ease-out, scale 0.3s ease-out",
                }}
              >
                <div className="flex flex-col items-center max-w-md w-full">
                  <div className={`rounded-full overflow-hidden mb-4 relative ${isCurrent ? "w-40 h-40" : position.translateX === 50 ? "w-36 h-36" : "w-32 h-32"}`}>
                    <Image
                      src={collaborator.photo_url}
                      alt={collaborator.name}
                      fill
                      className="object-cover"
                      sizes={isCurrent ? "160px" : "128px"}
                    />
                  </div>
                  <h3 className={`font-semibold text-zinc-900 mb-2 ${isCurrent ? "text-xl" : position.translateX === 50 ? "text-lg" : "text-base"}`}>
                    {collaborator.name}
                  </h3>
                  <p className={`text-zinc-600 mb-2 ${isCurrent ? "text-sm" : "text-xs"}`}>
                    {collaborator.role}
                  </p>
                  {isCurrent && collaborator.presentation && (
                    <>
                      <button
                        onClick={() => setExpandedIndex(expandedIndex === currentIndex ? null : currentIndex)}
                        className="mb-4 transition-transform duration-300 hover:scale-110"
                        style={{ transform: expandedIndex === currentIndex ? 'rotate(180deg)' : 'rotate(0deg)' }}
                        aria-label={expandedIndex === currentIndex ? "Masquer la présentation" : "Afficher la présentation"}
                      >
                        <svg
                          className="w-6 h-6 text-zinc-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      <div 
                        className="text-base text-zinc-700 max-w-2xl leading-tight p-6 border border-zinc-200 rounded-lg bg-white overflow-visible transition-all duration-500 ease-out w-full"
                        style={{ 
                          boxShadow: '0 10px 20px rgba(0, 0, 0, 0.06)',
                          maxHeight: expandedIndex === currentIndex ? 'none' : '0',
                          opacity: expandedIndex === currentIndex ? 1 : 0,
                          paddingTop: expandedIndex === currentIndex ? '24px' : '0',
                          paddingBottom: expandedIndex === currentIndex ? '24px' : '0',
                          marginTop: expandedIndex === currentIndex ? '0' : '0',
                          marginBottom: expandedIndex === currentIndex ? '0' : '0',
                          borderWidth: expandedIndex === currentIndex ? '1px' : '0',
                        }}
                      >
                        <p>{collaborator.presentation}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Indicateurs de position */}
      {collaborators.length > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {collaborators.map((_, index) => (
            <button
              key={index}
              onClick={() => goToIndex(index)}
              disabled={isTransitioning}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? "bg-emerald-600 w-8"
                  : "bg-zinc-300 hover:bg-zinc-400 w-2"
              }`}
              aria-label={`Aller au collaborateur ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

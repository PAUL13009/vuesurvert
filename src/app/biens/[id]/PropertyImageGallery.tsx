"use client";

import { useState } from "react";
import Image from "next/image";

type PropertyImageGalleryProps = {
  photos: string[];
  title: string;
};

export default function PropertyImageGallery({ photos, title }: PropertyImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToPrevious = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const goToNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  return (
    <div className="space-y-6">
      {/* Carrousel mobile */}
      <div className="relative lg:hidden">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl">
          <Image
            src={photos[currentIndex]}
            alt={`${title} - Photo ${currentIndex + 1}`}
            fill
            className={`object-cover transition-opacity duration-300 ${isTransitioning ? 'opacity-70' : 'opacity-100'}`}
            priority={currentIndex === 0}
            sizes="100vw"
          />
          
          {/* Flèches de navigation */}
          {photos.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors z-10"
                aria-label="Photo précédente"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={goToNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors z-10"
                aria-label="Photo suivante"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Indicateurs de points */}
          {photos.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {photos.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentIndex 
                      ? 'w-6 bg-white' 
                      : 'w-2 bg-white/50 hover:bg-white/75'
                  }`}
                  aria-label={`Aller à la photo ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Galerie desktop (ancienne version) */}
      <div className="hidden lg:block space-y-6">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl">
          <Image
            src={photos[currentIndex]}
            alt={`${title} - Photo principale`}
            fill
            className={`object-cover transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
            priority={currentIndex === 0}
            sizes="50vw"
          />
        </div>
        
        {photos.length > 1 && (
          <div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {photos.map((photo, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`relative aspect-square w-full overflow-hidden rounded-lg transition-all duration-200 ${
                    currentIndex === index 
                      ? 'ring-2 ring-emerald-500 ring-offset-2 scale-105' 
                      : 'hover:opacity-80'
                  }`}
                  aria-label={`Afficher la photo ${index + 1}`}
                >
                  <Image
                    src={photo}
                    alt={`${title} - Photo ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 33vw, 25vw"
                  />
                  {currentIndex === index && (
                    <div className="absolute inset-0 bg-emerald-500/20" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


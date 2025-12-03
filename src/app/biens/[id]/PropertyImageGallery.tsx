"use client";

import { useState } from "react";
import Image from "next/image";

type PropertyImageGalleryProps = {
  photos: string[];
  title: string;
};

export default function PropertyImageGallery({ photos, title }: PropertyImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isChanging, setIsChanging] = useState(false);

  const handleImageClick = (index: number) => {
    if (index === selectedImage) return;
    
    setIsChanging(true);
    setTimeout(() => {
      setSelectedImage(index);
      setIsChanging(false);
    }, 200);
  };

  return (
    <div className="space-y-6">
      {/* Image principale en haut à gauche */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl">
        <Image
          src={photos[selectedImage]}
          alt={`${title} - Photo principale`}
          fill
          className={`object-cover transition-opacity duration-300 ${isChanging ? 'opacity-0' : 'opacity-100'}`}
          priority={selectedImage === 0}
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>
      
      {/* Galerie complète en dessous */}
      {photos.length > 1 && (
        <div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {photos.map((photo, index) => (
              <button
                key={index}
                onClick={() => handleImageClick(index)}
                className={`relative aspect-square w-full overflow-hidden rounded-lg transition-all duration-200 ${
                  selectedImage === index 
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
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                {selectedImage === index && (
                  <div className="absolute inset-0 bg-emerald-500/20" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


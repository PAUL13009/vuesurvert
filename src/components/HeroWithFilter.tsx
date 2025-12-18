"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import PropertyFilterBar, { type FilterValues } from "./PropertyFilterBar";

type HeroWithFilterProps = {
  title: string;
  subtitle?: string;
  backgroundUrl: string;
  onFilterChange: (filters: FilterValues) => void;
};

export default function HeroWithFilter({ 
  title, 
  subtitle, 
  backgroundUrl,
  onFilterChange 
}: HeroWithFilterProps) {
  const [titleOpacity, setTitleOpacity] = useState(0);
  const [filterOpacity, setFilterOpacity] = useState(0);
  const [blurAmount, setBlurAmount] = useState(0);

  useEffect(() => {
    // Animation du titre : fade-in de 0 à 1 sur 1.5 secondes, commence après 0.3s
    const titleTimer = setTimeout(() => {
      setTitleOpacity(1);
    }, 300);

    // Animation de la barre de filtrage : fade-in de 0 à 1 sur 1.5 secondes, commence après 0.8s
    const filterTimer = setTimeout(() => {
      setFilterOpacity(1);
    }, 800);

    // Animation du flou : de 0 à 3px sur 2 secondes, commence après 0.3s
    const blurTimer = setTimeout(() => {
      setBlurAmount(3);
    }, 300);

    return () => {
      clearTimeout(titleTimer);
      clearTimeout(filterTimer);
      clearTimeout(blurTimer);
    };
  }, []);

  return (
    <section className="relative min-h-[50vh] sm:min-h-[56vh] w-full overflow-hidden">
      <Image
        src={backgroundUrl}
        alt=""
        fill
        priority
        className="object-cover transition-all duration-[2000ms] ease-out"
        style={{ filter: `blur(${blurAmount}px)` }}
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-black/40" aria-hidden="true" />
      <div className="relative mx-auto flex min-h-[50vh] sm:min-h-[56vh] max-w-7xl flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-6 sm:py-0">
        <div 
          className="text-center text-white -mt-8 sm:-mt-24 transition-opacity duration-[1500ms] ease-out"
          style={{ opacity: titleOpacity }}
        >
          <h1 className="text-lg sm:text-2xl font-light tracking-normal sm:text-3xl md:text-4xl px-2 leading-tight">{title}</h1>
          {subtitle ? (
            <p className="mt-2 sm:mt-4 text-xs sm:text-base text-white/90 px-2">{subtitle}</p>
          ) : null}
        </div>
        <div 
          className="w-full mt-4 sm:mt-8 transition-opacity duration-[1500ms] ease-out"
          style={{ opacity: filterOpacity }}
        >
          <PropertyFilterBar onFilterChange={onFilterChange} />
        </div>
      </div>
    </section>
  );
}


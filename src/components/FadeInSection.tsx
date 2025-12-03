"use client";

import { useEffect, useRef, useState } from "react";

type FadeInSectionProps = {
  children: React.ReactNode;
  delay?: number;
};

export default function FadeInSection({ children, delay = 0 }: FadeInSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
          // Une fois visible, on peut arrêter d'observer
          if (ref.current) {
            observer.unobserve(ref.current);
          }
        }
      },
      {
        threshold: 0.1, // Déclenche quand 10% de l'élément est visible
        rootMargin: "0px 0px -50px 0px", // Déclenche un peu avant que l'élément soit complètement visible
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [delay]);

  return (
    <div
      ref={ref}
      className="transition-opacity duration-[1500ms] ease-out"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 1500ms ease-out, transform 1500ms ease-out",
      }}
    >
      {children}
    </div>
  );
}


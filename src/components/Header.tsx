"use client";

import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    
    // Si on est sur la page d'accueil, faire un scroll smooth
    if (window.location.pathname === "/") {
      const targetId = href.replace("#", "");
      const element = document.getElementById(targetId);
      
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    } else {
      // Si on est sur une autre page, rediriger vers la page d'accueil avec l'ancre
      window.location.href = `/${href}`;
    }
  };

  return (
    <header className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo et tagline centrés */}
        <div className="flex flex-col items-center justify-center text-center mb-3">
          <Link href="/" className="flex flex-col items-center gap-2">
            {/* Logo image */}
            <div className="flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="Vue Sur Vert"
                width={200}
                height={150}
                className="object-contain"
                priority
              />
            </div>
          </Link>
        </div>

        {/* Navigation horizontale centrée */}
        <nav className="flex items-center justify-center gap-8" aria-label="Primary">
          <a 
            href="#biens" 
            onClick={(e) => handleNavClick(e, "#biens")}
            className="text-base text-black hover:text-zinc-700 transition-colors cursor-pointer"
          >
            ACHETER
          </a>
          <a 
            href="#equipe" 
            onClick={(e) => handleNavClick(e, "#equipe")}
            className="text-base text-black hover:text-zinc-700 transition-colors cursor-pointer"
          >
            L'ÉQUIPE
          </a>
          <a 
            href="#contact" 
            onClick={(e) => handleNavClick(e, "#contact")}
            className="text-base text-black hover:text-zinc-700 transition-colors cursor-pointer"
          >
            CONTACT
          </a>
          <Link 
            href="/blog"
            className="text-base text-black hover:text-zinc-700 transition-colors"
          >
            BLOG
          </Link>
        </nav>
      </div>
    </header>
  );
}

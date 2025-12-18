"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoClient from "./LogoClient";

export default function Header() {
  const pathname = usePathname();
  const isPropertyPage = pathname?.startsWith("/biens/");

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
    <header className={`bg-white ${isPropertyPage ? 'hidden lg:block' : ''}`}>
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo et tagline centrés */}
        <div className="flex flex-col items-center justify-center text-center mb-2 sm:mb-3">
          <Link href="/" className="flex flex-col items-center gap-1 sm:gap-2">
            {/* Logo image */}
            <div className="flex items-center justify-center scale-75 sm:scale-100">
              <LogoClient width={200} height={150} />
            </div>
          </Link>
        </div>

        {/* Navigation horizontale centrée */}
        <nav className="flex items-center justify-center gap-4 sm:gap-6 lg:gap-8" aria-label="Primary">
          <a 
            href="#biens" 
            onClick={(e) => handleNavClick(e, "#biens")}
            className="text-sm sm:text-base text-black hover:text-zinc-700 transition-colors cursor-pointer"
          >
            ACHETER
          </a>
          <a 
            href="#equipe" 
            onClick={(e) => handleNavClick(e, "#equipe")}
            className="text-sm sm:text-base text-black hover:text-zinc-700 transition-colors cursor-pointer"
          >
            L'ÉQUIPE
          </a>
          <a 
            href="#contact" 
            onClick={(e) => handleNavClick(e, "#contact")}
            className="text-sm sm:text-base text-black hover:text-zinc-700 transition-colors cursor-pointer"
          >
            CONTACT
          </a>
        </nav>
      </div>
    </header>
  );
}

"use client";

import Image from "next/image";

export default function AgentCTA() {
  return (
    <div className="mt-8 sm:mt-16 mb-6 sm:mb-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white border border-zinc-200 rounded-lg p-6 sm:p-8 text-center" style={{ boxShadow: '0 10px 20px rgba(0, 0, 0, 0.06)' }}>
          <div className="flex flex-col items-center">
            {/* Photo de l'agent */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden mb-3 sm:mb-4 relative">
              <Image
                src="/floris.jpg"
                alt="Floris Van Lidth"
                fill
                className="object-cover"
                sizes="96px"
              />
            </div>
            
            {/* Nom et fonction */}
            <h3 className="text-lg sm:text-xl font-semibold text-zinc-900 mb-1">Floris Van Lidth</h3>
            <p className="text-xs sm:text-sm text-zinc-600 mb-4 sm:mb-6">Directeur d'agence</p>
            
            {/* Message CTA */}
            <p className="text-sm sm:text-base text-zinc-700 mb-4 sm:mb-6 max-w-md">
              Intéressé(e) par ce bien ? Contactez-moi directement pour plus d'informations ou pour organiser une visite.
            </p>
            
            {/* Informations de contact */}
            <div className="flex flex-col gap-3 sm:gap-4 justify-center items-center w-full">
              <a
                href="mailto:floris.vanlidth@vuesurvert.com"
                className="flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-md text-xs sm:text-sm font-medium text-white transition-colors w-full sm:w-auto justify-center"
                style={{ backgroundColor: "#00E09E" }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#00C08A"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#00E09E"}
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                floris.vanlidth@vuesurvert.com
              </a>
              
              <a
                href="tel:+33698706467"
                className="flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-md text-xs sm:text-sm font-medium text-white transition-colors w-full sm:w-auto justify-center"
                style={{ backgroundColor: "#00E09E" }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#00C08A"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#00E09E"}
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                06 98 70 64 67
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


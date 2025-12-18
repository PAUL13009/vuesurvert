"use client";

export default function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: "Mattia Trabucchi",
      text: "Un immense merci à Floris pour son accompagnement tout au long de notre première aventure immobilière !",
      rating: 5,
    },
    {
      id: 2,
      name: "Karine Goevaerts",
      text: "Floris est quelqu'un de très compétent et reconnu dans son secteur. Tout en bienveillance et disponibilité. Je recommande!!",
      rating: 5,
    },
    {
      id: 3,
      name: "Guillaume Morel",
      text: "Très pro et vraiment un bon suivi/coaching de notre projet d'achat immobilier. Merci l'équipe!",
      rating: 5,
    },
    {
      id: 4,
      name: "Agnès Olive",
      text: "Super accompagnement dans mon projet ! Professionnel et joyeux !!",
      rating: 5,
    },
  ];

  return (
    <div className="mt-12 sm:mt-16 overflow-hidden bg-zinc-50/30 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <h3 className="text-lg sm:text-xl font-medium tracking-tight text-zinc-900 mb-6 sm:mb-8 text-center">Ils nous font confiance</h3>
      <div className="relative overflow-hidden">
        <div className="flex animate-scroll gap-4 sm:gap-6 will-change-transform">
          {/* Dupliquer les avis pour un défilement infini */}
          {[...testimonials, ...testimonials].map((testimonial, index) => (
            <div
              key={`${testimonial.id}-${index}`}
              className="flex-shrink-0 w-[280px] sm:w-80 p-4 sm:p-6 border border-zinc-200 rounded-lg bg-white flex flex-col"
              style={{ boxShadow: '0 10px 20px rgba(0, 0, 0, 0.06)' }}
            >
              <div className="flex items-center justify-center gap-1 mb-3 sm:mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-zinc-700 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4">
                "{testimonial.text}"
              </p>
              <div>
                <p className="font-semibold text-zinc-900 text-xs sm:text-sm">{testimonial.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center mt-6 sm:mt-8">
        <a
          href="https://www.google.com/search?sa=X&sca_esv=af1cc41fdc275e2b&rlz=1C5MACD_enFR1150FR1150&cs=1&hl=fr&biw=1470&bih=920&sxsrf=AE3TifNB4BEhvogPOkXYc35h64vipZNzmA:1766042283955&q=Vue%20sur%20Vert%20Avis&rflfq=1&num=20&stick=H4sIAAAAAAAAAONgkxI2NTOzMLQ0MAESxuYm5uZGppYbGBlfMQqGlaYqFJcWKYSlFpUoOJZlFi9ixRQDALdMGodCAAAA&rldimm=5668190481937477259&tbm=lcl&ved=0CAcQ5foLahcKEwiAr5iYzMaRAxUAAAAAHQAAAAAQCg#lkt=LocalPoiReviews&arid=Ci9DQUlRQUNvZENodHljRjlvT2xVdGRXUmZjVE5JTTBOUGFtRlJjME16TTJscU1WRRAB"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-md px-5 py-2 sm:px-6 sm:py-2.5 text-xs sm:text-sm font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
          style={{ backgroundColor: "#00E09E" }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#00C08A"}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#00E09E"}
        >
          Voir tous les avis
        </a>
      </div>
    </div>
  );
}


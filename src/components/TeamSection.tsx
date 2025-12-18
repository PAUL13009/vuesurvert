"use client";

import Testimonials from "./Testimonials";

export default function TeamSection() {
  return (
    <section id="equipe" className="mx-auto max-w-7xl px-4 py-12 sm:py-16 lg:py-20 sm:px-6 lg:px-8 border-t border-zinc-100 bg-zinc-50/30">
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-zinc-900 mb-4 sm:mb-6">L'Équipe</h2>
        
        {/* Texte de présentation */}
        <div className="max-w-3xl mx-auto mb-6 sm:mb-8 px-2 sm:px-0">
          <p className="text-sm sm:text-base text-zinc-700 leading-relaxed mb-3 sm:mb-4">
            <strong>Vue sur Vert</strong> accompagne la recherche et la vente de biens immobiliers, terrains ou bâtis, destinés à la construction, à la réhabilitation ou à la reconversion de manière écologique, sociale et durable.
          </p>
          <p className="text-sm sm:text-base text-zinc-700 leading-relaxed mb-3 sm:mb-4">
            L'agence défend une approche sensible du territoire et du bâti : chaque lieu recèle un potentiel à révéler, chaque projet s'inscrit dans un contexte vivant fait d'usages, de ressources et de relations humaines.
          </p>
          <p className="text-sm sm:text-base text-zinc-700 leading-relaxed">
            Son accompagnement ne s'arrête pas à la transaction : il s'appuie sur un écosystème d'acteurs engagés dans la transition écologique. Ensemble, ils envisagent chaque projet comme un processus global, de la prospection à la transformation, où les choix techniques, matériels et énergétiques sont pensés dans une logique de sobriété et de réemploi.
          </p>
        </div>

        {/* Bouton CTA */}
        <div className="mb-8 sm:mb-12">
          <a
            href="https://vuesurvert.com/presentation/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-md px-5 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base font-semibold text-white transition-colors hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{ backgroundColor: "#00E09E" }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#00C08A"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#00E09E"}
          >
            Découvrir l'équipe de Vue sur Vert
          </a>
        </div>

        <Testimonials />

        {/* Section Blog */}
        <div className="mt-12 sm:mt-16 max-w-3xl mx-auto px-2 sm:px-0">
          <h3 className="text-xl sm:text-2xl font-medium tracking-tight text-zinc-900 mb-4 sm:mb-6">Articles</h3>
          
          {/* Texte de présentation */}
          <div className="mb-6 sm:mb-8">
            <p className="text-sm sm:text-base text-zinc-700 leading-relaxed mb-3 sm:mb-4">
              Découvrez nos articles sur l'immobilier écologique, la rénovation durable, les projets de construction responsable et bien plus encore.
            </p>
            <p className="text-sm sm:text-base text-zinc-700 leading-relaxed">
              Retrouvez des témoignages de projets, des conseils pratiques, des retours d'expérience sur des chantiers écologiques et des informations sur les dispositifs d'aide à l'accession immobilière.
            </p>
          </div>

          {/* Bouton CTA */}
          <div className="flex justify-center">
            <a
              href="https://vuesurvert.com/category/articles/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-md px-5 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base font-semibold text-white transition-colors hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{ backgroundColor: "#00E09E" }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#00C08A"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#00E09E"}
            >
              Découvrir tous les articles
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}



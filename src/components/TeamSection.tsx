"use client";

import Testimonials from "./Testimonials";
import TeamCarousel from "./TeamCarousel";

type Collaborator = {
  id: string;
  name: string;
  role: string;
  photo_url: string;
  presentation?: string;
};

interface TeamSectionProps {
  collaborators?: Collaborator[];
}

export default function TeamSection({ collaborators = [] }: TeamSectionProps) {

  return (
    <section id="equipe" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 border-t border-zinc-100 bg-zinc-50/30">
      <div className="text-center">
        <h2 className="text-2xl font-medium tracking-tight text-zinc-900 mb-4">L'Équipe</h2>
        {collaborators.length > 0 ? (
          <TeamCarousel collaborators={collaborators} />
        ) : (
          <div className="text-zinc-500 text-sm py-8">
            Aucun collaborateur pour le moment.
          </div>
        )}
        <Testimonials />
      </div>
    </section>
  );
}



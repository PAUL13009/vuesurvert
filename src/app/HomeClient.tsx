"use client";

import { useState } from "react";
import HeroWithFilter from "@/components/HeroWithFilter";
import PropertyGrid from "@/components/PropertyGrid";
import TeamSection from "@/components/TeamSection";
import ContactSection from "@/components/ContactSection";
import FadeInSection from "@/components/FadeInSection";
import { type Property } from "@/components/PropertyCard";
import { type FilterValues } from "@/components/PropertyFilterBar";

type Collaborator = {
  id: string;
  name: string;
  role: string;
  photo_url: string;
  presentation?: string;
};

type HomeClientProps = {
  properties: ReadonlyArray<Property>;
  collaborators?: Collaborator[];
};

export default function HomeClient({ properties, collaborators = [] }: HomeClientProps) {
  const [filters, setFilters] = useState<FilterValues>({});

  return (
    <>
      <HeroWithFilter
        title="Votre partenaire immobilier responsable"
        backgroundUrl="/vieuxport.webp"
        onFilterChange={setFilters}
      />
      <FadeInSection>
        <PropertyGrid properties={properties} filters={filters} />
      </FadeInSection>
      <FadeInSection delay={100}>
        <TeamSection collaborators={collaborators} />
      </FadeInSection>
      <FadeInSection delay={200}>
        <ContactSection />
      </FadeInSection>
    </>
  );
}


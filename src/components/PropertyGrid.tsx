import { type Property } from "./PropertyCard";
import PropertyGridWrapper from "./PropertyGridWrapper";
import { type FilterValues } from "./PropertyFilterBar";

export default function PropertyGrid({ 
  properties,
  filters 
}: { 
  properties: ReadonlyArray<Property>;
  filters?: FilterValues;
}) {
  return (
    <section id="biens" className="mx-auto max-w-[1920px] px-4 py-12 sm:py-16 lg:py-20 sm:px-8 lg:px-12">
      <div className="mb-8 sm:mb-12 text-center">
        <h2 className="text-xl sm:text-2xl font-medium tracking-tight">Nos biens en vitrine</h2>
        <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-zinc-600">Découvrez une sélection de propriétés.</p>
      </div>
      <PropertyGridWrapper properties={properties} filters={filters} />
    </section>
  );
}



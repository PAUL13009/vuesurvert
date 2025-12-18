"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export type Property = {
  id: string;
  title: string;
  price: number;
  location: string;
  image: string;
  beds: number;
  baths: number;
  area: number;
  description?: string;
  photos?: string[];
  photo_principale?: string;
  status?: "vendu" | "sous_compromis" | "a_vendre";
  // Prestations (JSONB)
  prestations?: {
    parking?: number; // nombre de places
    ascenseur?: boolean;
    balcon?: boolean;
    terrasse?: boolean;
    cave?: boolean;
    garage?: number; // nombre de places
    piscine?: boolean;
    jardin?: boolean;
    climatisation?: boolean;
    chauffage?: "individuel" | "collectif" | "electrique" | "gaz" | "autre";
    internet?: boolean;
    fibre?: boolean;
    interphone?: boolean;
    digicode?: boolean;
    gardien?: boolean;
    local_velo?: boolean;
    autres?: string;
  };
  // Surfaces
  surface_totale?: number;
  surface_terrasse?: number;
  surface_balcon?: number;
  surface_cave?: number;
  surface_garage?: number;
  surface_jardin?: number;
  // DPE
  dpe_consommation?: "A" | "B" | "C" | "D" | "E" | "F" | "G";
  dpe_ges?: "A" | "B" | "C" | "D" | "E" | "F" | "G";
};

export default function PropertyCard({ property }: { property: Property }) {
  const router = useRouter();
  
  // IMPORTANT : Conserver cette logique pour utiliser les images uploadées lors de la création de l'annonce
  // Priorité : photo_principale > photos[0] > image (fallback)
  const mainImage = property.photo_principale || property.photos?.[0] || property.image;
  
  // Statut par défaut : "A Vendre"
  const status = property.status || "a_vendre";
  
  // Configuration des badges selon le statut
  const statusConfig = {
    vendu: { label: "Vendu", bgColor: "bg-red-600", useCustomColor: false },
    sous_compromis: { label: "Sous Compromis", bgColor: "bg-emerald-600", useCustomColor: false },
    a_vendre: { label: "A Vendre", bgColor: "", useCustomColor: true },
  };
  
  const statusInfo = statusConfig[status];
  const formattedPrice = new Intl.NumberFormat("fr-FR", { 
    style: "currency", 
    currency: "EUR", 
    maximumFractionDigits: 0 
  }).format(property.price);
  
  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/biens/${property.id}`);
  };

  return (
    <Link href={`/biens/${property.id}`} className="card">
      <div className="card-image">
        <Image
          src={mainImage}
          alt={`${property.title} à ${property.location}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
        {/* Badge de statut en haut à gauche */}
        <div 
          className={`absolute top-3 left-3 sm:top-4 sm:left-4 ${statusInfo.bgColor} px-2.5 py-1 sm:px-3 sm:py-1.5 rounded text-white text-xs sm:text-sm font-semibold z-10`}
          style={statusInfo.useCustomColor ? { backgroundColor: "#00E09E" } : {}}
        >
          {statusInfo.label}
        </div>
      </div>
      
      <div className="card-body">
        <div className="card-top flex items-center justify-between">
          <span className="city">{property.location}</span>
          <span className="text-lg sm:text-xl font-bold text-zinc-900">{formattedPrice}</span>
        </div>
        
        <h3 className="card-title text-base sm:text-lg">{property.title}</h3>
        
        <ul className="features">
          <li className="area">{property.area} m²</li>
          <li className="beds">{property.beds}</li>
          <li className="baths">{property.baths}</li>
        </ul>
        
        <button
          onClick={handleButtonClick}
          className="mt-4 w-full rounded-md px-4 py-3 sm:py-2.5 text-center text-sm font-bold text-white transition-colors"
          style={{ backgroundColor: "#00E09E" }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#00C08A"}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#00E09E"}
        >
          Voir le détail
        </button>
      </div>
    </Link>
  );
}

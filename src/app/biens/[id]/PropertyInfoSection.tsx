"use client";

import { useState } from "react";
import type { Property } from "@/components/PropertyCard";

type PropertyInfoSectionProps = {
  property: Property;
};

export default function PropertyInfoSection({ property }: PropertyInfoSectionProps) {
  const [activeTab, setActiveTab] = useState<"prestation" | "surfaces" | "dpe">("prestation");

  const tabs = [
    { id: "prestation" as const, label: "Prestation" },
    { id: "surfaces" as const, label: "Surfaces" },
    { id: "dpe" as const, label: "DPE" },
  ];

  // Obtenir la couleur DPE selon la lettre (couleurs officielles DPE France)
  const getDpeColor = (dpe?: string): string => {
    const dpeColorMap: Record<string, string> = {
      A: "#009639", // Vert foncé
      B: "#38B549", // Vert moyen
      C: "#85BB2F", // Vert clair/jaune-vert
      D: "#FECB00", // Jaune
      E: "#F8981D", // Orange clair
      F: "#EF7E14", // Orange foncé
      G: "#E53E30", // Rouge
    };
    return dpe ? dpeColorMap[dpe] || "#6B7280" : "#6B7280";
  };

  // Calculer le pourcentage de performance DPE
  const getDpePercentage = (dpe?: string): number => {
    const dpeMap: Record<string, number> = {
      A: 100,
      B: 85,
      C: 70,
      D: 55,
      E: 40,
      F: 25,
      G: 10,
    };
    return dpe ? dpeMap[dpe] || 0 : 0;
  };

  const dpePercentage = getDpePercentage(property.dpe_consommation);

  // Filtrer les prestations cochées
  const prestationsList = [];
  if (property.beds) {
    prestationsList.push({ label: "Chambres", value: property.beds });
  }
  if (property.baths) {
    prestationsList.push({ label: "Salles de bain", value: property.baths });
  }
  if (property.prestations?.parking) {
    prestationsList.push({
      label: "Parking",
      value: `${property.prestations.parking} ${property.prestations.parking === 1 ? "place" : "places"}`,
    });
  }
  if (property.prestations?.ascenseur) {
    prestationsList.push({ label: "Ascenseur", value: "Oui" });
  }
  if (property.prestations?.balcon) {
    prestationsList.push({ label: "Balcon", value: "Oui" });
  }
  if (property.prestations?.terrasse) {
    prestationsList.push({ label: "Terrasse", value: "Oui" });
  }
  if (property.prestations?.cave) {
    prestationsList.push({ label: "Cave", value: "Oui" });
  }
  if (property.prestations?.garage) {
    prestationsList.push({
      label: "Garage",
      value: `${property.prestations.garage} ${property.prestations.garage === 1 ? "place" : "places"}`,
    });
  }
  if (property.prestations?.piscine) {
    prestationsList.push({ label: "Piscine", value: "Oui" });
  }
  if (property.prestations?.jardin) {
    prestationsList.push({ label: "Jardin", value: "Oui" });
  }
  if (property.prestations?.climatisation) {
    prestationsList.push({ label: "Climatisation", value: "Oui" });
  }
  if (property.prestations?.chauffage) {
    const chauffageLabels: Record<string, string> = {
      individuel: "Individuel",
      collectif: "Collectif",
      electrique: "Électrique",
      gaz: "Gaz",
      autre: "Autre",
    };
    prestationsList.push({
      label: "Chauffage",
      value: chauffageLabels[property.prestations.chauffage] || property.prestations.chauffage,
    });
  }
  if (property.prestations?.internet) {
    prestationsList.push({ label: "Internet", value: "Oui" });
  }
  if (property.prestations?.fibre) {
    prestationsList.push({ label: "Fibre optique", value: "Oui" });
  }
  if (property.prestations?.interphone) {
    prestationsList.push({ label: "Interphone", value: "Oui" });
  }
  if (property.prestations?.digicode) {
    prestationsList.push({ label: "Digicode", value: "Oui" });
  }
  if (property.prestations?.gardien) {
    prestationsList.push({ label: "Gardien", value: "Oui" });
  }
  if (property.prestations?.local_velo) {
    prestationsList.push({ label: "Local vélo", value: "Oui" });
  }
  if (property.prestations?.autres) {
    prestationsList.push({ label: "Autres", value: property.prestations.autres });
  }

  // Filtrer les surfaces renseignées
  const surfacesList = [];
  if (property.area) {
    surfacesList.push({ label: "Surface habitable", value: `${property.area} m²` });
  }
  if (property.surface_totale) {
    surfacesList.push({ label: "Surface totale", value: `${property.surface_totale} m²` });
  }
  if (property.surface_terrasse) {
    surfacesList.push({ label: "Terrasse", value: `${property.surface_terrasse} m²` });
  }
  if (property.surface_balcon) {
    surfacesList.push({ label: "Balcon", value: `${property.surface_balcon} m²` });
  }
  if (property.surface_cave) {
    surfacesList.push({ label: "Cave", value: `${property.surface_cave} m²` });
  }
  if (property.surface_garage) {
    surfacesList.push({ label: "Garage", value: `${property.surface_garage} m²` });
  }
  if (property.surface_jardin) {
    surfacesList.push({ label: "Jardin", value: `${property.surface_jardin} m²` });
  }

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold text-zinc-900 mb-4">Information</h2>
      
      {/* Navigation des onglets */}
      <div className="flex gap-2 border-b border-zinc-200 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
              activeTab === tab.id
                ? "border-emerald-600 text-emerald-600"
                : "border-transparent text-zinc-600 hover:text-zinc-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Contenu des onglets */}
      <div className="min-h-[200px]">
        {activeTab === "prestation" && (
          <div className="space-y-4">
            {prestationsList.length > 0 ? (
              prestationsList.map((item, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-zinc-100">
                  <span className="text-zinc-600">{item.label}</span>
                  <span className="font-semibold text-zinc-900">{item.value}</span>
                </div>
              ))
            ) : (
              <p className="text-zinc-500 text-sm py-4">Aucune prestation renseignée</p>
            )}
          </div>
        )}

        {activeTab === "surfaces" && (
          <div className="space-y-4">
            {surfacesList.length > 0 ? (
              surfacesList.map((item, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-zinc-100">
                  <span className="text-zinc-600">{item.label}</span>
                  <span className="font-semibold text-zinc-900">{item.value}</span>
                </div>
              ))
            ) : (
              <p className="text-zinc-500 text-sm py-4">Aucune surface renseignée</p>
            )}
          </div>
        )}

        {activeTab === "dpe" && (
          <div className="space-y-4">
            {property.dpe_consommation ? (
              <div className="flex items-center justify-between py-3 border-b border-zinc-100">
                <span className="text-zinc-600">Consommation énergétique</span>
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg"
                  style={{ backgroundColor: getDpeColor(property.dpe_consommation) }}
                >
                  {property.dpe_consommation}
                </div>
              </div>
            ) : null}
            {property.dpe_ges ? (
              <div className="flex items-center justify-between py-3 border-b border-zinc-100">
                <span className="text-zinc-600">Émissions de GES</span>
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg"
                  style={{ backgroundColor: getDpeColor(property.dpe_ges) }}
                >
                  {property.dpe_ges}
                </div>
              </div>
            ) : null}
            {property.dpe_consommation ? (
              <div className="py-3">
                <p className="text-sm text-zinc-600 mb-2">Performance énergétique</p>
                <div className="w-full bg-zinc-200 rounded-full h-2">
                  <div
                    className="bg-emerald-600 h-2 rounded-full transition-all"
                    style={{ width: `${dpePercentage}%` }}
                  ></div>
                </div>
              </div>
            ) : (
              <p className="text-zinc-500 text-sm py-4">DPE non renseigné</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

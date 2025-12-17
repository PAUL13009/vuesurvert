-- Migration pour ajouter external_id et updated_at à la table properties
-- À exécuter dans Supabase Dashboard → SQL Editor

-- Ajouter colonne external_id pour référencer Hektor
alter table public.properties 
add column if not exists external_id text;

-- Index pour les recherches rapides
create index if not exists idx_properties_external_id 
on public.properties(external_id);

-- Ajouter colonne updated_at si elle n'existe pas
alter table public.properties 
add column if not exists updated_at timestamptz default now();


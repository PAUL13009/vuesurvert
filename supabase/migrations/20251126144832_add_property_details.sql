-- Ajouter colonne status
alter table public.properties 
add column if not exists status text default 'a_vendre';

-- Ajouter colonnes pour les prestations (utiliser JSONB pour flexibilité)
alter table public.properties 
add column if not exists prestations jsonb default '{}';

-- Ajouter colonnes pour les surfaces
alter table public.properties 
add column if not exists surface_totale numeric;
alter table public.properties 
add column if not exists surface_terrasse numeric;
alter table public.properties 
add column if not exists surface_balcon numeric;
alter table public.properties 
add column if not exists surface_cave numeric;
alter table public.properties 
add column if not exists surface_garage numeric;
alter table public.properties 
add column if not exists surface_jardin numeric;

-- Ajouter colonnes pour le DPE
alter table public.properties 
add column if not exists dpe_consommation text;
alter table public.properties 
add column if not exists dpe_ges text;

-- Ajouter contraintes pour le status
alter table public.properties 
add constraint check_status 
check (status in ('a_vendre', 'vendu', 'sous_compromis'));

-- Ajouter contraintes pour le DPE
alter table public.properties 
add constraint check_dpe_consommation 
check (dpe_consommation is null or dpe_consommation in ('A', 'B', 'C', 'D', 'E', 'F', 'G'));

alter table public.properties 
add constraint check_dpe_ges 
check (dpe_ges is null or dpe_ges in ('A', 'B', 'C', 'D', 'E', 'F', 'G'));


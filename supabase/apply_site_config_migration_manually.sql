-- Migration pour créer la table site_config
-- À exécuter dans Supabase Dashboard → SQL Editor

-- Supprimer les éléments existants si nécessaire (pour éviter les erreurs)
drop policy if exists "site_config_select_all" on public.site_config;
drop policy if exists "site_config_insert_authenticated" on public.site_config;
drop policy if exists "site_config_update_authenticated" on public.site_config;
drop policy if exists "site_config_delete_authenticated" on public.site_config;
drop trigger if exists update_site_config_updated_at on public.site_config;
drop function if exists update_site_config_updated_at();

-- Créer la table site_config pour stocker les configurations du site
create table if not exists public.site_config (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Activer Row Level Security
alter table public.site_config enable row level security;

-- Policy: Allow public read access
create policy "site_config_select_all" on public.site_config
for select to public using (true);

-- Policy: Allow authenticated users to insert
create policy "site_config_insert_authenticated" on public.site_config
for insert to authenticated with check (true);

-- Policy: Allow authenticated users to update
create policy "site_config_update_authenticated" on public.site_config
for update to authenticated using (true);

-- Policy: Allow authenticated users to delete
create policy "site_config_delete_authenticated" on public.site_config
for delete to authenticated using (true);

-- Créer un trigger pour mettre à jour updated_at automatiquement
create or replace function update_site_config_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_site_config_updated_at
before update on public.site_config
for each row
execute function update_site_config_updated_at();

-- Insérer la valeur par défaut du logo (logo.png dans public/)
insert into public.site_config (key, value)
values ('logo_url', '/logo.png')
on conflict (key) do nothing;


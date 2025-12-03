-- Migration pour créer la table collaborators
-- À exécuter dans Supabase Dashboard → SQL Editor

-- Créer la table collaborators
create table if not exists public.collaborators (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  photo_url text not null,
  presentation text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  display_order int default 0
);

-- Activer Row Level Security
alter table public.collaborators enable row level security;

-- Supprimer les politiques si elles existent déjà
drop policy if exists "collaborators_select_all" on public.collaborators;
drop policy if exists "collaborators_insert_authenticated" on public.collaborators;
drop policy if exists "collaborators_update_authenticated" on public.collaborators;
drop policy if exists "collaborators_delete_authenticated" on public.collaborators;

-- Politique pour permettre à tous de lire les collaborateurs
create policy "collaborators_select_all" on public.collaborators
for select to public using (true);

-- Politique pour permettre aux utilisateurs authentifiés d'insérer
create policy "collaborators_insert_authenticated" on public.collaborators
for insert to authenticated with check (true);

-- Politique pour permettre aux utilisateurs authentifiés de modifier
create policy "collaborators_update_authenticated" on public.collaborators
for update to authenticated using (true);

-- Politique pour permettre aux utilisateurs authentifiés de supprimer
create policy "collaborators_delete_authenticated" on public.collaborators
for delete to authenticated using (true);

-- Fonction pour mettre à jour updated_at automatiquement
create or replace function update_collaborators_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Supprimer le trigger si il existe déjà
drop trigger if exists update_collaborators_updated_at on public.collaborators;

-- Trigger pour mettre à jour updated_at
create trigger update_collaborators_updated_at
before update on public.collaborators
for each row
execute function update_collaborators_updated_at();


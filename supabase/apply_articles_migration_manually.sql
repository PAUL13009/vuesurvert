-- Migration pour créer la table articles
-- À exécuter dans Supabase Dashboard → SQL Editor

-- Créer la table articles
create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  excerpt text not null,
  content text not null,
  category text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Activer Row Level Security
alter table public.articles enable row level security;

-- Supprimer les politiques si elles existent déjà
drop policy if exists "articles_select_all" on public.articles;
drop policy if exists "articles_insert_authenticated" on public.articles;
drop policy if exists "articles_update_authenticated" on public.articles;
drop policy if exists "articles_delete_authenticated" on public.articles;

-- Politique pour permettre à tous de lire les articles (pour la page blog)
create policy "articles_select_all" on public.articles
for select to public using (true);

-- Politique pour permettre aux utilisateurs authentifiés d'insérer
create policy "articles_insert_authenticated" on public.articles
for insert to authenticated with check (true);

-- Politique pour permettre aux utilisateurs authentifiés de modifier
create policy "articles_update_authenticated" on public.articles
for update to authenticated using (true);

-- Politique pour permettre aux utilisateurs authentifiés de supprimer
create policy "articles_delete_authenticated" on public.articles
for delete to authenticated using (true);

-- Fonction pour mettre à jour updated_at automatiquement
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Supprimer le trigger si il existe déjà
drop trigger if exists update_articles_updated_at on public.articles;

-- Trigger pour mettre à jour updated_at
create trigger update_articles_updated_at
before update on public.articles
for each row
execute function update_updated_at_column();


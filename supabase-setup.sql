-- Créer la table properties
create table if not exists properties (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  price numeric not null,
  location text not null,
  image text not null,
  beds int not null,
  baths int not null,
  area int not null,
  created_at timestamptz default now()
);

-- Activer Row Level Security
alter table properties enable row level security;

-- Politique pour permettre à tous de lire les propriétés (pour la page d'accueil)
create policy "properties_select_all" on properties
for select to public using (true);

-- Politique pour permettre aux utilisateurs authentifiés d'insérer
create policy "properties_insert_authenticated" on properties
for insert to authenticated with check (true);

-- Politique pour permettre aux utilisateurs authentifiés de modifier
create policy "properties_update_authenticated" on properties
for update to authenticated using (true);

-- Politique pour permettre aux utilisateurs authentifiés de supprimer
create policy "properties_delete_authenticated" on properties
for delete to authenticated using (true);


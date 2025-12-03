-- Create properties table
create table if not exists public.properties (
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

-- Enable Row Level Security
alter table public.properties enable row level security;

-- Policy: Allow public read access (for homepage)
create policy "properties_select_all" on public.properties
for select to public using (true);

-- Policy: Allow authenticated users to insert
create policy "properties_insert_authenticated" on public.properties
for insert to authenticated with check (true);

-- Policy: Allow authenticated users to update
create policy "properties_update_authenticated" on public.properties
for update to authenticated using (true);

-- Policy: Allow authenticated users to delete
create policy "properties_delete_authenticated" on public.properties
for delete to authenticated using (true);


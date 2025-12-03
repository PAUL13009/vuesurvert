-- Ajouter colonne description
alter table public.properties 
add column if not exists description text;

-- Ajouter colonne photos (array de text)
alter table public.properties 
add column if not exists photos text[] default '{}';

-- Ajouter colonne photo_principale (pour performance, évite de devoir faire photos[0])
alter table public.properties 
add column if not exists photo_principale text;

-- Mettre à jour photo_principale pour les enregistrements existants
-- (si image existe, la mettre dans photo_principale et photos)
update public.properties 
set photo_principale = image, photos = array[image]
where image is not null and photo_principale is null;


# Configuration Supabase Storage pour les photos

## Étapes à suivre

### 1. Créer le bucket "property-photos"

1. Allez dans **Supabase Dashboard** → **Storage**
2. Cliquez sur **"New bucket"**
3. Nom du bucket : `property-photos`
4. Cochez **"Public bucket"** (pour que les photos soient accessibles publiquement)
5. Cliquez sur **"Create bucket"**

### 2. Configurer les politiques RLS pour le bucket

1. Allez dans **Storage** → **Policies** (ou cliquez sur le bucket `property-photos` → **Policies`)
2. Créez les politiques suivantes :

#### Politique SELECT (lecture publique)
- **Policy name**: `Public read access`
- **Allowed operation**: SELECT
- **Policy definition**:
```sql
bucket_id = 'property-photos'
```

#### Politique INSERT (upload authentifié)
- **Policy name**: `Authenticated insert`
- **Allowed operation**: INSERT
- **Policy definition**:
```sql
bucket_id = 'property-photos' AND auth.role() = 'authenticated'
```

#### Politique UPDATE (modification authentifiée)
- **Policy name**: `Authenticated update`
- **Allowed operation**: UPDATE
- **Policy definition**:
```sql
bucket_id = 'property-photos' AND auth.role() = 'authenticated'
```

#### Politique DELETE (suppression authentifiée)
- **Policy name**: `Authenticated delete`
- **Allowed operation**: DELETE
- **Policy definition**:
```sql
bucket_id = 'property-photos' AND auth.role() = 'authenticated'
```

### 3. Appliquer la migration SQL

N'oubliez pas d'appliquer la migration pour ajouter les colonnes `description`, `photos`, et `photo_principale` :

1. Allez dans **Supabase Dashboard** → **SQL Editor**
2. Créez une nouvelle requête
3. Copiez-collez le contenu de `supabase/migrations/20251117050810_add_description_and_photos.sql`
4. Cliquez sur **Run**

Ou via CLI :
```bash
npm run supabase:migrate
```

## Vérification

Après configuration :
- ✅ Le bucket `property-photos` existe et est public
- ✅ Les 4 politiques RLS sont créées
- ✅ La migration SQL est appliquée
- ✅ Vous pouvez uploader des photos depuis le formulaire d'annonce

## Structure des fichiers dans Storage

Les photos seront organisées ainsi :
- `property-photos/{propertyId}/{filename}` pour les photos d'une propriété existante
- `property-photos/temp/{filename}` pour les photos temporaires avant création


# Instructions pour appliquer la migration Supabase

La migration pour créer la table `properties` a été créée dans `supabase/migrations/20251117043639_create_properties_table.sql`.

## Option 1 : Via Supabase CLI (recommandé)

1. **Se connecter à Supabase CLI** :
   ```bash
   npx supabase login
   ```
   Cela ouvrira votre navigateur pour vous authentifier.

2. **Lier le projet** :
   ```bash
   npx supabase link --project-ref inujyawqmfldpdejpzgt
   ```
   Vous devrez peut-être fournir votre clé `service_role` (trouvable dans Supabase Dashboard → Settings → API).

3. **Appliquer la migration** :
   ```bash
   npm run supabase:migrate
   ```
   Ou directement :
   ```bash
   npx supabase db push
   ```

## Option 2 : Via Supabase Dashboard (rapide)

Si vous préférez appliquer manuellement :

1. Allez dans **Supabase Dashboard** → **SQL Editor**
2. Créez une nouvelle requête
3. Copiez-collez le contenu de `supabase/migrations/20251117043639_create_properties_table.sql`
4. Cliquez sur **Run**

## Vérification

Après avoir appliqué la migration, vérifiez que :

- ✅ La table `properties` apparaît dans **Table Editor**
- ✅ Les 4 politiques RLS sont visibles dans **Authentication → Policies**
- ✅ Le dashboard admin peut maintenant fetch les propriétés sans erreur

## Commandes utiles

- Créer une nouvelle migration : `npm run supabase:new-migration [nom]`
- Appliquer les migrations : `npm run supabase:migrate`
- Voir l'état des migrations : `npx supabase migration list`


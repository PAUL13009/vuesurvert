Projet “Vue Sur Vert” — Page d’accueil immobilière (Next.js + Tailwind)

## Prérequis
- Node.js 18+
- npm (ou pnpm/bun si vous préférez)

## Installation

```bash
npm install
```

## Lancer en développement

```bash
npm run dev
```

Ouvrez `http://localhost:3000` pour voir la page d’accueil avec:
- Header de navigation
- Section Hero (titre “Vue Sur Vert”)
- Grille de biens mock
- Footer

## Build et démarrage en production

```bash
npm run build
npm start
```

## Structure (principaux fichiers)
- `src/app/layout.tsx`: layout global, metadata, `Header` et `Footer`
- `src/app/page.tsx`: page d’accueil (`Hero` + `PropertyGrid`)
- `src/components/*`: `Header`, `Hero`, `PropertyGrid`, `PropertyCard`, `Footer`
- `src/data/properties.ts`: données locales mock

## Accessibilité & SEO
- Landmarks: `header`, `main`, `footer`, `nav`
- `alt` descriptifs pour les images
- `metadata` défini (title, description)

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

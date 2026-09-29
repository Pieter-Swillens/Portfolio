# Portfolio Pieter Swillens

> ⚠️ Deze README is AI-generated bij de initial commit.
 
Een statische portfolio-website, gebouwd met React, TypeScript en Vite.

## Tech stack

| Onderdeel | Doel |
|-----------|------|
| [React 19](https://react.dev) | UI library |
| [TypeScript](https://www.typescriptlang.org) (strict) | Type-safe code |
| [Vite 8](https://vite.dev) | Build tool & development server |
| [oxlint](https://oxc.rs/docs/guide/usage/linter) | Linting (o.a. React-, TypeScript- en a11y-regels) |

## Getting started

Vereist een recente versie van [Node.js](https://nodejs.org).

```bash
# Dependencies installeren
npm install

# Ontwikkelserver starten
npm run dev
```

## Scripts

| Script | Beschrijving |
|--------|-------------|
| `npm run dev` | Start de development server |
| `npm run typecheck` | Controleert de types met `tsc --noEmit` |
| `npm run build` | Typecheck + productiebuild naar `dist/` |
| `npm run preview` | Lokale preview van de productiebuild |
| `npm run lint` | Code controleren met oxlint |

De build faalt bij typefouten, omdat Vite zelf enkel transpileert en geen types controleert.

## Projectstructuur

```
portfolio/
├── index.html            # Entry point HTML
├── vite.config.ts        # Vite-configuratie (incl. @-alias)
├── tsconfig.json         # TypeScript-configuratie
├── .oxlintrc.json        # Lint-configuratie
├── package.json
├── public/               # Statische bestanden, ongewijzigd geserveerd (favicon, ...)
└── src/
    ├── main.tsx          # App entry point
    ├── App.tsx           # Hoofdcomponent
    ├── index.css         # Global styles
    └── vite-env.d.ts     # Vite client types
```

## Conventies

- **Import-alias:** `@/` verwijst naar `src/`, bijvoorbeeld `import App from '@/App'`.
  Het alias is geconfigureerd in zowel `vite.config.ts` (bundling) als `tsconfig.json` (types).
  Pas je het aan, doe dat dan op beide plaatsen.
- **Linting:** correctheidsregels staan op `error`. `any`, non-null assertions (`!`) en nieuwe
  objecten/arrays/functies als JSX-props geven een warning.
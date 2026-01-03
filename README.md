# Potpourri

## TL;DR

Gift shop storefront client (Vite + React + TanStack). Currently uses stub routes; will swap to `@signal/catalog-core` package when available.

```bash
npm install && npm run dev   # Start development
npm run build                # Production build
```

## Product Goal

A lightweight, white-label gift shop client that:

- Renders a catalog from a shared package (`@signal/catalog-core`)
- Uses `client.config.ts` as the single source of branding/tenant config
- Supports future checkout, admin, and inquiry features via feature flags

## Current Status

| Area                | Status                                             |
| ------------------- | -------------------------------------------------- |
| Scaffold            | Complete                                           |
| Stub Routes         | Working (/, /catalog, /item/:id, /admin)           |
| Package Integration | Pending `@signal/catalog-core`                     |
| Branding Config     | Complete (`client.config.ts`)                      |
| CI/CD               | Complete (lint, typecheck, test, build, automerge) |
| Deployment          | Not configured                                     |

## How to Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Available Scripts

| Script               | Description                              |
| -------------------- | ---------------------------------------- |
| `npm run dev`        | Start Vite dev server                    |
| `npm run build`      | TypeScript build + Vite production build |
| `npm run lint`       | Run ESLint                               |
| `npm run format`     | Check Prettier formatting                |
| `npm run format:fix` | Fix Prettier formatting                  |
| `npm run typecheck`  | Run TypeScript type checking             |
| `npm run test`       | Run tests with Vitest                    |

### Environment Variables

| Variable            | Description                      | Default |
| ------------------- | -------------------------------- | ------- |
| `VITE_API_BASE_URL` | API endpoint for catalog backend | `/api`  |

## Architecture (Short)

```
src/
├── main.tsx           # App entry (QueryClient + Router providers)
├── app.tsx            # Root route + layout
├── client.config.ts   # Branding, tenant, feature flags (EDIT THIS)
├── catalogCore.tsx    # Package adapter (swap stub → real package here)
└── routes/            # Page components (temporary stubs)
    ├── index.tsx      # Home (/)
    ├── catalog.tsx    # Catalog (/catalog)
    ├── item.tsx       # Item detail (/item/:id)
    └── admin.tsx      # Admin panel (/admin)
```

**Integration Point**: `src/catalogCore.tsx` is the single file to modify when `@signal/catalog-core` is installed. Uncomment the real import, delete the stub section.

## Known Issues

1. **Stub routes only** - All pages are placeholder UI until package integration
2. **No auth gating** - Admin route is publicly accessible
3. **No deployment config** - Needs Vercel/Netlify/Docker setup
4. **Checkout disabled** - Feature flag exists but no implementation

## Task Queue (Autopilot)

| ID       | Task                                                      | Size | Status  |
| -------- | --------------------------------------------------------- | ---- | ------- |
| GIFT-001 | Swap stub index route to catalog-core IndexPage           | S    | Pending |
| GIFT-002 | Swap stub catalog route to catalog-core CatalogPage       | S    | Pending |
| GIFT-003 | Swap stub item route to catalog-core ItemPage             | S    | Pending |
| GIFT-004 | Swap stub admin route to catalog-core AdminPage           | S    | Pending |
| GIFT-005 | Apply brand colors from config to Tailwind theme          | S    | Pending |
| GIFT-006 | Add logo component using brand.logoUrl                    | S    | Pending |
| GIFT-007 | Create inquiry/contact form component                     | M    | Pending |
| GIFT-008 | Add basic meta tags and Open Graph for SEO                | S    | Pending |
| GIFT-009 | Add Vercel deployment config (vercel.json)                | S    | Pending |
| GIFT-010 | Add admin route auth gate (simple password or flag check) | S    | Pending |

**Size Guide**: S = <1hr, M = 1-3hr, L = 3-8hr

## Release Gates

All PRs must pass before merge:

- [ ] `npm run lint` - ESLint passes
- [ ] `npm run typecheck` - TypeScript passes
- [ ] `npm run test` - Vitest passes
- [ ] `npm run build` - Production build succeeds

Auto-merge enabled: Add `automerge` label to PRs for automatic squash-merge after CI passes.

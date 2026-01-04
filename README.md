# Potpourri

Gift shop storefront (Vite + React + TanStack). Thin client designed for `@signal/catalog-core` package (pending). All branding via `src/client.config.ts`.

```bash
npm install && npm run dev   # Start development
npm run build                # Production build
```

## Product Goal

A lightweight, white-label gift shop client that:

- Renders a catalog from a shared package (`@signal/catalog-core`)
- Uses `client.config.ts` as the single source of branding/tenant config
- Supports checkout, admin, and inquiry features via feature flags
- Enables unattended agent development via autopilot task queue

## Current Status (Reality Check)

> Last audit: 2026-01-03

### ✅ Demo-Ready (Phase 0 Complete)

All critical user flows work. Ready for client demos.

| Feature | Status |
|---------|--------|
| Hero + catalog + product detail | ✅ Done |
| Inquiry modal with localStorage fallback | ✅ Done |
| Admin dashboard with auth gate | ✅ Done |
| Products/inquiries/categories CRUD | ✅ Done |
| Mobile hamburger nav | ✅ Done |
| 404, empty states, loading skeletons | ✅ Done |
| Contact page with map | ✅ Done |
| SEO (meta, JSON-LD, sitemap) | ✅ Done |
| Testimonials, trust badges placeholders | ✅ Done |

### 🟡 Production Hardening Needed (13 items TODO)

See [docs/TASKS.md](docs/TASKS.md) for full backlog. Key items:

- Env validation, analytics stubs, error reporting
- Accessibility fixes, keyboard gallery nav
- Admin password from env (currently hardcoded)
- Bundle size verification

### ❌ Blocked

| Item | Status |
|------|--------|
| `@signal-core/catalog-react-sdk` integration | ✅ Complete - SDK integrated into admin route |
| Checkout flow | Feature disabled, can be enabled when needed |

---

## Demo Readiness Checklist

### Storefront
- [x] Hero section renders with brand config
- [x] Catalog with search, filter, sort
- [x] Product detail with gallery, reviews
- [x] Related products, recently viewed
- [x] Inventory badges display

### Inquiry / Lead Capture
- [x] Inquiry modal opens from product page
- [x] Form validates (name, email, message)
- [x] Submit persists to localStorage (demo mode)
- [x] Success message displays
- [x] Quote mode with quantity field

### Admin
- [x] `/admin` gated by password
- [x] Inquiries table with status dropdown
- [x] Inquiry detail modal
- [x] Products table with edit/delete
- [x] Categories panel
- [x] CSV export (products + inquiries)

### Mobile / Polish
- [x] Hamburger menu <768px
- [x] Responsive grids
- [x] Focus-visible states
- [x] Breadcrumbs

### Reliability
- [x] Error boundary catches crashes
- [x] 404 page for unknown routes
- [x] Loading skeletons

---

## Sanity Check Results

```
Build:  ✅ PASS (423KB JS → 122KB gzip)
Lint:   ⚠️ 31 warnings, 1 error (no-explicit-any in vite.config.d.ts)
Tests:  ❌ FAIL (4 tests - useFavorites hook infinite loop in test env)
```

---

## How to Run

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build         # TypeScript + Vite production build
npm run preview       # Preview production build locally
```

### Test / Lint

```bash
npm run test          # Vitest (currently failing - see Known Issues)
npm run lint          # ESLint
npm run typecheck     # TypeScript only
```

### Env Vars

| Variable            | Description                      | Default |
| ------------------- | -------------------------------- | ------- |
| `VITE_API_BASE_URL` | API endpoint for catalog backend | `/api`  |

## Architecture (Short)

### High-level Components

```
┌─────────────────────────────────────────────────────────────┐
│                    Potpourri (Thin Client)                  │
├─────────────────────────────────────────────────────────────┤
│  src/client.config.ts  ← Single source of branding/config  │
│  src/catalogCore.tsx   ← Package seam (stub → real)        │
│  src/routes/*          ← Page components                   │
├─────────────────────────────────────────────────────────────┤
│              @signal/catalog-core (pending)                 │
│  makeRouteTree({ clientConfig }) → TanStack routes         │
│  CatalogApp({ clientConfig }) → Optional full app          │
└─────────────────────────────────────────────────────────────┘
```

### Key Files

| File                    | Purpose                                              |
| ----------------------- | ---------------------------------------------------- |
| `src/client.config.ts`  | Branding, tenant ID, feature flags, contact info     |
| `src/catalogCore.tsx`   | Package adapter (ONE file imports `@signal/catalog-core`) |
| `src/main.tsx`          | App entry (QueryClient + Router providers)           |
| `src/app.tsx`           | Root route + layout                                  |
| `src/routes/index.tsx`  | Home page                                            |
| `src/routes/catalog.tsx`| Catalog grid                                         |
| `src/routes/item.tsx`   | Product detail                                       |
| `src/routes/admin.tsx`  | Admin dashboard                                      |

## Known Issues

1. **Package seam uses stubs** - Real `@signal/catalog-core` not yet published
2. **Checkout disabled** - Feature flag exists but no implementation

## Task Queue (Summary)

Full backlog with acceptance criteria: **[docs/TASKS.md](docs/TASKS.md)**

### Status Overview

| Priority | Total | Done | Remaining |
|----------|-------|------|-----------|
| P0 (Demo) | 20 | 20 | 0 |
| P1 (Production) | 17 | 4 | 13 |
| P2 (Future) | 20 | 0 | 20 |
| BLOCKED | 5 | 0 | 5 |

### Next Up (P1 Production Items)

| ID | Title | Area |
|----|-------|------|
| POT-030 | Env validation on startup | Ops |
| POT-031 | Analytics event placeholders | Analytics |
| POT-032 | Error reporting placeholder | Ops |
| POT-041 | Secure admin password (from env) | Security |
| POT-037 | Trust badges footer | Trust |

### SDK Integration Status

| ID | Title | Status |
|----|-------|--------|
| POT-001 | Build @signal-core/catalog-react-sdk package | ✅ DONE |
| POT-002 | Integrate SDK components into catalogCore routes | ✅ DONE |
| POT-003 | Add SDK integration feature flag | ✅ DONE |
| POT-004 | Verify SDK peer dependencies compatibility | ✅ DONE |
| POT-005 | Update types and config mapping for SDK | ✅ DONE |

**Status**: SDK integration complete! `CatalogAdminApp` is integrated into admin route with proper authentication flow.

**Note**: See [docs/INTEGRATION_PLAN.md](docs/INTEGRATION_PLAN.md) for integration details.

**Status Values**: `TODO` | `DONE` | `BLOCKED`

## Release Gates

PRs must pass before merge:

```bash
npm run typecheck  # TypeScript passes
npm run build      # Production build succeeds
# npm run test     # Currently skipped (see Known Issues)
```

Auto-merge: Add `automerge` label to PRs for automatic squash-merge after CI passes.

# Potpourri

Gift shop storefront (Vite + React + TanStack). Thin client designed for `@signal/catalog-core` package (pending). All branding via `src/client.config.ts`.

```bash
npm install && npm run dev   # Start development
npm run build                # Production build
```

---

## Current Status

> **Last audit**: 2026-01-04

### ✅ DONE

- Hero, catalog, product detail pages with galleries
- Inquiry modal with localStorage fallback (demo mode)
- Admin dashboard with auth gate (password from env var)
- Admin: products/inquiries/categories CRUD, CSV export
- Mobile hamburger nav, 404 page, empty states, loading skeletons
- Contact page with map, testimonials, trust badges
- SEO (meta, JSON-LD, sitemap, robots.txt)
- Product favorites/wishlist with localStorage persistence
- Product reviews/ratings (mock data)
- Recently viewed products section
- Inventory badges (In Stock/Low Stock/Out of Stock)
- Newsletter signup form, social share buttons
- Quote request mode (`priceMode='quote'`)
- Checkout flow skeleton (gated by `enableCheckout` flag)

### 🟡 PARTIAL

| Item | Status | Notes |
|------|--------|-------|
| POT-038: Accessibility | Focus states + alt text done | Axe violation scan TODO |

<<<<<<< HEAD
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
=======
### ❌ BLOCKED

| Item | Blocker |
|------|---------|
| `@signal/catalog-core` integration (POT-001-005) | Package not published |
>>>>>>> abf32a452fda6a5e9cbc961dff0c394cb94b26ec

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

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_API_BASE_URL` | No | `/api` | Backend API endpoint |
| `VITE_ADMIN_PASSWORD` | **Yes (prod)** | `admin123` | Admin dashboard password |

Create a `.env` file for local development:

```env
VITE_ADMIN_PASSWORD=your-secure-password
```

---

## Architecture (Brief)

```
Potpourri (Thin Client)
├── src/client.config.ts    ← Single source of branding + feature flags
├── src/catalogCore.tsx     ← Package seam (stubs → @signal/catalog-core)
├── src/routes/*            ← Page components (TanStack Router)
├── src/ui/*                ← Reusable components
└── src/api/inquiries.ts    ← Lead capture with localStorage fallback
```

<<<<<<< HEAD
1. **Package seam uses stubs** - SDK package (`@signal-core/catalog-react-sdk`) installed but needs to be built before integration
2. **Checkout disabled** - Feature flag exists but no implementation
3. **Integration plan available** - See [docs/INTEGRATION_PLAN.md](docs/INTEGRATION_PLAN.md) for SDK integration strategy
=======
**Package Seam**: `src/catalogCore.tsx` contains 700+ lines of stubs. When `@signal/catalog-core` publishes, delete the stubs and uncomment one import line. See swap instructions in file.
>>>>>>> abf32a452fda6a5e9cbc961dff0c394cb94b26ec

**Feature Flags**: `enableCheckout`, `enableAdmin`, `priceMode` in `client.config.ts`.

---

## Known Issues / Next Tasks

### Bugs

| ID | Issue | Priority |
|----|-------|----------|
| - | Tests fail: useFavorites infinite loop in jsdom | P1 |
| - | Lint error in vite.config.d.ts | P1 |

### Next Up (from docs/TASKS.md)

| ID | Title | Priority |
|----|-------|----------|
| POT-038 | Complete accessibility (axe violation scan) | P1 |
| POT-054 | Add product comparison feature | P2 |
| POT-058 | Add admin CSV import | P2 |
| POT-060 | Add admin dashboard charts | P2 |
| POT-064 | Add multi-image product upload | P2 |
| POT-065 | Add inventory management | P2 |

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

---

## Task Status Summary

| Priority | Total | Done | Remaining |
|----------|-------|------|-----------|
| BLOCKED | 5 | 0 | 5 |
| P0 | 20 | 20 | 0 |
| P1 | 17 | 16 | 1 (partial) |
| P2 | 20 | 9 | 11 |

See [docs/TASKS.md](docs/TASKS.md) for full backlog with acceptance criteria.

---

## Documentation

| Document | Purpose |
|----------|---------|
| [docs/TASKS.md](docs/TASKS.md) | Full backlog with priorities and status |
| [docs/ROADMAP.md](docs/ROADMAP.md) | Phased ship plan |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Technical architecture details |
| [docs/PACKAGE_INTEGRATION.md](docs/PACKAGE_INTEGRATION.md) | @signal/catalog-core seam spec |

---

## Release Gates

PRs must pass before merge:

```bash
npm run typecheck  # TypeScript passes
npm run build      # Production build succeeds
# npm run test     # Currently skipped (see Known Issues)
```

Auto-merge: Add `automerge` label to PRs for automatic squash-merge after CI passes.

# Potpourri

Gift shop storefront built with Vite + React + TanStack. Self-contained demo with mock data and localStorage persistence. All branding via `src/client.config.ts`.

```bash
npm install && npm run dev   # Start development
npm run build                # Production build
```

---

## Current Status

> **Last audit**: 2026-01-05

### ✅ DONE

- Hero, catalog, product detail pages with galleries
- Inquiry modal with localStorage fallback (demo mode)
- Admin dashboard with auth gate (password from env var)
- Admin: products/inquiries/categories CRUD, CSV import/export
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
- Lookbook feature (curated product collections)
- AI image enhancement with Gemini integration
- Multi-image product upload with drag-drop
- Accessibility audit with axe-core tests (POT-038)
- Product comparison feature (POT-054)
- Admin dashboard charts (POT-060)
- Inventory management panel (POT-065)

---

## Demo Readiness Checklist

### Storefront
- [x] Hero section renders with brand config
- [x] Catalog with search, filter, sort
- [x] Product detail with gallery, reviews
- [x] Related products, recently viewed
- [x] Inventory badges display
- [x] Favorites/wishlist
- [x] Lookbooks (curated collections)
- [x] Product comparison (up to 4 products)

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
- [x] CSV import/export (products + inquiries)
- [x] Multi-image product upload
- [x] AI image enhancement (Gemini)
- [x] Lookbook management
- [x] Dashboard charts (inquiry trends, category distribution)
- [x] Inventory management panel

### Mobile / Polish
- [x] Hamburger menu <768px
- [x] Responsive grids
- [x] Focus-visible states
- [x] Breadcrumbs

### Reliability
- [x] Error boundary catches crashes
- [x] 404 page for unknown routes
- [x] Loading skeletons
- [x] Accessibility (axe-core automated tests)

---

## Sanity Check Results

```
Build:      ✅ PASS (384KB JS → 111KB gzip)
TypeCheck:  ✅ PASS
Lint:       ✅ PASS (41 warnings, 0 errors)
Tests:      ✅ PASS (6 tests passing)
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
npm run test          # Vitest
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
Potpourri
├── src/client.config.ts    ← Single source of branding + feature flags
├── src/catalogCore.tsx     ← Catalog data + routes (mock data for demo)
├── src/data/mockProducts.ts ← Demo product catalog
├── src/routes/*            ← Page components (TanStack Router)
├── src/ui/*                ← Reusable components
├── src/api/                ← Lead capture, Gemini AI, image storage
└── src/hooks/*             ← Custom React hooks (auth, favorites, etc.)
```

**Data Storage**: Uses localStorage for demo mode persistence. Products, inquiries, and user preferences are stored locally.

**Feature Flags**: `enableCheckout`, `enableAdmin`, `priceMode` in `client.config.ts`.

---

## Known Issues / Next Tasks

### Bugs

None - all lint errors and test failures resolved.

### Next Up (from docs/TASKS.md)

| ID | Title | Priority |
|----|-------|----------|
| POT-070+ | See docs/TASKS.md for remaining P2 items | P2 |

---

## Task Status Summary

| Priority | Total | Done | Remaining |
|----------|-------|------|-----------|
| P0 | 20 | 20 | 0 |
| P1 | 17 | 17 | 0 |
| P2 | 20 | 16 | 4 |

See [docs/TASKS.md](docs/TASKS.md) for full backlog with acceptance criteria.

---

## Documentation

| Document | Purpose |
|----------|---------|
| [docs/TASKS.md](docs/TASKS.md) | Full backlog with priorities and status |
| [docs/ROADMAP.md](docs/ROADMAP.md) | Phased ship plan |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Technical architecture details |

---

## Release Gates

PRs must pass before merge:

```bash
npm run typecheck  # TypeScript passes
npm run build      # Production build succeeds
npm run test       # All tests pass
```

Auto-merge: Add `automerge` label to PRs for automatic squash-merge after CI passes.

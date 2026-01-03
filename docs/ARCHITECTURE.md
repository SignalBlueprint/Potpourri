# Architecture

> Technical architecture of the Potpourri gift shop storefront.

**Last Updated**: 2026-01-03

---

## System Overview

Potpourri is a **thin-client storefront** built with Vite + React + TanStack. It's designed to consume a shared package (`@signal/catalog-core`) for catalog functionality, with all branding controlled via a single config file.

```
┌─────────────────────────────────────────────────────────────────┐
│                         Browser                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              Potpourri (Thin Client)                     │   │
│   │                                                          │   │
│   │   src/client.config.ts  ← Branding, tenant, features     │   │
│   │   src/catalogCore.tsx   ← Package seam (stubs → real)    │   │
│   │   src/routes/*          ← Page components                │   │
│   │   src/ui/*              ← Shared UI components           │   │
│   │   src/layout/*          ← App shell, nav                 │   │
│   │                                                          │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                   │
│                              ▼                                   │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │           @signal/catalog-core (PENDING)                 │   │
│   │                                                          │   │
│   │   makeRouteTree({ clientConfig, rootRoute })             │   │
│   │   CatalogApp({ clientConfig })  [optional]               │   │
│   │                                                          │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                   │
│                              ▼                                   │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                   Backend API (Future)                   │   │
│   │                                                          │   │
│   │   POST /api/inquiries  → Lead capture                    │   │
│   │   POST /api/contact    → Contact form                    │   │
│   │   GET  /api/products   → Catalog data                    │   │
│   │                                                          │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Directory Structure

```
Potpourri/
├── src/
│   ├── api/                    # API client modules
│   │   └── inquiries.ts        # Inquiry submission + localStorage fallback
│   │
│   ├── components/             # Shared structural components
│   │   ├── Breadcrumbs.tsx     # Navigation breadcrumbs
│   │   ├── CategoryNav.tsx     # Category sidebar navigation
│   │   ├── ErrorBoundary.tsx   # React error boundary
│   │   ├── ProductSchema.tsx   # JSON-LD structured data
│   │   ├── SEO.tsx             # Meta tags component
│   │   └── Skeleton.tsx        # Loading skeleton primitives
│   │
│   ├── data/
│   │   └── mockProducts.ts     # 36 mock products for development
│   │
│   ├── hooks/
│   │   └── useAuth.ts          # Admin authentication hook
│   │
│   ├── layout/
│   │   ├── AppShell.tsx        # Main layout (header + footer)
│   │   └── MobileNav.tsx       # Hamburger menu for mobile
│   │
│   ├── routes/
│   │   ├── index.tsx           # Home page
│   │   ├── catalog.tsx         # Product listing
│   │   ├── item.tsx            # Product detail
│   │   ├── admin.tsx           # Admin dashboard
│   │   ├── contact.tsx         # Contact page
│   │   └── notFound.tsx        # 404 page
│   │
│   ├── ui/                     # Reusable UI components
│   │   ├── sections/           # Home page sections
│   │   │   ├── HeroSection.tsx
│   │   │   ├── CategoryGrid.tsx
│   │   │   ├── Testimonials.tsx
│   │   │   ├── TrustBadges.tsx
│   │   │   ├── VisitUs.tsx
│   │   │   └── ProductTeaserGrid.tsx
│   │   │
│   │   ├── AdminProductsTable.tsx
│   │   ├── AdminInquiriesTable.tsx
│   │   ├── AdminProductForm.tsx
│   │   ├── AdminCategoriesPanel.tsx
│   │   ├── DeleteConfirmModal.tsx
│   │   ├── FilterBar.tsx
│   │   ├── InquiryModal.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ProductGallery.tsx
│   │   ├── RelatedProducts.tsx
│   │   ├── SearchInput.tsx
│   │   ├── EmptyState.tsx
│   │   └── index.tsx           # Barrel exports + base components
│   │
│   ├── app.tsx                 # Root route + router setup
│   ├── catalogCore.tsx         # Package seam (CRITICAL)
│   ├── client.config.ts        # Branding + tenant config
│   ├── main.tsx                # App entry point
│   └── styles.css              # Global styles + Tailwind
│
├── docs/                       # Documentation
│   ├── ARCHITECTURE.md         # This file
│   ├── ROADMAP.md              # Phased ship plan
│   ├── TASKS.md                # Single source of truth backlog
│   ├── PACKAGE_INTEGRATION.md  # Catalog-core integration spec
│   ├── AI_STATE.md             # Agent context
│   └── AI_PLAYBOOK.md          # Agent rules
│
├── public/
│   ├── favicon.svg
│   ├── manifest.json
│   ├── robots.txt
│   └── sitemap.xml
│
├── index.html                  # HTML entry
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── vercel.json                 # Vercel deployment config
```

---

## Key Architectural Decisions

### 1. Single Config File for Branding

All tenant-specific configuration lives in `src/client.config.ts`:

```typescript
export const clientConfig: ClientConfig = {
  brand: {
    name: 'Potpourri',
    tagline: 'Curated gifts for every occasion',
    logoUrl: '/logo.svg',
    colors: { primary: '#7c6a5d', accent: '#d4a59a', ... }
  },
  tenant: {
    id: 'potpourri',
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? '/api'
  },
  features: {
    enableCheckout: false,
    enableAdmin: true,
    priceMode: 'fixed'
  },
  contact: { ... },
  catalog: { ... },
  testimonials: { ... }
}
```

**Rationale**: Clone the repo, edit one file, deploy. White-label ready.

### 2. One-File Package Seam

Only `src/catalogCore.tsx` imports the package:

```typescript
// When package is ready, this is the ONLY change needed:
export { makeRouteTree, CatalogApp } from '@signal/catalog-core'

// Delete everything below this line (600+ lines of stubs)
```

**Rationale**: Minimize merge conflicts, single point of integration.

### 3. TanStack Router for Type-Safe Routing

Routes are defined as a tree with full type inference:

```typescript
const routeTree = rootRoute.addChildren([
  indexRoute,     // /
  catalogRoute,   // /catalog
  itemRoute,      // /item/$id
  adminRoute,     // /admin
  contactRoute,   // /contact
  notFoundRoute   // * (catch-all)
])
```

**Rationale**: Type-safe links, automatic code splitting, modern patterns.

### 4. TanStack Query for Data Fetching (Future)

Currently using mock data with simulated delays. When backend is ready:

```typescript
const { data, isLoading } = useQuery({
  queryKey: ['products'],
  queryFn: () => fetch('/api/products').then(r => r.json())
})
```

**Rationale**: Caching, deduplication, background refetch built-in.

### 5. localStorage Fallback for Demo Mode

Lead capture persists to localStorage when no backend:

```typescript
// src/api/inquiries.ts
try {
  const response = await fetch(endpoint, { ... })
  if (response.ok) return { success: true }
} catch {
  // Fallback to localStorage
  return saveInquiryLocally(payload)
}
```

**Rationale**: Demo works without backend, data persists across refreshes.

---

## Where catalog-core Will Plug In

The package seam is designed for minimal friction:

```typescript
// src/catalogCore.tsx (current - 700 lines of stubs)
export function makeRouteTree({ clientConfig, rootRoute }) {
  const indexRoute = createRoute({ ... })
  const catalogRoute = createRoute({ ... })
  // ... 600+ lines of component implementations
  return [indexRoute, catalogRoute, itemRoute, adminRoute]
}

// src/catalogCore.tsx (future - 1 line)
export { makeRouteTree, CatalogApp } from '@signal/catalog-core'
```

The package will receive `clientConfig` and return TanStack routes configured for that tenant.

---

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_API_BASE_URL` | No | `/api` | Backend API endpoint |

**Future additions** (not yet implemented):
- `VITE_ADMIN_PASSWORD` - Admin authentication
- `VITE_ANALYTICS_ID` - GA/Plausible tracking
- `VITE_SENTRY_DSN` - Error reporting

---

## Runtime Assumptions

1. **Modern browsers**: ES2020+, no IE11 support
2. **JavaScript enabled**: No SSR/hydration (pure SPA)
3. **Network available**: Graceful degradation to localStorage when offline
4. **Single tenant**: One config per deployment
5. **No real-time**: No WebSockets, polling, or subscriptions

---

## Data Flow

### Inquiry Submission

```
User fills form → InquiryModal.handleSubmit()
                         │
                         ▼
              submitInquiry(payload)
                         │
            ┌────────────┴────────────┐
            │                         │
    Backend available         Backend unavailable
            │                         │
            ▼                         ▼
    POST /api/inquiries      saveInquiryLocally()
            │                         │
            ▼                         ▼
    { success: true }        localStorage.setItem()
            │                         │
            └────────────┬────────────┘
                         │
                         ▼
              Show success message
```

### Admin Inquiry View

```
Admin opens /admin → AdminInquiriesTable mounts
                              │
                              ▼
                    getLocalInquiries()
                              │
                              ▼
                    localStorage.getItem()
                              │
              ┌───────────────┴───────────────┐
              │                               │
        Data exists                    No data
              │                               │
              ▼                               ▼
        Show inquiries              Show mock data
```

---

## Known Technical Debt

| Issue | Impact | Location | Mitigation |
|-------|--------|----------|------------|
| Admin password hardcoded | Security risk | `src/hooks/useAuth.ts:10` | Move to env var (POT-041) |
| 700 lines of stubs in catalogCore | Maintenance burden | `src/catalogCore.tsx` | Delete when package ready |
| No real backend | Data volatile | `src/api/inquiries.ts` | Add persistence layer |
| Simulated loading delays | Artificial UX | Multiple routes | Remove when real API |
| No server-side rendering | SEO limitations | Architecture | Consider Next.js later |
| Bundle not analyzed | Potential bloat | Build config | Add bundle analysis (POT-034) |

---

## Security Considerations

| Area | Current State | Recommendation |
|------|---------------|----------------|
| Admin auth | Hardcoded password in source | Move to env var, add proper auth later |
| Form submission | No rate limiting | Add client-side throttle |
| XSS | React escapes by default | Audit any dangerouslySetInnerHTML |
| CSRF | N/A (no cookies) | Add when backend uses sessions |
| Data exposure | localStorage readable | Don't store sensitive data |

---

## Performance Characteristics

| Metric | Target | Current | Notes |
|--------|--------|---------|-------|
| First Contentful Paint | <1.5s | ~1.0s | Vite optimized |
| Time to Interactive | <3.0s | ~2.0s | Code splitting helps |
| Bundle size (gzipped) | <500KB | ~300KB | Verify with POT-034 |
| Lighthouse Performance | >90 | ~85 | Room for improvement |

---

*Last updated: 2026-01-03*

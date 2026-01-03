# Potpourri

## TL;DR

Gift shop storefront client (Vite + React + TanStack). Thin client consuming `@signal/catalog-core` package (pending). All branding via `src/client.config.ts`.

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

- ✅ Working
  - Scaffold complete (Vite + React + TanStack Router/Query)
  - Branding config (`src/client.config.ts`) with theme application
  - CI pipeline (lint, typecheck, test, build)
  - Auto-merge workflow (label `automerge`)
  - Auto-PR creation for `claude/**` branches
  - Catalog page with filtering and sorting
  - Product detail page with gallery and inquiry modal
  - Admin dashboard with auth gate and professional SaaS styling
  - Vercel deployment config
  - SEO meta tags and Open Graph
  - Contact page with map
  - Footer with contact info
  - Loading skeletons and error boundary

- 🟡 Partial
  - Package integration seam exists (`src/catalogCore.tsx`) but uses stubs
  - Inquiry modal captures leads (no backend persistence yet)

- ❌ Missing/Broken
  - `@signal/catalog-core` package not yet available
  - Checkout disabled (feature flag exists, no implementation)

## How to Run

### Install

```bash
npm install
```

### Dev

```bash
npm run dev
```

### Test

```bash
npm run test          # Single run
npm run test:watch    # Watch mode
```

### Build

```bash
npm run build         # TypeScript + Vite production build
npm run preview       # Preview production build locally
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

## Task Queue (Autopilot)

| ID       | Title                                        | Priority | Status      | Files                                                    | Acceptance Criteria                                                                                                                                      | Notes/PR |
| -------- | -------------------------------------------- | -------- | ----------- | -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| GIFT-001 | Polish home hero section                     | 1        | DONE        | `src/routes/index.tsx`, `src/client.config.ts`           | WHAT: Add compelling hero with brand imagery and CTA / WHY: First impression drives engagement / WHERE: Home route / DONE: Hero visible, CTA links to catalog | Branch: claude/cost-control-setup-wRLFR |
| GIFT-002 | Add inquiry form backend/lead capture        | 1        | DONE        | `src/routes/item.tsx`, `src/api/inquiries.ts`, `src/ui/InquiryModal.tsx` | WHAT: POST inquiry to API / WHY: Capture leads for follow-up / WHERE: Inquiry modal / DONE: Submission persists, user sees confirmation                 | Branch: claude/cost-control-setup-IG5XJ |
| GIFT-003 | Polish catalog grid cards                    | 2        | DONE        | `src/routes/catalog.tsx`, `src/ui/ProductCard.tsx`         | WHAT: Improve card styling with hover effects / WHY: Visual polish increases conversions / WHERE: Catalog page / DONE: Cards have shadows, transitions  | Branch: claude/cost-control-setup-8LW3i |
| GIFT-004 | Add category navigation component            | 2        | DONE        | `src/components/CategoryNav.tsx`, `src/routes/catalog.tsx` | WHAT: Sidebar or tabs for category filtering / WHY: Easier browsing / WHERE: Catalog page / DONE: Click category filters products                       | Branch: claude/cost-control-setup-BjjJY |
| GIFT-005 | Polish product detail gallery                | 2        | DONE        | `src/routes/item.tsx`, `src/ui/ProductGallery.tsx`       | WHAT: Add zoom and thumbnail nav / WHY: Users want to inspect products / WHERE: Item page / DONE: Click thumbnail shows image, zoom works               | Branch: claude/cost-control-setup-8LW3i |
| GIFT-006 | Add admin auth gate                          | 2        | DONE        | `src/routes/admin.tsx`, `src/hooks/useAuth.ts`           | WHAT: Simple password/flag check / WHY: Prevent public access / WHERE: Admin route / DONE: Unauthenticated users see login prompt                       | Branch: claude/cost-control-setup-6D4uU |
| GIFT-007 | Add Vercel deployment config                 | 3        | DONE        | `vercel.json`, `.env.example`                            | WHAT: Configure Vercel deployment / WHY: Enable production hosting / WHERE: Root / DONE: `vercel deploy` works                                          | Branch: claude/cost-control-setup-EEwp6 |
| GIFT-008 | Prepare catalogCore for package swap         | 3        | TODO        | `src/catalogCore.tsx`                                    | WHAT: Add clear swap instructions and types / WHY: Smooth integration when package ready / WHERE: Package seam / DONE: Comments explain swap process    |          |
| GIFT-009 | Add SEO meta tags and Open Graph             | 3        | DONE        | `index.html`, `src/components/SEO.tsx`                   | WHAT: Dynamic meta tags per page / WHY: Better sharing/search / WHERE: Head / DONE: Sharing shows correct title/image                                   | Branch: claude/cost-control-setup-8aQDd |
| GIFT-010 | Add contact page with map                    | 3        | DONE        | `src/routes/contact.tsx`, `src/client.config.ts`, `src/app.tsx` | WHAT: Contact form + address map / WHY: Multiple contact methods / WHERE: New route / DONE: Form submits, map shows location                            | Branch: claude/cost-control-setup-MvyPW |
| GIFT-011 | Add footer with contact info                 | 4        | DONE        | `src/layout/AppShell.tsx`                                | WHAT: Footer with hours, address, links / WHY: Standard UX / WHERE: Layout / DONE: Footer visible on all pages                                          | Branch: claude/cost-control-setup-YXOMC |
| GIFT-012 | Add loading skeletons                        | 4        | DONE        | `src/components/Skeleton.tsx`, `src/routes/*`            | WHAT: Skeleton loaders during fetch / WHY: Perceived performance / WHERE: All data routes / DONE: Skeletons show during load                            | Branch: ai/gift/GIFT-012-loading-skeletons |
| GIFT-013 | Add error boundary                           | 4        | DONE        | `src/components/ErrorBoundary.tsx`, `src/app.tsx`        | WHAT: Catch and display errors gracefully / WHY: UX on failures / WHERE: Root / DONE: Errors show friendly message                                      | Branch: claude/cost-control-setup-tAxxR |
| GIFT-014 | Verify CI automerge flow                     | 5        | READY       | `.github/workflows/automerge.yml`                        | WHAT: Test automerge with real PR / WHY: Confirm autopilot works / WHERE: CI / DONE: PR with label merges automatically                                 |          |
| GIFT-015 | Add related products section                 | 5        | READY       | `src/routes/item.tsx`, `src/components/RelatedProducts.tsx` | WHAT: Show similar items on detail page / WHY: Cross-sell / WHERE: Item page / DONE: Related items display below main product                           |          |
| GIFT-016 | Add 404 Not Found page                       | 2        | TODO        | `src/routes/notFound.tsx`, `src/app.tsx`                 | WHAT: Create a 404 page for unknown routes / WHY: Better UX than blank page / WHERE: Catch-all route / DONE: Unknown URLs show friendly 404 with nav home |          |
| GIFT-017 | Add favicon and PWA manifest                 | 3        | TODO        | `public/favicon.ico`, `public/manifest.json`, `index.html` | WHAT: Add favicon and web app manifest / WHY: Browser tab icon and installability / WHERE: Public assets / DONE: Favicon shows in tab, manifest valid   |          |
| GIFT-018 | Add breadcrumb navigation                    | 3        | TODO        | `src/components/Breadcrumbs.tsx`, `src/routes/catalog.tsx`, `src/routes/item.tsx` | WHAT: Add breadcrumb trail on catalog/item pages / WHY: Easier navigation context / WHERE: Catalog and item routes / DONE: Breadcrumbs show current path, links work |          |
| GIFT-019 | Add admin inquiries list view                | 2        | TODO        | `src/routes/admin.tsx`, `src/ui/AdminInquiriesTable.tsx`, `src/api/inquiries.ts` | WHAT: Display submitted inquiries in admin / WHY: Staff needs to see leads / WHERE: Admin dashboard / DONE: Inquiries table visible, shows mock/stored data |          |
| GIFT-020 | Add JSON-LD structured data for products     | 2        | TODO        | `src/components/ProductSchema.tsx`, `src/routes/item.tsx` | WHAT: Add Product schema.org JSON-LD / WHY: Rich snippets in search results / WHERE: Item detail page head / DONE: Valid JSON-LD in page source         |          |
| GIFT-021 | Add empty state for catalog                  | 3        | TODO        | `src/routes/catalog.tsx`, `src/ui/EmptyState.tsx`        | WHAT: Show friendly empty state when no products match / WHY: Clear feedback vs blank grid / WHERE: Catalog page / DONE: "No products found" message with reset link |          |
| GIFT-022 | Add mobile hamburger navigation              | 2        | TODO        | `src/layout/AppShell.tsx`, `src/layout/MobileNav.tsx`    | WHAT: Add responsive hamburger menu for mobile / WHY: Nav unusable on small screens / WHERE: Header layout / DONE: Menu toggles on mobile, links work   |          |
| GIFT-023 | Add GitHub PR template                       | 4        | TODO        | `.github/PULL_REQUEST_TEMPLATE.md`                       | WHAT: Add PR template with checklist / WHY: Consistent PR descriptions / WHERE: GitHub config / DONE: New PRs show template with sections               |          |
| GIFT-024 | Add env validation on startup                | 4        | TODO        | `src/lib/env.ts`, `src/main.tsx`                         | WHAT: Validate required env vars at app start / WHY: Fail fast with clear errors / WHERE: App entry / DONE: Missing vars logged with actionable message |          |
| GIFT-025 | Add keyboard navigation for gallery          | 4        | TODO        | `src/ui/ProductGallery.tsx`                              | WHAT: Arrow keys navigate gallery images / WHY: Accessibility and power users / WHERE: Product gallery / DONE: Left/Right arrows change image, Escape closes zoom |          |
| GIFT-026 | Add testimonials section to home             | 3        | TODO        | `src/ui/sections/Testimonials.tsx`, `src/routes/index.tsx`, `src/client.config.ts` | WHAT: Add customer testimonials carousel / WHY: Social proof builds trust / WHERE: Home page / DONE: Testimonials display, config-driven content        |          |
| GIFT-027 | Add product search input                     | 2        | TODO        | `src/ui/SearchInput.tsx`, `src/routes/catalog.tsx`       | WHAT: Add search box with debounced filtering / WHY: Quick product lookup / WHERE: Catalog page / DONE: Typing filters products, 300ms debounce         |          |
| GIFT-028 | Add admin product form modal                 | 2        | TODO        | `src/ui/AdminProductForm.tsx`, `src/routes/admin.tsx`    | WHAT: Modal form for add/edit product / WHY: Admin needs CRUD capability / WHERE: Admin dashboard / DONE: Modal opens, form validates, mock save works  |          |
| GIFT-029 | Add sitemap.xml and robots.txt               | 3        | TODO        | `public/sitemap.xml`, `public/robots.txt`, `index.html`  | WHAT: Add static sitemap and robots.txt / WHY: SEO crawlability / WHERE: Public root / DONE: /sitemap.xml and /robots.txt accessible                    |          |
| GIFT-030 | Add analytics event placeholders             | 4        | TODO        | `src/lib/analytics.ts`, `src/routes/item.tsx`, `src/ui/InquiryModal.tsx` | WHAT: Add trackEvent stub for key actions / WHY: Ready for GA/Plausible integration / WHERE: Key conversion points / DONE: Events logged to console in dev |          |

**Status Values**: `TODO` | `READY` | `IN_PROGRESS` | `DONE` | `BLOCKED`

## Release Gates

All PRs must pass before merge:

```bash
npm run lint       # ESLint passes
npm run typecheck  # TypeScript passes
npm run test       # Vitest passes
npm run build      # Production build succeeds
```

Auto-merge: Add `automerge` label to PRs for automatic squash-merge after CI passes.

## Control-Plane Docs

| Document                                              | Purpose                                |
| ----------------------------------------------------- | -------------------------------------- |
| [docs/AI_STATE.md](docs/AI_STATE.md)                  | Suite goal, repo map, active blockers  |
| [docs/AI_PLAYBOOK.md](docs/AI_PLAYBOOK.md)            | Agent rules, task size, stop conditions|
| [docs/AI_METRICS.json](docs/AI_METRICS.json)          | Counters and timestamps                |
| [docs/PACKAGE_INTEGRATION.md](docs/PACKAGE_INTEGRATION.md) | @signal/catalog-core seam spec    |

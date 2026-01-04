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

### ✅ SDK Integration Complete

| Item | Status |
|------|--------|
| `@signal-core/catalog-react-sdk` integration | ✅ Complete - SDK integrated into admin route |
| Checkout flow | Feature disabled, can be enabled when needed |

---

## Demo Readiness Checklist

> Run through this before any client meeting.

### Pre-Demo Verification

- [ ] `npm run build` passes without errors
- [ ] Test on actual mobile device (not just devtools)
- [ ] Clear localStorage to test fresh state
- [ ] Verify inquiry submits and appears in admin

### Demo Flow Script

1. **Landing** → Hero, trust badges, testimonials
2. **Browse** → Catalog with search, filter by category
3. **Detail** → Gallery, related products
4. **Inquire** → Fill form, submit, see success
5. **Admin** → Login (password: `admin123`), view inquiry
6. **Mobile** → Hamburger menu, responsive grid

### Known Demo Gotchas

| Issue | Note |
|-------|------|
| Loading skeletons | First load shows 600-800ms skeleton (expected) |
| Admin password | Hardcoded in source - don't inspect during demo |
| Placeholder images | Real deployment would have real product photos |

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

1. **Package seam uses stubs** - SDK package (`@signal-core/catalog-react-sdk`) installed but needs to be built before integration
2. **Checkout disabled** - Feature flag exists but no implementation
3. **Integration plan available** - See [docs/INTEGRATION_PLAN.md](docs/INTEGRATION_PLAN.md) for SDK integration strategy

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

All PRs must pass before merge:

```bash
npm run lint       # ESLint passes
npm run typecheck  # TypeScript passes
npm run test       # Vitest passes
npm run build      # Production build succeeds
```

Auto-merge: Add `automerge` label to PRs for automatic squash-merge after CI passes.

## Documentation

### Ship Plan

| Document | Purpose |
|----------|---------|
| [docs/ROADMAP.md](docs/ROADMAP.md) | Phased plan: Demo → Production → Mobile → AI → Checkout |
| [docs/TASKS.md](docs/TASKS.md) | Full backlog with priorities, status, acceptance criteria |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | App structure, data flow, tech decisions |

### Integration & Operations

| Document | Purpose |
|----------|---------|
| [docs/PACKAGE_INTEGRATION.md](docs/PACKAGE_INTEGRATION.md) | @signal/catalog-core seam spec |
| [docs/AI_STATE.md](docs/AI_STATE.md) | Suite goal, repo map, active blockers |
| [docs/AI_PLAYBOOK.md](docs/AI_PLAYBOOK.md) | Agent rules, task size, stop conditions |
| [docs/AI_METRICS.json](docs/AI_METRICS.json) | Counters and timestamps |

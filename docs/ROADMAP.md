# Roadmap

> Phased ship plan for Potpourri gift shop storefront.

**Last Updated**: 2026-01-03

---

## Overview

Potpourri is a thin-client storefront designed to consume `@signal/catalog-core`. Until that package is published, we run on local stubs. This roadmap defines clear phases to reach demo-ready, production-ready, and future growth states.

---

## Phase 0: Demo-Ready (Inquiry-First)

> **Goal**: A polished storefront that can be shown to clients. Lead capture works. Admin shows inquiries.

### Status: ✅ COMPLETE

All P0 items verified working as of 2026-01-03 audit.

### Must-Have Outcomes

| Outcome | Status | Verified |
|---------|--------|----------|
| Hero section with brand and CTA | ✅ Done | Yes |
| Catalog with search, filter, sort | ✅ Done | Yes |
| Product detail with gallery and inquiry modal | ✅ Done | Yes |
| Inquiry submission persists (localStorage) | ✅ Done | Yes |
| Admin gate blocks unauthenticated users | ✅ Done | Yes |
| Admin shows submitted inquiries | ✅ Done | Yes |
| Mobile hamburger navigation | ✅ Done | Yes |
| 404 page for unknown routes | ✅ Done | Yes |
| Empty states (catalog, admin tables) | ✅ Done | Yes |
| Loading skeletons | ✅ Done | Yes |
| Error boundary | ✅ Done | Yes |
| Testimonials section | ✅ Done | Yes |
| Favicon and manifest | ✅ Done | Yes |
| Contact page with map | ✅ Done | Yes |
| Footer with hours and contact | ✅ Done | Yes |

### Acceptance Criteria for Demo

- [ ] Full flow demo: Browse → View Product → Submit Inquiry → See in Admin
- [ ] Works on mobile (test on actual device)
- [ ] No console errors during flow
- [ ] All navigation links work
- [ ] Branding matches client config

---

## Phase 1: Production-Ready (Inquiry + Admin + Ops)

> **Goal**: Hardened for real traffic. Secure, observable, reliable.

### Status: 🟡 IN PROGRESS (13 items TODO)

### Must-Have Outcomes

| Outcome | Task IDs | Status |
|---------|----------|--------|
| Environment validation at startup | POT-030 | TODO |
| Analytics event hooks ready | POT-031 | TODO |
| Error reporting stub (Sentry-ready) | POT-032 | TODO |
| Production logging config | POT-033 | TODO |
| Bundle size verified <500KB | POT-034 | TODO |
| Inquiry status tracking (new/contacted/closed) | POT-035 | TODO |
| Inquiry detail modal in admin | POT-036 | TODO |
| Trust badges in footer | POT-037 | TODO |
| Basic accessibility (focus, alt, contrast) | POT-038 | TODO |
| Gallery keyboard navigation | POT-039 | TODO |
| CatalogCore swap instructions documented | POT-040 | TODO |
| Admin password from env (not hardcoded) | POT-041 | TODO |
| Rate limiting awareness on forms | POT-042 | TODO |
| Robots.txt and sitemap | POT-043 | ✅ Done |
| JSON-LD product schema | POT-044 | ✅ Done |
| CI automerge verified | POT-045 | ✅ Done |
| PR template added | POT-046 | ✅ Done |

### Acceptance Criteria for Production

- [ ] No hardcoded secrets in source
- [ ] Errors captured and reportable
- [ ] Analytics events fire on key actions
- [ ] axe-core reports 0 critical violations
- [ ] Bundle size meets target
- [ ] Admin can track inquiry lifecycle

---

## Phase 2: Mobile Product Intake (Upload + Basic CRUD)

> **Goal**: Store owner can add products from mobile device. Images upload. Basic inventory visible.

### Status: ⏳ NOT STARTED

### Must-Have Outcomes

| Outcome | Task IDs | Status |
|---------|----------|--------|
| Multi-image upload component | POT-064 | TODO |
| Image optimization on upload | - | TODO |
| Mobile-friendly admin product form | POT-025 (done), needs mobile audit | PARTIAL |
| Basic inventory counts | POT-065 | TODO |
| Stock level badges on products | POT-052 | TODO |
| Admin bulk import CSV | POT-058 | TODO |
| Admin data export | POT-059 | TODO |

### Acceptance Criteria

- [ ] Owner can add product with 4+ images from phone
- [ ] Images resize/compress before save
- [ ] Inventory shows on product cards
- [ ] CSV import works for 100+ products

---

## Phase 3: AI Media Pipeline + JSON + Embeddings (Future)

> **Goal**: AI-powered product descriptions, image enhancement, semantic search.

### Status: ⏳ NOT STARTED (Blocked by catalog-core integration)

### Must-Have Outcomes

| Outcome | Task IDs | Status |
|---------|----------|--------|
| @signal/catalog-core integrated | POT-001, POT-002 | BLOCKED |
| AI media pipeline stub | POT-061 | TODO |
| Embeddings generation for products | - | TODO |
| Semantic search UX | POT-062 | TODO |
| Auto-generated product descriptions | - | TODO |
| Image background removal | - | TODO |

### Acceptance Criteria

- [ ] Package swap complete, stubs removed
- [ ] Products have embeddings
- [ ] "Find similar" search works
- [ ] AI descriptions toggleable per product

---

## Phase 4: Checkout Enablement (Future)

> **Goal**: Full e-commerce with cart, checkout, payment processing, order management.

### Status: ⏳ NOT STARTED

### Must-Have Outcomes

| Outcome | Task IDs | Status |
|---------|----------|--------|
| enableCheckout=true activates cart | - | TODO |
| Cart state management | - | TODO |
| Checkout flow skeleton | POT-050 | TODO |
| Payment integration (Stripe placeholder) | - | TODO |
| Order confirmation page | - | TODO |
| Order management in admin | POT-066 | TODO |
| Customer accounts | POT-067 | TODO |
| Quote request mode | POT-051 | TODO |
| Gift wrapping option | POT-068 | TODO |

### Acceptance Criteria

- [ ] Customer can add to cart, checkout, pay
- [ ] Admin sees orders, can update status
- [ ] Confirmation email sends (or placeholder logs)
- [ ] Quote mode works for variable pricing

---

## Critical Blockers

| Blocker | Impact | Owner | Resolution |
|---------|--------|-------|------------|
| `@signal/catalog-core` not published | Cannot complete Phase 3+, stuck on stubs | Neal | Publish package, signal ready |
| Admin password hardcoded | Security risk for production | Team | POT-041: Move to env var |
| No real backend | Data in localStorage only | Team | Future: Add persistence API |

---

## Dependencies Graph

```
Phase 0 (Demo) ──────────────────────────────► COMPLETE
       │
       ▼
Phase 1 (Production) ────────────────────────► IN PROGRESS
       │
       ├── POT-030 to POT-042 (TODO)
       │
       ▼
Phase 2 (Mobile Intake) ─────────────────────► NOT STARTED
       │
       ├── Requires Phase 1 complete
       │
       ▼
Phase 3 (AI Pipeline) ───────────────────────► BLOCKED
       │
       ├── Requires POT-001 (@signal/catalog-core)
       ├── Requires POT-002 (package swap)
       │
       ▼
Phase 4 (Checkout) ──────────────────────────► FUTURE
       │
       ├── Requires Phase 3 complete
       └── Requires payment provider decision
```

---

## Quick Wins (Low Effort, High Impact)

These can be done immediately with minimal risk:

1. **POT-030**: Env validation (~30 min)
2. **POT-040**: Document catalogCore swap (~15 min)
3. **POT-037**: Trust badges footer (~1 hr)
4. **POT-041**: Move password to env (~30 min)
5. **POT-031**: Analytics stubs (~1 hr)

---

## Risk Register

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| catalog-core delayed | High | High | Continue with stubs, Phase 0-2 unaffected |
| localStorage data loss | Medium | Medium | Document backup, add export feature (POT-059) |
| Admin password leak | Low | High | POT-041: Env var ASAP |
| Bundle bloat | Low | Medium | POT-034: Monitor bundle size |
| Accessibility lawsuit | Low | High | POT-038: Basic a11y pass |

---

*Last updated: 2026-01-03*

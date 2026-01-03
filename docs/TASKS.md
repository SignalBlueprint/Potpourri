# Task Backlog

> Single source of truth for all Potpourri work items.

**Last Audit**: 2026-01-03
**ID Scheme**: `POT-XXX` (continuing from existing GIFT-XXX where applicable)

---

## Priority Rubric

| Priority | Definition | Examples |
|----------|------------|----------|
| **P0** | Demo-breaking or trust-breaking. Must fix before any client meeting. | Lead capture reliability, blank states, nav issues, obvious broken flows |
| **P1** | Production hardening. Required before going live with real users. | Logging, error reporting, rate limiting, analytics, security basics |
| **P2** | Future expansion and polish. Nice-to-have for growth. | Checkout, AI pipeline, embeddings, advanced inventory |

---

## Backlog Table

### Epic: BLOCKED - Catalog-Core Package Integration

> **Owner**: Neal (external)
> **Status**: BLOCKED - Package not yet published
> **Impact**: Cannot swap stubs for real package, cannot add package-dependent features

| ID | Title | Priority | Status | Blocked By | Area | Files | Acceptance Criteria | Notes |
|----|-------|----------|--------|------------|------|-------|---------------------|-------|
| POT-001 | Publish @signal/catalog-core package | P0 | BLOCKED | External | Package | N/A | Package published to npm or private registry | Owner: Neal |
| POT-002 | Swap catalogCore stubs for real package | P0 | BLOCKED | POT-001 | Integration | `src/catalogCore.tsx` | Uncomment real import, delete 600+ lines of stubs, all routes render | One-line change once package ready |
| POT-003 | Add package swap feature flag | P1 | BLOCKED | POT-001 | Config | `src/client.config.ts`, `src/catalogCore.tsx` | Feature flag toggles stub vs real, both paths work | Safe rollout mechanism |
| POT-004 | Verify package peer dependencies | P1 | BLOCKED | POT-001 | Integration | `package.json` | React 18, TanStack Router/Query versions compatible | Check before merge |
| POT-005 | Update types to match package exports | P1 | BLOCKED | POT-001 | Types | `src/catalogCore.tsx` | Types match package API exactly, no TS errors | May need type overrides |

---

### P0: Demo Readiness (Trust & Reliability)

> Items that must work flawlessly for a client demo.

| ID | Title | Priority | Status | Blocked By | Area | Files | Acceptance Criteria | Notes |
|----|-------|----------|--------|------------|------|-------|---------------------|-------|
| POT-010 | Verify inquiry modal submits reliably | P0 | DONE | - | Lead Capture | `src/ui/InquiryModal.tsx`, `src/api/inquiries.ts` | Submit shows spinner, success message appears, data in localStorage | Falls back to localStorage when API unavailable |
| POT-011 | Verify admin shows submitted inquiries | P0 | DONE | - | Admin | `src/ui/AdminInquiriesTable.tsx` | Inquiries table shows localStorage data, includes mock fallback | Loads from localStorage or shows mock |
| POT-012 | Mobile navigation works on all breakpoints | P0 | DONE | - | UX | `src/layout/MobileNav.tsx`, `src/layout/AppShell.tsx` | Hamburger visible <768px, menu opens/closes, links navigate | Verify on actual mobile device |
| POT-013 | 404 page renders for unknown routes | P0 | DONE | - | UX | `src/routes/notFound.tsx` | /unknown shows friendly 404 with nav home | Catch-all route configured |
| POT-014 | Catalog search filters products correctly | P0 | DONE | - | UX | `src/routes/catalog.tsx`, `src/ui/SearchInput.tsx` | Typing filters products, 300ms debounce, results update | Debounced search implemented |
| POT-015 | Empty state shows when no products match | P0 | DONE | - | UX | `src/routes/catalog.tsx`, `src/ui/EmptyState.tsx` | "No products found" with reset link when filter returns empty | Friendly empty state |
| POT-016 | Product images have fallback on load error | P0 | DONE | - | UX | `src/ui/ProductCard.tsx`, `src/ui/ProductGallery.tsx` | Broken image shows placeholder, no console errors | onError handler with fallback |
| POT-017 | Favicon and manifest present | P0 | DONE | - | Polish | `public/favicon.svg`, `public/manifest.json` | Browser tab shows icon, manifest valid | PWA-ready |
| POT-018 | Admin auth gate blocks unauthenticated | P0 | DONE | - | Security | `src/routes/admin.tsx`, `src/hooks/useAuth.ts` | /admin redirects to login if not authenticated | SessionStorage-based |
| POT-019 | Contact form submits and shows confirmation | P0 | DONE | - | Lead Capture | `src/routes/contact.tsx` | Form submit shows "Message Sent!", data persists | localStorage fallback |
| POT-020 | All navigation links work (header + footer) | P0 | DONE | - | UX | `src/layout/AppShell.tsx` | Every link navigates correctly, no dead links | Manual test required |
| POT-021 | Testimonials section displays on home | P0 | DONE | - | Trust | `src/ui/sections/Testimonials.tsx` | 3+ testimonials render, config-driven content | Social proof |
| POT-022 | Loading skeletons show during data fetch | P0 | DONE | - | UX | `src/components/Skeleton.tsx`, multiple routes | Skeleton visible during simulated load, then content | Perceived performance |
| POT-023 | Error boundary catches and displays errors | P0 | DONE | - | Reliability | `src/components/ErrorBoundary.tsx` | Thrown error shows friendly message with retry | Wrap entire app |
| POT-024 | Product detail page loads and displays | P0 | DONE | - | Core | `src/routes/item.tsx` | /item/1 shows product with gallery, price, CTA | Core flow |
| POT-025 | Admin product form modal works | P0 | DONE | - | Admin | `src/ui/AdminProductForm.tsx` | Add button opens modal, form validates, mock save logs | CRUD ready |
| POT-026 | Admin delete confirmation modal works | P0 | DONE | - | Admin | `src/ui/DeleteConfirmModal.tsx` | Delete shows confirm dialog, cancel closes, confirm deletes | Prevent accidents |
| POT-027 | Admin category management works | P0 | DONE | - | Admin | `src/ui/AdminCategoriesPanel.tsx` | Add/edit/delete categories, changes persist in state | Basic CRUD |
| POT-028 | Breadcrumbs show correct path | P0 | DONE | - | UX | `src/components/Breadcrumbs.tsx` | Catalog/item pages show Home > Shop > [Category] > Product | Navigation context |
| POT-029 | Scroll to top on route change | P0 | DONE | - | UX | `src/app.tsx` | Navigate to new page, starts at top | useEffect on pathname |

---

### P1: Production Hardening

> Required before going live with real traffic.

| ID | Title | Priority | Status | Blocked By | Area | Files | Acceptance Criteria | Notes |
|----|-------|----------|--------|------------|------|-------|---------------------|-------|
| POT-030 | Add env validation on startup | P1 | DONE | - | Ops | `src/lib/env.ts`, `src/main.tsx`, `src/vite-env.d.ts` | Missing VITE_API_BASE_URL shows actionable error in console | Validates env vars at startup, logs warnings in dev |
| POT-031 | Add analytics event placeholders | P1 | DONE | - | Analytics | `src/lib/analytics.ts`, `src/routes/item.tsx`, `src/ui/InquiryModal.tsx` | trackEvent('inquiry_submit') etc, logs in dev, no-op in prod | Tracks product_view, inquiry_start/success/error |
| POT-032 | Add error reporting placeholder | P1 | DONE | - | Ops | `src/lib/errorReporting.ts`, `src/components/ErrorBoundary.tsx` | captureException stub called on errors, ready for Sentry | ErrorBoundary calls captureException |
| POT-033 | Add console logging config | P1 | DONE | - | Ops | `src/lib/logger.ts` | Logger respects NODE_ENV, debug in dev, errors only in prod | Clean production console |
| POT-034 | Verify production build optimization | P1 | DONE | - | Performance | `vite.config.ts`, `package.json` | Bundle <500KB gzipped, no duplicate deps, tree shaking works | Build verified: 118KB gzipped |
| POT-035 | Add inquiry status management | P1 | DONE | - | Admin | `src/ui/AdminInquiriesTable.tsx`, `src/api/inquiries.ts` | Status dropdown (new/contacted/closed), persists to localStorage | Status dropdown in table, persists to localStorage |
| POT-036 | Add admin inquiry detail modal | P1 | DONE | - | Admin | `src/ui/InquiryDetailModal.tsx`, `src/routes/admin.tsx` | Click row opens modal with full inquiry data | Full modal with status change and email reply |
| POT-037 | Add trust badges to footer | P1 | DONE | - | Trust | `src/layout/AppShell.tsx` | Payment security, shipping, guarantee badges visible | 4 trust badges with icons in footer |
| POT-038 | Add basic accessibility fixes | P1 | PARTIAL | - | A11y | Multiple files | Focus states visible, alt text present, no critical axe violations | Slice 1 DONE: focus-visible states. Slice 2 DONE: alt text audit (all img tags have alt), decorative SVGs hidden (aria-hidden in HeroSection.tsx, item.tsx). Remaining: axe violation scan |
| POT-039 | Add keyboard navigation for gallery | P1 | DONE | - | A11y | `src/ui/ProductGallery.tsx` | Arrow keys navigate, Escape closes zoom, focus ring visible | Power users + a11y |
| POT-040 | Prepare catalogCore swap instructions | P1 | DONE | - | Docs | `src/catalogCore.tsx` | Clear comments: "delete lines X-Y, uncomment line Z" | Swap box at top of file, DELETE markers around stub code |
| POT-041 | Secure admin password handling | P1 | DONE | - | Security | `src/hooks/useAuth.ts`, `src/lib/env.ts` | Password from env var, not hardcoded in source | Uses VITE_ADMIN_PASSWORD with fallback |
| POT-042 | Add rate limiting awareness to forms | P1 | DONE | - | Security | `src/ui/InquiryModal.tsx`, `src/routes/contact.tsx` | Disable submit for 2s after submit, show if rate limited | 2s cooldown with timer, shows "Please wait..." |
| POT-043 | Add SEO robots.txt and sitemap | P1 | DONE | - | SEO | `public/robots.txt`, `public/sitemap.xml` | Both files exist and are valid | Basic SEO |
| POT-044 | Add JSON-LD product schema | P1 | DONE | - | SEO | `src/components/ProductSchema.tsx`, `src/routes/item.tsx` | Valid JSON-LD in page source | Rich snippets |
| POT-045 | Verify CI automerge flow works | P1 | DONE | - | CI | `.github/workflows/automerge.yml` | PR with automerge label merges after CI | Autopilot verified |
| POT-046 | Add GitHub PR template | P1 | DONE | - | CI | `.github/PULL_REQUEST_TEMPLATE.md` | New PRs show template with sections | Consistent PRs |

---

### P2: Future Expansion

> Growth features, not required for initial launch.

| ID | Title | Priority | Status | Blocked By | Area | Files | Acceptance Criteria | Notes |
|----|-------|----------|--------|------------|------|-------|---------------------|-------|
| POT-050 | Add checkout flow skeleton | P2 | TODO | - | Commerce | `src/routes/checkout.tsx` | Route exists when enableCheckout=true, cart summary + form shell | Payment integration later |
| POT-051 | Add quote request mode | P2 | TODO | - | Commerce | `src/ui/InquiryModal.tsx`, `src/routes/item.tsx` | priceMode='quote' shows "Request Quote" with quantity field | Variable pricing |
| POT-052 | Add inventory badges | P2 | DONE | - | UX | `src/data/mockProducts.ts`, `src/ui/index.tsx`, `src/ui/ProductCard.tsx`, `src/routes/item.tsx`, `src/catalogCore.tsx` | "In Stock" / "Low Stock" / "Out of Stock" badge | Urgency signals. Added StockStatus type, InventoryBadge component, stock field to all products |
| POT-053 | Add product favorites/wishlist | P2 | TODO | - | UX | `src/hooks/useFavorites.ts` | Heart icon saves to localStorage, favorites page | Engagement feature |
| POT-054 | Add product comparison | P2 | TODO | - | UX | `src/routes/compare.tsx` | Select 2-4 products, side-by-side table | Decision helper |
| POT-055 | Add recently viewed products | P2 | DONE | - | UX | `src/hooks/useRecentlyViewed.ts`, `src/ui/RecentlyViewed.tsx`, `src/routes/item.tsx` | Show last 4 viewed products on item page | Cross-sell. localStorage persistence, syncs across tabs |
| POT-056 | Add newsletter signup | P2 | DONE | - | Marketing | `src/ui/NewsletterForm.tsx`, `src/layout/AppShell.tsx`, `src/ui/index.tsx`, `src/lib/analytics.ts` | Email input in footer, localStorage capture | Lead nurture. Centered form above trust badges, analytics tracking, success state |
| POT-057 | Add social share buttons | P2 | TODO | - | Marketing | `src/ui/ShareButtons.tsx`, `src/routes/item.tsx` | Share to Twitter, Facebook, copy link | Viral growth |
| POT-058 | Add admin product import CSV | P2 | TODO | - | Admin | `src/ui/AdminImportCSV.tsx` | Upload CSV, parse, preview, import | Bulk operations |
| POT-059 | Add admin export data | P2 | TODO | - | Admin | `src/routes/admin.tsx` | Download products/inquiries as CSV | Data portability |
| POT-060 | Add admin dashboard charts | P2 | TODO | - | Admin | `src/ui/AdminCharts.tsx` | Inquiry trends, category distribution | Visual analytics |
| POT-061 | Add AI media pipeline placeholder | P2 | TODO | POT-001 | AI | `src/lib/mediaPipeline.ts` | Stub for image optimization, embedding generation | Phase 3 prep |
| POT-062 | Add embeddings search UX | P2 | TODO | POT-061 | AI | `src/ui/SemanticSearch.tsx` | Natural language search with embedding matching | Phase 3 feature |
| POT-063 | Add product reviews/ratings | P2 | TODO | - | Trust | `src/ui/ProductReviews.tsx`, `src/routes/item.tsx` | Star rating display, review list | Social proof |
| POT-064 | Add multi-image product upload | P2 | TODO | - | Admin | `src/ui/ImageUploader.tsx` | Drag-drop multiple images, reorder, delete | Rich product media |
| POT-065 | Add inventory management | P2 | TODO | - | Admin | `src/ui/AdminInventory.tsx` | Stock counts, low stock alerts, reorder points | Ops visibility |
| POT-066 | Add order management (when checkout enabled) | P2 | TODO | POT-050 | Admin | `src/routes/admin.tsx` | Orders list, status updates, fulfillment | Post-checkout ops |
| POT-067 | Add customer accounts | P2 | TODO | - | Auth | `src/routes/account.tsx` | Login, order history, saved addresses | Repeat customers |
| POT-068 | Add gift wrapping option | P2 | TODO | - | Commerce | `src/ui/GiftOptions.tsx` | Checkbox in checkout/inquiry, +$5 option | Upsell |
| POT-069 | Add store locator | P2 | TODO | - | Multi-location | `src/routes/locations.tsx` | Multiple store addresses with maps | Franchise support |

---

## Status Summary

| Priority | Total | DONE | TODO | BLOCKED |
|----------|-------|------|------|---------|
| BLOCKED Epic | 5 | 0 | 0 | 5 |
| P0 | 20 | 20 | 0 | 0 |
| P1 | 17 | 15 | 2 | 0 |
| P2 | 20 | 3 | 17 | 0 |
| **Total** | **62** | **38** | **19** | **5** |

---

## Quick Reference: Files by Area

| Area | Key Files |
|------|-----------|
| Core Routes | `src/routes/index.tsx`, `src/routes/catalog.tsx`, `src/routes/item.tsx` |
| Admin | `src/routes/admin.tsx`, `src/ui/Admin*.tsx` |
| Lead Capture | `src/ui/InquiryModal.tsx`, `src/api/inquiries.ts`, `src/routes/contact.tsx` |
| Layout | `src/layout/AppShell.tsx`, `src/layout/MobileNav.tsx` |
| Config | `src/client.config.ts` |
| Package Seam | `src/catalogCore.tsx` |
| Data | `src/data/mockProducts.ts` |
| UI Components | `src/ui/*.tsx` |
| SEO | `src/components/SEO.tsx`, `src/components/ProductSchema.tsx` |

---

*Last updated: 2026-01-03 (POT-056 - newsletter signup form)*

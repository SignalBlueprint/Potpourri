# Product Completion Plan

> Comprehensive definition of "completed" and full backlog to achieve shippable, polished, maintainable product.

**Generated**: 2026-01-03
**Baseline**: 13 tasks DONE, 2 READY, 15 TODO (GIFT-001 to GIFT-030)
**Next ID**: GIFT-031

---

## Definition of Completed App

### A) Customer UI (Home, Catalog, Item Detail)

- [x] Home page with compelling hero, brand imagery, and CTA to catalog
- [x] Catalog grid with product cards, hover effects, shadows, and transitions
- [x] Category filtering via sidebar/tabs navigation
- [x] Product sorting (price, name, newest)
- [x] Product detail page with full gallery (thumbnails, zoom)
- [x] Inquiry modal on product detail for lead capture
- [x] Related products section on item page
- [ ] Search input with debounced filtering
- [ ] Empty state for no search/filter results
- [ ] Breadcrumb navigation on catalog and item pages
- [ ] Mobile hamburger menu navigation
- [ ] 404 Not Found page for unknown routes
- [ ] Keyboard accessibility for gallery (arrows, escape)
- [ ] Customer testimonials section on home page

### B) Admin UI (Inventory CRUD, Categories, Inquiries)

- [x] Admin dashboard with auth gate (password/flag check)
- [x] Professional SaaS-style dashboard layout
- [x] Products table with search and pagination
- [x] Quick actions panel
- [x] Stat cards for overview metrics
- [ ] Inquiries list view showing submitted leads
- [ ] Product add/edit modal form with validation
- [ ] Product delete confirmation
- [ ] Category management (list, add, edit, delete)
- [ ] Image upload handling (or URL input placeholder)
- [ ] Bulk product actions (future)

### C) Data & Content (images, product fields, validation)

- [x] Stub product data in catalogCore.tsx for development
- [ ] Product field validation in admin forms (name, price, images required)
- [ ] Image URL validation (or placeholder fallback)
- [ ] Category must exist for product assignment
- [ ] Price formatting consistency across app
- [ ] Inventory count field (optional for "in stock" badge)

### D) Lead Capture / Sales Flow (inquiry or checkout toggle)

- [x] Inquiry modal captures customer interest
- [x] Feature flag `enableCheckout` exists (currently false)
- [ ] Inquiry data persistence (localStorage or backend stub)
- [ ] Inquiry confirmation email placeholder/hook
- [ ] Quote request mode for `priceMode: 'quote'`
- [ ] Checkout flow placeholder (when enableCheckout = true) - **Package Integration**

### E) SEO & Trust (metadata, sitemap, OG, accessibility basics)

- [x] Dynamic SEO meta tags per page (title, description)
- [x] Open Graph tags for social sharing
- [ ] JSON-LD structured data for products (schema.org/Product)
- [ ] sitemap.xml for search engine crawling
- [ ] robots.txt for crawler directives
- [ ] Favicon and PWA manifest
- [ ] Testimonials/reviews section for social proof
- [ ] Trust badges placeholder (payment security, etc.)
- [ ] WCAG 2.1 AA compliance basics (focus states, alt text, contrast)

### F) Reliability (error boundaries, empty states, loading, logging)

- [x] React Error Boundary with friendly error message
- [x] Loading skeletons during data fetch
- [ ] Empty state component for catalog (no results)
- [ ] Empty state for admin tables (no inquiries, no products)
- [ ] Console logging strategy (debug vs prod)
- [ ] Graceful degradation if image fails to load
- [ ] Offline state detection (future)

### G) Deployment & Ops (env vars, hosting config, monitoring placeholder)

- [x] Vercel deployment configuration (vercel.json)
- [x] Environment variable setup (.env.example, VITE_API_BASE_URL)
- [ ] Environment variable validation at startup
- [ ] Analytics event placeholders (trackEvent stub)
- [ ] Error reporting placeholder (Sentry stub or similar)
- [ ] Health check endpoint (if backend exists)
- [ ] Production build optimization verification

### H) Automation (CI, automerge, task queue hygiene)

- [x] CI pipeline (lint, typecheck, test, build)
- [x] Auto-merge workflow on `automerge` label
- [x] Auto-PR creation for claude/* branches
- [ ] Verify CI automerge flow end-to-end
- [ ] GitHub PR template for consistent descriptions
- [ ] Task queue hygiene (clean up completed tasks periodically)
- [ ] Pre-commit hooks (optional, husky + lint-staged)

---

## Milestones & Task Backlog

### Milestone M1: Core Polish & Critical Gaps

> Goal: Make existing pages feel complete and professional. Handle common error cases.

| ID | Title | Priority | Size | Files | Acceptance Criteria |
|----|-------|----------|------|-------|---------------------|
| GIFT-015 | Add related products section | 5 | M | `src/routes/item.tsx`, `src/ui/RelatedProducts.tsx` | WHAT: Show similar items on detail page / WHY: Cross-sell opportunity / WHERE: Item page below main product / DONE: 4 related items display, clicking navigates to that item |
| GIFT-016 | Add 404 Not Found page | 2 | S | `src/routes/notFound.tsx`, `src/app.tsx` | WHAT: Create a 404 page for unknown routes / WHY: Better UX than blank page / WHERE: Catch-all route / DONE: Unknown URLs show friendly 404 with navigation home and to catalog |
| GIFT-021 | Add empty state for catalog | 3 | S | `src/routes/catalog.tsx`, `src/ui/EmptyState.tsx` | WHAT: Show friendly empty state when no products match filter/search / WHY: Clear feedback vs blank grid / WHERE: Catalog page / DONE: "No products found" message displays with reset filters link |
| GIFT-031 | Add image fallback for broken product images | 3 | S | `src/ui/ProductCard.tsx`, `src/ui/ProductGallery.tsx` | WHAT: Show placeholder when product image fails to load / WHY: Graceful degradation / WHERE: Catalog cards and gallery / DONE: Broken images show placeholder, no console errors |
| GIFT-032 | Add admin empty states | 3 | S | `src/routes/admin.tsx`, `src/ui/EmptyState.tsx` | WHAT: Empty states for products table and inquiries when no data / WHY: Clear feedback for new installs / WHERE: Admin dashboard / DONE: Empty tables show "No items yet" with action prompt |

### Milestone M2: Navigation & Usability

> Goal: Users can find their way around on any device, search products, and navigate intuitively.

| ID | Title | Priority | Size | Files | Acceptance Criteria |
|----|-------|----------|------|-------|---------------------|
| GIFT-022 | Add mobile hamburger navigation | 2 | M | `src/layout/AppShell.tsx`, `src/layout/MobileNav.tsx` | WHAT: Responsive hamburger menu for mobile / WHY: Nav unusable on small screens / WHERE: Header layout / DONE: Menu toggles on mobile, all links work, closes on navigation |
| GIFT-027 | Add product search input | 2 | M | `src/ui/SearchInput.tsx`, `src/routes/catalog.tsx` | WHAT: Search box with debounced filtering / WHY: Quick product lookup / WHERE: Catalog page filter bar / DONE: Typing filters products in real-time, 300ms debounce |
| GIFT-018 | Add breadcrumb navigation | 3 | S | `src/components/Breadcrumbs.tsx`, `src/routes/catalog.tsx`, `src/routes/item.tsx` | WHAT: Breadcrumb trail on catalog/item pages / WHY: Easier navigation context / WHERE: Below header / DONE: Breadcrumbs show current path, links work, home always included |
| GIFT-025 | Add keyboard navigation for gallery | 4 | S | `src/ui/ProductGallery.tsx` | WHAT: Arrow keys navigate gallery images / WHY: Accessibility and power users / WHERE: Product gallery / DONE: Left/Right arrows change image, Escape closes zoom, focus visible |
| GIFT-033 | Add scroll-to-top on route change | 4 | S | `src/app.tsx` | WHAT: Scroll to top when navigating between pages / WHY: Standard UX expectation / WHERE: Router level / DONE: Page starts at top after navigation |

### Milestone M3: Admin Dashboard Complete

> Goal: Store owner can manage inquiries, add/edit products, and manage categories.

| ID | Title | Priority | Size | Files | Acceptance Criteria |
|----|-------|----------|------|-------|---------------------|
| GIFT-019 | Add admin inquiries list view | 2 | M | `src/routes/admin.tsx`, `src/ui/AdminInquiriesTable.tsx`, `src/api/inquiries.ts` | WHAT: Display submitted inquiries in admin / WHY: Staff needs to see leads / WHERE: Admin dashboard tab/section / DONE: Table shows inquiry date, customer name, product, message, status |
| GIFT-028 | Add admin product form modal | 2 | L | `src/ui/AdminProductForm.tsx`, `src/routes/admin.tsx` | WHAT: Modal form for add/edit product / WHY: Admin needs CRUD capability / WHERE: Admin dashboard / DONE: Modal opens, form has all fields, validation works, saves to stub/state |
| GIFT-034 | Add product delete confirmation | 3 | S | `src/ui/DeleteConfirmModal.tsx`, `src/routes/admin.tsx` | WHAT: Confirmation dialog before deleting product / WHY: Prevent accidental deletion / WHERE: Admin products table / DONE: Delete prompts confirmation, cancel closes, confirm deletes |
| GIFT-035 | Add admin category management | 3 | M | `src/ui/AdminCategoriesPanel.tsx`, `src/routes/admin.tsx` | WHAT: List, add, edit, delete categories / WHY: Owner needs to organize catalog / WHERE: Admin dashboard / DONE: Categories CRUD works, changes reflect in product forms |
| GIFT-036 | Add inquiry status management | 4 | S | `src/ui/AdminInquiriesTable.tsx` | WHAT: Mark inquiries as new/contacted/closed / WHY: Track lead follow-up / WHERE: Admin inquiries table / DONE: Status dropdown updates, persists in state |
| GIFT-037 | Add admin inquiry detail modal | 4 | S | `src/ui/InquiryDetailModal.tsx`, `src/routes/admin.tsx` | WHAT: View full inquiry details in modal / WHY: Read full message, customer details / WHERE: Admin inquiries / DONE: Click row opens modal with all inquiry data |

### Milestone M4: SEO & Trust

> Goal: Site ranks in search, shares beautifully on social, and inspires customer confidence.

| ID | Title | Priority | Size | Files | Acceptance Criteria |
|----|-------|----------|------|-------|---------------------|
| GIFT-020 | Add JSON-LD structured data for products | 2 | M | `src/components/ProductSchema.tsx`, `src/routes/item.tsx` | WHAT: Add schema.org/Product JSON-LD / WHY: Rich snippets in search results / WHERE: Item detail page head / DONE: Valid JSON-LD in page source, passes Google's Rich Results Test |
| GIFT-029 | Add sitemap.xml and robots.txt | 3 | S | `public/sitemap.xml`, `public/robots.txt` | WHAT: Static sitemap and robots.txt / WHY: SEO crawlability / WHERE: Public root / DONE: /sitemap.xml and /robots.txt accessible, valid format |
| GIFT-017 | Add favicon and PWA manifest | 3 | S | `public/favicon.ico`, `public/manifest.json`, `index.html` | WHAT: Favicon and web app manifest / WHY: Browser tab icon and installability / WHERE: Public assets / DONE: Favicon shows in tab, manifest validates, can add to home screen |
| GIFT-026 | Add testimonials section to home | 3 | M | `src/ui/sections/Testimonials.tsx`, `src/routes/index.tsx`, `src/client.config.ts` | WHAT: Customer testimonials carousel/grid / WHY: Social proof builds trust / WHERE: Home page / DONE: 3+ testimonials display, content is config-driven |
| GIFT-038 | Add trust badges footer section | 4 | S | `src/layout/AppShell.tsx`, `src/client.config.ts` | WHAT: Payment security, shipping, guarantee badges / WHY: Increase purchase confidence / WHERE: Footer / DONE: Badges display, config controls visibility |
| GIFT-039 | Add basic accessibility audit fixes | 4 | M | Multiple files | WHAT: Focus states, alt text, color contrast / WHY: WCAG 2.1 AA compliance / WHERE: All interactive elements / DONE: No critical axe-core violations |

### Milestone M5: Production Readiness

> Goal: App fails gracefully, logs meaningful data, and is ready for real deployment.

| ID | Title | Priority | Size | Files | Acceptance Criteria |
|----|-------|----------|------|-------|---------------------|
| GIFT-024 | Add env validation on startup | 4 | S | `src/lib/env.ts`, `src/main.tsx` | WHAT: Validate required env vars at app start / WHY: Fail fast with clear errors / WHERE: App entry / DONE: Missing vars throw with actionable error message |
| GIFT-030 | Add analytics event placeholders | 4 | S | `src/lib/analytics.ts`, `src/routes/item.tsx`, `src/ui/InquiryModal.tsx` | WHAT: trackEvent stub for key actions / WHY: Ready for GA/Plausible integration / WHERE: Key conversion points / DONE: Events logged to console in dev, no-op in prod |
| GIFT-040 | Add error reporting placeholder | 4 | S | `src/lib/errorReporting.ts`, `src/components/ErrorBoundary.tsx` | WHAT: Stub for Sentry/LogRocket integration / WHY: Know when production errors occur / WHERE: Error boundary / DONE: captureException stub called on errors |
| GIFT-041 | Add console logging config | 5 | S | `src/lib/logger.ts`, Multiple files | WHAT: Logger that respects env (debug/prod) / WHY: Clean prod console, verbose dev / WHERE: Throughout app / DONE: Log levels work, prod shows errors only |
| GIFT-042 | Verify production build optimization | 5 | S | `vite.config.ts`, package.json | WHAT: Check bundle size, tree shaking / WHY: Fast initial load / WHERE: Build config / DONE: Bundle <500KB gzipped, no duplicate deps |
| GIFT-014 | Verify CI automerge flow | 5 | S | `.github/workflows/automerge.yml` | WHAT: Test automerge with real PR / WHY: Confirm autopilot works / WHERE: CI / DONE: PR with automerge label merges after CI passes |
| GIFT-023 | Add GitHub PR template | 4 | S | `.github/PULL_REQUEST_TEMPLATE.md` | WHAT: PR template with checklist / WHY: Consistent PR descriptions / WHERE: GitHub config / DONE: New PRs show template with summary, test plan sections |

### Milestone M6: Package Integration & Future Features

> Goal: Seamlessly swap to @signal/catalog-core and enable checkout when ready. **Note: Heavy catalogCore.tsx edits blocked until Neal completes package integration.**

| ID | Title | Priority | Size | Files | Acceptance Criteria |
|----|-------|----------|------|-------|---------------------|
| GIFT-008 | Prepare catalogCore for package swap | 3 | S | `src/catalogCore.tsx` | WHAT: Add clear swap instructions and types / WHY: Smooth integration when package ready / WHERE: Package seam / DONE: Comments explain exact lines to change, types match package API |
| GIFT-043 | Add package swap feature flag | 3 | S | `src/client.config.ts`, `src/catalogCore.tsx` | WHAT: Feature flag to toggle stub vs real package / WHY: Safe rollout / WHERE: Config / DONE: Flag toggles behavior, both paths work |
| GIFT-044 | Implement inquiry persistence (localStorage) | 3 | M | `src/api/inquiries.ts`, `src/ui/InquiryModal.tsx` | WHAT: Persist inquiries to localStorage / WHY: Data survives page refresh / WHERE: Inquiry flow / DONE: Submitted inquiries persist, visible in admin |
| GIFT-045 | Add checkout flow skeleton | 4 | L | `src/routes/checkout.tsx`, `src/client.config.ts` | WHAT: Checkout page structure when enableCheckout=true / WHY: Ready for payment integration / WHERE: New route / DONE: Cart summary, customer form, payment placeholder |
| GIFT-046 | Add quote request mode | 4 | M | `src/ui/InquiryModal.tsx`, `src/routes/item.tsx` | WHAT: Different modal for priceMode='quote' / WHY: Variable pricing products / WHERE: Item page / DONE: "Request Quote" button, form includes quantity field |
| GIFT-047 | Add inventory badge | 5 | S | `src/ui/ProductCard.tsx`, `src/routes/item.tsx` | WHAT: "In Stock" or "Low Stock" badge / WHY: Purchase urgency / WHERE: Cards and detail / DONE: Badge shows based on inventory count |

---

## Minimum Lovable Demo

> The smallest set of tasks to look amazing in a pitch demo.

For a compelling demo, the following must work flawlessly:

### Already Done ✅
- GIFT-001: Hero section with CTA
- GIFT-003: Polished catalog cards with hover effects
- GIFT-004: Category navigation
- GIFT-005: Product gallery with zoom and thumbnails
- GIFT-002: Inquiry modal with lead capture
- GIFT-006: Admin dashboard with auth gate
- GIFT-009: SEO meta tags and OG
- GIFT-010: Contact page with map
- GIFT-011: Footer with contact info
- GIFT-012: Loading skeletons
- GIFT-013: Error boundary

### Must Complete for Demo 🎯

| Priority | ID | Title | Why It's Critical |
|----------|-------|-------|-------------------|
| 1 | GIFT-022 | Mobile hamburger navigation | Demo on phone is embarrassing without it |
| 2 | GIFT-016 | 404 Not Found page | Typing wrong URL looks broken |
| 3 | GIFT-027 | Product search input | "Can I search?" is first demo question |
| 4 | GIFT-019 | Admin inquiries list view | Show leads flowing through = money story |
| 5 | GIFT-021 | Empty state for catalog | No results must look intentional, not broken |
| 6 | GIFT-017 | Favicon and PWA manifest | Professional polish in browser tab |
| 7 | GIFT-026 | Testimonials section | Social proof = conversion story |

### Demo Task Sequence (Recommended Order)

```
GIFT-022 → GIFT-016 → GIFT-027 → GIFT-019 → GIFT-021 → GIFT-017 → GIFT-026
```

After these 7 tasks, the demo will:
1. Work on mobile devices
2. Handle all navigation gracefully
3. Show search functionality
4. Demonstrate the full lead funnel (browse → inquire → admin sees it)
5. Look polished with favicon and testimonials

---

## Summary

| Milestone | Tasks | Shippable After? | Focus |
|-----------|-------|------------------|-------|
| M1 | 5 | ✅ Yes | Core polish, error states |
| M2 | 5 | ✅ Yes | Navigation, search, mobile |
| M3 | 6 | ✅ Yes | Admin CRUD complete |
| M4 | 6 | ✅ Yes | SEO, trust, accessibility |
| M5 | 7 | ✅ Yes | Production hardening |
| M6 | 6 | ⏳ After package | Package swap, checkout |

**Total New Tasks**: 17 (GIFT-031 to GIFT-047)
**Total Backlog**: 35 tasks (including existing TODO/READY)

---

## Appendix: File Reference

| Component | Path | Status |
|-----------|------|--------|
| Home page | `src/routes/index.tsx` | Done |
| Catalog | `src/routes/catalog.tsx` | Done |
| Item detail | `src/routes/item.tsx` | Done |
| Admin dashboard | `src/routes/admin.tsx` | Done |
| Contact page | `src/routes/contact.tsx` | Done |
| App shell/layout | `src/layout/AppShell.tsx` | Done |
| Client config | `src/client.config.ts` | Done |
| Package seam | `src/catalogCore.tsx` | Stub (Neal working) |
| Error boundary | `src/components/ErrorBoundary.tsx` | Done |
| SEO component | `src/components/SEO.tsx` | Done |
| Category nav | `src/components/CategoryNav.tsx` | Done |
| Skeletons | `src/components/Skeleton.tsx` | Done |
| Product card | `src/ui/ProductCard.tsx` | Done |
| Product gallery | `src/ui/ProductGallery.tsx` | Done |
| Inquiry modal | `src/ui/InquiryModal.tsx` | Done |
| Related products | `src/ui/RelatedProducts.tsx` | Done |
| Filter bar | `src/ui/FilterBar.tsx` | Done |
| Admin products table | `src/ui/AdminProductsTable.tsx` | Done |
| Admin stat cards | `src/ui/AdminStatCard.tsx` | Done |
| Admin quick actions | `src/ui/AdminQuickActions.tsx` | Done |

---

*This plan is read-only guidance. No code changes made.*

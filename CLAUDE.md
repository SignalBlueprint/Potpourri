# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm run dev          # Start Vite dev server
npm run build        # TypeScript check + Vite build
npm run typecheck    # TypeScript only (no emit)
npm run lint         # ESLint
npm run format       # Prettier check
npm run format:fix   # Prettier fix
npm run test         # Vitest (single run)
npm run test:watch   # Vitest (watch mode)
```

## Architecture Overview

**Potpourri** is a React gift shop storefront built with Vite, TanStack Router, TanStack Query, and Tailwind CSS.

### Configuration-Driven Design

The app is designed for multi-tenant deployment. All client-specific values live in `src/client.config.ts`:
- Brand config (name, tagline, colors)
- Tenant config (API base URL)
- Feature flags (`enableCheckout`, `enableAdmin`, `priceMode`)
- Contact info, store hours, catalog categories

Theme colors are applied as CSS custom properties at startup via `applyTheme()` in `main.tsx`. Tailwind references these variables (e.g., `bg-brand-primary`, `text-neutral-600`).

### Routing Structure

Routes are created in `src/app.tsx` using TanStack Router. The `makeRouteTree()` function in `src/catalogCore.tsx` generates the core routes:
- `/` - Landing page (hero, categories, featured products)
- `/catalog` - Product listing with filtering/sorting
- `/item/$id` - Product detail page with inquiry modal
- `/admin` - Admin dashboard (gated by `enableAdmin` flag)
- `/contact` - Contact page (added separately in `app.tsx`)

The `catalogCore.tsx` file is designed as a temporary fallback until an external `@signal/catalog-core` package is installed. When that package is ready, uncomment the import and remove the fallback implementation.

### Key Directories

- `src/ui/` - Reusable UI components (Button, Card, Badge, Input, etc.) and page-specific components (ProductCard, FilterBar, InquiryModal)
- `src/ui/sections/` - Landing page sections (HeroSection, CategoryGrid, TrustBadges, VisitUs)
- `src/layout/` - AppShell with Header and Footer
- `src/components/` - Shared components (SEO, CategoryNav)
- `src/data/` - Mock product data and filter/sort utilities
- `src/api/` - API calls (inquiries with localStorage fallback for demo mode)
- `src/hooks/` - Custom hooks (`useAuth` for admin password gate)

### Admin Authentication

Admin access uses a simple session-based password check (`useAuth` hook). The password is hardcoded as `admin123` in `src/hooks/useAuth.ts`. This is meant to be replaced with proper authentication in production.

### Testing

Tests use Vitest with jsdom environment. Test files are colocated with routes (e.g., `src/routes/catalog.test.tsx`). Setup file: `src/test/setup.ts`.

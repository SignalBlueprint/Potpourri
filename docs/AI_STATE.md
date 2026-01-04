# AI State

> Current state of the Potpourri suite for agent context.

## Suite Goal

Build a white-label gift shop storefront that consumes `@signal/catalog-core` for catalog functionality, configured entirely via `src/client.config.ts`.

## Repo Map

```
Potpourri (Thin Client)
├── src/client.config.ts   ← Branding, tenant, features (EDIT THIS)
├── src/catalogCore.tsx    ← Package seam (ONLY file importing @signal/catalog-core)
├── src/routes/*           ← Page components
└── .github/workflows/*    ← CI, auto-merge, auto-PR

@signal/catalog-core (External Package - Pending)
├── makeRouteTree()        ← Returns TanStack route tree
└── CatalogApp()           ← Optional full app component
```

### Thin Client Architecture

- **Config-driven**: All branding/behavior via `client.config.ts`
- **One seam file**: Only `src/catalogCore.tsx` imports the package
- **Stub mode**: Currently uses inline stubs until package is published

## Global Release Gates

All PRs must pass:

```bash
npm run lint       # ESLint
npm run typecheck  # TypeScript
npm run test       # Vitest
npm run build      # Production build
```

Auto-merge enabled via `automerge` label.

## Active Blockers

*No active blockers - SDK integration complete!*

~~B1~~ ✅ **RESOLVED**: `@signal-core/catalog-react-sdk` integration complete. SDK package built and integrated into admin route.

## Last 10 Merged PRs

| PR | Title | Date | Task ID |
|----|-------|------|---------|
| #19 | feat: Make brand styling driven by client.config.ts | 2026-01-02 | - |
| #18 | feat: Upgrade admin into professional SaaS dashboard | 2026-01-02 | - |
| #17 | feat: Build polished product detail page with gallery, inquiry modal, and related products | 2026-01-02 | - |
| #16 | feat: Build proper shopping catalog experience with filtering and sorting | 2026-01-01 | - |
| #15 | fix: Add contents:write permission for auto-merge | 2026-01-01 | - |
| #14 | - | - | - |
| #13 | - | - | - |
| #12 | - | - | - |
| #11 | - | - | - |
| #10 | - | - | - |

---

*Last updated: 2026-01-03*

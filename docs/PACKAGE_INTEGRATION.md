# @signal/catalog-core Integration Guide

**For:** Neal
**Purpose:** Integrate catalog-core with minimal friction

---

## Package Name

```
@signal/catalog-core
```

Already declared in `package.json` as a pending dependency:

```json
"@signal/catalog-core": "workspace:* OR ^1.0.0"
```

---

## Expected Exports

The package must export **at least one** of these patterns:

### Pattern A: Route Tree Builder (preferred)

```typescript
export function makeRouteTree(options: {
  clientConfig: ClientConfig
  rootRoute: AnyRoute
}): AnyRoute[]
```

- Returns an array of routes to add as children to the root
- Client wires it up in `app.tsx` via `rootRoute.addChildren(routes)`

### Pattern B: Complete App Component

```typescript
export function CatalogApp(props: { clientConfig: ClientConfig }): React.ReactNode
```

- Returns a complete `<RouterProvider />` with all routes
- Client renders it directly in `main.tsx`

---

## Expected Peer Dependencies

| Package                  | Version   | Required      |
| ------------------------ | --------- | ------------- |
| `react`                  | `^18.0.0` | Yes           |
| `react-dom`              | `^18.0.0` | Yes           |
| `@tanstack/react-router` | `^1.0.0`  | Yes           |
| `@tanstack/react-query`  | `^5.0.0`  | Yes           |
| `tailwindcss`            | `^3.0.0`  | No (optional) |

---

## ClientConfig Shape

The package should accept this config (defined in `src/client.config.ts`):

```typescript
interface ClientConfig {
  brand: {
    name: string
    logoUrl: string
    colors: { primary: string; secondary: string; accent: string }
  }
  tenant: {
    id: string
    apiBaseUrl: string
  }
  features: {
    enableCheckout: boolean
    enableAdmin: boolean
    priceMode: 'fixed' | 'variable' | 'quote'
  }
  contact: {
    /* ... */
  }
  catalog: {
    /* ... */
  }
}
```

---

## Versioning Notes

- **Initial release:** `1.0.0`
- **Breaking changes:** Bump major version if `makeRouteTree` signature changes
- **Workspace mode:** Use `workspace:*` during monorepo development
- **Published mode:** Pin to `^1.0.0` or exact version for stability

---

## Integration Steps (2 files only)

### 1. `package.json`

Move from pending to dependencies:

```json
"dependencies": {
  "@signal/catalog-core": "^1.0.0"
}
```

### 2. `src/catalogCore.tsx`

Replace the stub with real import:

```typescript
// DELETE the entire "TEMP FALLBACK STUB" section
// ADD this single line:
export { makeRouteTree, CatalogApp } from '@signal/catalog-core'
```

That's it. No other files need changes.

---

## Verification

After integration, run:

```bash
npm install
npm run typecheck
npm run test
npm run build
```

All gates should pass.

# Package Integration

> Specification for integrating `@signal/catalog-core` into Potpourri.

## Package Name

```
@signal/catalog-core
```

**Status**: Pending publication (placeholder acceptable)

## Required Exports

The package MUST export:

### `makeRouteTree({ clientConfig })`

Returns a TanStack Router route tree configured for the client.

```typescript
import { makeRouteTree } from '@signal/catalog-core'
import { clientConfig } from './client.config'

const routeTree = makeRouteTree({ clientConfig })
```

### `CatalogApp({ clientConfig })` (Optional)

Full app component if client wants turnkey solution:

```typescript
import { CatalogApp } from '@signal/catalog-core'
import { clientConfig } from './client.config'

function App() {
  return <CatalogApp clientConfig={clientConfig} />
}
```

## Expected Types

```typescript
// From @signal/catalog-core
export interface CatalogCoreConfig {
  clientConfig: ClientConfig  // From src/client.config.ts
}

export function makeRouteTree(config: CatalogCoreConfig): RouteTree
export function CatalogApp(props: CatalogCoreConfig): JSX.Element
```

## Peer Dependencies

The package expects these as peer dependencies:

| Package | Version |
|---------|---------|
| `react` | `^18.0.0` |
| `react-dom` | `^18.0.0` |
| `@tanstack/react-router` | `^1.0.0` |
| `@tanstack/react-query` | `^5.0.0` |

## One-File Seam Rule

**CRITICAL**: Only `src/catalogCore.tsx` may import `@signal/catalog-core`.

### Current State (Stubs)

```typescript
// src/catalogCore.tsx
// STUBS - Replace with real package when available

export function makeRouteTree({ clientConfig }) {
  // Inline stub implementation
}
```

### Target State (Real Package)

```typescript
// src/catalogCore.tsx
export { makeRouteTree, CatalogApp } from '@signal/catalog-core'
```

## Integration Steps

When `@signal/catalog-core` is published:

1. **Install package**:
   ```bash
   npm install @signal/catalog-core
   ```

2. **Update package.json**: Move from `pendingDependencies` to `dependencies`

3. **Swap seam file** (`src/catalogCore.tsx`):
   ```typescript
   // DELETE everything below this line
   // --- STUB IMPLEMENTATION ---

   // ADD this single line
   export { makeRouteTree, CatalogApp } from '@signal/catalog-core'
   ```

4. **Verify**:
   ```bash
   npm run typecheck
   npm run test
   npm run build
   ```

## Testing Integration

Before marking integration complete:

- [ ] All routes render correctly
- [ ] Branding from `clientConfig` applied
- [ ] Feature flags respected
- [ ] No TypeScript errors
- [ ] All tests pass

---

*Version: 1.0.0*

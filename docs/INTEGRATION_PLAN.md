# Signal-Catalog Integration Plan

## Current Situation

**Expected Package**: `@signal/catalog-core` (not yet published)
- Expected exports: `makeRouteTree()`, `CatalogApp()`
- Expected API: Route-based integration

**Actual Package Available**: `@signal-core/catalog-react-sdk` (installed locally)
- Actual exports: `CatalogStorefrontApp`, `CatalogAdminApp`
- Actual API: Component-based integration

## Architecture Mismatch

Potpourri's architecture expects:
```
makeRouteTree({ clientConfig, rootRoute }) → Route[]
```

But the SDK provides:
```
CatalogStorefrontApp({ apiBase, customerId }) → React Component
CatalogAdminApp({ apiBase, customerId, authToken }) → React Component
```

## Integration Strategy

### Phase 1: Build & Prepare SDK Package ✅

1. ✅ Install `@signal-core/catalog-react-sdk` as local dependency
2. ⏳ Build the SDK package (`npm run build` in react-sdk folder)
3. ✅ Add wrapper component structure to `catalogCore.tsx`

### Phase 2: Hybrid Integration Approach

Since the SDK provides components (not route generators), we'll integrate them as **route components** within the existing `makeRouteTree` structure:

**Option A: Replace Route Components (Recommended for Admin)**
- Replace `AdminPage` component with `CatalogAdminWrapper` (uses SDK)
- Keep custom routes for storefront (index, catalog, item) to maintain branding

**Option B: Feature Flag Toggle**
- Add feature flag in `client.config.ts`: `useSDKComponents: boolean`
- Allow switching between stub implementations and SDK components
- Enables gradual migration and A/B testing

**Option C: Hybrid (Recommended)**
- Use SDK `CatalogAdminApp` for admin routes (full replacement)
- Keep custom storefront routes but allow future SDK integration
- Maintains branding control while leveraging SDK admin features

### Phase 3: Update Blocked Tasks

The blocked tasks (POT-001 to POT-005) assume a different package structure. We need to:

1. **Update POT-001**: Change from "Publish @signal/catalog-core" to "Build @signal-core/catalog-react-sdk"
2. **Update POT-002**: Change from "Swap stubs for real package" to "Integrate SDK components into routes"
3. **Update POT-003**: Keep feature flag idea but adapt to component-based integration
4. **Update POT-004**: Verify SDK peer dependencies match Potpourri's
5. **Update POT-005**: Update types to match SDK component props (not route tree types)

## Recommended Implementation Steps

### Step 1: Build SDK Package

```bash
cd ../signal-catalog/packages/react-sdk
npm install  # Ensure tsup and dependencies are installed
npm run build  # Build dist/ folder with types
```

### Step 2: Enable SDK Imports

Uncomment imports in `catalogCore.tsx`:
```typescript
import { CatalogStorefrontApp, CatalogAdminApp } from '@signal-core/catalog-react-sdk'
import { useAuth } from './hooks/useAuth'
```

### Step 3: Create SDK Wrapper Components

Uncomment and adapt wrapper components:
- `CatalogStorefrontWrapper` - Maps clientConfig → SDK props for storefront
- `CatalogAdminWrapper` - Handles auth, maps clientConfig → SDK props for admin

### Step 4: Integrate into Routes

**For Admin Route** (recommended first):
```typescript
// In makeRouteTree, replace AdminPage with CatalogAdminWrapper
const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  beforeLoad: () => {
    if (!config.features.enableAdmin) {
      throw new Error('Admin access disabled')
    }
  },
  component: CatalogAdminWrapper,  // Use SDK component
})
```

**For Storefront Routes** (optional, keep custom for branding):
- Keep existing `CatalogPage` and `ItemPage` implementations
- OR create feature flag to toggle between custom and SDK versions

### Step 5: Configuration Mapping

Ensure proper mapping:
```typescript
// clientConfig.tenant.apiBaseUrl → apiBase
// clientConfig.tenant.id → customerId  
// useAuth hook → authToken (need JWT integration)
```

### Step 6: Testing & Verification

- [ ] TypeScript compiles without errors
- [ ] Admin route renders SDK component
- [ ] API connections work (if backend available)
- [ ] Authentication flow works
- [ ] All existing routes still work
- [ ] Build succeeds

## Key Considerations

### 1. Authentication Token

SDK's `CatalogAdminApp` requires `authToken`. Currently Potpourri uses simple password auth. Options:
- **Short-term**: Placeholder token (for testing)
- **Long-term**: Integrate JWT token from backend authentication
- **Alternative**: Extend SDK to support session-based auth

### 2. UI/Layout Compatibility

SDK components are full-page apps with their own UI. Potpourri has `AppShell` layout. Options:
- Use SDK components as-is (they have own headers/nav)
- Wrap in AppShell (may cause layout conflicts)
- Extract SDK logic but use Potpourri UI (requires SDK refactoring)

### 3. Branding

Potpourri is white-label, config-driven via `client.config.ts`. SDK components may have:
- Hard-coded styling
- Limited customization
- Need for CSS overrides

### 4. Data Flow

SDK components fetch from API directly. Potpourri currently uses:
- Mock data (local)
- localStorage for inquiries
- API endpoints via `clientConfig.tenant.apiBaseUrl`

Need to ensure SDK uses correct API base URL.

## Next Steps (Prioritized)

1. **POT-001-ADAPTED**: Build SDK package and verify it compiles
2. **POT-002-ADAPTED**: Integrate CatalogAdminApp into admin route  
3. **POT-003-ADAPTED**: Add feature flag to toggle SDK vs stubs
4. **POT-004-ADAPTED**: Verify peer dependencies compatibility
5. **POT-005-ADAPTED**: Update TypeScript types for SDK components

## Migration Path

1. Start with Admin (lower risk, less visible to customers)
2. Test thoroughly with real backend if available
3. Add feature flag for gradual rollout
4. Monitor for issues
5. Consider storefront SDK integration later (if needed)

---

**Status**: Planning phase complete, ready for implementation
**Last Updated**: 2026-01-03


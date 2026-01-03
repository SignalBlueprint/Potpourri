# SDK Integration Guide

This document describes how the `@signal-core/catalog-react-sdk` package is integrated into Potpourri.

## Package Location

The SDK is installed as a local package reference:
```json
"@signal-core/catalog-react-sdk": "file:../signal-catalog/packages/react-sdk"
```

## Building the Package

Before the SDK can be used, it must be built:

```bash
cd ../signal-catalog/packages/react-sdk
npm install  # Install dependencies including tsup
npm run build  # Build the package
```

This creates the `dist/` folder with compiled JavaScript and TypeScript declaration files.

## Integration Point

The SDK is integrated through `src/catalogCore.tsx`, which is the single integration seam for catalog functionality.

## SDK Components

The SDK provides two main components:

### CatalogStorefrontApp
- **Props**: `{ apiBase?: string, customerId: string }`
- **Usage**: Full storefront component with product browsing, cart, and checkout

### CatalogAdminApp  
- **Props**: `{ apiBase?: string, customerId: string, authToken: string }`
- **Usage**: Full admin component for managing products, lookbooks, and analytics

## Configuration Mapping

The SDK components need:
- `apiBase`: Maps from `clientConfig.tenant.apiBaseUrl` (defaults to `/api`)
- `customerId`: Maps from `clientConfig.tenant.id`
- `authToken`: Required for admin, should come from authentication system

## Next Steps

1. Build the react-sdk package (see above)
2. Uncomment the imports in `catalogCore.tsx`
3. Uncomment the wrapper components in `catalogCore.tsx`
4. Update `makeRouteTree` to use the wrapper components for catalog/admin routes
5. Integrate proper JWT token authentication for admin access

## Notes

- The SDK components are full-page apps with their own UI/layout
- Potpourri uses AppShell layout - consider if SDK components should be wrapped or replace the layout
- Admin authentication needs proper JWT token integration (currently placeholder)


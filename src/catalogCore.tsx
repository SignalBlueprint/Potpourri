/**
 * Catalog Core Adapter
 *
 * This file is the SINGLE integration point for @signal/catalog-core.
 * When the real package is installed, update the import below.
 *
 * The package should export:
 * - makeRouteTree({ clientConfig, rootRoute }) => Route[]
 * - CatalogApp({ clientConfig }) => React component (optional)
 */

import type { AnyRoute } from '@tanstack/react-router'
import type { ClientConfig } from './client.config'

// =============================================================================
// TYPES - Expected interface from @signal/catalog-core
// =============================================================================

export interface CatalogCoreConfig {
  clientConfig: ClientConfig
  rootRoute: AnyRoute
}

export type MakeRouteTree = (config: CatalogCoreConfig) => AnyRoute[]

export interface CatalogAppProps {
  clientConfig: ClientConfig
}

// =============================================================================
// REAL PACKAGE IMPORT
// When @signal/catalog-core is installed, uncomment the line below and
// remove the TEMP FALLBACK section. That's the only change needed.
// =============================================================================

// export { makeRouteTree, CatalogApp } from '@signal/catalog-core'

// =============================================================================
// TEMP FALLBACK - Stub implementation until real package is installed
// Delete this entire section once @signal/catalog-core is available
// =============================================================================

import { createRoute, Link } from '@tanstack/react-router'

function IndexPage({ config }: { config: ClientConfig }) {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900">
        Welcome to {config.branding.name}
      </h1>
      <p className="mt-4 text-gray-600">{config.branding.tagline}</p>
    </div>
  )
}

function CatalogPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900">Catalog</h1>
      <p className="mt-4 text-gray-600">Browse our curated collection</p>
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border p-4">
          <p className="text-sm text-gray-500">Catalog items will appear here</p>
        </div>
      </div>
    </div>
  )
}

function ItemPage({ id }: { id: string }) {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900">Item Details</h1>
      <p className="mt-4 text-gray-600">Viewing item: {id}</p>
      <div className="mt-8 rounded-lg border p-6">
        <p className="text-sm text-gray-500">Item details will load here</p>
      </div>
    </div>
  )
}

function AdminPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
      <p className="mt-4 text-gray-600">Manage your gift shop</p>
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-lg border p-4">
          <h2 className="font-semibold">Products</h2>
          <p className="text-sm text-gray-500">Manage catalog items</p>
        </div>
        <div className="rounded-lg border p-4">
          <h2 className="font-semibold">Orders</h2>
          <p className="text-sm text-gray-500">View and manage orders</p>
        </div>
      </div>
    </div>
  )
}

export const makeRouteTree: MakeRouteTree = ({ clientConfig, rootRoute }) => {
  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: () => <IndexPage config={clientConfig} />,
  })

  const catalogRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/catalog',
    component: CatalogPage,
  })

  const itemRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/item/$id',
    component: function ItemPageWrapper() {
      const { id } = itemRoute.useParams()
      return <ItemPage id={id} />
    },
  })

  const adminRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/admin',
    component: AdminPage,
  })

  return [indexRoute, catalogRoute, itemRoute, adminRoute]
}

// Optional: Full app component if consumer wants a drop-in solution
export function CatalogApp({ clientConfig }: CatalogAppProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="text-xl font-bold text-indigo-600">
              {clientConfig.branding.name}
            </Link>
            <div className="flex gap-6">
              <Link
                to="/"
                className="text-gray-600 hover:text-gray-900 [&.active]:text-indigo-600"
              >
                Home
              </Link>
              <Link
                to="/catalog"
                className="text-gray-600 hover:text-gray-900 [&.active]:text-indigo-600"
              >
                Catalog
              </Link>
              {clientConfig.features.enableAdminPanel && (
                <Link
                  to="/admin"
                  className="text-gray-600 hover:text-gray-900 [&.active]:text-indigo-600"
                >
                  Admin
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="mx-auto max-w-7xl">
        {/* Outlet would go here if using CatalogApp directly */}
      </main>
    </div>
  )
}

// =============================================================================
// END TEMP FALLBACK
// =============================================================================

import { createRootRoute, createRouter, Link, Outlet } from '@tanstack/react-router'
import { clientConfig } from './client.config'
import { makeRouteTree } from './catalogCore'

export const rootRoute = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
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
        <Outlet />
      </main>
    </div>
  )
}

// Routes are provided by catalog-core (or fallback stub)
const routes = makeRouteTree({ clientConfig, rootRoute })
const routeTree = rootRoute.addChildren(routes)

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

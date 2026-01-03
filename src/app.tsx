import { createRootRoute, createRouter, Outlet } from '@tanstack/react-router'
import { clientConfig } from './client.config'
import { makeRouteTree } from './catalogCore'
import { AppShell } from './layout/AppShell'
import { contactRoute } from './routes/contact'
import { notFoundRoute } from './routes/notFound'
import { ErrorBoundary } from './components/ErrorBoundary'

export const rootRoute = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  return (
    <ErrorBoundary>
      <AppShell>
        <Outlet />
      </AppShell>
    </ErrorBoundary>
  )
}

// Routes are provided by catalog-core (or fallback stub)
const routes = makeRouteTree({ clientConfig, rootRoute })
// Add additional routes not managed by catalog-core
// Note: notFoundRoute must be last as it's a catch-all (*) route
const routeTree = rootRoute.addChildren([...routes, contactRoute, notFoundRoute])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

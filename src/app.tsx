import { createRootRoute, createRouter, Outlet } from '@tanstack/react-router'
import { clientConfig } from './client.config'
import { makeRouteTree } from './catalogCore'
import { AppShell } from './layout/AppShell'
import { contactRoute } from './routes/contact'
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
const routeTree = rootRoute.addChildren([...routes, contactRoute])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

import { createRootRoute, createRouter, Outlet } from '@tanstack/react-router'
import { clientConfig } from './client.config'
import { makeRouteTree } from './catalogCore'
import { AppShell } from './layout/AppShell'
import { contactRoute } from './routes/contact'

export const rootRoute = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
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

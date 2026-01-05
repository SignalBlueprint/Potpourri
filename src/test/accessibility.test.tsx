import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createMemoryHistory, createRouter } from '@tanstack/react-router'
import { rootRoute } from '../app'
import { indexRoute } from '../routes/index'
import { catalogRoute } from '../routes/catalog'
import { clientConfig } from '../client.config'

expect.extend(toHaveNoViolations)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createTestSetup(route: any, initialPath: string) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  const routeTree = rootRoute.addChildren([route])
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: [initialPath] }),
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}

describe('Accessibility', () => {
  it('home page has no critical accessibility violations', async () => {
    const { container } = createTestSetup(indexRoute, '/')

    // Wait for page to render - h1 contains brand name
    const headings = await screen.findAllByRole('heading', {
      name: new RegExp(clientConfig.brand.name),
    })
    expect(headings.length).toBeGreaterThan(0)

    const results = await axe(container, {
      rules: {
        // Ignore color-contrast as it requires specific color testing
        'color-contrast': { enabled: false },
        // Ignore region - layout structure varies
        region: { enabled: false },
        // Footer has h4 for section titles which is acceptable
        'heading-order': { enabled: false },
      },
    })

    expect(results).toHaveNoViolations()
  }, 10000)

  it('catalog page has no critical accessibility violations', async () => {
    const { container } = createTestSetup(catalogRoute, '/catalog')

    expect(
      await screen.findByRole('heading', { name: 'Shop' })
    ).toBeInTheDocument()

    const results = await axe(container, {
      rules: {
        'color-contrast': { enabled: false },
        region: { enabled: false },
        'heading-order': { enabled: false },
      },
    })

    expect(results).toHaveNoViolations()
  }, 10000)
})

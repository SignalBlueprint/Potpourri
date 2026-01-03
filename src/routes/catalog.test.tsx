import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createMemoryHistory, createRouter } from '@tanstack/react-router'
import { rootRoute } from '../app'
import { catalogRoute } from './catalog'

function renderWithProviders(initialPath: string) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  const routeTree = rootRoute.addChildren([catalogRoute])
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

describe('Catalog route', () => {
  it('renders the catalog page', async () => {
    renderWithProviders('/catalog')
    expect(await screen.findByRole('heading', { name: 'Shop' })).toBeInTheDocument()
  })

  it('displays browse message', async () => {
    renderWithProviders('/catalog')
    expect(await screen.findByText(/Browse our curated collection/)).toBeInTheDocument()
  })
})

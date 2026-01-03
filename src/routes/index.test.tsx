import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createMemoryHistory, createRouter } from '@tanstack/react-router'
import { rootRoute } from '../app'
import { indexRoute } from './index'

function renderWithProviders(initialPath: string) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  const routeTree = rootRoute.addChildren([indexRoute])
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

describe('Home route', () => {
  it('renders the home page', async () => {
    renderWithProviders('/')
    expect(await screen.findByText('Welcome to Potpourri')).toBeInTheDocument()
  })

  it('displays the tagline', async () => {
    renderWithProviders('/')
    const taglines = await screen.findAllByText('Curated gifts for every occasion')
    expect(taglines.length).toBeGreaterThan(0)
  })
})

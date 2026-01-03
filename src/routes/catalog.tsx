import { createRoute } from '@tanstack/react-router'
import { rootRoute } from '../app'

export const catalogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/catalog',
  component: CatalogPage,
})

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

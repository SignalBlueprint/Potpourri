import { createRoute } from '@tanstack/react-router'
import { rootRoute } from '../app'

export const itemRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/item/$id',
  component: ItemPage,
})

function ItemPage() {
  const { id } = itemRoute.useParams()

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

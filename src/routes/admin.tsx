import { createRoute } from '@tanstack/react-router'
import { rootRoute } from '../app'

export const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminPage,
})

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

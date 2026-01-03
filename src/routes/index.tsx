import { createRoute } from '@tanstack/react-router'
import { rootRoute } from '../app'

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: IndexPage,
})

function IndexPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900">Welcome to Potpourri</h1>
      <p className="mt-4 text-gray-600">Your curated gift shop experience</p>
    </div>
  )
}

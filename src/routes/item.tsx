import { createRoute, Link } from '@tanstack/react-router'
import { rootRoute } from '../app'
import { Card, Container, Button, Badge } from '../ui'

export const itemRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/item/$id',
  component: ItemPage,
})

function ItemPage() {
  const { id } = itemRoute.useParams()

  return (
    <Container>
      {/* Breadcrumb */}
      <nav className="py-4">
        <ol className="flex items-center gap-2 text-sm text-neutral-600">
          <li>
            <Link to="/" className="transition-colors hover:text-brand-primary">
              Home
            </Link>
          </li>
          <li>&rsaquo;</li>
          <li>
            <Link to="/catalog" className="transition-colors hover:text-brand-primary">
              Shop
            </Link>
          </li>
          <li>&rsaquo;</li>
          <li className="text-neutral-900">Item {id}</li>
        </ol>
      </nav>

      {/* Product Detail */}
      <section className="pb-16">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Image */}
          <div className="aspect-square rounded-xl bg-neutral-100" />

          {/* Info */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Badge>Home Decor</Badge>
              <h1 className="text-3xl font-semibold text-neutral-900">Product Name</h1>
              <p className="text-2xl font-semibold text-neutral-800">$45.00</p>
            </div>

            <p className="text-neutral-600">
              This is a placeholder for the product description. It will display details about the
              item, materials, dimensions, and care instructions.
            </p>

            <Card className="space-y-4 bg-neutral-50">
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-600">Availability</span>
                <span className="font-medium text-green-700">In Stock</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-600">Item ID</span>
                <span className="font-medium text-neutral-900">{id}</span>
              </div>
            </Card>

            <div className="flex gap-4">
              <Button size="lg" className="flex-1">
                Add to Cart
              </Button>
              <Button size="lg" variant="secondary">
                Save
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Container>
  )
}

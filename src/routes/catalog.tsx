import { createRoute } from '@tanstack/react-router'
import { rootRoute } from '../app'
import { Card, Container, PageHeader, Badge } from '../ui'

export const catalogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/catalog',
  component: CatalogPage,
})

// Placeholder product data
const placeholderProducts = [
  { id: '1', name: 'Artisan Candle Set', category: 'Home Decor', price: 34.99 },
  { id: '2', name: 'Ceramic Planter', category: 'Garden & Outdoor', price: 28.0 },
  { id: '3', name: 'Linen Tea Towels', category: 'Kitchen & Dining', price: 22.5 },
  { id: '4', name: 'Seasonal Wreath', category: 'Seasonal', price: 45.0 },
  { id: '5', name: 'Curated Gift Box', category: 'Gift Sets', price: 65.0 },
  { id: '6', name: 'Handwoven Basket', category: 'Home Decor', price: 38.0 },
]

function CatalogPage() {
  return (
    <Container>
      <PageHeader title="Shop" subtitle="Browse our curated collection of unique gifts and home goods" />

      {/* Product Grid */}
      <section className="space-y-6 pb-16">
        <div className="flex items-center justify-between">
          <p className="text-sm text-neutral-600">{placeholderProducts.length} items</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {placeholderProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </Container>
  )
}

interface Product {
  id: string
  name: string
  category: string
  price: number
}

function ProductCard({ product }: { product: Product }) {
  return (
    <Card hover className="group cursor-pointer space-y-4">
      {/* Image Placeholder */}
      <div className="aspect-square rounded-lg bg-neutral-100 transition-colors group-hover:bg-neutral-200" />

      {/* Product Info */}
      <div className="space-y-2">
        <Badge>{product.category}</Badge>
        <h3 className="font-medium text-neutral-900 transition-colors group-hover:text-brand-primary">
          {product.name}
        </h3>
        <p className="text-lg font-semibold text-neutral-800">
          ${product.price.toFixed(2)}
        </p>
      </div>
    </Card>
  )
}

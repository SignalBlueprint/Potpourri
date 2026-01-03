import { Link } from '@tanstack/react-router'
import { Card, Badge, Button, SectionTitle } from '../index'
import { SkeletonCard, SkeletonImage, Skeleton } from '../../components/Skeleton'

// Mock new arrival items
const mockNewArrivals = [
  {
    id: '1',
    name: 'Artisan Ceramic Vase',
    price: 48,
    category: 'Home Decor',
    image: null,
    isNew: true,
  },
  {
    id: '2',
    name: 'Hand-Poured Candle Set',
    price: 36,
    category: 'Gift Sets',
    image: null,
    isNew: true,
  },
  {
    id: '3',
    name: 'Linen Table Runner',
    price: 42,
    category: 'Kitchen & Dining',
    image: null,
    isNew: false,
  },
  {
    id: '4',
    name: 'Botanical Print Collection',
    price: 65,
    category: 'Home Decor',
    image: null,
    isNew: true,
  },
  {
    id: '5',
    name: 'Copper Herb Planter',
    price: 38,
    category: 'Garden & Outdoor',
    image: null,
    isNew: false,
  },
  {
    id: '6',
    name: 'Cozy Throw Blanket',
    price: 72,
    category: 'Home Decor',
    image: null,
    isNew: true,
  },
]

interface ProductTeaserGridProps {
  title?: string
  subtitle?: string
  itemCount?: number
}

export function ProductTeaserGrid({
  title = 'New Arrivals',
  subtitle = 'Fresh finds, just in',
  itemCount = 6,
}: ProductTeaserGridProps) {
  const items = mockNewArrivals.slice(0, itemCount)

  return (
    <section className="py-12 sm:py-16">
      <SectionTitle subtitle={subtitle} className="text-center mb-8">
        {title}
      </SectionTitle>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Card key={item.id} hover className="group overflow-hidden p-0">
            {/* Image placeholder */}
            <div className="relative aspect-square bg-gradient-to-br from-neutral-100 to-neutral-200">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-6xl opacity-30">✨</span>
              </div>
              {item.isNew && (
                <div className="absolute left-3 top-3">
                  <Badge variant="accent">New</Badge>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                {item.category}
              </p>
              <h3 className="mt-1 font-medium text-neutral-800 group-hover:text-brand-primary transition-colors">
                {item.name}
              </h3>
              <p className="mt-2 text-lg font-semibold text-neutral-900">
                ${item.price}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* View All CTA */}
      <div className="mt-10 text-center">
        <Link to="/catalog">
          <Button variant="secondary" size="lg">
            View All Products
          </Button>
        </Link>
      </div>
    </section>
  )
}

// =============================================================================
// ProductTeaserGridSkeleton - Loading placeholder for new arrivals
// =============================================================================

interface ProductTeaserGridSkeletonProps {
  itemCount?: number
}

export function ProductTeaserGridSkeleton({ itemCount = 6 }: ProductTeaserGridSkeletonProps) {
  return (
    <section className="py-12 sm:py-16" aria-label="Loading products">
      {/* Title skeleton */}
      <div className="mb-8 text-center">
        <Skeleton className="mx-auto mb-2 h-8 w-40" />
        <Skeleton className="mx-auto h-4 w-32" />
      </div>

      {/* Grid skeleton */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: itemCount }).map((_, i) => (
          <SkeletonCard key={i}>
            <SkeletonImage aspectRatio="square" />
            <div className="p-4">
              <Skeleton className="mb-1 h-3 w-20" />
              <Skeleton className="mb-2 h-5 w-3/4" />
              <Skeleton className="h-6 w-16" />
            </div>
          </SkeletonCard>
        ))}
      </div>

      {/* CTA skeleton */}
      <div className="mt-10 text-center">
        <Skeleton className="mx-auto h-12 w-40 rounded-lg" />
      </div>
    </section>
  )
}

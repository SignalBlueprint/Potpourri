import { mockProducts } from '../data/mockProducts'
import { useRecentlyViewed } from '../hooks/useRecentlyViewed'
import { ProductCard } from './ProductCard'
import { SectionTitle } from './index'

// =============================================================================
// RecentlyViewed - "Recently Viewed" section showing last viewed products
// =============================================================================

interface RecentlyViewedProps {
  /** Exclude this product ID from the list (usually current product) */
  excludeProductId?: string
  /** Maximum number of items to display (default: 4) */
  maxItems?: number
}

export function RecentlyViewed({ excludeProductId, maxItems = 4 }: RecentlyViewedProps) {
  const { recentlyViewedIds } = useRecentlyViewed()

  // Get product objects for recently viewed IDs (excluding current product)
  const recentProducts = recentlyViewedIds
    .filter((id) => id !== excludeProductId)
    .slice(0, maxItems)
    .map((id) => mockProducts.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => p !== undefined)

  // Don't render if no recently viewed products
  if (recentProducts.length === 0) {
    return null
  }

  return (
    <section className="border-t border-neutral-200 pt-12">
      <SectionTitle className="mb-8">Recently Viewed</SectionTitle>

      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {recentProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}

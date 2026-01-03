import type { Product } from '../data/mockProducts'
import { mockProducts } from '../data/mockProducts'
import { ProductCard } from './ProductCard'
import { SectionTitle } from './index'

// =============================================================================
// RelatedProducts - "You may also like" section with related items
// =============================================================================

interface RelatedProductsProps {
  currentProductId: string
  category: string
  maxItems?: number
}

export function RelatedProducts({ currentProductId, category, maxItems = 4 }: RelatedProductsProps) {
  // Get related products: same category first, then featured items
  const relatedProducts = getRelatedProducts(currentProductId, category, maxItems)

  if (relatedProducts.length === 0) {
    return null
  }

  return (
    <section className="border-t border-neutral-200 pt-12">
      <SectionTitle className="mb-8">You May Also Like</SectionTitle>

      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {relatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}

// =============================================================================
// Helper function to get related products
// =============================================================================

function getRelatedProducts(currentProductId: string, category: string, maxItems: number): Product[] {
  // First, get products from the same category (excluding current product)
  const sameCategoryProducts = mockProducts.filter(
    (product) => product.category === category && product.id !== currentProductId
  )

  // If we have enough from the same category, return those
  if (sameCategoryProducts.length >= maxItems) {
    return sameCategoryProducts.slice(0, maxItems)
  }

  // Otherwise, supplement with featured products from other categories
  const featuredProducts = mockProducts.filter(
    (product) =>
      product.isFeatured &&
      product.id !== currentProductId &&
      product.category !== category
  )

  // Combine and return up to maxItems
  const combined = [...sameCategoryProducts, ...featuredProducts]
  return combined.slice(0, maxItems)
}

// =============================================================================
// RelatedProductsSkeleton - Loading placeholder
// =============================================================================

export function RelatedProductsSkeleton() {
  return (
    <section className="border-t border-neutral-200 pt-12">
      <div className="mb-8 h-8 w-48 animate-pulse rounded bg-neutral-200" />

      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse overflow-hidden rounded-xl bg-white shadow-card">
            <div className="aspect-square bg-neutral-200" />
            <div className="p-4">
              <div className="mb-2 h-4 w-24 rounded bg-neutral-200" />
              <div className="mb-2 h-5 w-3/4 rounded bg-neutral-200" />
              <div className="mb-1 h-4 w-full rounded bg-neutral-200" />
              <div className="mb-3 h-4 w-2/3 rounded bg-neutral-200" />
              <div className="h-6 w-20 rounded bg-neutral-200" />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

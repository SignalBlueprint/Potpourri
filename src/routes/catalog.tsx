import { createRoute } from '@tanstack/react-router'
import { useState, useMemo, useEffect } from 'react'
import { rootRoute } from '../app'
import { Container, PageHeader } from '../ui'
import { FilterBar, FilterBarSkeleton } from '../ui/FilterBar'
import { ProductCard, ProductCardSkeleton } from '../ui/ProductCard'
import {
  mockProducts,
  filterProducts,
  sortProducts,
  type SortOption,
  type Product,
} from '../data/mockProducts'

export const catalogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/catalog',
  component: CatalogPage,
})

function CatalogPage() {
  // Simulate loading state
  const [isLoading, setIsLoading] = useState(true)

  // Filter state
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [sort, setSort] = useState<SortOption>('newest')

  // Simulate initial data fetch
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  // Debounced search for smoother UX
  const [debouncedSearch, setDebouncedSearch] = useState(search)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
    }, 150)
    return () => clearTimeout(timer)
  }, [search])

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    const filtered = filterProducts(mockProducts, {
      search: debouncedSearch,
      category: selectedCategory,
    })
    return sortProducts(filtered, sort)
  }, [debouncedSearch, selectedCategory, sort])

  // Handle quick action (placeholder)
  const handleQuickAction = (product: Product) => {
    // This would integrate with cart or modal in the future
    console.log('Quick action on:', product.name)
  }

  return (
    <Container>
      <PageHeader
        title="Shop"
        subtitle="Browse our curated collection of unique gifts and home goods"
      />

      {/* Filter Bar */}
      {isLoading ? (
        <FilterBarSkeleton />
      ) : (
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          sort={sort}
          onSortChange={setSort}
          resultCount={filteredProducts.length}
        />
      )}

      {/* Product Grid */}
      <section className="pb-16 pt-4">
        {isLoading ? (
          // Loading skeletons
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          // Empty state
          <EmptyState
            search={search}
            category={selectedCategory}
            onClearFilters={() => {
              setSearch('')
              setSelectedCategory(null)
            }}
          />
        ) : (
          // Product grid
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickAction={handleQuickAction}
              />
            ))}
          </div>
        )}
      </section>
    </Container>
  )
}

// =============================================================================
// Empty State Component
// =============================================================================

interface EmptyStateProps {
  search: string
  category: string | null
  onClearFilters: () => void
}

function EmptyState({ search, category, onClearFilters }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 text-6xl">🔍</div>
      <h3 className="mb-2 text-lg font-semibold text-neutral-900">
        No products found
      </h3>
      <p className="mb-6 max-w-md text-neutral-600">
        {search && category
          ? `We couldn't find any products matching "${search}" in ${category}.`
          : search
            ? `We couldn't find any products matching "${search}".`
            : category
              ? `No products available in ${category} right now.`
              : 'No products are currently available.'}
      </p>
      <button
        onClick={onClearFilters}
        className="rounded-lg bg-brand-primary px-6 py-2.5 font-medium text-white transition-colors hover:bg-neutral-800"
      >
        Clear Filters
      </button>
    </div>
  )
}

import { createRoute, useNavigate } from '@tanstack/react-router'
import { useState, useMemo, useEffect } from 'react'
import { rootRoute } from '../app'
import { Container, PageHeader, CatalogEmptyState } from '../ui'
import { SEO } from '../components/SEO'
import { Breadcrumbs, BreadcrumbsSkeleton } from '../components/Breadcrumbs'
import { FilterBar, FilterBarSkeleton } from '../ui/FilterBar'
import { ProductCard, ProductCardSkeleton } from '../ui/ProductCard'
import { CategoryNav, CategoryNavSkeleton } from '../components/CategoryNav'
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
  const navigate = useNavigate()

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
    }, 300)
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

  // Handle quick action - navigates to product page (could integrate with cart when checkout enabled)
  const handleQuickAction = (product: Product) => {
    navigate({ to: '/item/$id', params: { id: product.id } })
  }

  return (
    <>
      <SEO
        title="Shop"
        description="Browse our curated collection of unique gifts and home goods. Find the perfect present for any occasion."
      />
      <Container>
        {isLoading ? (
          <BreadcrumbsSkeleton />
        ) : (
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Shop' },
            ]}
          />
        )}
        <PageHeader
          title="Shop"
          subtitle="Browse our curated collection of unique gifts and home goods"
        />

      {/* Main layout with sidebar on desktop */}
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Category Sidebar - visible on desktop */}
        <aside className="hidden shrink-0 lg:block lg:w-56">
          <div className="sticky top-24">
            {isLoading ? (
              <CategoryNavSkeleton />
            ) : (
              <CategoryNav
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                products={mockProducts}
              />
            )}
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="min-w-0 flex-1">
          {/* Filter Bar - category pills hidden on desktop where sidebar is shown */}
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
              hideCategoryPills
            />
          )}

          {/* Product Grid */}
          <section className="pb-16 pt-4">
            {isLoading ? (
              // Loading skeletons
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              // Empty state
              <CatalogEmptyState
                search={search}
                category={selectedCategory}
                onClearFilters={() => {
                  setSearch('')
                  setSelectedCategory(null)
                }}
              />
            ) : (
              // Product grid
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
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
        </div>
      </div>
    </Container>
    </>
  )
}

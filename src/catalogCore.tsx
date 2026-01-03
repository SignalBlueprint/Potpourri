/**
 * Catalog Core Adapter
 *
 * This file is the SINGLE integration point for @signal-core/catalog-react-sdk.
 * It uses the SDK's types and API utilities while keeping Potpourri's custom UI.
 *
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║                    PACKAGE SWAP INSTRUCTIONS                               ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║ When @signal-core/catalog-react-sdk is published, follow these steps:     ║
 * ║                                                                           ║
 * ║ 1. Install the package:                                                   ║
 * ║    pnpm add @signal-core/catalog-react-sdk                                ║
 * ║                                                                           ║
 * ║ 2. Uncomment line ~25:                                                    ║
 * ║    import { fetchJson } from '@signal-core/catalog-react-sdk'             ║
 * ║                                                                           ║
 * ║ 3. Delete lines ~27-87:                                                   ║
 * ║    - The mockProducts import                                              ║
 * ║    - The SDKProduct interface (provided by SDK)                           ║
 * ║    - The entire fetchJson stub function                                   ║
 * ║                                                                           ║
 * ║ 4. Run: pnpm typecheck && pnpm build                                      ║
 * ║                                                                           ║
 * ║ 5. Test all routes: /, /catalog, /item/*, /admin                          ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { useState, useMemo, useEffect } from 'react'
import { createRoute, Link } from '@tanstack/react-router'
import type { AnyRoute } from '@tanstack/react-router'
import type { ClientConfig } from './client.config'
import { clientConfig } from './client.config'

// =============================================================================
// SDK Integration - @signal-core/catalog-react-sdk
// =============================================================================
// STEP 2: Uncomment the line below when @signal-core/catalog-react-sdk is available
// import { fetchJson } from '@signal-core/catalog-react-sdk'

// ┌───────────────────────────────────────────────────────────────────────────┐
// │ STEP 3: DELETE FROM HERE ────────────────────────────────────────────────│
// └───────────────────────────────────────────────────────────────────────────┘

import { mockProducts } from './data/mockProducts'

// SDK Product type (matches signal-catalog server models)
// NOTE: This interface will be provided by @signal-core/catalog-react-sdk
interface SDKProduct {
  id: string
  orgId: string
  name: string
  description?: string
  price?: number
  currency?: string
  category?: string
  status: 'draft' | 'active' | 'out_of_stock'
  tags?: string[]
  images: Array<{ id: string; url: string; type: 'original' | 'generated' }>
  createdAt: string
  updatedAt: string
}

// Local fetchJson stub - uses mock data until real SDK is available
// NOTE: This function will be provided by @signal-core/catalog-react-sdk
async function fetchJson<T>(url: string): Promise<T> {
  // Simulate network delay for realistic behavior
  await new Promise((resolve) => setTimeout(resolve, 100))

  // Convert mock products to SDK format
  const sdkProducts: SDKProduct[] = mockProducts.map((p) => ({
    id: p.id,
    orgId: 'demo-org',
    name: p.name,
    description: p.description,
    price: p.price,
    currency: 'USD',
    category: p.category,
    status: 'active' as const,
    tags: [
      ...(p.isNew ? ['new'] : []),
      ...(p.isFeatured ? ['featured'] : []),
    ],
    images: p.imageUrl
      ? [{ id: `img-${p.id}`, url: p.imageUrl, type: 'original' as const }]
      : [],
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.createdAt.toISOString(),
  }))

  // Parse URL to determine what to return
  const urlParts = url.split('/')
  const productsIndex = urlParts.indexOf('products')

  if (productsIndex !== -1 && urlParts[productsIndex + 1]) {
    // Single product request: /store/{id}/products/{productId}
    const productId = urlParts[productsIndex + 1]
    const product = sdkProducts.find((p) => p.id === productId)
    if (!product) {
      throw new Error(`Product not found: ${productId}`)
    }
    return product as T
  }

  // All products request: /store/{id}/products
  return sdkProducts as T
}

// ┌───────────────────────────────────────────────────────────────────────────┐
// │ STEP 3: DELETE TO HERE ──────────────────────────────────────────────────│
// └───────────────────────────────────────────────────────────────────────────┘

// UI Components
import {
  Container,
  PageHeader,
  Card,
  Button,
  Badge,
  SectionTitle,
  AdminStatCard,
  AdminStatCardSkeleton,
  AdminProductsTable,
  AdminProductsTableSkeleton,
  AdminQuickActions,
  AdminQuickActionsSkeleton,
  PackageIcon,
  TagIcon,
  InboxIcon,
  ShoppingCartIcon,
} from './ui'
import {
  HeroSection,
  CategoryGrid,
  ProductTeaserGrid,
  VisitUs,
  TrustBadges,
} from './ui/sections'
import { FilterBar, FilterBarSkeleton } from './ui/FilterBar'
import { ProductCard, ProductCardSkeleton } from './ui/ProductCard'
import { ProductGallery } from './ui/ProductGallery'
import { RelatedProducts } from './ui/RelatedProducts'
import { InquiryModal } from './ui/InquiryModal'

// Local types for backward compatibility with existing UI components
import {
  categoryIcons,
  type SortOption,
  type Category,
  type Product as MockProduct,
} from './data/mockProducts'

// =============================================================================
// TYPES
// =============================================================================

export interface CatalogCoreConfig {
  clientConfig: ClientConfig
  rootRoute: AnyRoute
}

export type MakeRouteTree = (config: CatalogCoreConfig) => AnyRoute[]

export interface CatalogAppProps {
  clientConfig: ClientConfig
}

// Convert SDK product to MockProduct format for UI component compatibility
function adaptProduct(p: SDKProduct): MockProduct {
  const imageUrl = p.images?.[0]?.url || null
  const createdDate = new Date(p.createdAt)
  const now = new Date()
  const daysSinceCreated = (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24)

  return {
    id: p.id,
    name: p.name,
    description: p.description || '',
    price: p.price || 0,
    category: p.category || 'Uncategorized',
    imageUrl,
    isNew: daysSinceCreated < 30,
    isFeatured: p.tags?.includes('featured') || false,
    createdAt: createdDate,
  }
}

// =============================================================================
// API HOOKS
// =============================================================================

function useProducts() {
  const [products, setProducts] = useState<MockProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const apiBase = clientConfig.tenant.apiBaseUrl
  const customerId = clientConfig.tenant.id

  useEffect(() => {
    async function load() {
      try {
        setIsLoading(true)
        setError(null)
        const data = await fetchJson<SDKProduct[]>(`${apiBase}/store/${customerId}/products`)
        setProducts(data.map(adaptProduct))
      } catch (err) {
        setError((err as Error).message)
        // Fall back to empty array on error
        setProducts([])
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [apiBase, customerId])

  return { products, isLoading, error }
}

function useProduct(id: string) {
  const [product, setProduct] = useState<MockProduct | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const apiBase = clientConfig.tenant.apiBaseUrl
  const customerId = clientConfig.tenant.id

  useEffect(() => {
    async function load() {
      try {
        setIsLoading(true)
        setError(null)
        // Fetch single product by ID
        const data = await fetchJson<SDKProduct>(`${apiBase}/store/${customerId}/products/${id}`)
        setProduct(adaptProduct(data))
      } catch (err) {
        setError((err as Error).message)
        setProduct(null)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [apiBase, customerId, id])

  return { product, isLoading, error }
}

// =============================================================================
// INDEX PAGE - Landing page with hero, categories, and featured products
// =============================================================================
function IndexPage() {
  return (
    <>
      {/* Hero Section - Full width background */}
      <Container>
        <HeroSection />
      </Container>

      {/* Trust Badges */}
      <Container>
        <TrustBadges />
      </Container>

      {/* Featured Categories */}
      <Container>
        <CategoryGrid />
      </Container>

      {/* New Arrivals */}
      <div className="bg-white/50">
        <Container>
          <ProductTeaserGrid />
        </Container>
      </div>

      {/* Visit Us Section */}
      <Container>
        <VisitUs />
      </Container>

      {/* Bottom spacing */}
      <div className="h-8 sm:h-12" />
    </>
  )
}

// =============================================================================
// CATALOG PAGE - Product listing with filtering and sorting
// =============================================================================
function CatalogPage() {
  const { products, isLoading, error } = useProducts()

  // Filter state
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [sort, setSort] = useState<SortOption>('newest')

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
    let result = [...products]

    // Apply search filter
    if (debouncedSearch) {
      const searchLower = debouncedSearch.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower) ||
          p.category.toLowerCase().includes(searchLower)
      )
    }

    // Apply category filter
    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory)
    }

    // Apply sorting
    switch (sort) {
      case 'newest':
        result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        break
      case 'price-asc':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        result.sort((a, b) => b.price - a.price)
        break
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
    }

    return result
  }, [products, debouncedSearch, selectedCategory, sort])

  // Handle quick action (placeholder)
  const handleQuickAction = (product: MockProduct) => {
    console.log('Quick action on:', product.name)
  }

  if (error) {
    return (
      <Container>
        <PageHeader
          title="Shop"
          subtitle="Browse our curated collection of unique gifts and home goods"
        />
        <div className="py-16 text-center">
          <p className="text-red-600">Error loading products: {error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
        </div>
      </Container>
    )
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

// Empty State Component for Catalog
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

// =============================================================================
// ITEM PAGE - Product detail with gallery, inquiry modal, and related products
// =============================================================================
function ItemPage({ id }: { id: string }) {
  const { product, isLoading, error } = useProduct(id)
  const [isInquiryOpen, setIsInquiryOpen] = useState(false)

  // Get config values
  const { enableCheckout } = clientConfig.features

  if (isLoading) {
    return (
      <Container>
        <div className="py-16 text-center">
          <div className="animate-pulse">Loading product...</div>
        </div>
      </Container>
    )
  }

  if (error || !product) {
    return (
      <Container>
        <div className="flex min-h-[50vh] flex-col items-center justify-center py-16 text-center">
          <span className="mb-4 text-6xl">🔍</span>
          <h1 className="mb-2 text-2xl font-semibold text-neutral-900">Product Not Found</h1>
          <p className="mb-6 text-neutral-600">
            {error || "We couldn't find the item you're looking for."}
          </p>
          <Link
            to="/catalog"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-primary px-4 py-2 text-sm font-medium text-white shadow-soft transition-all duration-200 hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
          >
            Browse Catalog
          </Link>
        </div>
      </Container>
    )
  }

  const categoryIcon = categoryIcons[product.category as Category] || '📦'
  const imageUrl = product.imageUrl || '/placeholder.jpg'

  // Generate placeholder additional images for gallery demo
  const productImages = [
    imageUrl,
    imageUrl,
    imageUrl,
    imageUrl,
  ]

  const handleAddToCart = () => {
    console.log('Added to cart:', product.id, product.name)
  }

  return (
    <>
      <Container>
        {/* Breadcrumb */}
        <nav className="py-4" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-neutral-600">
            <li>
              <Link to="/" className="transition-colors hover:text-brand-primary">
                Home
              </Link>
            </li>
            <li className="text-neutral-400">/</li>
            <li>
              <Link to="/catalog" className="transition-colors hover:text-brand-primary">
                Catalog
              </Link>
            </li>
            <li className="text-neutral-400">/</li>
            <li>
              <span className="text-neutral-600">
                {product.category}
              </span>
            </li>
            <li className="text-neutral-400">/</li>
            <li className="truncate text-neutral-900" aria-current="page">
              {product.name}
            </li>
          </ol>
        </nav>

        {/* Product Detail */}
        <section className="pb-12">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Image Gallery */}
            <ProductGallery
              images={productImages}
              productName={product.name}
              category={product.category}
            />

            {/* Product Info */}
            <div className="space-y-6">
              {/* Category & Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="primary" className="flex items-center gap-1.5">
                  <span>{categoryIcon}</span>
                  {product.category}
                </Badge>
                {product.isNew && <Badge variant="accent">New Arrival</Badge>}
                {product.isFeatured && <Badge>Featured</Badge>}
              </div>

              {/* Title & Price */}
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
                  {product.name}
                </h1>
                <p className="text-2xl font-semibold text-neutral-800">
                  ${product.price.toFixed(2)}
                </p>
              </div>

              {/* Description */}
              <p className="text-lg leading-relaxed text-neutral-600">
                {product.description}
              </p>

              {/* Product Details Card */}
              <Card className="space-y-3 bg-neutral-50/80">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600">Availability</span>
                  <span className="flex items-center gap-1.5 font-medium text-green-700">
                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                    In Stock
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600">Item ID</span>
                  <span className="font-mono text-xs text-neutral-500">#{id.slice(0, 8)}</span>
                </div>
                {clientConfig.catalog.shippingNote && (
                  <div className="border-t border-neutral-200 pt-3 text-sm text-neutral-600">
                    {clientConfig.catalog.shippingNote}
                  </div>
                )}
              </Card>

              {/* Actions */}
              <div className="flex flex-col gap-3 sm:flex-row">
                {enableCheckout ? (
                  <Button size="lg" className="flex-1 sm:flex-initial" onClick={handleAddToCart}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-2 h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    Add to Cart
                  </Button>
                ) : (
                  <Button size="lg" className="flex-1 sm:flex-initial" onClick={() => setIsInquiryOpen(true)}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-2 h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    Inquire About This Item
                  </Button>
                )}
                <Button size="lg" variant="secondary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-2 h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  Save
                </Button>
              </div>

              {/* Trust indicators */}
              <div className="grid grid-cols-2 gap-4 border-t border-neutral-200 pt-6 text-sm text-neutral-600">
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-brand-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                  Quality Guaranteed
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-brand-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Local Pickup Available
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Products */}
        <RelatedProducts
          currentProductId={product.id}
          category={product.category}
        />

        {/* Bottom spacing */}
        <div className="pb-16" />
      </Container>

      {/* Inquiry Modal */}
      <InquiryModal
        isOpen={isInquiryOpen}
        onClose={() => setIsInquiryOpen(false)}
        productName={product.name}
        productId={product.id}
      />
    </>
  )
}

// =============================================================================
// ADMIN PAGE - Dashboard for managing products and inquiries
// =============================================================================
function AdminPage() {
  const [isLoading, setIsLoading] = useState(true)

  // Simulate loading state for demo purposes
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <Container>
      <PageHeader
        title="Admin Dashboard"
        subtitle="Manage your inventory, view inquiries, and track orders"
      />

      {/* Summary Cards */}
      <section className="pb-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {isLoading ? (
            <>
              <AdminStatCardSkeleton />
              <AdminStatCardSkeleton />
              <AdminStatCardSkeleton />
              <AdminStatCardSkeleton />
            </>
          ) : (
            <>
              <AdminStatCard
                label="Total Products"
                value={24}
                icon={<PackageIcon />}
                trend={{ value: 12, label: 'from last month', direction: 'up' }}
              />
              <AdminStatCard
                label="Categories"
                value={5}
                icon={<TagIcon />}
              />
              <AdminStatCard
                label="Inquiries"
                value={8}
                icon={<InboxIcon />}
                trend={{ value: 3, label: 'new this week', direction: 'up' }}
                variant="success"
              />
              <AdminStatCard
                label="Orders"
                value={0}
                icon={<ShoppingCartIcon />}
                variant="default"
              />
            </>
          )}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="pb-8">
        <div className="mb-4">
          <SectionTitle>Quick Actions</SectionTitle>
        </div>
        {isLoading ? (
          <AdminQuickActionsSkeleton />
        ) : (
          <AdminQuickActions
            onAddProduct={() => console.log('Add product clicked')}
            onImportCSV={() => console.log('Import CSV clicked')}
            onManageCategories={() => console.log('Manage categories clicked')}
          />
        )}
      </section>

      {/* Products Table */}
      <section className="pb-16">
        <div className="mb-6">
          <SectionTitle subtitle="View and manage your product catalog">
            Products
          </SectionTitle>
        </div>
        {isLoading ? (
          <AdminProductsTableSkeleton />
        ) : (
          <AdminProductsTable
            onEdit={(product) => console.log('Edit product:', product)}
            onDelete={(product) => console.log('Delete product:', product)}
          />
        )}
      </section>
    </Container>
  )
}

// =============================================================================
// Route Tree Factory
// =============================================================================

export const makeRouteTree: MakeRouteTree = ({ clientConfig: config, rootRoute }) => {
  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: IndexPage,
  })

  const catalogRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/catalog',
    component: CatalogPage,
  })

  const itemRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/item/$id',
    component: function ItemPageWrapper() {
      const { id } = itemRoute.useParams()
      return <ItemPage id={id} />
    },
  })

  const adminRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/admin',
    beforeLoad: () => {
      if (!config.features.enableAdmin) {
        // Redirect to home if admin is disabled
        throw new Error('Admin access disabled')
      }
    },
    component: AdminPage,
  })

  return [indexRoute, catalogRoute, itemRoute, adminRoute]
}

// Optional: Full app component if consumer wants a drop-in solution
export function CatalogApp({ clientConfig: config }: CatalogAppProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="text-xl font-bold text-indigo-600">
              {config.brand.name}
            </Link>
            <div className="flex gap-6">
              <Link to="/" className="text-gray-600 hover:text-gray-900 [&.active]:text-indigo-600">
                Home
              </Link>
              <Link
                to="/catalog"
                className="text-gray-600 hover:text-gray-900 [&.active]:text-indigo-600"
              >
                Catalog
              </Link>
              {config.features.enableAdmin && (
                <Link
                  to="/admin"
                  className="text-gray-600 hover:text-gray-900 [&.active]:text-indigo-600"
                >
                  Admin
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="mx-auto max-w-7xl">
        {/* Outlet would go here if using CatalogApp directly */}
      </main>
    </div>
  )
}

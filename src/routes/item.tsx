import { useState, useEffect } from 'react'
import { createRoute, Link } from '@tanstack/react-router'
import { rootRoute } from '../app'
import { Card, Container, Button, Badge, InventoryBadge, ShareButtons } from '../ui'
import { SEO } from '../components/SEO'
import { Breadcrumbs, BreadcrumbsSkeleton } from '../components/Breadcrumbs'
import { ProductSchema } from '../components/ProductSchema'
import { ProductGallery } from '../ui/ProductGallery'
import { RelatedProducts, RelatedProductsSkeleton } from '../ui/RelatedProducts'
import { RecentlyViewed } from '../ui/RecentlyViewed'
import { InquiryModal } from '../ui/InquiryModal'
import { useRecentlyViewed } from '../hooks/useRecentlyViewed'
import { mockProducts, categoryIcons, type Category } from '../data/mockProducts'
import { clientConfig } from '../client.config'
import { Skeleton, SkeletonImage, SkeletonCard } from '../components/Skeleton'
import { trackProductView } from '../lib/analytics'

export const itemRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/item/$id',
  component: ItemPage,
})

function ItemPage() {
  const { id } = itemRoute.useParams()
  const [isInquiryOpen, setIsInquiryOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { addViewed } = useRecentlyViewed()

  // Find the product by ID
  const product = mockProducts.find((p) => p.id === id)

  // Get config values
  const { enableCheckout } = clientConfig.features

  // Simulate initial data fetch
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 600)
    return () => clearTimeout(timer)
  }, [])

  // Track product view when product loads
  useEffect(() => {
    if (!isLoading && product) {
      trackProductView(product.id, product.name, product.category)
      addViewed(product.id)
    }
  }, [isLoading, product, addViewed])

  // Show loading skeleton
  if (isLoading) {
    return (
      <Container>
        <ItemDetailSkeleton />
      </Container>
    )
  }

  // Handle product not found
  if (!product) {
    return (
      <Container>
        <div className="flex min-h-[50vh] flex-col items-center justify-center py-16 text-center">
          <span className="mb-4 text-6xl">🔍</span>
          <h1 className="mb-2 text-2xl font-semibold text-neutral-900">Product Not Found</h1>
          <p className="mb-6 text-neutral-600">
            We couldn't find the item you're looking for.
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

  // Generate placeholder additional images for gallery demo
  // In a real app, products would have an images array
  const productImages = [
    product.imageUrl,
    product.imageUrl, // Duplicate for demo
    product.imageUrl,
    product.imageUrl,
  ]

  const handleAddToCart = () => {
    // Placeholder for cart functionality
    console.log('Added to cart:', product.id, product.name)
    // In a real app, this would dispatch to a cart store
  }

  return (
    <>
      <SEO
        title={product.name}
        description={product.description}
        image={product.imageUrl ?? undefined}
        type="product"
      />
      <ProductSchema
        id={product.id}
        name={product.name}
        description={product.description}
        price={product.price}
        imageUrl={product.imageUrl}
        category={product.category}
      />
      <Container>
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Shop', href: '/catalog' },
            { label: product.category },
            { label: product.name },
          ]}
        />

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
                  <InventoryBadge stock={product.stock} />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600">Item ID</span>
                  <span className="font-mono text-xs text-neutral-500">#{id.padStart(4, '0')}</span>
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
                      aria-hidden="true"
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
                      aria-hidden="true"
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
                    aria-hidden="true"
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
                    aria-hidden="true"
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
                    aria-hidden="true"
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

              {/* Share buttons */}
              <ShareButtons title={product.name} className="border-t border-neutral-200 pt-4" />
            </div>
          </div>
        </section>

        {/* Related Products */}
        <RelatedProducts
          currentProductId={product.id}
          category={product.category}
        />

        {/* Recently Viewed */}
        <RecentlyViewed excludeProductId={product.id} />

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
// ItemDetailSkeleton - Loading placeholder for product detail page
// =============================================================================

function ItemDetailSkeleton() {
  return (
    <>
      <BreadcrumbsSkeleton />

      {/* Product Detail skeleton */}
      <section className="pb-12">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Image Gallery skeleton */}
          <div className="space-y-4">
            <SkeletonImage aspectRatio="square" className="rounded-xl" />
            <div className="flex gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonImage key={i} className="h-16 w-16 rounded-lg" aspectRatio="auto" />
              ))}
            </div>
          </div>

          {/* Product Info skeleton */}
          <div className="space-y-6">
            {/* Category & Badges */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>

            {/* Title & Price */}
            <div className="space-y-2">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-8 w-24" />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-2/3" />
            </div>

            {/* Product Details Card */}
            <SkeletonCard className="space-y-3 p-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
            </SkeletonCard>

            {/* Action buttons */}
            <div className="flex gap-3">
              <Skeleton className="h-12 w-40 rounded-lg" />
              <Skeleton className="h-12 w-24 rounded-lg" />
            </div>

            {/* Trust indicators */}
            <div className="grid grid-cols-2 gap-4 border-t border-neutral-200 pt-6">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-4 w-28" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products skeleton */}
      <RelatedProductsSkeleton />

      {/* Bottom spacing */}
      <div className="pb-16" />
    </>
  )
}

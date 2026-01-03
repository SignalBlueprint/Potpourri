import { Link } from '@tanstack/react-router'
import type { Product } from '../data/mockProducts'
import { categoryIcons, type Category } from '../data/mockProducts'
import { clientConfig } from '../client.config'
import { Badge, Button } from './index'

// =============================================================================
// ProductCard - Reusable product card with hover effects
// =============================================================================

interface ProductCardProps {
  product: Product
  onQuickAction?: (product: Product) => void
}

export function ProductCard({ product, onQuickAction }: ProductCardProps) {
  const { enableCheckout } = clientConfig.features
  const categoryIcon = categoryIcons[product.category as Category] || '📦'

  const actionLabel = enableCheckout ? 'Add to Cart' : 'View Details'

  const handleQuickAction = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onQuickAction?.(product)
  }

  return (
    <Link
      to="/item/$id"
      params={{ id: product.id }}
      className="group block"
    >
      <article className="relative overflow-hidden rounded-xl bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-soft">
        {/* Image Container with aspect ratio */}
        <div className="relative aspect-square overflow-hidden bg-neutral-100">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-200">
              <span className="text-5xl opacity-50">{categoryIcon}</span>
            </div>
          )}

          {/* Badges overlay */}
          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {product.isNew && (
              <Badge variant="accent" className="shadow-sm">
                New
              </Badge>
            )}
            {product.isFeatured && (
              <Badge variant="primary" className="shadow-sm">
                Featured
              </Badge>
            )}
          </div>

          {/* Quick action overlay on hover */}
          <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <Button
              variant="secondary"
              size="sm"
              className="w-full bg-white/95 backdrop-blur-sm"
              onClick={handleQuickAction}
            >
              {actionLabel}
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Category */}
          <div className="mb-1.5 flex items-center gap-1.5">
            <span className="text-sm">{categoryIcon}</span>
            <span className="text-xs font-medium text-neutral-500">
              {product.category}
            </span>
          </div>

          {/* Name */}
          <h3 className="mb-1 line-clamp-1 font-medium text-neutral-900 transition-colors group-hover:text-brand-primary">
            {product.name}
          </h3>

          {/* Description */}
          <p className="mb-3 line-clamp-2 text-sm text-neutral-600">
            {product.description}
          </p>

          {/* Price */}
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-neutral-900">
              ${product.price.toFixed(2)}
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}

// =============================================================================
// ProductCardSkeleton - Loading placeholder
// =============================================================================

export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-xl bg-white shadow-card">
      {/* Image skeleton */}
      <div className="aspect-square bg-neutral-200" />

      {/* Content skeleton */}
      <div className="p-4">
        {/* Category */}
        <div className="mb-2 h-4 w-24 rounded bg-neutral-200" />

        {/* Name */}
        <div className="mb-2 h-5 w-3/4 rounded bg-neutral-200" />

        {/* Description */}
        <div className="mb-1 h-4 w-full rounded bg-neutral-200" />
        <div className="mb-3 h-4 w-2/3 rounded bg-neutral-200" />

        {/* Price */}
        <div className="h-6 w-20 rounded bg-neutral-200" />
      </div>
    </div>
  )
}

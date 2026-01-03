import { useState } from 'react'
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
  const [imageError, setImageError] = useState(false)
  const { enableCheckout } = clientConfig.features
  const categoryIcon = categoryIcons[product.category as Category] || '📦'

  const actionLabel = enableCheckout ? 'Add to Cart' : 'View Details'
  const showFallback = !product.imageUrl || imageError

  const handleQuickAction = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onQuickAction?.(product)
  }

  return (
    <Link
      to="/item/$id"
      params={{ id: product.id }}
      className="group block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
    >
      <article className="relative overflow-hidden rounded-xl border border-neutral-100 bg-white shadow-card ring-brand-primary/0 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-brand-primary/20 hover:shadow-elevated hover:ring-4 hover:ring-brand-primary/10">
        {/* Image Container with aspect ratio */}
        <div className="relative aspect-square overflow-hidden bg-neutral-50">
          {!showFallback ? (
            <img
              src={product.imageUrl!}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-neutral-50 via-neutral-100 to-neutral-200">
              <span className="text-6xl opacity-40 transition-transform duration-300 group-hover:scale-110">{categoryIcon}</span>
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
          <div className="mb-2 flex items-center gap-1.5">
            <span className="text-sm transition-transform duration-200 group-hover:scale-110">{categoryIcon}</span>
            <span className="text-xs font-medium uppercase tracking-wide text-neutral-500">
              {product.category}
            </span>
          </div>

          {/* Name */}
          <h3 className="mb-1.5 line-clamp-1 font-semibold text-neutral-900 transition-colors duration-200 group-hover:text-brand-primary">
            {product.name}
          </h3>

          {/* Description */}
          <p className="mb-3 line-clamp-2 text-sm leading-relaxed text-neutral-600">
            {product.description}
          </p>

          {/* Price */}
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center rounded-lg bg-neutral-50 px-2.5 py-1 text-lg font-bold text-neutral-900 transition-colors duration-200 group-hover:bg-brand-primary/10 group-hover:text-brand-primary">
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
    <div className="animate-pulse overflow-hidden rounded-xl border border-neutral-100 bg-white shadow-card">
      {/* Image skeleton */}
      <div className="aspect-square bg-gradient-to-br from-neutral-100 to-neutral-200" />

      {/* Content skeleton */}
      <div className="p-4">
        {/* Category */}
        <div className="mb-2 h-4 w-24 rounded-md bg-neutral-200" />

        {/* Name */}
        <div className="mb-2 h-5 w-3/4 rounded-md bg-neutral-200" />

        {/* Description */}
        <div className="mb-1 h-4 w-full rounded-md bg-neutral-200" />
        <div className="mb-3 h-4 w-2/3 rounded-md bg-neutral-200" />

        {/* Price */}
        <div className="h-8 w-24 rounded-lg bg-neutral-200" />
      </div>
    </div>
  )
}

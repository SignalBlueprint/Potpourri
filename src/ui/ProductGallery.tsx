import { useState } from 'react'
import { categoryIcons, type Category } from '../data/mockProducts'

// =============================================================================
// ProductGallery - Image gallery with main image and thumbnails
// =============================================================================

interface ProductGalleryProps {
  images: (string | null)[]
  productName: string
  category: string
}

export function ProductGallery({ images, productName, category }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  // Filter out null images and ensure we have at least one placeholder
  const validImages = images.filter((img): img is string => img !== null)
  const hasImages = validImages.length > 0

  const categoryIcon = categoryIcons[category as Category] || '📦'

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square overflow-hidden rounded-xl bg-neutral-100">
        {hasImages ? (
          <img
            src={validImages[selectedIndex] || validImages[0]}
            alt={`${productName} - Image ${selectedIndex + 1}`}
            className="h-full w-full object-cover transition-opacity duration-300"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-200">
            <span className="text-8xl opacity-40">{categoryIcon}</span>
          </div>
        )}
      </div>

      {/* Thumbnails - only show if we have multiple images */}
      {validImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {validImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`
                relative flex-shrink-0 overflow-hidden rounded-lg
                transition-all duration-200
                ${
                  selectedIndex === index
                    ? 'ring-2 ring-brand-primary ring-offset-2'
                    : 'opacity-70 hover:opacity-100'
                }
              `}
              aria-label={`View image ${index + 1}`}
            >
              <div className="h-16 w-16 sm:h-20 sm:w-20">
                <img
                  src={image}
                  alt={`${productName} thumbnail ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// =============================================================================
// ProductGallerySkeleton - Loading placeholder
// =============================================================================

export function ProductGallerySkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      {/* Main image skeleton */}
      <div className="aspect-square rounded-xl bg-neutral-200" />

      {/* Thumbnails skeleton */}
      <div className="flex gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-16 w-16 flex-shrink-0 rounded-lg bg-neutral-200 sm:h-20 sm:w-20" />
        ))}
      </div>
    </div>
  )
}

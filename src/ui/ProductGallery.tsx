import { useState, useCallback, useEffect, useRef } from 'react'
import { categoryIcons, type Category } from '../data/mockProducts'

// =============================================================================
// ProductGallery - Image gallery with zoom, navigation, and thumbnails
// Keyboard accessible: Arrow keys navigate, Enter/Space opens zoom, Escape closes
// =============================================================================

interface ProductGalleryProps {
  images: (string | null)[]
  productName: string
  category: string
}

export function ProductGallery({ images, productName, category }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set())
  const galleryRef = useRef<HTMLDivElement>(null)

  // Filter out null images and ensure we have at least one placeholder
  const validImages = images.filter((img): img is string => img !== null)
  const hasImages = validImages.length > 0
  const hasMultipleImages = validImages.length > 1

  const categoryIcon = categoryIcons[category as Category] || '📦'

  // Check if selected image has failed to load
  const selectedImageFailed = failedImages.has(selectedIndex)

  // Handle image load error
  const handleImageError = useCallback((index: number) => {
    setFailedImages((prev) => new Set(prev).add(index))
  }, [])

  // Navigation handlers
  const goToPrevious = useCallback(() => {
    setSelectedIndex((prev) => (prev === 0 ? validImages.length - 1 : prev - 1))
  }, [validImages.length])

  const goToNext = useCallback(() => {
    setSelectedIndex((prev) => (prev === validImages.length - 1 ? 0 : prev + 1))
  }, [validImages.length])

  // Keyboard navigation for gallery when focused (not zoomed)
  const handleGalleryKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (isZoomed) return // Let the zoom modal handler take over

      switch (e.key) {
        case 'ArrowLeft':
          if (hasMultipleImages) {
            e.preventDefault()
            goToPrevious()
          }
          break
        case 'ArrowRight':
          if (hasMultipleImages) {
            e.preventDefault()
            goToNext()
          }
          break
        case 'Enter':
        case ' ':
          if (hasImages && !failedImages.has(selectedIndex)) {
            e.preventDefault()
            setIsZoomed(true)
          }
          break
      }
    },
    [isZoomed, hasMultipleImages, hasImages, selectedIndex, failedImages, goToPrevious, goToNext]
  )

  // Keyboard navigation for zoom modal (global listener)
  useEffect(() => {
    if (!isZoomed) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsZoomed(false)
      } else if (e.key === 'ArrowLeft' && hasMultipleImages) {
        goToPrevious()
      } else if (e.key === 'ArrowRight' && hasMultipleImages) {
        goToNext()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isZoomed, hasMultipleImages, goToPrevious, goToNext])

  return (
    <>
      <div
        ref={galleryRef}
        className="space-y-4 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
        tabIndex={0}
        role="region"
        aria-label={`Image gallery for ${productName}. ${hasMultipleImages ? 'Use arrow keys to navigate images, Enter or Space to zoom.' : 'Press Enter or Space to zoom.'}`}
        onKeyDown={handleGalleryKeyDown}
      >
        {/* Main Image with zoom capability */}
        <div className="group relative aspect-square overflow-hidden rounded-xl bg-neutral-100">
          {hasImages && !selectedImageFailed ? (
            <>
              <img
                src={validImages[selectedIndex] || validImages[0]}
                alt={`${productName} - Image ${selectedIndex + 1}`}
                className="h-full w-full cursor-zoom-in object-cover transition-transform duration-500 group-hover:scale-105"
                onClick={() => setIsZoomed(true)}
                onError={() => handleImageError(selectedIndex)}
              />
              {/* Zoom hint overlay */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/10 group-hover:opacity-100">
                <div className="rounded-full bg-white/90 p-3 shadow-lg backdrop-blur-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-neutral-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                    />
                  </svg>
                </div>
              </div>
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-neutral-50 via-neutral-100 to-neutral-200">
              <span className="text-8xl opacity-40">{categoryIcon}</span>
            </div>
          )}

          {/* Navigation arrows on main image */}
          {hasMultipleImages && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  goToPrevious()
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 opacity-0 shadow-lg backdrop-blur-sm transition-all duration-200 hover:bg-white hover:scale-110 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
                aria-label="Previous image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  goToNext()
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 opacity-0 shadow-lg backdrop-blur-sm transition-all duration-200 hover:bg-white hover:scale-110 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
                aria-label="Next image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Image counter badge */}
          {hasMultipleImages && (
            <div className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
              {selectedIndex + 1} / {validImages.length}
            </div>
          )}
        </div>

        {/* Thumbnails - only show if we have multiple images */}
        {hasMultipleImages && (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {validImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedIndex(index)}
                className={`
                  relative flex-shrink-0 overflow-hidden rounded-lg outline-none
                  transition-all duration-200 ease-out
                  focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2
                  ${
                    selectedIndex === index
                      ? 'ring-2 ring-brand-primary ring-offset-2 scale-105'
                      : 'opacity-60 hover:opacity-100 hover:scale-105'
                  }
                `}
                aria-label={`View image ${index + 1}`}
              >
                <div className="h-16 w-16 sm:h-20 sm:w-20">
                  {failedImages.has(index) ? (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-neutral-50 via-neutral-100 to-neutral-200">
                      <span className="text-2xl opacity-40">{categoryIcon}</span>
                    </div>
                  ) : (
                    <img
                      src={image}
                      alt={`${productName} thumbnail ${index + 1}`}
                      className="h-full w-full object-cover"
                      onError={() => handleImageError(index)}
                    />
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Zoom Modal / Lightbox */}
      {isZoomed && hasImages && !selectedImageFailed && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={() => setIsZoomed(false)}
        >
          {/* Close button */}
          <button
            onClick={() => setIsZoomed(false)}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/90 outline-none"
            aria-label="Close zoom"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Navigation arrows in zoom mode */}
          {hasMultipleImages && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  goToPrevious()
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-all hover:bg-white/20 hover:scale-110 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/90 outline-none"
                aria-label="Previous image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  goToNext()
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-all hover:bg-white/20 hover:scale-110 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/90 outline-none"
                aria-label="Next image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Zoomed image */}
          <img
            src={validImages[selectedIndex]}
            alt={`${productName} - Image ${selectedIndex + 1}`}
            className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Image counter in zoom mode */}
          {hasMultipleImages && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
              {selectedIndex + 1} / {validImages.length}
            </div>
          )}

          {/* Keyboard hint */}
          <div className="absolute bottom-4 right-4 text-xs text-white/50">
            {hasMultipleImages ? '← → to navigate · ' : ''}ESC to close
          </div>
        </div>
      )}
    </>
  )
}

// =============================================================================
// ProductGallerySkeleton - Loading placeholder
// =============================================================================

export function ProductGallerySkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      {/* Main image skeleton */}
      <div className="aspect-square rounded-xl bg-gradient-to-br from-neutral-100 to-neutral-200" />

      {/* Thumbnails skeleton */}
      <div className="flex gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-16 w-16 flex-shrink-0 rounded-lg bg-neutral-200 sm:h-20 sm:w-20" />
        ))}
      </div>
    </div>
  )
}

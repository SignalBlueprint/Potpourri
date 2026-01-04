// =============================================================================
// ProductReviews - Star rating display and review list for product pages
// POT-063: Add product reviews/ratings
// =============================================================================

import { useState } from 'react'
import { Card } from './index'

// =============================================================================
// Types
// =============================================================================

export interface Review {
  id: string
  author: string
  rating: number // 1-5
  date: string
  content: string
  verified: boolean
}

interface ProductReviewsProps {
  productId: string
  className?: string
}

// =============================================================================
// Mock Reviews Data
// Seeded by product ID for consistent demo experience
// =============================================================================

function getMockReviews(productId: string): Review[] {
  // Generate consistent reviews based on product ID
  const seed = parseInt(productId, 10) || 1

  const reviewTemplates: Array<Omit<Review, 'id'>> = [
    {
      author: 'Sarah M.',
      rating: 5,
      date: '2024-12-15',
      content: 'Absolutely love this! The quality is exceptional and it arrived beautifully packaged. Would definitely recommend.',
      verified: true,
    },
    {
      author: 'James T.',
      rating: 4,
      date: '2024-12-10',
      content: 'Great product, exactly as described. Shipping was fast. Only giving 4 stars because I wish there were more color options.',
      verified: true,
    },
    {
      author: 'Emily R.',
      rating: 5,
      date: '2024-12-05',
      content: 'This makes the perfect gift! I bought two - one for myself and one for my sister. We both love them.',
      verified: true,
    },
    {
      author: 'Michael K.',
      rating: 4,
      date: '2024-11-28',
      content: 'Good quality for the price. Nice attention to detail.',
      verified: false,
    },
    {
      author: 'Amanda L.',
      rating: 5,
      date: '2024-11-20',
      content: 'Exceeded my expectations! The craftsmanship is beautiful. Will definitely shop here again.',
      verified: true,
    },
  ]

  // Select 2-4 reviews based on product ID
  const numReviews = 2 + (seed % 3) // 2, 3, or 4 reviews
  const startIndex = seed % reviewTemplates.length

  const reviews: Review[] = []
  for (let i = 0; i < numReviews; i++) {
    const templateIndex = (startIndex + i) % reviewTemplates.length
    const template = reviewTemplates[templateIndex]
    if (!template) continue
    reviews.push({
      id: `${productId}-review-${i}`,
      author: template.author,
      rating: template.rating,
      date: template.date,
      content: template.content,
      verified: template.verified,
    })
  }

  return reviews
}

// =============================================================================
// StarRating Component
// =============================================================================

interface StarRatingProps {
  rating: number
  size?: 'sm' | 'md' | 'lg'
  showValue?: boolean
  className?: string
}

function StarRating({ rating, size = 'md', showValue = false, className = '' }: StarRatingProps) {
  const sizeClasses = {
    sm: 'h-3.5 w-3.5',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  }

  const textClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  }

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex" role="img" aria-label={`${rating} out of 5 stars`}>
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= rating
          const halfFilled = !filled && star - 0.5 <= rating

          return (
            <svg
              key={star}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className={`${sizeClasses[size]} ${filled || halfFilled ? 'text-amber-400' : 'text-neutral-300'}`}
              fill={filled ? 'currentColor' : halfFilled ? 'url(#half)' : 'none'}
              stroke="currentColor"
              strokeWidth={1.5}
            >
              {halfFilled && (
                <defs>
                  <linearGradient id="half">
                    <stop offset="50%" stopColor="currentColor" />
                    <stop offset="50%" stopColor="transparent" />
                  </linearGradient>
                </defs>
              )}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
              />
            </svg>
          )
        })}
      </div>
      {showValue && (
        <span className={`font-medium text-neutral-700 ${textClasses[size]}`}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  )
}

// =============================================================================
// ReviewCard Component
// =============================================================================

interface ReviewCardProps {
  review: Review
}

function ReviewCard({ review }: ReviewCardProps) {
  const formattedDate = new Date(review.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  return (
    <div className="border-b border-neutral-100 py-4 last:border-b-0">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-neutral-900">{review.author}</span>
            {review.verified && (
              <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="h-3 w-3"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.416 3.376a.75.75 0 01.208 1.04l-5 7.5a.75.75 0 01-1.154.114l-3-3a.75.75 0 011.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 011.04-.207z"
                    clipRule="evenodd"
                  />
                </svg>
                Verified
              </span>
            )}
          </div>
          <div className="mt-1 flex items-center gap-2">
            <StarRating rating={review.rating} size="sm" />
            <span className="text-xs text-neutral-500">{formattedDate}</span>
          </div>
        </div>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-neutral-600">{review.content}</p>
    </div>
  )
}

// =============================================================================
// ProductReviews Component
// =============================================================================

export function ProductReviews({ productId, className = '' }: ProductReviewsProps) {
  const [showAll, setShowAll] = useState(false)

  const reviews = getMockReviews(productId)
  const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
  const displayedReviews = showAll ? reviews : reviews.slice(0, 2)

  // Rating distribution for summary
  const ratingCounts = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((r) => r.rating === rating).length,
    percentage: (reviews.filter((r) => r.rating === rating).length / reviews.length) * 100,
  }))

  return (
    <section className={`py-8 ${className}`}>
      <Card className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-neutral-900">Customer Reviews</h2>
        </div>

        {/* Summary */}
        <div className="flex flex-col gap-6 border-b border-neutral-100 pb-6 sm:flex-row sm:items-start">
          {/* Average rating */}
          <div className="flex flex-col items-center sm:items-start">
            <div className="text-4xl font-bold text-neutral-900">{averageRating.toFixed(1)}</div>
            <StarRating rating={averageRating} size="lg" className="mt-1" />
            <div className="mt-1 text-sm text-neutral-500">
              Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
            </div>
          </div>

          {/* Rating bars */}
          <div className="flex-1 space-y-1.5">
            {ratingCounts.map(({ rating, count, percentage }) => (
              <div key={rating} className="flex items-center gap-2 text-sm">
                <span className="w-8 text-neutral-600">{rating} star</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-neutral-100">
                  <div
                    className="h-full rounded-full bg-amber-400 transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-8 text-right text-neutral-500">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews list */}
        <div>
          {displayedReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>

        {/* Show more/less */}
        {reviews.length > 2 && (
          <button
            type="button"
            onClick={() => setShowAll(!showAll)}
            className="text-sm font-medium text-brand-primary hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
          >
            {showAll ? 'Show less' : `Show all ${reviews.length} reviews`}
          </button>
        )}
      </Card>
    </section>
  )
}

// =============================================================================
// ProductReviewsSkeleton - Loading state
// =============================================================================

export function ProductReviewsSkeleton() {
  return (
    <section className="py-8">
      <Card className="space-y-6">
        <div className="h-7 w-40 animate-pulse rounded bg-neutral-200" />

        <div className="flex flex-col gap-6 border-b border-neutral-100 pb-6 sm:flex-row">
          <div className="flex flex-col items-center sm:items-start">
            <div className="h-10 w-16 animate-pulse rounded bg-neutral-200" />
            <div className="mt-2 h-5 w-24 animate-pulse rounded bg-neutral-200" />
            <div className="mt-1 h-4 w-28 animate-pulse rounded bg-neutral-200" />
          </div>

          <div className="flex-1 space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="h-4 w-12 animate-pulse rounded bg-neutral-200" />
                <div className="h-2 flex-1 animate-pulse rounded-full bg-neutral-200" />
                <div className="h-4 w-6 animate-pulse rounded bg-neutral-200" />
              </div>
            ))}
          </div>
        </div>

        {[1, 2].map((i) => (
          <div key={i} className="space-y-2 border-b border-neutral-100 py-4 last:border-b-0">
            <div className="flex items-center gap-2">
              <div className="h-5 w-20 animate-pulse rounded bg-neutral-200" />
              <div className="h-5 w-16 animate-pulse rounded bg-neutral-200" />
            </div>
            <div className="h-4 w-32 animate-pulse rounded bg-neutral-200" />
            <div className="h-16 w-full animate-pulse rounded bg-neutral-200" />
          </div>
        ))}
      </Card>
    </section>
  )
}

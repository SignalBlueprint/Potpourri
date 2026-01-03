import { type ReactNode } from 'react'

// =============================================================================
// Skeleton - Reusable loading skeleton primitives
// =============================================================================

interface SkeletonProps {
  className?: string
}

/**
 * Base skeleton component with pulse animation
 */
export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded bg-neutral-200 ${className}`}
      aria-hidden="true"
    />
  )
}

/**
 * Text line skeleton for paragraph placeholders
 */
export function SkeletonText({ className = '' }: SkeletonProps) {
  return <Skeleton className={`h-4 ${className}`} />
}

/**
 * Heading skeleton for title placeholders
 */
export function SkeletonHeading({ className = '' }: SkeletonProps) {
  return <Skeleton className={`h-6 ${className}`} />
}

/**
 * Circle skeleton for avatars/icons
 */
export function SkeletonCircle({ className = '' }: SkeletonProps) {
  return <Skeleton className={`rounded-full ${className}`} />
}

/**
 * Image skeleton with aspect ratio
 */
interface SkeletonImageProps extends SkeletonProps {
  aspectRatio?: 'square' | '16/9' | '4/3' | 'auto'
}

export function SkeletonImage({ className = '', aspectRatio = 'square' }: SkeletonImageProps) {
  const aspectClasses = {
    square: 'aspect-square',
    '16/9': 'aspect-video',
    '4/3': 'aspect-[4/3]',
    auto: '',
  }

  return (
    <div
      className={`animate-pulse bg-gradient-to-br from-neutral-100 to-neutral-200 ${aspectClasses[aspectRatio]} ${className}`}
      aria-hidden="true"
    />
  )
}

/**
 * Button skeleton
 */
export function SkeletonButton({ className = '' }: SkeletonProps) {
  return <Skeleton className={`h-10 rounded-lg ${className}`} />
}

/**
 * Card skeleton container with children
 */
interface SkeletonCardProps extends SkeletonProps {
  children?: ReactNode
}

export function SkeletonCard({ className = '', children }: SkeletonCardProps) {
  return (
    <div
      className={`animate-pulse overflow-hidden rounded-xl border border-neutral-100 bg-white shadow-card ${className}`}
      aria-hidden="true"
    >
      {children}
    </div>
  )
}

/**
 * Badge skeleton
 */
export function SkeletonBadge({ className = '' }: SkeletonProps) {
  return <Skeleton className={`h-6 w-16 rounded-full ${className}`} />
}

/**
 * Wrapper to disable animations (useful for reduced motion preferences)
 */
interface SkeletonGroupProps {
  children: ReactNode
  className?: string
}

export function SkeletonGroup({ children, className = '' }: SkeletonGroupProps) {
  return (
    <div className={className} role="status" aria-label="Loading...">
      {children}
      <span className="sr-only">Loading...</span>
    </div>
  )
}

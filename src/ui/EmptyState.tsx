import { type ReactNode } from 'react'
import { Button } from './index'

// =============================================================================
// EmptyState - Reusable component for empty/no-results states
// =============================================================================

export interface EmptyStateProps {
  /** Icon to display (emoji or React node) */
  icon?: ReactNode
  /** Main heading */
  title: string
  /** Descriptive message */
  message: string
  /** Optional action button text */
  actionLabel?: string
  /** Optional action callback */
  onAction?: () => void
  /** Additional CSS classes */
  className?: string
}

export function EmptyState({
  icon = '📭',
  title,
  message,
  actionLabel,
  onAction,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-16 text-center ${className}`}
    >
      <div className="mb-4 text-6xl">{icon}</div>
      <h3 className="mb-2 text-lg font-semibold text-neutral-900">{title}</h3>
      <p className="mb-6 max-w-md text-neutral-600">{message}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary" size="md">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

// =============================================================================
// CatalogEmptyState - Specialized empty state for catalog search/filter results
// =============================================================================

export interface CatalogEmptyStateProps {
  /** Current search query */
  search: string
  /** Current selected category */
  category: string | null
  /** Callback to clear all filters */
  onClearFilters: () => void
}

export function CatalogEmptyState({
  search,
  category,
  onClearFilters,
}: CatalogEmptyStateProps) {
  const getMessage = () => {
    if (search && category) {
      return `We couldn't find any products matching "${search}" in ${category}.`
    }
    if (search) {
      return `We couldn't find any products matching "${search}".`
    }
    if (category) {
      return `No products available in ${category} right now.`
    }
    return 'No products are currently available.'
  }

  return (
    <EmptyState
      icon="🔍"
      title="No products found"
      message={getMessage()}
      actionLabel="Clear Filters"
      onAction={onClearFilters}
    />
  )
}

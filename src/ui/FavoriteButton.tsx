import { useFavorites } from '../hooks/useFavorites'

// =============================================================================
// FavoriteButton - Heart icon toggle button for wishlist
// =============================================================================

interface FavoriteButtonProps {
  productId: string
  /** Size variant */
  size?: 'sm' | 'md' | 'lg'
  /** Optional className for positioning */
  className?: string
  /** Show label text next to icon */
  showLabel?: boolean
}

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
}

const iconSizes = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
}

export function FavoriteButton({
  productId,
  size = 'md',
  className = '',
  showLabel = false,
}: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const isActive = isFavorite(productId)

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(productId)
  }

  if (showLabel) {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`
          inline-flex items-center justify-center gap-2
          rounded-lg px-4 py-2.5 text-sm font-medium
          transition-all duration-200 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2
          ${
            isActive
              ? 'bg-red-50 text-red-600 hover:bg-red-100'
              : 'border border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-100 hover:border-neutral-300'
          }
          ${className}
        `}
        aria-label={isActive ? 'Remove from favorites' : 'Add to favorites'}
        aria-pressed={isActive}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={iconSizes[size]}
          fill={isActive ? 'currentColor' : 'none'}
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
        {isActive ? 'Saved' : 'Save'}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`
        inline-flex items-center justify-center
        rounded-full
        transition-all duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2
        ${sizeClasses[size]}
        ${
          isActive
            ? 'bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600'
            : 'bg-white/90 text-neutral-400 hover:bg-white hover:text-red-500 shadow-sm'
        }
        ${className}
      `}
      aria-label={isActive ? 'Remove from favorites' : 'Add to favorites'}
      aria-pressed={isActive}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={iconSizes[size]}
        fill={isActive ? 'currentColor' : 'none'}
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
    </button>
  )
}

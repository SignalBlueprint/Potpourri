import { useCompare } from '../hooks/useCompare'

interface CompareButtonProps {
  productId: string
  className?: string
  variant?: 'icon' | 'button'
}

export function CompareButton({ productId, className = '', variant = 'icon' }: CompareButtonProps) {
  const { isComparing, toggleCompare, canAdd } = useCompare()
  const comparing = isComparing(productId)

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleCompare(productId)
  }

  const disabled = !comparing && !canAdd

  if (variant === 'button') {
    return (
      <button
        onClick={handleClick}
        disabled={disabled}
        className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
          comparing
            ? 'border-brand-primary bg-brand-primary/10 text-brand-primary'
            : disabled
            ? 'cursor-not-allowed border-neutral-200 bg-neutral-100 text-neutral-400'
            : 'border-neutral-200 bg-white text-neutral-700 hover:border-brand-primary hover:text-brand-primary'
        } ${className}`}
        title={disabled ? 'Maximum 4 products can be compared' : comparing ? 'Remove from compare' : 'Add to compare'}
      >
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
        {comparing ? 'Comparing' : 'Compare'}
      </button>
    )
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`rounded-full p-2 transition-colors ${
        comparing
          ? 'bg-brand-primary text-white'
          : disabled
          ? 'cursor-not-allowed bg-neutral-100 text-neutral-300'
          : 'bg-white/90 text-neutral-600 shadow-sm hover:bg-brand-primary hover:text-white'
      } ${className}`}
      title={disabled ? 'Maximum 4 products can be compared' : comparing ? 'Remove from compare' : 'Add to compare'}
      aria-label={comparing ? 'Remove from compare' : 'Add to compare'}
    >
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    </button>
  )
}

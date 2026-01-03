import { useState, useEffect, useCallback, useRef } from 'react'

// =============================================================================
// SearchInput - Reusable search input with debounced filtering
// =============================================================================

interface SearchInputProps {
  /** Current search value */
  value: string
  /** Callback when search value changes (debounced) */
  onChange: (value: string) => void
  /** Placeholder text */
  placeholder?: string
  /** Debounce delay in milliseconds (default: 300ms) */
  debounceMs?: number
  /** Additional CSS classes */
  className?: string
  /** Auto-focus on mount */
  autoFocus?: boolean
}

export function SearchInput({
  value,
  onChange,
  placeholder = 'Search...',
  debounceMs = 300,
  className = '',
  autoFocus = false,
}: SearchInputProps) {
  // Local state for immediate UI feedback
  const [localValue, setLocalValue] = useState(value)
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Sync local value when external value changes
  useEffect(() => {
    setLocalValue(value)
  }, [value])

  // Debounced change handler
  const handleChange = useCallback(
    (newValue: string) => {
      setLocalValue(newValue)

      // Clear any existing debounce timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }

      // Set new debounce timer
      debounceTimerRef.current = setTimeout(() => {
        onChange(newValue)
      }, debounceMs)
    },
    [onChange, debounceMs]
  )

  // Clear debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

  // Handle clear button click (immediate, no debounce)
  const handleClear = useCallback(() => {
    setLocalValue('')
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }
    onChange('')
  }, [onChange])

  return (
    <div className={`relative ${className}`}>
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <SearchIcon className="h-5 w-5 text-neutral-400" />
      </div>
      <input
        type="text"
        placeholder={placeholder}
        value={localValue}
        onChange={(e) => handleChange(e.target.value)}
        autoFocus={autoFocus}
        className="block w-full rounded-lg border border-neutral-200 bg-white py-2.5 pl-10 pr-10 text-neutral-900 placeholder:text-neutral-500 transition-colors duration-200 hover:border-neutral-300 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
      />
      {localValue && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400 hover:text-neutral-600 transition-colors"
          aria-label="Clear search"
        >
          <XIcon className="h-5 w-5" />
        </button>
      )}
    </div>
  )
}

// =============================================================================
// Icon Components
// =============================================================================

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  )
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  )
}

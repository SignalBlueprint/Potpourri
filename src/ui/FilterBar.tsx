import { useCallback, useState, useRef, useEffect } from 'react'
import { categories, categoryIcons, sortOptions, type SortOption } from '../data/mockProducts'

// =============================================================================
// FilterBar - Search, Category Pills, and Sort Dropdown
// =============================================================================

interface FilterBarProps {
  search: string
  onSearchChange: (search: string) => void
  selectedCategory: string | null
  onCategoryChange: (category: string | null) => void
  sort: SortOption
  onSortChange: (sort: SortOption) => void
  resultCount: number
  hideCategoryPills?: boolean
}

export function FilterBar({
  search,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  sort,
  onSortChange,
  resultCount,
  hideCategoryPills = false,
}: FilterBarProps) {
  const [isSticky, setIsSticky] = useState(false)
  const filterBarRef = useRef<HTMLDivElement>(null)

  // Sticky detection
  useEffect(() => {
    const handleScroll = () => {
      if (filterBarRef.current) {
        const rect = filterBarRef.current.getBoundingClientRect()
        setIsSticky(rect.top <= 0)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      ref={filterBarRef}
      className={`sticky top-0 z-20 -mx-4 px-4 py-4 transition-all duration-200 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 ${
        isSticky
          ? 'bg-white/95 shadow-soft backdrop-blur-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="space-y-4">
        {/* Top row: Search and Sort */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Search Input */}
          <div className="relative flex-1 sm:max-w-md">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <SearchIcon className="h-5 w-5 text-neutral-400" />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="block w-full rounded-lg border border-neutral-200 bg-white py-2.5 pl-10 pr-4 text-neutral-900 placeholder:text-neutral-500 transition-colors duration-200 hover:border-neutral-300 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
            />
            {search && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400 hover:text-neutral-600"
                aria-label="Clear search"
              >
                <XIcon className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-neutral-500">
              {resultCount} {resultCount === 1 ? 'product' : 'products'}
            </span>
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => onSortChange(e.target.value as SortOption)}
                className="appearance-none rounded-lg border border-neutral-200 bg-white py-2 pl-3 pr-10 text-sm font-medium text-neutral-700 transition-colors duration-200 hover:border-neutral-300 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronDownIcon className="h-5 w-5 text-neutral-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Category Pills - hidden on lg+ when sidebar is shown */}
        <div className={hideCategoryPills ? 'lg:hidden' : ''}>
          <CategoryPills
            selectedCategory={selectedCategory}
            onCategoryChange={onCategoryChange}
          />
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// CategoryPills - Horizontal scrollable category chips
// =============================================================================

interface CategoryPillsProps {
  selectedCategory: string | null
  onCategoryChange: (category: string | null) => void
}

function CategoryPills({ selectedCategory, onCategoryChange }: CategoryPillsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [showLeftFade, setShowLeftFade] = useState(false)
  const [showRightFade, setShowRightFade] = useState(false)

  const checkScroll = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setShowLeftFade(scrollLeft > 0)
      setShowRightFade(scrollLeft < scrollWidth - clientWidth - 1)
    }
  }, [])

  useEffect(() => {
    checkScroll()
    window.addEventListener('resize', checkScroll)
    return () => window.removeEventListener('resize', checkScroll)
  }, [checkScroll])

  return (
    <div className="relative">
      {/* Left fade indicator */}
      {showLeftFade && (
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-8 bg-gradient-to-r from-white to-transparent" />
      )}

      {/* Right fade indicator */}
      {showRightFade && (
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-8 bg-gradient-to-l from-white to-transparent" />
      )}

      {/* Scrollable container */}
      <div
        ref={scrollContainerRef}
        onScroll={checkScroll}
        className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {/* All category pill */}
        <CategoryPill
          label="All"
          icon="✨"
          isSelected={selectedCategory === null}
          onClick={() => onCategoryChange(null)}
        />

        {/* Individual category pills */}
        {categories.map((category) => (
          <CategoryPill
            key={category}
            label={category}
            icon={categoryIcons[category]}
            isSelected={selectedCategory === category}
            onClick={() => onCategoryChange(category)}
          />
        ))}
      </div>
    </div>
  )
}

// =============================================================================
// CategoryPill - Individual category chip
// =============================================================================

interface CategoryPillProps {
  label: string
  icon: string
  isSelected: boolean
  onClick: () => void
}

function CategoryPill({ label, icon, isSelected, onClick }: CategoryPillProps) {
  return (
    <button
      onClick={onClick}
      className={`
        flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2
        text-sm font-medium transition-all duration-200
        ${
          isSelected
            ? 'bg-brand-primary text-white shadow-sm'
            : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
        }
      `}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  )
}

// =============================================================================
// FilterBarSkeleton - Loading placeholder
// =============================================================================

export function FilterBarSkeleton() {
  return (
    <div className="animate-pulse space-y-4 py-4">
      {/* Search and sort row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="h-11 w-full rounded-lg bg-neutral-200 sm:max-w-md" />
        <div className="flex items-center gap-3">
          <div className="h-5 w-20 rounded bg-neutral-200" />
          <div className="h-10 w-32 rounded-lg bg-neutral-200" />
        </div>
      </div>

      {/* Category pills */}
      <div className="flex gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-9 w-24 shrink-0 rounded-full bg-neutral-200" />
        ))}
      </div>
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

function ChevronDownIcon({ className }: { className?: string }) {
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
        d="M19 9l-7 7-7-7"
      />
    </svg>
  )
}

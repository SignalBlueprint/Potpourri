import { categories, categoryIcons, type Category, type Product } from '../data/mockProducts'

interface CategoryNavProps {
  selectedCategory: string | null
  onCategoryChange: (category: string | null) => void
  products: Product[]
}

export function CategoryNav({
  selectedCategory,
  onCategoryChange,
  products,
}: CategoryNavProps) {
  // Calculate product counts per category
  const categoryCounts = categories.reduce(
    (acc, category) => {
      acc[category] = products.filter((p) => p.category === category).length
      return acc
    },
    {} as Record<Category, number>
  )

  const totalCount = products.length

  return (
    <nav className="w-full" aria-label="Product categories">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-neutral-500">
        Categories
      </h2>

      <ul className="space-y-1">
        {/* All Products */}
        <li>
          <button
            onClick={() => onCategoryChange(null)}
            className={`
              flex w-full items-center justify-between rounded-lg px-3 py-2.5
              text-left text-sm font-medium transition-all duration-200
              ${
                selectedCategory === null
                  ? 'bg-brand-primary text-white shadow-sm'
                  : 'text-neutral-700 hover:bg-neutral-100'
              }
            `}
            aria-current={selectedCategory === null ? 'page' : undefined}
          >
            <span className="flex items-center gap-2.5">
              <span className="text-base">✨</span>
              <span>All Products</span>
            </span>
            <span
              className={`
                rounded-full px-2 py-0.5 text-xs font-medium
                ${
                  selectedCategory === null
                    ? 'bg-white/20 text-white'
                    : 'bg-neutral-100 text-neutral-600'
                }
              `}
            >
              {totalCount}
            </span>
          </button>
        </li>

        {/* Individual Categories */}
        {categories.map((category) => (
          <li key={category}>
            <button
              onClick={() => onCategoryChange(category)}
              className={`
                flex w-full items-center justify-between rounded-lg px-3 py-2.5
                text-left text-sm font-medium transition-all duration-200
                ${
                  selectedCategory === category
                    ? 'bg-brand-primary text-white shadow-sm'
                    : 'text-neutral-700 hover:bg-neutral-100'
                }
              `}
              aria-current={selectedCategory === category ? 'page' : undefined}
            >
              <span className="flex items-center gap-2.5">
                <span className="text-base">{categoryIcons[category]}</span>
                <span>{category}</span>
              </span>
              <span
                className={`
                  rounded-full px-2 py-0.5 text-xs font-medium
                  ${
                    selectedCategory === category
                      ? 'bg-white/20 text-white'
                      : 'bg-neutral-100 text-neutral-600'
                  }
                `}
              >
                {categoryCounts[category]}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}

// Skeleton for loading state
export function CategoryNavSkeleton() {
  return (
    <nav className="w-full animate-pulse" aria-label="Loading categories">
      <div className="mb-4 h-4 w-24 rounded bg-neutral-200" />
      <ul className="space-y-1">
        {Array.from({ length: 9 }).map((_, i) => (
          <li key={i}>
            <div className="flex items-center justify-between rounded-lg px-3 py-2.5">
              <div className="flex items-center gap-2.5">
                <div className="h-5 w-5 rounded bg-neutral-200" />
                <div className="h-4 w-24 rounded bg-neutral-200" />
              </div>
              <div className="h-5 w-8 rounded-full bg-neutral-200" />
            </div>
          </li>
        ))}
      </ul>
    </nav>
  )
}

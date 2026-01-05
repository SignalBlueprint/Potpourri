import { createRoute, Link } from '@tanstack/react-router'
import { rootRoute } from '../app'
import { Container, Button } from '../ui/index'
import { useCompare } from '../hooks/useCompare'
import { mockProducts, getPrimaryImageUrl, type Product } from '../data/mockProducts'
import { useFavorites } from '../hooks/useFavorites'
import { SEO } from '../components/SEO'

export const compareRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/compare',
  component: ComparePage,
})

// Comparison attributes to display
const comparisonAttributes: { key: keyof Product | 'stockLabel'; label: string; format?: (value: unknown) => string }[] = [
  { key: 'price', label: 'Price', format: (v) => `$${(v as number).toFixed(2)}` },
  { key: 'category', label: 'Category' },
  { key: 'stockLabel', label: 'Availability' },
  { key: 'isNew', label: 'New Arrival', format: (v) => (v ? 'Yes' : 'No') },
  { key: 'isFeatured', label: 'Featured', format: (v) => (v ? 'Yes' : 'No') },
]

function getStockLabel(stock: Product['stock']): string {
  switch (stock) {
    case 'in_stock':
      return 'In Stock'
    case 'low_stock':
      return 'Low Stock'
    case 'out_of_stock':
      return 'Out of Stock'
    default:
      return 'Unknown'
  }
}

function ComparePage() {
  const { compareIds, removeFromCompare, clearCompare } = useCompare()
  const { toggleFavorite, isFavorite } = useFavorites()

  const compareProducts = compareIds
    .map((id) => mockProducts.find((p) => p.id === id))
    .filter((p): p is Product => p !== undefined)

  if (compareProducts.length === 0) {
    return (
      <>
        <SEO title="Compare Products" description="Compare products side by side" />
        <main className="py-12">
          <Container>
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-neutral-100">
                <svg className="h-10 w-10 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h1 className="mb-2 text-2xl font-bold text-neutral-900">No Products to Compare</h1>
              <p className="mb-6 text-neutral-600">
                Add products to compare by clicking the compare icon on product cards.
              </p>
              <Link to="/catalog">
                <Button>Browse Products</Button>
              </Link>
            </div>
          </Container>
        </main>
      </>
    )
  }

  return (
    <>
      <SEO title="Compare Products" description="Compare products side by side" />
      <main className="py-8">
        <Container>
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">Compare Products</h1>
              <p className="text-neutral-600">Comparing {compareProducts.length} products</p>
            </div>
            <button
              onClick={clearCompare}
              className="text-sm text-neutral-500 hover:text-red-600"
            >
              Clear all
            </button>
          </div>

          {/* Comparison Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse">
              {/* Product Images & Names */}
              <thead>
                <tr>
                  <th className="w-40 border-b border-neutral-200 bg-neutral-50 p-4 text-left text-sm font-medium text-neutral-600">
                    Product
                  </th>
                  {compareProducts.map((product) => (
                    <th
                      key={product.id}
                      className="border-b border-neutral-200 bg-neutral-50 p-4 text-center"
                    >
                      <div className="relative inline-block">
                        <button
                          onClick={() => removeFromCompare(product.id)}
                          className="absolute -right-2 -top-2 rounded-full bg-neutral-800 p-1 text-white hover:bg-red-600"
                          aria-label={`Remove ${product.name}`}
                        >
                          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                        <Link to="/item/$itemId" params={{ itemId: product.id }}>
                          <div className="mx-auto mb-3 h-32 w-32 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100">
                            {getPrimaryImageUrl(product) ? (
                              <img
                                src={getPrimaryImageUrl(product)!}
                                alt={product.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-neutral-400">
                                <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <h3 className="line-clamp-2 text-sm font-semibold text-neutral-900 hover:text-brand-primary">
                            {product.name}
                          </h3>
                        </Link>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Comparison Rows */}
              <tbody>
                {comparisonAttributes.map((attr) => (
                  <tr key={attr.key}>
                    <td className="border-b border-neutral-200 p-4 text-sm font-medium text-neutral-600">
                      {attr.label}
                    </td>
                    {compareProducts.map((product) => {
                      let value: unknown
                      if (attr.key === 'stockLabel') {
                        value = getStockLabel(product.stock)
                      } else {
                        value = product[attr.key as keyof Product]
                      }
                      const displayValue = attr.format ? attr.format(value) : String(value)

                      return (
                        <td
                          key={product.id}
                          className="border-b border-neutral-200 p-4 text-center text-sm text-neutral-900"
                        >
                          {attr.key === 'stockLabel' ? (
                            <span
                              className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                                product.stock === 'in_stock'
                                  ? 'bg-green-100 text-green-800'
                                  : product.stock === 'low_stock'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {displayValue}
                            </span>
                          ) : attr.key === 'price' ? (
                            <span className="font-semibold text-brand-primary">{displayValue}</span>
                          ) : (
                            displayValue
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}

                {/* Description Row */}
                <tr>
                  <td className="border-b border-neutral-200 p-4 text-sm font-medium text-neutral-600">
                    Description
                  </td>
                  {compareProducts.map((product) => (
                    <td
                      key={product.id}
                      className="border-b border-neutral-200 p-4 text-left text-sm text-neutral-700"
                    >
                      <p className="line-clamp-3">{product.description}</p>
                    </td>
                  ))}
                </tr>

                {/* Actions Row */}
                <tr>
                  <td className="p-4 text-sm font-medium text-neutral-600">Actions</td>
                  {compareProducts.map((product) => (
                    <td key={product.id} className="p-4 text-center">
                      <div className="flex flex-col gap-2">
                        <Link to="/item/$itemId" params={{ itemId: product.id }}>
                          <Button size="sm" className="w-full">
                            View Details
                          </Button>
                        </Link>
                        <button
                          onClick={() => toggleFavorite(product.id)}
                          className={`inline-flex w-full items-center justify-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                            isFavorite(product.id)
                              ? 'border-red-200 bg-red-50 text-red-600'
                              : 'border-neutral-200 text-neutral-700 hover:border-red-200 hover:bg-red-50 hover:text-red-600'
                          }`}
                        >
                          <svg
                            className="h-4 w-4"
                            fill={isFavorite(product.id) ? 'currentColor' : 'none'}
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                          </svg>
                          {isFavorite(product.id) ? 'Favorited' : 'Add to Favorites'}
                        </button>
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Add more products hint */}
          {compareProducts.length < 4 && (
            <div className="mt-8 rounded-lg border border-dashed border-neutral-300 bg-neutral-50 p-6 text-center">
              <p className="text-neutral-600">
                You can compare up to 4 products.{' '}
                <Link to="/catalog" className="text-brand-primary hover:underline">
                  Browse more products
                </Link>
              </p>
            </div>
          )}
        </Container>
      </main>
    </>
  )
}

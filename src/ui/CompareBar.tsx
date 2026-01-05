import { Link } from '@tanstack/react-router'
import { useCompare } from '../hooks/useCompare'
import { mockProducts, getPrimaryImageUrl } from '../data/mockProducts'

export function CompareBar() {
  const { compareIds, removeFromCompare, clearCompare, count } = useCompare()

  if (count === 0) return null

  const compareProducts = compareIds
    .map((id) => mockProducts.find((p) => p.id === id))
    .filter(Boolean)

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-neutral-200 bg-white shadow-lg">
      <div className="mx-auto flex max-w-container items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        {/* Product previews */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-neutral-700">
            Compare ({count}/4):
          </span>
          <div className="flex gap-2">
            {compareProducts.map((product) => (
              <div key={product!.id} className="relative">
                <div className="h-12 w-12 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100">
                  {getPrimaryImageUrl(product!) ? (
                    <img
                      src={getPrimaryImageUrl(product!)!}
                      alt={product!.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-neutral-400">
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => removeFromCompare(product!.id)}
                  className="absolute -right-1 -top-1 rounded-full bg-neutral-800 p-0.5 text-white hover:bg-red-600"
                  aria-label={`Remove ${product!.name} from compare`}
                >
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={clearCompare}
            className="text-sm text-neutral-500 hover:text-neutral-700"
          >
            Clear all
          </button>
          <Link
            to="/compare"
            className="inline-flex items-center gap-2 rounded-lg bg-brand-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-primary/90"
          >
            Compare Now
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}

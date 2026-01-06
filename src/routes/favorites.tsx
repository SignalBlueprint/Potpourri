import { createRoute, Link } from '@tanstack/react-router'
import { rootRoute } from '../app'
import { Container, PageHeader, Button } from '../ui'
import { SEO } from '../components/SEO'
import { ProductCard } from '../ui/ProductCard'
import { useFavorites } from '../hooks/useFavorites'
import { mockProducts } from '../data/mockProducts'

export const favoritesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/favorites',
  component: FavoritesPage,
})

function FavoritesPage() {
  const { favoriteIds, clearFavorites, count } = useFavorites()

  // Get favorite products in order they were added
  const favoriteProducts = favoriteIds
    .map((id) => mockProducts.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => p !== undefined)

  return (
    <>
      <SEO
        title="My Favorites"
        description="View and manage your saved favorite products."
      />
      <Container>
        <div className="flex items-start justify-between gap-4">
          <PageHeader
            title="My Favorites"
            subtitle={count > 0 ? `${count} saved item${count !== 1 ? 's' : ''}` : undefined}
          />
          {count > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="mt-8 text-neutral-500 hover:text-red-500"
              onClick={clearFavorites}
            >
              Clear all
            </Button>
          )}
        </div>

        {count === 0 ? (
          <EmptyFavorites />
        ) : (
          <div className="grid gap-6 pb-16 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {favoriteProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </Container>
    </>
  )
}

function EmptyFavorites() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-neutral-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </div>
      <h2 className="mb-2 text-xl font-semibold text-neutral-900">No favorites yet</h2>
      <p className="mb-6 max-w-sm text-neutral-600">
        Start adding items to your favorites by clicking the heart icon on any product.
      </p>
      <Link
        to="/catalog"
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-primary px-6 py-3 text-sm font-medium text-white shadow-soft transition-all duration-200 hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
      >
        Browse Products
      </Link>
    </div>
  )
}

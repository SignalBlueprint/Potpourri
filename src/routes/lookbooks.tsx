import { useState, useEffect } from 'react'
import { createRoute, Link } from '@tanstack/react-router'
import { rootRoute } from '../app'
import { Container, PageHeader, Button, Badge } from '../ui'
import { SEO } from '../components/SEO'
import type { Lookbook } from '../types/images'
import { getPublishedLookbooks } from '../api/imageStorage'

export const lookbooksRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/lookbooks',
  component: LookbooksPage,
})

function LookbooksPage() {
  const [lookbooks, setLookbooks] = useState<Lookbook[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getPublishedLookbooks()
      .then(setLookbooks)
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <>
      <SEO
        title="Lookbooks"
        description="Browse our curated product lookbooks and collections"
      />
      <Container>
        <PageHeader
          title="Lookbooks"
          subtitle="Explore our curated collections and product showcases"
        />

        {isLoading ? (
          <LookbooksGridSkeleton />
        ) : lookbooks.length === 0 ? (
          <EmptyLookbooks />
        ) : (
          <div className="grid gap-6 pb-16 sm:grid-cols-2 lg:grid-cols-3">
            {lookbooks.map((lookbook) => (
              <LookbookCard key={lookbook.id} lookbook={lookbook} />
            ))}
          </div>
        )}
      </Container>
    </>
  )
}

// =============================================================================
// LookbookCard
// =============================================================================

interface LookbookCardProps {
  lookbook: Lookbook
}

function LookbookCard({ lookbook }: LookbookCardProps) {
  const coverUrl = lookbook.coverImage?.url || lookbook.pages[0]?.images[0]?.url

  return (
    <Link
      to="/lookbook/$id"
      params={{ id: lookbook.id }}
      className="group block overflow-hidden rounded-xl bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
    >
      {/* Cover Image */}
      <div className="aspect-[4/3] overflow-hidden bg-neutral-100">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={lookbook.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-200">
            <svg
              className="h-16 w-16 text-neutral-300"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="mb-1 font-semibold text-neutral-900 transition-colors group-hover:text-brand-primary">
          {lookbook.name}
        </h3>
        {lookbook.description && (
          <p className="mb-2 line-clamp-2 text-sm text-neutral-600">
            {lookbook.description}
          </p>
        )}
        <div className="flex items-center gap-2 text-xs text-neutral-500">
          <Badge variant="default">{lookbook.pages.length} pages</Badge>
          <span>
            {new Date(lookbook.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </Link>
  )
}

// =============================================================================
// Empty State
// =============================================================================

function EmptyLookbooks() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 rounded-full bg-neutral-100 p-4">
        <svg
          className="h-12 w-12 text-neutral-400"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
          />
        </svg>
      </div>
      <h2 className="mb-2 text-xl font-semibold text-neutral-900">No Lookbooks Yet</h2>
      <p className="mb-6 max-w-md text-neutral-600">
        Our lookbooks are coming soon! Check back later to see our curated product collections.
      </p>
      <Link to="/catalog">
        <Button>Browse Products</Button>
      </Link>
    </div>
  )
}

// =============================================================================
// Skeleton
// =============================================================================

function LookbooksGridSkeleton() {
  return (
    <div className="grid gap-6 pb-16 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse overflow-hidden rounded-xl bg-white shadow-card"
        >
          <div className="aspect-[4/3] bg-gradient-to-br from-neutral-100 to-neutral-200" />
          <div className="space-y-2 p-4">
            <div className="h-5 w-3/4 rounded bg-neutral-200" />
            <div className="h-4 w-full rounded bg-neutral-200" />
            <div className="flex items-center gap-2">
              <div className="h-5 w-16 rounded-full bg-neutral-200" />
              <div className="h-4 w-20 rounded bg-neutral-200" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

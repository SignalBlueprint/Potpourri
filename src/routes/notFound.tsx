import { createRoute, Link } from '@tanstack/react-router'
import { rootRoute } from '../app'
import { Container, Button } from '../ui'
import { SEO } from '../components/SEO'

export const notFoundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '*',
  component: NotFoundPage,
})

function NotFoundPage() {
  return (
    <>
      <SEO
        title="Page Not Found"
        description="The page you're looking for doesn't exist or has been moved."
      />
      <Container>
        <div className="flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
          {/* 404 Illustration */}
          <div className="mb-8">
            <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-brand-accent/20">
              <NotFoundIcon />
            </div>
          </div>

          {/* Error Code */}
          <h1 className="mb-2 text-6xl font-bold tracking-tight text-neutral-900 sm:text-8xl">
            404
          </h1>

          {/* Message */}
          <h2 className="mb-4 text-xl font-semibold text-neutral-700 sm:text-2xl">
            Page Not Found
          </h2>
          <p className="mb-8 max-w-md text-neutral-600">
            Sorry, we couldn't find the page you're looking for. It might have
            been moved, deleted, or never existed.
          </p>

          {/* Navigation Options */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link to="/">
              <Button size="lg">
                <HomeIcon />
                Go Home
              </Button>
            </Link>
            <Link to="/catalog">
              <Button variant="secondary" size="lg">
                <ShopIcon />
                Browse Catalog
              </Button>
            </Link>
          </div>

          {/* Helpful Links */}
          <div className="mt-12 border-t border-neutral-200 pt-8">
            <p className="mb-4 text-sm text-neutral-500">
              Looking for something specific?
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link
                to="/catalog"
                className="text-brand-primary hover:underline"
              >
                Shop All Products
              </Link>
              <span className="text-neutral-300">•</span>
              <Link
                to="/contact"
                className="text-brand-primary hover:underline"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </>
  )
}

// =============================================================================
// Icons
// =============================================================================

function NotFoundIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-16 w-16 text-brand-primary"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  )
}

function HomeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
      />
    </svg>
  )
}

function ShopIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
      />
    </svg>
  )
}

import { useState, useEffect, useCallback } from 'react'
import { createRoute, Link } from '@tanstack/react-router'
import { rootRoute } from '../app'
import { Container, Button } from '../ui'
import { SEO } from '../components/SEO'
import type { Lookbook, LookbookPage } from '../types/images'
import { getLookbook } from '../api/imageStorage'
import { getImageTypeLabel } from '../types/images'

export const lookbookRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/lookbook/$id',
  component: LookbookViewerPage,
})

function LookbookViewerPage() {
  const { id } = lookbookRoute.useParams()
  const [lookbook, setLookbook] = useState<Lookbook | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    getLookbook(id)
      .then((lb) => setLookbook(lb || null))
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [id])

  const goToPage = useCallback((index: number) => {
    if (lookbook && index >= 0 && index < lookbook.pages.length) {
      setCurrentPageIndex(index)
    }
  }, [lookbook])

  const goToPrevious = useCallback(() => {
    goToPage(currentPageIndex - 1)
  }, [currentPageIndex, goToPage])

  const goToNext = useCallback(() => {
    goToPage(currentPageIndex + 1)
  }, [currentPageIndex, goToPage])

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') {
        goToPrevious()
      } else if (e.key === 'ArrowRight') {
        goToNext()
      } else if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [goToPrevious, goToNext, isFullscreen])

  if (isLoading) {
    return (
      <Container>
        <LookbookViewerSkeleton />
      </Container>
    )
  }

  if (!lookbook) {
    return (
      <Container>
        <div className="flex min-h-[50vh] flex-col items-center justify-center py-16 text-center">
          <span className="mb-4 text-6xl">📖</span>
          <h1 className="mb-2 text-2xl font-semibold text-neutral-900">Lookbook Not Found</h1>
          <p className="mb-6 text-neutral-600">
            We couldn't find the lookbook you're looking for.
          </p>
          <Link to="/lookbooks">
            <Button>Browse Lookbooks</Button>
          </Link>
        </div>
      </Container>
    )
  }

  const currentPage = lookbook.pages[currentPageIndex]
  const hasPrevious = currentPageIndex > 0
  const hasNext = currentPageIndex < lookbook.pages.length - 1

  if (!currentPage) {
    return null
  }

  return (
    <>
      <SEO
        title={lookbook.name}
        description={lookbook.description || `View ${lookbook.name} lookbook`}
        image={lookbook.coverImage?.url}
      />

      {isFullscreen ? (
        <FullscreenViewer
          page={currentPage}
          pageIndex={currentPageIndex}
          totalPages={lookbook.pages.length}
          onClose={() => setIsFullscreen(false)}
          onPrevious={goToPrevious}
          onNext={goToNext}
          hasPrevious={hasPrevious}
          hasNext={hasNext}
        />
      ) : (
        <Container>
          {/* Header */}
          <div className="mb-8 flex items-start justify-between">
            <div>
              <Link
                to="/lookbooks"
                className="mb-2 inline-flex items-center gap-1 text-sm text-neutral-600 transition-colors hover:text-brand-primary"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
                All Lookbooks
              </Link>
              <h1 className="text-3xl font-semibold text-neutral-900">{lookbook.name}</h1>
              {lookbook.description && (
                <p className="mt-2 text-neutral-600">{lookbook.description}</p>
              )}
            </div>
            <Button
              variant="secondary"
              onClick={() => setIsFullscreen(true)}
              className="flex items-center gap-2"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
              </svg>
              Fullscreen
            </Button>
          </div>

          {/* Current Page */}
          <div className="mb-8">
            {currentPage && <LookbookPageView page={currentPage} />}
          </div>

          {/* Page Navigation */}
          <div className="mb-8 flex items-center justify-between">
            <Button
              variant="secondary"
              onClick={goToPrevious}
              disabled={!hasPrevious}
              className="flex items-center gap-2"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
              Previous
            </Button>

            <div className="text-sm text-neutral-600">
              Page {currentPageIndex + 1} of {lookbook.pages.length}
            </div>

            <Button
              variant="secondary"
              onClick={goToNext}
              disabled={!hasNext}
              className="flex items-center gap-2"
            >
              Next
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </Button>
          </div>

          {/* Page Thumbnails */}
          {lookbook.pages.length > 1 && (
            <div className="mb-16">
              <h3 className="mb-4 text-sm font-medium text-neutral-700">Pages</h3>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {lookbook.pages.map((page, index) => (
                  <button
                    key={page.id}
                    onClick={() => goToPage(index)}
                    className={`
                      flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all
                      ${index === currentPageIndex
                        ? 'border-brand-primary ring-2 ring-brand-primary/20'
                        : 'border-transparent hover:border-neutral-300'}
                    `}
                  >
                    <div className="h-20 w-28 bg-neutral-100">
                      {page.images[0]?.url ? (
                        <img
                          src={page.images[0].url}
                          alt={page.title || `Page ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-neutral-400">
                          {index + 1}
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </Container>
      )}
    </>
  )
}

// =============================================================================
// LookbookPageView - Renders a single page with its layout
// =============================================================================

interface LookbookPageViewProps {
  page: LookbookPage
}

function LookbookPageView({ page }: LookbookPageViewProps) {
  const layoutClasses: Record<LookbookPage['layout'], string> = {
    hero: 'grid-cols-1',
    'grid-2': 'grid-cols-1 sm:grid-cols-2',
    'grid-3': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    'grid-4': 'grid-cols-2 lg:grid-cols-4',
    masonry: 'grid-cols-2 lg:grid-cols-3',
    split: 'grid-cols-1 lg:grid-cols-2',
  }

  return (
    <div
      className="rounded-xl p-6"
      style={{ backgroundColor: page.backgroundColor || '#fafafa' }}
    >
      {/* Page Title */}
      {(page.title || page.subtitle) && (
        <div className="mb-6 text-center">
          {page.title && (
            <h2
              className="text-2xl font-semibold"
              style={{ color: page.textColor || '#1a1a1a' }}
            >
              {page.title}
            </h2>
          )}
          {page.subtitle && (
            <p
              className="mt-1 text-lg"
              style={{ color: page.textColor ? `${page.textColor}99` : '#666' }}
            >
              {page.subtitle}
            </p>
          )}
        </div>
      )}

      {/* Images Grid */}
      <div className={`grid gap-4 ${layoutClasses[page.layout]}`}>
        {page.images.map((image, index) => (
          <div
            key={image.id}
            className={`
              group relative overflow-hidden rounded-lg bg-white shadow-sm
              ${page.layout === 'hero' ? 'aspect-[16/9]' : 'aspect-square'}
            `}
          >
            <img
              src={image.url}
              alt={`Image ${index + 1}`}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {image.type !== 'original' && (
              <div className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-1 text-xs text-white">
                {getImageTypeLabel(image.type)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// =============================================================================
// FullscreenViewer
// =============================================================================

interface FullscreenViewerProps {
  page: LookbookPage
  pageIndex: number
  totalPages: number
  onClose: () => void
  onPrevious: () => void
  onNext: () => void
  hasPrevious: boolean
  hasNext: boolean
}

function FullscreenViewer({
  page,
  pageIndex,
  totalPages,
  onClose,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
}: FullscreenViewerProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="text-white">
          {page.title && <span className="font-medium">{page.title}</span>}
          <span className="ml-2 text-white/60">
            {pageIndex + 1} / {totalPages}
          </span>
        </div>
        <button
          onClick={onClose}
          className="rounded-full p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-1 items-center justify-center overflow-hidden p-4">
        <LookbookPageView page={page} />
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between px-4 py-3">
        <button
          onClick={onPrevious}
          disabled={!hasPrevious}
          className="flex items-center gap-2 rounded-lg px-4 py-2 text-white transition-colors hover:bg-white/10 disabled:opacity-30"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
          Previous
        </button>

        <div className="text-sm text-white/60">
          Use arrow keys to navigate
        </div>

        <button
          onClick={onNext}
          disabled={!hasNext}
          className="flex items-center gap-2 rounded-lg px-4 py-2 text-white transition-colors hover:bg-white/10 disabled:opacity-30"
        >
          Next
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>
    </div>
  )
}

// =============================================================================
// Skeleton
// =============================================================================

function LookbookViewerSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-2 h-4 w-24 rounded bg-neutral-200" />
        <div className="h-8 w-64 rounded bg-neutral-200" />
        <div className="mt-2 h-5 w-96 rounded bg-neutral-200" />
      </div>

      {/* Page Content */}
      <div className="mb-8 rounded-xl bg-neutral-100 p-6">
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-lg bg-neutral-200" />
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <div className="h-10 w-24 rounded-lg bg-neutral-200" />
        <div className="h-5 w-20 rounded bg-neutral-200" />
        <div className="h-10 w-24 rounded-lg bg-neutral-200" />
      </div>
    </div>
  )
}

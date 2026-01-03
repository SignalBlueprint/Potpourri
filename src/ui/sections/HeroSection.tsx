import { Link } from '@tanstack/react-router'
import { Button } from '../index'
import { clientConfig } from '../../client.config'

function GiftBoxIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="8"
        y="24"
        width="48"
        height="32"
        rx="4"
        className="fill-brand-accent/30 stroke-brand-primary"
        strokeWidth="2"
      />
      <rect
        x="4"
        y="16"
        width="56"
        height="12"
        rx="3"
        className="fill-brand-primary/20 stroke-brand-primary"
        strokeWidth="2"
      />
      <path
        d="M32 16V56"
        className="stroke-brand-accent"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M20 16C20 16 24 8 32 8C40 8 44 16 44 16"
        className="stroke-brand-accent"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="32" cy="8" r="3" className="fill-brand-accent" />
    </svg>
  )
}

function VaseIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16 12C16 12 12 20 12 32C12 44 16 56 24 56C32 56 36 44 36 32C36 20 32 12 32 12"
        className="fill-brand-accent/25 stroke-brand-primary"
        strokeWidth="2"
      />
      <rect
        x="14"
        y="6"
        width="20"
        height="8"
        rx="2"
        className="fill-brand-primary/30 stroke-brand-primary"
        strokeWidth="2"
      />
      <path
        d="M20 6C20 6 22 0 24 0C26 0 28 6 28 6"
        className="stroke-brand-accent"
        strokeWidth="2"
        fill="none"
      />
      <ellipse cx="18" cy="4" rx="3" ry="2" className="fill-brand-accent/60" />
      <ellipse cx="30" cy="4" rx="3" ry="2" className="fill-brand-accent/60" />
    </svg>
  )
}

function CandleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="4"
        y="20"
        width="24"
        height="40"
        rx="4"
        className="fill-brand-accent/20 stroke-brand-primary"
        strokeWidth="2"
      />
      <rect
        x="14"
        y="14"
        width="4"
        height="8"
        className="fill-brand-primary/40"
      />
      <ellipse
        cx="16"
        cy="10"
        rx="4"
        ry="6"
        className="fill-brand-accent/80"
      />
      <ellipse cx="16" cy="8" rx="2" ry="3" className="fill-yellow-400/60" />
    </svg>
  )
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2L14.5 9H22L16 14L18.5 22L12 17L5.5 22L8 14L2 9H9.5L12 2Z"
        className="fill-brand-accent/40"
      />
    </svg>
  )
}

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-24 lg:py-28">
      {/* Decorative background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/10 via-transparent to-brand-primary/5" />
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-brand-accent/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-brand-primary/10 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-accent/5 blur-3xl" />
      </div>

      {/* Floating decorative icons */}
      <div className="pointer-events-none absolute inset-0 -z-5 hidden lg:block" aria-hidden="true">
        <GiftBoxIcon className="absolute left-[8%] top-[15%] h-16 w-16 animate-float opacity-60" />
        <VaseIcon className="absolute right-[10%] top-[20%] h-14 w-12 animate-float-delayed opacity-50" />
        <CandleIcon className="absolute bottom-[20%] left-[12%] h-16 w-8 animate-float-slow opacity-50" />
        <GiftBoxIcon className="absolute bottom-[25%] right-[8%] h-12 w-12 animate-float-delayed opacity-40" />
        <StarIcon className="absolute left-[20%] top-[40%] h-6 w-6 animate-pulse opacity-40" />
        <StarIcon className="absolute right-[18%] top-[60%] h-5 w-5 animate-pulse opacity-30" />
        <StarIcon className="absolute bottom-[40%] left-[25%] h-4 w-4 animate-pulse opacity-35" />
      </div>

      <div className="relative mx-auto max-w-4xl text-center">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-brand-accent/15 px-4 py-1.5 text-sm font-medium text-brand-primary">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-accent" />
          Handpicked with love
        </div>

        {/* Headline */}
        <h1 className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl">
          Welcome to{' '}
          <span className="relative inline-block text-brand-primary">
            {clientConfig.brand.name}
            <svg
              className="absolute -bottom-2 left-0 h-3 w-full text-brand-accent/40"
              viewBox="0 0 200 12"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d="M0 8 Q50 0 100 8 T200 8"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </h1>

        {/* Tagline */}
        <p className="mt-6 text-xl text-neutral-600 sm:mt-8 sm:text-2xl lg:text-3xl">
          {clientConfig.brand.tagline}
        </p>

        {/* Description */}
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-neutral-500 sm:text-lg">
          Discover handpicked treasures for your home and the people you love.
          From artisan home décor to thoughtful gift sets—find something special
          today.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
          <Link to="/catalog">
            <Button size="lg" className="group min-w-[200px]">
              <span className="flex items-center gap-2">
                Browse Collection
                <svg
                  className="h-5 w-5 transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </span>
            </Button>
          </Link>
          <a href="#visit-us">
            <Button variant="secondary" size="lg" className="min-w-[200px]">
              Visit Our Store
            </Button>
          </a>
        </div>

        {/* Social proof hint */}
        <div className="mt-12 flex items-center justify-center gap-6 text-sm text-neutral-500">
          <div className="flex items-center gap-2">
            <svg
              className="h-5 w-5 text-brand-accent"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span>Locally sourced</span>
          </div>
          <div className="h-4 w-px bg-neutral-300" aria-hidden="true" />
          <div className="flex items-center gap-2">
            <svg
              className="h-5 w-5 text-brand-accent"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <span>Curated with care</span>
          </div>
          <div className="hidden h-4 w-px bg-neutral-300 sm:block" aria-hidden="true" />
          <div className="hidden items-center gap-2 sm:flex">
            <svg
              className="h-5 w-5 text-brand-accent"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
              />
            </svg>
            <span>Gift wrapping available</span>
          </div>
        </div>
      </div>
    </section>
  )
}

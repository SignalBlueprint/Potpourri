import { Link } from '@tanstack/react-router'
import { Button } from '../index'
import { clientConfig } from '../../client.config'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-24">
      {/* Decorative background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/10 via-transparent to-brand-primary/5" />
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-brand-accent/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-brand-primary/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-3xl text-center">
        {/* Headline */}
        <h1 className="text-4xl font-semibold tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl">
          {clientConfig.brand.name}
        </h1>

        {/* Tagline */}
        <p className="mt-4 text-xl text-neutral-600 sm:mt-6 sm:text-2xl">
          {clientConfig.brand.tagline}
        </p>

        {/* Description */}
        <p className="mx-auto mt-6 max-w-xl text-base text-neutral-500 sm:text-lg">
          Discover handpicked treasures for your home and the people you love.
          From artisan home décor to thoughtful gift sets—find something special today.
        </p>

        {/* CTAs */}
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
          <Link to="/catalog">
            <Button size="lg" className="min-w-[180px]">
              Browse the Catalog
            </Button>
          </Link>
          <a href="#visit-us">
            <Button variant="secondary" size="lg" className="min-w-[180px]">
              Visit in Store
            </Button>
          </a>
        </div>
      </div>
    </section>
  )
}

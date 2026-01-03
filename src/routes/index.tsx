import { createRoute } from '@tanstack/react-router'
import { rootRoute } from '../app'
import { Container } from '../ui'
import {
  HeroSection,
  CategoryGrid,
  ProductTeaserGrid,
  VisitUs,
  TrustBadges,
} from '../ui/sections'

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: IndexPage,
})

function IndexPage() {
  return (
    <>
      {/* Hero Section - Full width background */}
      <Container>
        <HeroSection />
      </Container>

      {/* Trust Badges */}
      <Container>
        <TrustBadges />
      </Container>

      {/* Featured Categories */}
      <Container>
        <CategoryGrid />
      </Container>

      {/* New Arrivals */}
      <div className="bg-white/50">
        <Container>
          <ProductTeaserGrid />
        </Container>
      </div>

      {/* Visit Us Section */}
      <Container>
        <VisitUs />
      </Container>

      {/* Bottom spacing */}
      <div className="h-8 sm:h-12" />
    </>
  )
}

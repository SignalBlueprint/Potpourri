import { createRoute, Link } from '@tanstack/react-router'
import { rootRoute } from '../app'
import { clientConfig } from '../client.config'
import { Button, Card, Container, PageHeader, Badge } from '../ui'

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: IndexPage,
})

function IndexPage() {
  const categories = clientConfig.catalog.categories

  return (
    <Container>
      {/* Hero Section */}
      <PageHeader
        title={`Welcome to ${clientConfig.brand.name}`}
        subtitle={clientConfig.brand.tagline}
      />

      {/* Featured Categories */}
      <section className="space-y-6 pb-12">
        <h2 className="text-xl font-semibold text-neutral-900">Shop by Category</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link key={category} to="/catalog" className="group">
              <Card hover className="flex items-center justify-between">
                <span className="font-medium text-neutral-800 transition-colors group-hover:text-brand-primary">
                  {category}
                </span>
                <span className="text-neutral-400 transition-transform group-hover:translate-x-1">
                  &rarr;
                </span>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="space-y-6 pb-16">
        <Card className="bg-neutral-100 text-center">
          <div className="space-y-4 py-4">
            <Badge variant="accent">New Arrivals</Badge>
            <h3 className="text-2xl font-semibold text-neutral-900">
              Discover Our Latest Collection
            </h3>
            <p className="mx-auto max-w-md text-neutral-600">
              Browse our handpicked selection of unique gifts, home decor, and seasonal favorites.
            </p>
            <div className="pt-2">
              <Link to="/catalog">
                <Button size="lg">Browse Catalog</Button>
              </Link>
            </div>
          </div>
        </Card>
      </section>
    </Container>
  )
}

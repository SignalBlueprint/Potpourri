import { Link } from '@tanstack/react-router'
import { Card, SectionTitle } from '../index'
import { clientConfig } from '../../client.config'

// Category icons/emojis for visual appeal
const categoryIcons: Record<string, string> = {
  'Home Decor': '🏠',
  'Kitchen & Dining': '🍽️',
  'Garden & Outdoor': '🌿',
  'Seasonal': '🎄',
  'Gift Sets': '🎁',
  'Jewelry & Accessories': '💎',
  'Bath & Body': '🛁',
  'Stationery': '✉️',
}

interface CategoryGridProps {
  title?: string
  subtitle?: string
}

export function CategoryGrid({
  title = 'Featured Categories',
  subtitle = 'Explore our curated collections'
}: CategoryGridProps) {
  const categories = clientConfig.catalog.categories

  return (
    <section className="py-12 sm:py-16">
      <SectionTitle subtitle={subtitle} className="text-center mb-8">
        {title}
      </SectionTitle>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Link key={category} to="/catalog" className="group">
            <Card hover className="flex items-center gap-4 transition-all duration-200 group-hover:border-brand-primary/20">
              {/* Icon */}
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-100 text-2xl transition-colors group-hover:bg-brand-accent/20">
                {categoryIcons[category] || '✨'}
              </span>

              {/* Content */}
              <div className="flex-1">
                <span className="block font-medium text-neutral-800 transition-colors group-hover:text-brand-primary">
                  {category}
                </span>
                <span className="text-sm text-neutral-500">
                  Shop now
                </span>
              </div>

              {/* Arrow */}
              <span className="text-neutral-400 transition-all group-hover:translate-x-1 group-hover:text-brand-primary">
                →
              </span>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}

// =============================================================================
// Client Configuration
// Each client repo differs only by this config, making rollout/automation easy.
// =============================================================================

export interface BrandConfig {
  name: string
  tagline: string
  logoUrl: string
  colors: {
    primary: string
    accent: string
    neutral: {
      50: string
      100: string
      200: string
      600: string
      800: string
      900: string
    }
  }
}

export interface TenantConfig {
  id: string
  apiBaseUrl: string
}

export interface FeaturesConfig {
  enableCheckout: boolean
  enableAdmin: boolean
  priceMode: 'fixed' | 'variable' | 'quote'
}

export interface ContactConfig {
  email: string
  phone: string
  address: {
    street: string
    city: string
    state: string
    zip: string
    country: string
  }
  coordinates: {
    lat: number
    lng: number
  }
  hours: {
    weekdays: string
    saturday: string
    sunday: string
  }
}

export interface CatalogConfig {
  categories: string[]
  taxNote: string
  shippingNote: string
}

export interface Testimonial {
  id: string
  name: string
  location: string
  text: string
  rating: number
}

export interface TestimonialsConfig {
  enabled: boolean
  title: string
  subtitle: string
  items: Testimonial[]
}

export interface TrustBadge {
  id: string
  icon: 'shield' | 'truck' | 'refresh' | 'lock' | 'heart'
  title: string
  description: string
}

export interface TrustBadgesConfig {
  enabled: boolean
  items: TrustBadge[]
}

export interface ClientConfig {
  brand: BrandConfig
  tenant: TenantConfig
  features: FeaturesConfig
  contact: ContactConfig
  catalog: CatalogConfig
  testimonials: TestimonialsConfig
  trustBadges: TrustBadgesConfig
}

// =============================================================================
// Theme Application
// Call this once at app startup to sync CSS custom properties with config
// =============================================================================
export function applyTheme(config: ClientConfig = clientConfig): void {
  const root = document.documentElement
  const { colors } = config.brand

  // Brand colors
  root.style.setProperty('--color-brand-primary', colors.primary)
  root.style.setProperty('--color-brand-accent', colors.accent)

  // Neutral palette
  root.style.setProperty('--color-neutral-50', colors.neutral[50])
  root.style.setProperty('--color-neutral-100', colors.neutral[100])
  root.style.setProperty('--color-neutral-200', colors.neutral[200])
  root.style.setProperty('--color-neutral-600', colors.neutral[600])
  root.style.setProperty('--color-neutral-800', colors.neutral[800])
  root.style.setProperty('--color-neutral-900', colors.neutral[900])

  // Update document title with brand name
  document.title = `${config.brand.name} | ${config.brand.tagline}`
}

export const clientConfig: ClientConfig = {
  brand: {
    name: 'Potpourri',
    tagline: 'Curated gifts for every occasion',
    logoUrl: '/logo.svg',
    colors: {
      primary: '#7c6a5d', // Warm taupe
      accent: '#d4a59a', // Dusty rose
      neutral: {
        50: '#faf9f7', // Warm white
        100: '#f5f3f0', // Light cream
        200: '#e8e4df', // Soft beige
        600: '#6b6560', // Muted gray
        800: '#3d3936', // Dark charcoal
        900: '#2a2724', // Near black
      },
    },
  },

  tenant: {
    id: 'potpourri',
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? '/api',
  },

  features: {
    enableCheckout: false,
    enableAdmin: true,
    priceMode: 'fixed',
  },

  contact: {
    email: 'hello@potpourri.shop',
    phone: '(555) 123-4567',
    address: {
      street: '123 Main Street',
      city: 'Portland',
      state: 'OR',
      zip: '97201',
      country: 'USA',
    },
    coordinates: {
      lat: 45.5152,
      lng: -122.6784,
    },
    hours: {
      weekdays: 'Mon-Fri: 10am - 7pm',
      saturday: 'Sat: 10am - 6pm',
      sunday: 'Sun: 12pm - 5pm',
    },
  },

  catalog: {
    categories: ['Home Decor', 'Kitchen & Dining', 'Garden & Outdoor', 'Seasonal', 'Gift Sets'],
    taxNote: 'Sales tax calculated at checkout based on shipping address.',
    shippingNote: 'Free shipping on orders over $50. Standard delivery 3-5 business days.',
  },

  testimonials: {
    enabled: true,
    title: 'What Our Customers Say',
    subtitle: 'Real reviews from our happy shoppers',
    items: [
      {
        id: '1',
        name: 'Sarah M.',
        location: 'Portland, OR',
        text: 'Found the perfect housewarming gift here! The quality exceeded my expectations and the packaging was beautiful.',
        rating: 5,
      },
      {
        id: '2',
        name: 'James K.',
        location: 'Seattle, WA',
        text: 'Great selection of unique items you won\'t find anywhere else. The staff was incredibly helpful with gift recommendations.',
        rating: 5,
      },
      {
        id: '3',
        name: 'Emily R.',
        location: 'Vancouver, WA',
        text: 'I always come here for birthday gifts. Everything is so thoughtfully curated and the prices are fair.',
        rating: 5,
      },
    ],
  },

  trustBadges: {
    enabled: true,
    items: [
      {
        id: '1',
        icon: 'shield',
        title: 'Secure Checkout',
        description: 'Your payment info is protected',
      },
      {
        id: '2',
        icon: 'truck',
        title: 'Free Shipping',
        description: 'On orders over $50',
      },
      {
        id: '3',
        icon: 'refresh',
        title: 'Easy Returns',
        description: '30-day hassle-free returns',
      },
      {
        id: '4',
        icon: 'heart',
        title: 'Satisfaction Guaranteed',
        description: '100% happiness promise',
      },
    ],
  },
}

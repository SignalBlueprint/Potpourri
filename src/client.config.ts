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

export interface ClientConfig {
  brand: BrandConfig
  tenant: TenantConfig
  features: FeaturesConfig
  contact: ContactConfig
  catalog: CatalogConfig
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
}

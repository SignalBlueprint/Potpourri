// =============================================================================
// Client Configuration
// Each client repo differs only by this config, making rollout/automation easy.
// =============================================================================

export interface BrandConfig {
  name: string
  logoUrl: string
  colors: {
    primary: string
    secondary: string
    accent: string
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
    name: 'Potpourri Gift Shop',
    logoUrl: '/logo.svg',
    colors: {
      primary: '#6366f1',
      secondary: '#4f46e5',
      accent: '#818cf8',
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
  },

  catalog: {
    categories: ['Home Decor', 'Kitchen & Dining', 'Garden & Outdoor', 'Seasonal', 'Gift Sets'],
    taxNote: 'Sales tax calculated at checkout based on shipping address.',
    shippingNote: 'Free shipping on orders over $50. Standard delivery 3-5 business days.',
  },
}

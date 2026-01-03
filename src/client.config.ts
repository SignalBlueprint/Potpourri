export const clientConfig = {
  branding: {
    name: 'Potpourri Gift Shop',
    tagline: 'Curated gifts for every occasion',
    primaryColor: '#6366f1',
    logoUrl: '/logo.svg',
  },
  tenant: {
    id: 'potpourri-default',
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? '/api',
  },
  features: {
    enableCart: true,
    enableWishlist: false,
    enableReviews: false,
    enableAdminPanel: true,
  },
} as const

export type ClientConfig = typeof clientConfig

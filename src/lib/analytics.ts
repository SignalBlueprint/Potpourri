// =============================================================================
// Analytics Events
// Placeholder for analytics integration (Google Analytics, Plausible, etc.)
// =============================================================================

/**
 * Event types for analytics tracking.
 */
export type AnalyticsEvent =
  | 'page_view'
  | 'product_view'
  | 'inquiry_start'
  | 'inquiry_submit'
  | 'inquiry_success'
  | 'inquiry_error'
  | 'contact_submit'
  | 'search'
  | 'filter_change'
  | 'add_to_cart'
  | 'admin_login'

/**
 * Event properties for analytics tracking.
 */
export interface EventProperties {
  // Page view
  path?: string
  title?: string

  // Product events
  productId?: string
  productName?: string
  category?: string
  price?: number

  // Search/filter
  query?: string
  filters?: Record<string, string>
  resultsCount?: number

  // Error tracking
  errorMessage?: string
  errorCode?: string

  // Generic
  [key: string]: unknown
}

/**
 * Track an analytics event.
 * In development, logs to console. In production, sends to analytics provider.
 *
 * @example
 * trackEvent('inquiry_submit', { productId: '123', productName: 'Candle Set' })
 */
export function trackEvent(event: AnalyticsEvent, properties?: EventProperties): void {
  // Development: log to console for debugging
  if (import.meta.env.DEV) {
    console.log('[analytics]', event, properties ?? {})
    return
  }

  // Production: send to analytics provider
  // TODO: Replace with actual analytics integration
  // Examples:
  //
  // Google Analytics 4:
  // if (window.gtag) {
  //   window.gtag('event', event, properties)
  // }
  //
  // Plausible:
  // if (window.plausible) {
  //   window.plausible(event, { props: properties })
  // }
  //
  // PostHog:
  // if (window.posthog) {
  //   window.posthog.capture(event, properties)
  // }

  // For now, no-op in production until analytics provider is configured
  void event
  void properties
}

/**
 * Track a page view.
 * Call this on route changes.
 */
export function trackPageView(path: string, title?: string): void {
  trackEvent('page_view', { path, title })
}

/**
 * Track a product view.
 */
export function trackProductView(product: { id: string; name: string; category?: string; price?: number }): void {
  trackEvent('product_view', {
    productId: product.id,
    productName: product.name,
    category: product.category,
    price: product.price,
  })
}

/**
 * Track inquiry submission.
 */
export function trackInquiry(
  action: 'start' | 'submit' | 'success' | 'error',
  properties?: { productId?: string; productName?: string; errorMessage?: string }
): void {
  const event: AnalyticsEvent = `inquiry_${action}`
  trackEvent(event, properties)
}

/**
 * Track search.
 */
export function trackSearch(query: string, resultsCount: number): void {
  trackEvent('search', { query, resultsCount })
}

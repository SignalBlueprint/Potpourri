// =============================================================================
// Analytics Event Tracking
// Placeholder implementation ready for Google Analytics, Plausible, etc.
// =============================================================================

type EventName =
  | 'page_view'
  | 'product_view'
  | 'inquiry_start'
  | 'inquiry_submit'
  | 'inquiry_success'
  | 'inquiry_error'
  | 'search'
  | 'filter_apply'
  | 'add_to_cart'
  | 'contact_submit'
  | 'admin_login'
  | 'admin_logout'

interface EventProperties {
  [key: string]: string | number | boolean | undefined
}

/**
 * Track an analytics event.
 * In development: logs to console.
 * In production: would send to analytics provider.
 */
export function trackEvent(name: EventName, properties?: EventProperties): void {
  // Log in development for debugging
  if (import.meta.env.DEV) {
    console.log(
      `%c[Analytics] ${name}`,
      'color: #7c6a5d; font-weight: bold',
      properties ?? ''
    )
  }

  // Production: integrate with real analytics provider
  // Examples:
  //
  // Google Analytics 4:
  // if (typeof gtag !== 'undefined') {
  //   gtag('event', name, properties)
  // }
  //
  // Plausible:
  // if (typeof plausible !== 'undefined') {
  //   plausible(name, { props: properties })
  // }
  //
  // PostHog:
  // if (typeof posthog !== 'undefined') {
  //   posthog.capture(name, properties)
  // }
}

/**
 * Track a page view event.
 * Call this on route changes.
 */
export function trackPageView(path: string, title?: string): void {
  trackEvent('page_view', { path, title })
}

/**
 * Track a product view event.
 */
export function trackProductView(productId: string, productName: string, category: string): void {
  trackEvent('product_view', { productId, productName, category })
}

/**
 * Track an inquiry submission.
 */
export function trackInquirySubmit(productId: string, productName: string): void {
  trackEvent('inquiry_submit', { productId, productName })
}

/**
 * Track a search query.
 */
export function trackSearch(query: string, resultCount: number): void {
  trackEvent('search', { query, resultCount })
}

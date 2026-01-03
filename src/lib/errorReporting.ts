// =============================================================================
// Error Reporting
// Placeholder implementation ready for Sentry, Bugsnag, etc.
// =============================================================================

interface ErrorContext {
  componentStack?: string
  extra?: Record<string, unknown>
  tags?: Record<string, string>
  user?: {
    id?: string
    email?: string
  }
}

/**
 * Capture an exception for error reporting.
 * In development: logs to console.
 * In production: would send to error reporting service.
 */
export function captureException(error: Error, context?: ErrorContext): void {
  // Always log to console for visibility
  console.error('[Error Report]', error.message, {
    error,
    ...context,
  })

  // Production: integrate with real error reporting service
  // Examples:
  //
  // Sentry:
  // if (typeof Sentry !== 'undefined') {
  //   Sentry.captureException(error, {
  //     extra: context?.extra,
  //     tags: context?.tags,
  //   })
  // }
  //
  // Bugsnag:
  // if (typeof Bugsnag !== 'undefined') {
  //   Bugsnag.notify(error, (event) => {
  //     event.addMetadata('context', context)
  //   })
  // }
}

/**
 * Capture a message/log for error reporting.
 * Useful for non-error events that need visibility.
 */
export function captureMessage(
  message: string,
  level: 'info' | 'warning' | 'error' = 'info',
  context?: ErrorContext
): void {
  const logFn = level === 'error' ? console.error : level === 'warning' ? console.warn : console.log
  logFn(`[${level.toUpperCase()}]`, message, context ?? '')

  // Production: integrate with real error reporting service
  // Example (Sentry):
  // if (typeof Sentry !== 'undefined') {
  //   Sentry.captureMessage(message, level)
  // }
}

/**
 * Set user context for error reports.
 * Call this when user logs in/out.
 */
export function setUserContext(user: { id?: string; email?: string } | null): void {
  if (import.meta.env.DEV) {
    console.log('[Error Reporting] User context set:', user)
  }

  // Production: integrate with real error reporting service
  // Example (Sentry):
  // if (typeof Sentry !== 'undefined') {
  //   Sentry.setUser(user)
  // }
}

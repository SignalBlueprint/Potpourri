// =============================================================================
// Error Reporting
// Placeholder for error reporting integration (Sentry, Bugsnag, etc.)
// =============================================================================

/**
 * Error context for additional debugging information.
 */
export interface ErrorContext {
  // Component/location where error occurred
  component?: string
  action?: string

  // User context
  userId?: string
  sessionId?: string

  // Additional metadata
  extra?: Record<string, unknown>

  // Tags for filtering
  tags?: Record<string, string>
}

/**
 * Severity levels for error reporting.
 */
export type ErrorSeverity = 'fatal' | 'error' | 'warning' | 'info'

/**
 * Capture and report an exception.
 * In development, logs to console. In production, sends to error reporting service.
 *
 * @example
 * try {
 *   await riskyOperation()
 * } catch (error) {
 *   captureException(error, { component: 'InquiryModal', action: 'submit' })
 * }
 */
export function captureException(
  error: Error | unknown,
  context?: ErrorContext,
  severity: ErrorSeverity = 'error'
): void {
  const errorObject = error instanceof Error ? error : new Error(String(error))

  // Development: log to console for debugging
  if (import.meta.env.DEV) {
    console.error('[error-reporting]', {
      message: errorObject.message,
      stack: errorObject.stack,
      severity,
      context,
    })
    return
  }

  // Production: send to error reporting service
  // TODO: Replace with actual error reporting integration
  // Examples:
  //
  // Sentry:
  // import * as Sentry from '@sentry/react'
  // Sentry.captureException(errorObject, {
  //   level: severity,
  //   tags: context?.tags,
  //   extra: { ...context?.extra, component: context?.component, action: context?.action },
  // })
  //
  // Bugsnag:
  // import Bugsnag from '@bugsnag/js'
  // Bugsnag.notify(errorObject, (event) => {
  //   event.severity = severity
  //   event.addMetadata('context', context)
  // })

  // For now, still log in production as a fallback
  console.error('[error]', errorObject.message, context)
}

/**
 * Capture a message (non-exception) for logging/alerting.
 *
 * @example
 * captureMessage('User attempted invalid action', { action: 'delete', userId: '123' }, 'warning')
 */
export function captureMessage(
  message: string,
  context?: ErrorContext,
  severity: ErrorSeverity = 'info'
): void {
  // Development: log to console
  if (import.meta.env.DEV) {
    const logFn = severity === 'error' || severity === 'fatal' ? console.error : console.warn
    logFn('[error-reporting]', message, context)
    return
  }

  // Production: send to error reporting service
  // TODO: Replace with actual integration
  // Sentry.captureMessage(message, { level: severity, extra: context })

  console.warn('[message]', message, context)
}

/**
 * Set user context for error reports.
 * Call this after user authentication.
 */
export function setUserContext(user: { id: string; email?: string }): void {
  if (import.meta.env.DEV) {
    console.log('[error-reporting] User context set:', user)
    return
  }

  // Production:
  // Sentry.setUser({ id: user.id, email: user.email })
  void user
}

/**
 * Clear user context (e.g., on logout).
 */
export function clearUserContext(): void {
  if (import.meta.env.DEV) {
    console.log('[error-reporting] User context cleared')
    return
  }

  // Production:
  // Sentry.setUser(null)
}

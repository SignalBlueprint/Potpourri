// =============================================================================
// Environment Validation
// Fail fast with actionable error messages if required env vars are missing.
// =============================================================================

/**
 * Environment configuration with validation.
 * Call validateEnv() at app startup to ensure all required vars are set.
 */
export interface EnvConfig {
  VITE_API_BASE_URL: string
  VITE_ADMIN_PASSWORD?: string
  // Gemini API configuration for image enhancement
  VITE_GEMINI_API_KEY?: string
  VITE_GEMINI_MODEL?: string
}

/**
 * Get the current environment configuration.
 * Returns validated environment variables.
 */
export function getEnv(): EnvConfig {
  return {
    VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL ?? '/api',
    VITE_ADMIN_PASSWORD: import.meta.env.VITE_ADMIN_PASSWORD,
    VITE_GEMINI_API_KEY: import.meta.env.VITE_GEMINI_API_KEY,
    VITE_GEMINI_MODEL: import.meta.env.VITE_GEMINI_MODEL ?? 'gemini-2.5-flash-preview-05-20',
  }
}

/**
 * Validate required environment variables at startup.
 * Logs warnings for missing optional vars, errors for missing required vars.
 */
export function validateEnv(): void {
  const env = getEnv()
  const warnings: string[] = []
  const errors: string[] = []

  // VITE_API_BASE_URL is optional (defaults to /api)
  if (!import.meta.env.VITE_API_BASE_URL) {
    warnings.push(
      'VITE_API_BASE_URL is not set. Using default "/api". ' +
        'Set this in your .env file for production.'
    )
  }

  // VITE_ADMIN_PASSWORD is recommended for production
  if (!env.VITE_ADMIN_PASSWORD) {
    warnings.push(
      'VITE_ADMIN_PASSWORD is not set. Using hardcoded fallback. ' +
        'Set this in your .env file for production security.'
    )
  }

  // Log warnings in development
  if (import.meta.env.DEV && warnings.length > 0) {
    console.warn(
      '%c[Env Validation] Warnings:',
      'color: orange; font-weight: bold'
    )
    warnings.forEach((w) => console.warn(`  - ${w}`))
  }

  // Throw on critical errors
  if (errors.length > 0) {
    const errorMessage = `Environment validation failed:\n${errors.map((e) => `  - ${e}`).join('\n')}`
    console.error(
      '%c[Env Validation] Critical Errors:',
      'color: red; font-weight: bold'
    )
    errors.forEach((e) => console.error(`  - ${e}`))
    throw new Error(errorMessage)
  }
}

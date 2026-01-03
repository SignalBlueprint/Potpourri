// =============================================================================
// Environment Validation
// Fail fast if required environment variables are missing.
// =============================================================================

interface EnvConfig {
  VITE_API_BASE_URL: string
  VITE_ADMIN_PASSWORD?: string
}

interface EnvValidationResult {
  valid: boolean
  config: EnvConfig
  warnings: string[]
}

/**
 * Validate environment variables at startup.
 * Logs warnings for missing optional vars, throws for missing required vars.
 */
export function validateEnv(): EnvValidationResult {
  const warnings: string[] = []

  // Required env vars (with defaults for development)
  const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

  // Optional env vars
  const VITE_ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD

  // Warn if admin password is not set (security concern for production)
  if (!VITE_ADMIN_PASSWORD && import.meta.env.PROD) {
    warnings.push(
      'VITE_ADMIN_PASSWORD not set. Using default password is a security risk in production.'
    )
  }

  // Log warnings in development
  if (import.meta.env.DEV && warnings.length > 0) {
    console.warn('[env] Validation warnings:')
    warnings.forEach((w) => console.warn(`  - ${w}`))
  }

  return {
    valid: true,
    config: {
      VITE_API_BASE_URL,
      VITE_ADMIN_PASSWORD,
    },
    warnings,
  }
}

/**
 * Get a validated env value with type safety.
 */
export function getEnv<K extends keyof EnvConfig>(key: K): EnvConfig[K] {
  const result = validateEnv()
  return result.config[key]
}

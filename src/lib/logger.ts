// =============================================================================
// Logger Configuration
// Environment-aware logging: debug in dev, errors only in prod.
// =============================================================================

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LoggerConfig {
  minLevel: LogLevel
  prefix: string
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
}

// Determine minimum log level based on environment
const getDefaultConfig = (): LoggerConfig => ({
  minLevel: import.meta.env.DEV ? 'debug' : 'error',
  prefix: '[Potpourri]',
})

let config: LoggerConfig = getDefaultConfig()

/**
 * Configure the logger. Call this at app startup if needed.
 */
export function configureLogger(options: Partial<LoggerConfig>): void {
  config = { ...config, ...options }
}

/**
 * Check if a log level should be output based on current config.
 */
function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[config.minLevel]
}

/**
 * Format the log message with prefix and level.
 */
function formatMessage(level: LogLevel, message: string): string {
  const timestamp = new Date().toISOString().slice(11, 23) // HH:mm:ss.SSS
  return `${config.prefix} [${timestamp}] [${level.toUpperCase()}] ${message}`
}

/**
 * Debug level logging. Only outputs in development.
 */
export function debug(message: string, ...args: unknown[]): void {
  if (shouldLog('debug')) {
    console.log(
      `%c${formatMessage('debug', message)}`,
      'color: #888',
      ...args
    )
  }
}

/**
 * Info level logging. Only outputs in development.
 */
export function info(message: string, ...args: unknown[]): void {
  if (shouldLog('info')) {
    console.log(
      `%c${formatMessage('info', message)}`,
      'color: #4a90a4',
      ...args
    )
  }
}

/**
 * Warning level logging. Outputs in development.
 */
export function warn(message: string, ...args: unknown[]): void {
  if (shouldLog('warn')) {
    console.warn(formatMessage('warn', message), ...args)
  }
}

/**
 * Error level logging. Always outputs.
 */
export function error(message: string, ...args: unknown[]): void {
  if (shouldLog('error')) {
    console.error(formatMessage('error', message), ...args)
  }
}

/**
 * Create a namespaced logger for a specific module.
 */
export function createLogger(namespace: string) {
  const ns = `[${namespace}]`
  return {
    debug: (message: string, ...args: unknown[]) => debug(`${ns} ${message}`, ...args),
    info: (message: string, ...args: unknown[]) => info(`${ns} ${message}`, ...args),
    warn: (message: string, ...args: unknown[]) => warn(`${ns} ${message}`, ...args),
    error: (message: string, ...args: unknown[]) => error(`${ns} ${message}`, ...args),
  }
}

// Default export for convenience
export const logger = {
  debug,
  info,
  warn,
  error,
  configure: configureLogger,
  createLogger,
}

import { useState, useCallback, useSyncExternalStore } from 'react'

// =============================================================================
// Admin Authentication Hook
// =============================================================================

const AUTH_STORAGE_KEY = 'potpourri_admin_auth'

// Admin password from environment variable with fallback for development
// IMPORTANT: Set VITE_ADMIN_PASSWORD in production to override the default
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123'

// Warn in development if using default password
if (import.meta.env.DEV && !import.meta.env.VITE_ADMIN_PASSWORD) {
  console.warn(
    '[auth] Using default admin password. Set VITE_ADMIN_PASSWORD in production.'
  )
}

// External store for sessionStorage sync
function getAuthSnapshot(): boolean {
  return sessionStorage.getItem(AUTH_STORAGE_KEY) === 'true'
}

function getServerSnapshot(): boolean {
  return false
}

function subscribeToAuth(callback: () => void): () => void {
  // Listen for storage events from other tabs
  window.addEventListener('storage', callback)
  return () => window.removeEventListener('storage', callback)
}

export interface UseAuthResult {
  isAuthenticated: boolean
  isLoading: boolean
  login: (password: string) => boolean
  logout: () => void
  error: string | null
}

/**
 * Simple authentication hook for admin access.
 * Uses sessionStorage to persist login state during browser session.
 */
export function useAuth(): UseAuthResult {
  const isAuthenticated = useSyncExternalStore(
    subscribeToAuth,
    getAuthSnapshot,
    getServerSnapshot
  )
  const [error, setError] = useState<string | null>(null)
  // Track if we're forcing a re-render after auth changes
  const [, forceUpdate] = useState(0)

  const login = useCallback((password: string): boolean => {
    setError(null)

    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(AUTH_STORAGE_KEY, 'true')
      forceUpdate((n) => n + 1)
      return true
    } else {
      setError('Invalid password')
      return false
    }
  }, [])

  const logout = useCallback(() => {
    sessionStorage.removeItem(AUTH_STORAGE_KEY)
    setError(null)
    forceUpdate((n) => n + 1)
  }, [])

  return {
    isAuthenticated,
    isLoading: false,
    login,
    logout,
    error,
  }
}

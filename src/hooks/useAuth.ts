import { useState, useCallback, useSyncExternalStore } from 'react'
import { getEnv } from '../lib/env'

// =============================================================================
// Admin Authentication Hook
// =============================================================================

const AUTH_STORAGE_KEY = 'potpourri_admin_auth'

// Admin password from environment variable, with fallback for development
// IMPORTANT: Set VITE_ADMIN_PASSWORD in production .env file
const ADMIN_PASSWORD = getEnv().VITE_ADMIN_PASSWORD ?? 'admin123'

// Listeners for same-tab auth changes
const authListeners = new Set<() => void>()

function notifyAuthChange() {
  authListeners.forEach((listener) => listener())
}

// External store for sessionStorage sync
function getAuthSnapshot(): boolean {
  return sessionStorage.getItem(AUTH_STORAGE_KEY) === 'true'
}

function getServerSnapshot(): boolean {
  return false
}

function subscribeToAuth(callback: () => void): () => void {
  // Track listener for same-tab notifications
  authListeners.add(callback)
  // Listen for storage events from other tabs
  window.addEventListener('storage', callback)
  return () => {
    authListeners.delete(callback)
    window.removeEventListener('storage', callback)
  }
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

  const login = useCallback((password: string): boolean => {
    setError(null)

    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(AUTH_STORAGE_KEY, 'true')
      notifyAuthChange()
      return true
    } else {
      setError('Invalid password')
      return false
    }
  }, [])

  const logout = useCallback(() => {
    sessionStorage.removeItem(AUTH_STORAGE_KEY)
    setError(null)
    notifyAuthChange()
  }, [])

  return {
    isAuthenticated,
    isLoading: false,
    login,
    logout,
    error,
  }
}

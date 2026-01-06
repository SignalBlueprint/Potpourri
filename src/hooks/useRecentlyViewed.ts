import { useCallback, useSyncExternalStore } from 'react'

// =============================================================================
// Recently Viewed Products Hook
// Tracks and persists recently viewed product IDs in localStorage
// =============================================================================

const STORAGE_KEY = 'potpourri_recently_viewed'
const MAX_ITEMS = 8 // Maximum number of recently viewed items to store

// Cached snapshot to avoid creating new array references on every call
let cachedSnapshot: string[] = []
let cachedStorageValue: string | null = null

// Get the current list of recently viewed product IDs from localStorage
// Returns a cached array reference unless the underlying data has changed
function getRecentlyViewedSnapshot(): string[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    // Only parse and create new array if storage value changed
    if (stored !== cachedStorageValue) {
      cachedStorageValue = stored
      if (!stored) {
        cachedSnapshot = []
      } else {
        const parsed = JSON.parse(stored)
        cachedSnapshot = Array.isArray(parsed) ? parsed : []
      }
    }
    return cachedSnapshot
  } catch {
    return cachedSnapshot
  }
}

// Empty array for server - stable reference
const serverSnapshot: string[] = []

// Server snapshot returns empty array (no localStorage on server)
function getServerSnapshot(): string[] {
  return serverSnapshot
}

// Set of listeners for storage changes
const listeners = new Set<() => void>()

// Notify all listeners when storage changes
function emitChange() {
  listeners.forEach((listener) => listener())
}

// Subscribe to storage changes
function subscribe(callback: () => void): () => void {
  listeners.add(callback)

  // Also listen for storage events from other tabs
  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      callback()
    }
  }
  window.addEventListener('storage', handleStorage)

  return () => {
    listeners.delete(callback)
    window.removeEventListener('storage', handleStorage)
  }
}

// Add a product ID to the recently viewed list
function addToRecentlyViewed(productId: string): void {
  const current = getRecentlyViewedSnapshot()

  // Remove if already exists (will re-add at front)
  const filtered = current.filter((id) => id !== productId)

  // Add to front of list
  const updated = [productId, ...filtered].slice(0, MAX_ITEMS)

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  emitChange()
}

export interface UseRecentlyViewedResult {
  /** Array of recently viewed product IDs (most recent first) */
  recentlyViewedIds: string[]
  /** Add a product ID to recently viewed */
  addViewed: (productId: string) => void
  /** Clear all recently viewed items */
  clearViewed: () => void
}

/**
 * Hook to track and retrieve recently viewed products.
 * Persists to localStorage and syncs across tabs.
 */
export function useRecentlyViewed(): UseRecentlyViewedResult {
  const recentlyViewedIds = useSyncExternalStore(
    subscribe,
    getRecentlyViewedSnapshot,
    getServerSnapshot
  )

  const addViewed = useCallback((productId: string) => {
    addToRecentlyViewed(productId)
  }, [])

  const clearViewed = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    emitChange()
  }, [])

  return {
    recentlyViewedIds,
    addViewed,
    clearViewed,
  }
}

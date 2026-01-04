import { useCallback, useSyncExternalStore } from 'react'

// =============================================================================
// Favorites/Wishlist Hook
// Tracks and persists favorite product IDs in localStorage
// =============================================================================

const STORAGE_KEY = 'potpourri_favorites'

// Get the current list of favorite product IDs from localStorage
function getFavoritesSnapshot(): string[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    const parsed = JSON.parse(stored)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

// Server snapshot returns empty array (no localStorage on server)
function getServerSnapshot(): string[] {
  return []
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

// Add a product ID to favorites
function addFavorite(productId: string): void {
  const current = getFavoritesSnapshot()
  if (current.includes(productId)) return

  const updated = [...current, productId]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  emitChange()
}

// Remove a product ID from favorites
function removeFavorite(productId: string): void {
  const current = getFavoritesSnapshot()
  const updated = current.filter((id) => id !== productId)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  emitChange()
}

// Toggle a product ID in favorites
function toggleFavorite(productId: string): boolean {
  const current = getFavoritesSnapshot()
  const isFavorite = current.includes(productId)

  if (isFavorite) {
    removeFavorite(productId)
    return false
  } else {
    addFavorite(productId)
    return true
  }
}

export interface UseFavoritesResult {
  /** Array of favorite product IDs */
  favoriteIds: string[]
  /** Check if a product is in favorites */
  isFavorite: (productId: string) => boolean
  /** Add a product to favorites */
  addFavorite: (productId: string) => void
  /** Remove a product from favorites */
  removeFavorite: (productId: string) => void
  /** Toggle a product in favorites, returns new state */
  toggleFavorite: (productId: string) => boolean
  /** Clear all favorites */
  clearFavorites: () => void
  /** Total count of favorites */
  count: number
}

/**
 * Hook to manage favorite/wishlist products.
 * Persists to localStorage and syncs across tabs.
 */
export function useFavorites(): UseFavoritesResult {
  const favoriteIds = useSyncExternalStore(
    subscribe,
    getFavoritesSnapshot,
    getServerSnapshot
  )

  const isFavorite = useCallback(
    (productId: string) => favoriteIds.includes(productId),
    [favoriteIds]
  )

  const add = useCallback((productId: string) => {
    addFavorite(productId)
  }, [])

  const remove = useCallback((productId: string) => {
    removeFavorite(productId)
  }, [])

  const toggle = useCallback((productId: string) => {
    return toggleFavorite(productId)
  }, [])

  const clearFavorites = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    emitChange()
  }, [])

  return {
    favoriteIds,
    isFavorite,
    addFavorite: add,
    removeFavorite: remove,
    toggleFavorite: toggle,
    clearFavorites,
    count: favoriteIds.length,
  }
}

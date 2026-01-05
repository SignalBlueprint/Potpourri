import { useCallback, useSyncExternalStore } from 'react'

// =============================================================================
// Product Comparison Hook
// Tracks products selected for comparison in localStorage
// =============================================================================

const STORAGE_KEY = 'potpourri_compare'
const MAX_ITEMS = 4 // Maximum number of products to compare

// Cached snapshot to avoid creating new array references on every call
let cachedSnapshot: string[] = []
let cachedStorageValue: string | null = null

// Get the current list of comparison product IDs from localStorage
function getCompareSnapshot(): string[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
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

function getServerSnapshot(): string[] {
  return serverSnapshot
}

// Set of listeners for storage changes
const listeners = new Set<() => void>()

function emitChange() {
  listeners.forEach((listener) => listener())
}

function subscribe(callback: () => void): () => void {
  listeners.add(callback)

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

function addToCompare(productId: string): boolean {
  const current = getCompareSnapshot()
  if (current.includes(productId)) return false
  if (current.length >= MAX_ITEMS) return false

  const updated = [...current, productId]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  cachedStorageValue = JSON.stringify(updated)
  cachedSnapshot = updated
  emitChange()
  return true
}

function removeFromCompare(productId: string): void {
  const current = getCompareSnapshot()
  const updated = current.filter((id) => id !== productId)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  cachedStorageValue = JSON.stringify(updated)
  cachedSnapshot = updated
  emitChange()
}

function clearCompare(): void {
  localStorage.removeItem(STORAGE_KEY)
  cachedStorageValue = null
  cachedSnapshot = []
  emitChange()
}

export interface UseCompareResult {
  /** Array of product IDs being compared */
  compareIds: string[]
  /** Check if a product is in comparison */
  isComparing: (productId: string) => boolean
  /** Add a product to comparison (returns false if already added or at max) */
  addToCompare: (productId: string) => boolean
  /** Remove a product from comparison */
  removeFromCompare: (productId: string) => void
  /** Toggle a product in comparison */
  toggleCompare: (productId: string) => boolean
  /** Clear all comparisons */
  clearCompare: () => void
  /** Number of products being compared */
  count: number
  /** Maximum number of products that can be compared */
  maxItems: number
  /** Whether more products can be added */
  canAdd: boolean
}

export function useCompare(): UseCompareResult {
  const compareIds = useSyncExternalStore(
    subscribe,
    getCompareSnapshot,
    getServerSnapshot
  )

  const isComparing = useCallback(
    (productId: string) => compareIds.includes(productId),
    [compareIds]
  )

  const add = useCallback((productId: string) => {
    return addToCompare(productId)
  }, [])

  const remove = useCallback((productId: string) => {
    removeFromCompare(productId)
  }, [])

  const toggle = useCallback((productId: string) => {
    if (compareIds.includes(productId)) {
      removeFromCompare(productId)
      return false
    } else {
      return addToCompare(productId)
    }
  }, [compareIds])

  const clear = useCallback(() => {
    clearCompare()
  }, [])

  return {
    compareIds,
    isComparing,
    addToCompare: add,
    removeFromCompare: remove,
    toggleCompare: toggle,
    clearCompare: clear,
    count: compareIds.length,
    maxItems: MAX_ITEMS,
    canAdd: compareIds.length < MAX_ITEMS,
  }
}

// =============================================================================
// Product Storage Layer
// Persists admin products to localStorage with image references to IndexedDB
// =============================================================================

import type { AdminProduct } from '../ui'
import { getProductImages } from './imageStorage'

const STORAGE_KEY = 'potpourri_admin_products'

export interface StoredProduct {
  id: string
  name: string
  category: string
  price: number
  stock: number
  status: AdminProduct['status']
  imageIds?: string[] // References to images in IndexedDB
  createdAt: string
  updatedAt: string
}

/**
 * Get all stored products
 */
export function getStoredProducts(): StoredProduct[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    console.error('Failed to read products from localStorage')
    return []
  }
}

/**
 * Save a product (create or update)
 */
export function saveProduct(product: StoredProduct): StoredProduct {
  const products = getStoredProducts()
  const existingIndex = products.findIndex((p) => p.id === product.id)

  if (existingIndex >= 0) {
    // Update existing
    products[existingIndex] = {
      ...product,
      updatedAt: new Date().toISOString(),
    }
  } else {
    // Create new
    products.push({
      ...product,
      createdAt: product.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
  return product
}

/**
 * Delete a product by ID
 */
export function deleteProduct(productId: string): boolean {
  const products = getStoredProducts()
  const filtered = products.filter((p) => p.id !== productId)

  if (filtered.length === products.length) {
    return false // Product not found
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
  return true
}

/**
 * Get a single product by ID
 */
export function getProduct(productId: string): StoredProduct | undefined {
  const products = getStoredProducts()
  return products.find((p) => p.id === productId)
}

/**
 * Convert StoredProduct to AdminProduct format for UI display
 */
export async function toAdminProduct(stored: StoredProduct): Promise<AdminProduct> {
  // Try to get images from IndexedDB
  let imageUrl: string | undefined
  try {
    const images = await getProductImages(stored.id)
    const primaryImage = images.find((img) => img.isPrimary) || images[0]
    imageUrl = primaryImage?.thumbnailUrl || primaryImage?.url
  } catch {
    // No images found
  }

  return {
    id: stored.id,
    name: stored.name,
    category: stored.category,
    price: stored.price,
    stock: stored.stock,
    status: stored.status,
    imageUrl,
    lastUpdated: stored.updatedAt,
  }
}

/**
 * Get all products as AdminProduct format
 */
export async function getAllAdminProducts(): Promise<AdminProduct[]> {
  const stored = getStoredProducts()
  return Promise.all(stored.map(toAdminProduct))
}

/**
 * Get product count
 */
export function getProductCount(): number {
  return getStoredProducts().length
}

/**
 * Clear all products (use with caution)
 */
export function clearAllProducts(): void {
  localStorage.removeItem(STORAGE_KEY)
}

// =============================================================================
// Image Utility Functions
// Helpers for image processing, compression, and validation
// =============================================================================

import {
  SUPPORTED_IMAGE_FORMATS,
  IMAGE_CONSTRAINTS,
  type SupportedImageFormat,
} from '../types/images'

/**
 * Validate an image file before upload
 */
export interface ImageValidationResult {
  valid: boolean
  error?: string
}

export function validateImageFile(file: File): ImageValidationResult {
  // Check file type
  if (!SUPPORTED_IMAGE_FORMATS.includes(file.type as SupportedImageFormat)) {
    return {
      valid: false,
      error: `Unsupported file type: ${file.type}. Supported formats: JPEG, PNG, WebP, GIF`,
    }
  }

  // Check file size
  if (file.size > IMAGE_CONSTRAINTS.maxFileSize) {
    return {
      valid: false,
      error: `File too large: ${formatFileSize(file.size)}. Maximum size: ${IMAGE_CONSTRAINTS.maxFileSizeDisplay}`,
    }
  }

  return { valid: true }
}

/**
 * Convert a File to a base64 data URL
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
      } else {
        reject(new Error('Failed to read file as base64'))
      }
    }
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

/**
 * Extract raw base64 data from a data URL (removes the prefix)
 */
export function extractBase64Data(dataUrl: string): string {
  const match = dataUrl.match(/^data:[^;]+;base64,(.+)$/)
  return match?.[1] ?? dataUrl
}

/**
 * Create a data URL from raw base64 and mime type
 */
export function createDataUrl(base64: string, mimeType: string): string {
  if (base64.startsWith('data:')) {
    return base64
  }
  return `data:${mimeType};base64,${base64}`
}

/**
 * Get image dimensions from a data URL or File
 */
export function getImageDimensions(
  source: string | File
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight })
    }
    img.onerror = () => reject(new Error('Failed to load image'))

    if (typeof source === 'string') {
      img.src = source
    } else {
      const url = URL.createObjectURL(source)
      img.onload = () => {
        URL.revokeObjectURL(url)
        resolve({ width: img.naturalWidth, height: img.naturalHeight })
      }
      img.onerror = () => {
        URL.revokeObjectURL(url)
        reject(new Error('Failed to load image'))
      }
      img.src = url
    }
  })
}

/**
 * Compress an image to reduce file size
 */
export interface CompressOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number // 0-1
  mimeType?: 'image/jpeg' | 'image/webp' | 'image/png'
}

export async function compressImage(
  source: string | File,
  options: CompressOptions = {}
): Promise<string> {
  const {
    maxWidth = 1920,
    maxHeight = 1920,
    quality = 0.85,
    mimeType = 'image/jpeg',
  } = options

  return new Promise((resolve, reject) => {
    const img = new Image()

    img.onload = () => {
      // Calculate new dimensions maintaining aspect ratio
      const { width, height } = calculateResizedDimensions(
        img.naturalWidth,
        img.naturalHeight,
        maxWidth,
        maxHeight
      )

      // Create canvas and draw resized image
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Failed to get canvas context'))
        return
      }

      // Use high quality image smoothing
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      ctx.drawImage(img, 0, 0, width, height)

      // Convert to data URL
      const compressed = canvas.toDataURL(mimeType, quality)
      resolve(compressed)
    }

    img.onerror = () => reject(new Error('Failed to load image for compression'))

    if (typeof source === 'string') {
      img.src = source
    } else {
      img.src = URL.createObjectURL(source)
    }
  })
}

/**
 * Create a thumbnail version of an image
 */
export async function createThumbnail(
  source: string | File,
  size: number = 200
): Promise<string> {
  return compressImage(source, {
    maxWidth: size,
    maxHeight: size,
    quality: 0.7,
    mimeType: 'image/jpeg',
  })
}

/**
 * Calculate resized dimensions maintaining aspect ratio
 */
export function calculateResizedDimensions(
  width: number,
  height: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } {
  if (width <= maxWidth && height <= maxHeight) {
    return { width, height }
  }

  const widthRatio = maxWidth / width
  const heightRatio = maxHeight / height
  const ratio = Math.min(widthRatio, heightRatio)

  return {
    width: Math.round(width * ratio),
    height: Math.round(height * ratio),
  }
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

/**
 * Get the file extension from a mime type
 */
export function mimeTypeToExtension(mimeType: string): string {
  const extensions: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
  }
  return extensions[mimeType] || 'jpg'
}

/**
 * Get mime type from a data URL
 */
export function getMimeTypeFromDataUrl(dataUrl: string): string {
  const match = dataUrl.match(/^data:([^;]+);/)
  return match?.[1] ?? 'image/jpeg'
}

/**
 * Estimate the size of a base64 string in bytes
 */
export function estimateBase64Size(base64: string): number {
  // Remove data URL prefix if present
  const data = extractBase64Data(base64)
  // Base64 encoding increases size by ~33%
  return Math.ceil((data.length * 3) / 4)
}

/**
 * Check if a string is a valid data URL
 */
export function isDataUrl(str: string): boolean {
  return /^data:[^;]+;base64,/.test(str)
}

/**
 * Check if a string is a valid URL (http/https or data URL)
 */
export function isValidImageUrl(str: string): boolean {
  if (isDataUrl(str)) return true
  try {
    const url = new URL(str)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

/**
 * Load an image from URL and convert to base64
 */
export async function urlToBase64(url: string): Promise<string> {
  if (isDataUrl(url)) {
    return url
  }

  const response = await fetch(url)
  const blob = await response.blob()
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
      } else {
        reject(new Error('Failed to convert URL to base64'))
      }
    }
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(blob)
  })
}

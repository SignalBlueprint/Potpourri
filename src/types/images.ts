// =============================================================================
// Image Types for Photo Upload & AI Enhancement
// =============================================================================

/**
 * Type of image in the product catalog
 */
export type ImageType = 'original' | 'clean_shot' | 'product_shot' | 'lifestyle'

/**
 * Status of an AI enhancement job
 */
export type EnhancementStatus = 'pending' | 'processing' | 'completed' | 'failed'

/**
 * A single product image with metadata
 */
export interface ProductImage {
  id: string
  productId: string
  url: string // base64 data URL or external URL
  thumbnailUrl?: string // Smaller version for performance
  type: ImageType
  isPrimary: boolean
  sortOrder: number
  originalImageId?: string // Links AI-generated images to their source
  enhancementPrompt?: string // Prompt used for AI generation
  width?: number
  height?: number
  fileSize?: number // In bytes
  mimeType?: string
  createdAt: Date
  updatedAt?: Date
}

/**
 * A variant request within an enhancement job
 */
export interface EnhancementVariant {
  type: ImageType
  prompt: string
  status: EnhancementStatus
  resultImageId?: string
  error?: string
}

/**
 * An AI enhancement job for generating product variants
 */
export interface EnhancementJob {
  id: string
  productId: string
  productName: string
  sourceImageId: string
  sourceImageUrl: string // Keep reference for processing
  status: EnhancementStatus
  variants: EnhancementVariant[]
  progress: number // 0-100
  createdAt: Date
  startedAt?: Date
  completedAt?: Date
  error?: string
}

/**
 * Configuration for generating enhanced images
 */
export interface EnhancementConfig {
  generateCleanShot: boolean
  productShotCount: number // 1-5
  lifestyleShot: boolean
  aspectRatio: '1:1' | '4:3' | '16:9' | '3:4'
  resolution: '1K' | '2K' | '4K'
}

/**
 * Default enhancement configuration
 */
export const DEFAULT_ENHANCEMENT_CONFIG: EnhancementConfig = {
  generateCleanShot: true,
  productShotCount: 3,
  lifestyleShot: true,
  aspectRatio: '1:1',
  resolution: '2K',
}

// =============================================================================
// Lookbook Types
// =============================================================================

/**
 * Layout options for a lookbook page
 */
export type LookbookLayout = 'hero' | 'grid-2' | 'grid-3' | 'grid-4' | 'masonry' | 'split'

/**
 * A single page within a lookbook
 */
export interface LookbookPage {
  id: string
  title?: string
  subtitle?: string
  images: ProductImage[]
  layout: LookbookLayout
  backgroundColor?: string
  textColor?: string
  sortOrder: number
}

/**
 * A collection of product images organized as a visual catalog
 */
export interface Lookbook {
  id: string
  name: string
  description?: string
  coverImage?: ProductImage
  pages: LookbookPage[]
  isPublished: boolean
  publishedAt?: Date
  createdAt: Date
  updatedAt?: Date
}

// =============================================================================
// Utility Types
// =============================================================================

/**
 * Supported image formats for upload
 */
export const SUPPORTED_IMAGE_FORMATS = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'] as const
export type SupportedImageFormat = (typeof SUPPORTED_IMAGE_FORMATS)[number]

/**
 * Image validation constraints
 */
export const IMAGE_CONSTRAINTS = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  maxFileSizeDisplay: '10MB',
  minWidth: 200,
  minHeight: 200,
  maxWidth: 8000,
  maxHeight: 8000,
  maxImagesPerProduct: 20,
} as const

/**
 * Generate a unique ID for images
 */
export function generateImageId(): string {
  return `img_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`
}

/**
 * Generate a unique ID for enhancement jobs
 */
export function generateJobId(): string {
  return `job_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`
}

/**
 * Generate a unique ID for lookbooks
 */
export function generateLookbookId(): string {
  return `lb_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`
}

/**
 * Get human-readable label for image type
 */
export function getImageTypeLabel(type: ImageType): string {
  const labels: Record<ImageType, string> = {
    original: 'Original',
    clean_shot: 'Clean Shot',
    product_shot: 'Product Shot',
    lifestyle: 'Lifestyle',
  }
  return labels[type]
}

/**
 * Get badge color for image type
 */
export function getImageTypeBadgeColor(type: ImageType): string {
  const colors: Record<ImageType, string> = {
    original: 'bg-gray-100 text-gray-700',
    clean_shot: 'bg-blue-100 text-blue-700',
    product_shot: 'bg-green-100 text-green-700',
    lifestyle: 'bg-purple-100 text-purple-700',
  }
  return colors[type]
}

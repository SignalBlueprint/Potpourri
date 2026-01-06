// =============================================================================
// Enhancement Manager
// Orchestrates the AI image enhancement workflow
// =============================================================================

import type {
  ProductImage,
  EnhancementJob,
  EnhancementConfig,
  EnhancementVariant,
  ImageType,
} from '../types/images'
import {
  generateImageId,
  generateJobId,
  DEFAULT_ENHANCEMENT_CONFIG,
} from '../types/images'
import {
  saveImage,
  saveJob,
  getJob,
  getProductImages,
} from './imageStorage'
import {
  generateCleanShot,
  generateProductShots,
  generateLifestyleShot,
  generateMockImages,
  shouldUseMockMode,
} from './geminiService'
import { createThumbnail } from '../lib/imageUtils'

/**
 * Event types for enhancement progress
 */
export type EnhancementEventType =
  | 'job_started'
  | 'variant_started'
  | 'variant_completed'
  | 'variant_failed'
  | 'job_completed'
  | 'job_failed'

export interface EnhancementEvent {
  type: EnhancementEventType
  jobId: string
  variant?: EnhancementVariant
  image?: ProductImage
  progress: number
  error?: string
}

export type EnhancementProgressCallback = (event: EnhancementEvent) => void

/**
 * Start an enhancement job for a product image
 */
export async function startEnhancementJob(
  sourceImage: ProductImage,
  productName: string,
  productCategory: string,
  config: Partial<EnhancementConfig> = {},
  onProgress?: EnhancementProgressCallback
): Promise<EnhancementJob> {
  const fullConfig: EnhancementConfig = {
    ...DEFAULT_ENHANCEMENT_CONFIG,
    ...config,
  }

  // Build the list of variants to generate
  const variants: EnhancementVariant[] = []

  if (fullConfig.generateCleanShot) {
    variants.push({
      type: 'clean_shot',
      prompt: `Clean product shot for ${productName}`,
      status: 'pending',
    })
  }

  for (let i = 0; i < fullConfig.productShotCount; i++) {
    variants.push({
      type: 'product_shot',
      prompt: `Product shot variant ${i + 1} for ${productName}`,
      status: 'pending',
    })
  }

  if (fullConfig.lifestyleShot) {
    variants.push({
      type: 'lifestyle',
      prompt: `Lifestyle shot for ${productName}`,
      status: 'pending',
    })
  }

  // Create the job
  const job: EnhancementJob = {
    id: generateJobId(),
    productId: sourceImage.productId,
    productName,
    sourceImageId: sourceImage.id,
    sourceImageUrl: sourceImage.url,
    status: 'pending',
    variants,
    progress: 0,
    createdAt: new Date(),
  }

  // Save the job
  await saveJob(job)

  // Start processing in the background
  processEnhancementJob(job, productCategory, fullConfig, onProgress).catch((error) => {
    console.error('Enhancement job failed:', error)
  })

  return job
}

/**
 * Process an enhancement job
 */
async function processEnhancementJob(
  job: EnhancementJob,
  productCategory: string,
  config: EnhancementConfig,
  onProgress?: EnhancementProgressCallback
): Promise<void> {
  // Update job status to processing
  job.status = 'processing'
  job.startedAt = new Date()
  await saveJob(job)

  onProgress?.({
    type: 'job_started',
    jobId: job.id,
    progress: 0,
  })

  const totalVariants = job.variants.length
  let completedVariants = 0
  let hasErrors = false

  // Check if we should use mock mode
  const useMock = shouldUseMockMode()

  if (useMock) {
    // Generate mock images for demo
    const mockImages = await generateMockImages(job.productName, totalVariants)

    for (let i = 0; i < job.variants.length; i++) {
      const variant = job.variants[i]
      if (!variant) continue

      variant.status = 'processing'

      onProgress?.({
        type: 'variant_started',
        jobId: job.id,
        variant,
        progress: Math.round((completedVariants / totalVariants) * 100),
      })

      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 800))

      try {
        const imageUrl = mockImages[i]
        if (!imageUrl) throw new Error('No mock image available')

        const newImage = await createAndSaveImage(
          job.productId,
          imageUrl,
          variant.type,
          job.sourceImageId,
          variant.prompt
        )

        variant.status = 'completed'
        variant.resultImageId = newImage.id
        completedVariants++

        onProgress?.({
          type: 'variant_completed',
          jobId: job.id,
          variant,
          image: newImage,
          progress: Math.round((completedVariants / totalVariants) * 100),
        })
      } catch (error) {
        variant.status = 'failed'
        variant.error = error instanceof Error ? error.message : 'Unknown error'
        hasErrors = true
        completedVariants++

        onProgress?.({
          type: 'variant_failed',
          jobId: job.id,
          variant,
          progress: Math.round((completedVariants / totalVariants) * 100),
          error: variant.error,
        })
      }

      await saveJob(job)
    }
  } else {
    // Use actual Gemini API
    for (const variant of job.variants) {
      variant.status = 'processing'

      onProgress?.({
        type: 'variant_started',
        jobId: job.id,
        variant,
        progress: Math.round((completedVariants / totalVariants) * 100),
      })

      try {
        let imageUrl: string

        switch (variant.type) {
          case 'clean_shot':
            imageUrl = await generateCleanShot(
              job.sourceImageUrl,
              job.productName,
              { aspectRatio: config.aspectRatio }
            )
            break

          case 'product_shot': {
            const productShots = await generateProductShots(
              job.sourceImageUrl,
              job.productName,
              productCategory,
              1,
              { aspectRatio: config.aspectRatio }
            )
            const firstShot = productShots[0]
            if (!firstShot) {
              throw new Error('No product shot generated')
            }
            imageUrl = firstShot
            break
          }

          case 'lifestyle':
            imageUrl = await generateLifestyleShot(
              job.sourceImageUrl,
              job.productName,
              productCategory,
              { aspectRatio: '16:9' }
            )
            break

          default:
            throw new Error(`Unknown variant type: ${variant.type}`)
        }

        const newImage = await createAndSaveImage(
          job.productId,
          imageUrl,
          variant.type,
          job.sourceImageId,
          variant.prompt
        )

        variant.status = 'completed'
        variant.resultImageId = newImage.id
        completedVariants++

        onProgress?.({
          type: 'variant_completed',
          jobId: job.id,
          variant,
          image: newImage,
          progress: Math.round((completedVariants / totalVariants) * 100),
        })
      } catch (error) {
        variant.status = 'failed'
        variant.error = error instanceof Error ? error.message : 'Unknown error'
        hasErrors = true
        completedVariants++

        onProgress?.({
          type: 'variant_failed',
          jobId: job.id,
          variant,
          progress: Math.round((completedVariants / totalVariants) * 100),
          error: variant.error,
        })
      }

      await saveJob(job)
    }
  }

  // Finalize job
  job.status = hasErrors && completedVariants === 0 ? 'failed' : 'completed'
  job.completedAt = new Date()
  job.progress = 100
  await saveJob(job)

  onProgress?.({
    type: job.status === 'completed' ? 'job_completed' : 'job_failed',
    jobId: job.id,
    progress: 100,
    error: hasErrors ? 'Some variants failed to generate' : undefined,
  })
}

/**
 * Create and save a new product image
 */
async function createAndSaveImage(
  productId: string,
  imageUrl: string,
  type: ImageType,
  originalImageId: string,
  prompt: string
): Promise<ProductImage> {
  // Get existing images to determine sort order
  const existingImages = await getProductImages(productId)
  const maxSortOrder = existingImages.reduce(
    (max, img) => Math.max(max, img.sortOrder),
    -1
  )

  // Create thumbnail
  let thumbnailUrl: string | undefined
  try {
    thumbnailUrl = await createThumbnail(imageUrl, 200)
  } catch {
    // Thumbnail creation failed, continue without it
  }

  const image: ProductImage = {
    id: generateImageId(),
    productId,
    url: imageUrl,
    thumbnailUrl,
    type,
    isPrimary: false,
    sortOrder: maxSortOrder + 1,
    originalImageId,
    enhancementPrompt: prompt,
    createdAt: new Date(),
  }

  await saveImage(image)
  return image
}

/**
 * Resume a failed or incomplete job
 */
export async function resumeEnhancementJob(
  jobId: string,
  productCategory: string,
  onProgress?: EnhancementProgressCallback
): Promise<void> {
  const job = await getJob(jobId)
  if (!job) {
    throw new Error(`Job not found: ${jobId}`)
  }

  if (job.status === 'completed') {
    throw new Error('Job is already completed')
  }

  // Reset failed variants to pending
  for (const variant of job.variants) {
    if (variant.status === 'failed') {
      variant.status = 'pending'
      variant.error = undefined
    }
  }

  await processEnhancementJob(
    job,
    productCategory,
    DEFAULT_ENHANCEMENT_CONFIG,
    onProgress
  )
}

/**
 * Cancel an in-progress job
 */
export async function cancelEnhancementJob(jobId: string): Promise<void> {
  const job = await getJob(jobId)
  if (!job) return

  if (job.status === 'processing') {
    job.status = 'failed'
    job.error = 'Cancelled by user'
    job.completedAt = new Date()
    await saveJob(job)
  }
}

/**
 * Get enhancement job status
 */
export async function getEnhancementJobStatus(
  jobId: string
): Promise<EnhancementJob | undefined> {
  return getJob(jobId)
}

/**
 * Quick enhance: upload image and immediately start enhancement
 */
export async function quickEnhance(
  file: File,
  productId: string,
  productName: string,
  productCategory: string,
  config?: Partial<EnhancementConfig>,
  onProgress?: EnhancementProgressCallback
): Promise<EnhancementJob> {
  // Convert file to base64
  const imageUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })

  // Create the source image
  const sourceImage: ProductImage = {
    id: generateImageId(),
    productId,
    url: imageUrl,
    type: 'original',
    isPrimary: true,
    sortOrder: 0,
    createdAt: new Date(),
  }

  // Save the original image
  await saveImage(sourceImage)

  // Start the enhancement job
  return startEnhancementJob(
    sourceImage,
    productName,
    productCategory,
    config,
    onProgress
  )
}

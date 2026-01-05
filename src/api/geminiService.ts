// =============================================================================
// Google Gemini API Service
// Integration with Google Nano Banana (Gemini Image) for AI image enhancement
// =============================================================================

import { getEnv } from '../lib/env'
import { extractBase64Data, createDataUrl } from '../lib/imageUtils'

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta'

/**
 * Response from Gemini image generation
 */
interface GeminiImageResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string
        inlineData?: {
          mimeType: string
          data: string
        }
      }>
    }
  }>
  error?: {
    code: number
    message: string
    status: string
  }
}

/**
 * Options for image generation
 */
export interface GenerateImageOptions {
  aspectRatio?: '1:1' | '4:3' | '16:9' | '3:4' | '9:16'
  numberOfImages?: number
}

/**
 * Check if Gemini API is configured
 */
export function isGeminiConfigured(): boolean {
  const env = getEnv()
  return !!env.VITE_GEMINI_API_KEY
}

/**
 * Get the configured Gemini model
 */
function getModel(): string {
  const env = getEnv()
  return env.VITE_GEMINI_MODEL || 'gemini-2.5-flash-preview-05-20'
}

/**
 * Make a request to the Gemini API
 */
async function callGeminiApi(
  prompt: string,
  imageBase64?: string,
  options: GenerateImageOptions = {}
): Promise<string[]> {
  const env = getEnv()
  const apiKey = env.VITE_GEMINI_API_KEY

  if (!apiKey) {
    throw new Error('Gemini API key not configured. Set VITE_GEMINI_API_KEY in your environment.')
  }

  const model = getModel()
  const endpoint = `${GEMINI_API_BASE}/models/${model}:generateContent?key=${apiKey}`

  // Build the request parts
  const parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = []

  // Add image if provided (for editing/enhancement)
  if (imageBase64) {
    const mimeType = imageBase64.match(/^data:([^;]+);/)?.[1] || 'image/jpeg'
    const data = extractBase64Data(imageBase64)
    parts.push({
      inlineData: {
        mimeType,
        data,
      },
    })
  }

  // Add the text prompt
  parts.push({ text: prompt })

  const requestBody = {
    contents: [{ parts }],
    generationConfig: {
      responseModalities: ['TEXT', 'IMAGE'],
      ...(options.aspectRatio && {
        imageGenerationConfig: {
          aspectRatio: options.aspectRatio,
        },
      }),
    },
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Gemini API error (${response.status}): ${errorText}`)
  }

  const result: GeminiImageResponse = await response.json()

  if (result.error) {
    throw new Error(`Gemini API error: ${result.error.message}`)
  }

  // Extract generated images from response
  const images: string[] = []
  const candidates = result.candidates || []

  for (const candidate of candidates) {
    const parts = candidate.content?.parts || []
    for (const part of parts) {
      if (part.inlineData) {
        const dataUrl = createDataUrl(part.inlineData.data, part.inlineData.mimeType)
        images.push(dataUrl)
      }
    }
  }

  return images
}

/**
 * Generate a clean product shot with professional background
 */
export async function generateCleanShot(
  imageBase64: string,
  productName: string,
  options: GenerateImageOptions = {}
): Promise<string> {
  const prompt = `Transform this product image into a professional e-commerce photo.
Create a clean, well-lit product shot with:
- Pure white or soft gradient background
- Professional studio lighting with soft shadows
- Product centered and well-composed
- Sharp focus on the product details
- Remove any distracting background elements

Product: ${productName}

Generate a single high-quality product image suitable for an online catalog.`

  const images = await callGeminiApi(prompt, imageBase64, {
    aspectRatio: options.aspectRatio || '1:1',
    ...options,
  })

  const firstImage = images[0]
  if (!firstImage) {
    throw new Error('No image generated for clean shot')
  }

  return firstImage
}

/**
 * Generate lifestyle/contextual product shots
 */
export async function generateProductShots(
  imageBase64: string,
  productName: string,
  productCategory: string,
  count: number = 3,
  options: GenerateImageOptions = {}
): Promise<string[]> {
  const contextPrompts = getContextPrompts(productCategory)
  const images: string[] = []

  // Generate multiple variations
  const promptsToUse = contextPrompts.slice(0, count)

  for (const contextPrompt of promptsToUse) {
    const prompt = `Create a beautiful lifestyle product photograph.

Product: ${productName}
Category: ${productCategory}

${contextPrompt}

Style requirements:
- Natural, warm lighting
- Elegant composition
- High-end catalog aesthetic
- Product should be the clear focal point
- Subtle, complementary background elements

Generate a single stunning product image.`

    try {
      const result = await callGeminiApi(prompt, imageBase64, {
        aspectRatio: options.aspectRatio || '4:3',
        ...options,
      })

      const firstResult = result[0]
      if (firstResult) {
        images.push(firstResult)
      }
    } catch (error) {
      console.error('Failed to generate product shot:', error)
      // Continue with other variations even if one fails
    }
  }

  return images
}

/**
 * Generate a lifestyle image showing product in use
 */
export async function generateLifestyleShot(
  imageBase64: string,
  productName: string,
  productCategory: string,
  options: GenerateImageOptions = {}
): Promise<string> {
  const lifestyleContext = getLifestyleContext(productCategory)

  const prompt = `Create an aspirational lifestyle photograph featuring this product.

Product: ${productName}
Category: ${productCategory}

Scene: ${lifestyleContext}

Requirements:
- Show the product being used or displayed in a real-world setting
- Create an emotional, aspirational atmosphere
- Use natural lighting and warm tones
- Include subtle environmental elements that complement the product
- Magazine-quality photography style
- The product should be clearly visible but integrated naturally

Generate a beautiful lifestyle image.`

  const images = await callGeminiApi(prompt, imageBase64, {
    aspectRatio: options.aspectRatio || '16:9',
    ...options,
  })

  const firstImage = images[0]
  if (!firstImage) {
    throw new Error('No image generated for lifestyle shot')
  }

  return firstImage
}

/**
 * Enhance an existing image (improve quality, lighting, etc.)
 */
export async function enhanceImage(
  imageBase64: string,
  customPrompt?: string
): Promise<string> {
  const prompt = customPrompt || `Enhance this product image:
- Improve lighting and color balance
- Increase sharpness and clarity
- Remove any imperfections or distractions
- Maintain the original product appearance
- Make it look professional and high-quality

Generate the enhanced version of this image.`

  const images = await callGeminiApi(prompt, imageBase64, {
    aspectRatio: '1:1',
  })

  const firstImage = images[0]
  if (!firstImage) {
    throw new Error('No image generated for enhancement')
  }

  return firstImage
}

/**
 * Get context-appropriate prompts based on product category
 */
function getContextPrompts(category: string): string[] {
  const categoryPrompts: Record<string, string[]> = {
    'Home Decor': [
      'Place the product in a cozy, modern living room setting with natural light streaming through windows.',
      'Show the product on a minimalist shelf with carefully curated decorative objects.',
      'Display in a Scandinavian-inspired interior with neutral tones and natural textures.',
      'Feature the product in a warm, inviting bedroom setting with soft textiles.',
    ],
    'Kitchen & Dining': [
      'Arrange on a beautifully set dining table with fresh ingredients and natural light.',
      'Show in a modern kitchen with marble countertops and copper accents.',
      'Display with artisanal food items and rustic wooden surfaces.',
      'Feature in a breakfast scene with morning light and fresh coffee.',
    ],
    'Garden & Outdoor': [
      'Place in a lush garden setting with blooming flowers and greenery.',
      'Show on a sunny patio with comfortable outdoor furniture.',
      'Display in a tranquil backyard oasis with natural elements.',
      'Feature in a cottage garden with romantic, overgrown plantings.',
    ],
    'Gift Sets': [
      'Arrange as a beautifully wrapped gift with elegant ribbons and tissue.',
      'Display on a gift table with celebratory elements and warm lighting.',
      'Show being unwrapped with excited, gift-giving atmosphere.',
      'Feature with luxurious packaging and premium presentation.',
    ],
    'Bath & Body': [
      'Place in a spa-like bathroom with candles, towels, and natural elements.',
      'Show arranged on a marble vanity with fresh flowers.',
      'Display in a self-care setting with bath accessories and soft lighting.',
      'Feature with botanical elements and calming, neutral backdrop.',
    ],
    Seasonal: [
      'Display in a festive holiday setting with appropriate seasonal decorations.',
      'Show in a cozy seasonal scene with warm textiles and ambient lighting.',
      'Feature with seasonal flora and traditional decorative elements.',
      'Arrange in a celebration setting with seasonal color palette.',
    ],
    Stationery: [
      'Place on a beautiful desk setup with creative workspace elements.',
      'Show with calligraphy tools, wax seals, and vintage accessories.',
      'Display in a writer\'s corner with books and warm lamp light.',
      'Feature in a productive morning routine setting.',
    ],
    Accessories: [
      'Display on a stylish dresser or vanity with personal items.',
      'Show being worn or used in a lifestyle context.',
      'Feature with complementary fashion or decor items.',
      'Arrange in a curated flat-lay with aesthetic accessories.',
    ],
  }

  return categoryPrompts[category] || [
    'Display in an elegant, neutral setting that highlights the product.',
    'Show in a warm, inviting environment with complementary elements.',
    'Feature with natural lighting and minimal, tasteful styling.',
    'Arrange in a lifestyle context appropriate for the product.',
  ]
}

/**
 * Get lifestyle context description based on category
 */
function getLifestyleContext(category: string): string {
  const contexts: Record<string, string> = {
    'Home Decor': 'A beautifully decorated living space where someone is enjoying a quiet moment, with the product adding warmth and character to the room.',
    'Kitchen & Dining': 'A warm kitchen or dining scene where friends or family gather, with the product being used as part of a memorable meal.',
    'Garden & Outdoor': 'A peaceful outdoor moment - perhaps morning coffee on the patio or tending to a beautiful garden.',
    'Gift Sets': 'A heartwarming gift-giving moment between loved ones, with genuine emotion and beautiful wrapping.',
    'Bath & Body': 'A luxurious self-care ritual, perhaps a relaxing bath or morning skincare routine.',
    Seasonal: 'A joyful seasonal celebration with family, traditions, and festive atmosphere.',
    Stationery: 'A creative moment of writing, planning, or artistic expression in a inspiring workspace.',
    Accessories: 'Someone putting the finishing touches on their outfit or space, with the product completing the look.',
  }

  return contexts[category] || 'A beautiful lifestyle moment where the product enhances everyday life.'
}

// =============================================================================
// Mock/Demo Mode (when API key not configured)
// =============================================================================

/**
 * Generate mock enhanced images for demo purposes
 * Uses placeholder service to simulate API response
 */
export async function generateMockImages(
  productName: string,
  count: number = 4
): Promise<string[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  const colors = ['e8e4df', 'd4a59a', 'a8d5ba', 'c4b8d1', 'f5d6ba']
  const images: string[] = []

  for (let i = 0; i < count; i++) {
    const color = colors[i % colors.length]
    const label = i === 0 ? 'Clean+Shot' : i === count - 1 ? 'Lifestyle' : `Product+${i}`
    images.push(
      `https://placehold.co/800x800/${color}/333333?text=${encodeURIComponent(productName)}%0A${label}`
    )
  }

  return images
}

/**
 * Check if we should use mock mode
 */
export function shouldUseMockMode(): boolean {
  return !isGeminiConfigured()
}

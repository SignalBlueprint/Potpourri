import { useState, useEffect, useCallback } from 'react'
import { Button } from './index'
import type {
  EnhancementJob,
  EnhancementConfig,
  ProductImage,
} from '../types/images'
import {
  DEFAULT_ENHANCEMENT_CONFIG,
  getImageTypeLabel,
  getImageTypeBadgeColor,
} from '../types/images'
import {
  startEnhancementJob,
  cancelEnhancementJob,
  type EnhancementEvent,
} from '../api/enhancementManager'
import { shouldUseMockMode } from '../api/geminiService'

// =============================================================================
// Types
// =============================================================================

interface EnhancementModalProps {
  isOpen: boolean
  onClose: () => void
  sourceImage: ProductImage | null
  productName: string
  productCategory: string
  onComplete: (generatedImages: ProductImage[]) => void
}

type ModalStep = 'configure' | 'processing' | 'results'

// =============================================================================
// EnhancementModal Component
// =============================================================================

export function EnhancementModal({
  isOpen,
  onClose,
  sourceImage,
  productName,
  productCategory,
  onComplete,
}: EnhancementModalProps) {
  const [step, setStep] = useState<ModalStep>('configure')
  const [config, setConfig] = useState<EnhancementConfig>(DEFAULT_ENHANCEMENT_CONFIG)
  const [job, setJob] = useState<EnhancementJob | null>(null)
  const [generatedImages, setGeneratedImages] = useState<ProductImage[]>([])
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set())
  const [error, setError] = useState<string | null>(null)

  const isMockMode = shouldUseMockMode()

  // Reset callback - memoized to avoid recreating on each render
  const resetState = useCallback(() => {
    setStep('configure')
    setConfig(DEFAULT_ENHANCEMENT_CONFIG)
    setJob(null)
    setGeneratedImages([])
    setSelectedImages(new Set())
    setError(null)
  }, [])

  // Reset state when modal opens - use layout effect for synchronous reset
  useEffect(() => {
    if (isOpen) {
      resetState()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  // Handle escape key
  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen && step !== 'processing') {
        onClose()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, step, onClose])

  const handleProgressUpdate = useCallback((event: EnhancementEvent) => {
    if (event.type === 'variant_completed' && event.image) {
      setGeneratedImages((prev) => [...prev, event.image!])
      setSelectedImages((prev) => new Set([...prev, event.image!.id]))
    }

    if (event.type === 'job_completed' || event.type === 'job_failed') {
      setStep('results')
      if (event.error) {
        setError(event.error)
      }
    }

    // Update job state for progress
    setJob((prev) =>
      prev ? { ...prev, progress: event.progress, status: event.type === 'job_failed' ? 'failed' : prev.status } : prev
    )
  }, [])

  const handleStartEnhancement = async () => {
    if (!sourceImage) return

    setStep('processing')
    setError(null)

    try {
      const newJob = await startEnhancementJob(
        sourceImage,
        productName,
        productCategory,
        config,
        handleProgressUpdate
      )
      setJob(newJob)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start enhancement')
      setStep('configure')
    }
  }

  const handleCancel = async () => {
    if (job) {
      await cancelEnhancementJob(job.id)
    }
    onClose()
  }

  const handleSelectAll = () => {
    setSelectedImages(new Set(generatedImages.map((img) => img.id)))
  }

  const handleSelectNone = () => {
    setSelectedImages(new Set())
  }

  const handleToggleImage = (imageId: string) => {
    setSelectedImages((prev) => {
      const next = new Set(prev)
      if (next.has(imageId)) {
        next.delete(imageId)
      } else {
        next.add(imageId)
      }
      return next
    })
  }

  const handleSaveSelected = () => {
    const selectedImagesList = generatedImages.filter((img) => selectedImages.has(img.id))
    onComplete(selectedImagesList)
    onClose()
  }

  if (!isOpen || !sourceImage) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={step !== 'processing' ? onClose : undefined}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="relative z-10 w-full max-w-2xl rounded-xl bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="enhancement-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
          <div>
            <h2 id="enhancement-modal-title" className="text-lg font-semibold text-neutral-900">
              AI Image Enhancement
            </h2>
            <p className="text-sm text-neutral-600">
              {isMockMode ? 'Demo Mode (no API key)' : 'Powered by Google Nano Banana'}
            </p>
          </div>
          {step !== 'processing' && (
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
              aria-label="Close modal"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Content */}
        <div className="max-h-[60vh] overflow-y-auto p-6">
          {step === 'configure' && (
            <ConfigureStep
              sourceImage={sourceImage}
              config={config}
              onConfigChange={setConfig}
              productName={productName}
            />
          )}

          {step === 'processing' && (
            <ProcessingStep job={job} generatedImages={generatedImages} />
          )}

          {step === 'results' && (
            <ResultsStep
              generatedImages={generatedImages}
              selectedImages={selectedImages}
              onToggleImage={handleToggleImage}
              onSelectAll={handleSelectAll}
              onSelectNone={handleSelectNone}
              error={error}
            />
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-neutral-200 px-6 py-4">
          {step === 'configure' && (
            <>
              <p className="text-sm text-neutral-500">
                {getTotalVariants(config)} images will be generated
              </p>
              <div className="flex gap-3">
                <Button variant="secondary" onClick={onClose}>
                  Cancel
                </Button>
                <Button onClick={handleStartEnhancement}>
                  Start Enhancement
                </Button>
              </div>
            </>
          )}

          {step === 'processing' && (
            <>
              <p className="text-sm text-neutral-500">
                Processing... {job?.progress || 0}% complete
              </p>
              <Button variant="secondary" onClick={handleCancel}>
                Cancel
              </Button>
            </>
          )}

          {step === 'results' && (
            <>
              <p className="text-sm text-neutral-500">
                {selectedImages.size} of {generatedImages.length} images selected
              </p>
              <div className="flex gap-3">
                <Button variant="secondary" onClick={onClose}>
                  Discard All
                </Button>
                <Button onClick={handleSaveSelected} disabled={selectedImages.size === 0}>
                  Save Selected ({selectedImages.size})
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// Configure Step
// =============================================================================

interface ConfigureStepProps {
  sourceImage: ProductImage
  config: EnhancementConfig
  onConfigChange: (config: EnhancementConfig) => void
  productName: string
}

function ConfigureStep({ sourceImage, config, onConfigChange, productName }: ConfigureStepProps) {
  return (
    <div className="space-y-6">
      {/* Source image preview */}
      <div className="flex gap-4">
        <div className="h-32 w-32 flex-shrink-0 overflow-hidden rounded-lg bg-neutral-100">
          <img
            src={sourceImage.url}
            alt="Source"
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <h3 className="font-medium text-neutral-900">{productName}</h3>
          <p className="text-sm text-neutral-600">Original image will be enhanced to create professional product photos.</p>
        </div>
      </div>

      {/* Configuration options */}
      <div className="space-y-4">
        <h4 className="font-medium text-neutral-900">Enhancement Options</h4>

        {/* Clean shot toggle */}
        <label className="flex items-center justify-between rounded-lg border border-neutral-200 p-4 hover:bg-neutral-50">
          <div>
            <p className="font-medium text-neutral-800">Clean Product Shot</p>
            <p className="text-sm text-neutral-600">Professional white background with studio lighting</p>
          </div>
          <input
            type="checkbox"
            checked={config.generateCleanShot}
            onChange={(e) =>
              onConfigChange({ ...config, generateCleanShot: e.target.checked })
            }
            className="h-5 w-5 rounded border-neutral-300 text-brand-primary focus:ring-brand-primary"
          />
        </label>

        {/* Product shots count */}
        <div className="rounded-lg border border-neutral-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-neutral-800">Product Shot Variations</p>
              <p className="text-sm text-neutral-600">Different angles and styling contexts</p>
            </div>
            <select
              value={config.productShotCount}
              onChange={(e) =>
                onConfigChange({ ...config, productShotCount: parseInt(e.target.value) })
              }
              className="rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
            >
              <option value={0}>None</option>
              <option value={1}>1 variation</option>
              <option value={2}>2 variations</option>
              <option value={3}>3 variations</option>
              <option value={4}>4 variations</option>
              <option value={5}>5 variations</option>
            </select>
          </div>
        </div>

        {/* Lifestyle shot toggle */}
        <label className="flex items-center justify-between rounded-lg border border-neutral-200 p-4 hover:bg-neutral-50">
          <div>
            <p className="font-medium text-neutral-800">Lifestyle Shot</p>
            <p className="text-sm text-neutral-600">Product in a real-world context setting</p>
          </div>
          <input
            type="checkbox"
            checked={config.lifestyleShot}
            onChange={(e) =>
              onConfigChange({ ...config, lifestyleShot: e.target.checked })
            }
            className="h-5 w-5 rounded border-neutral-300 text-brand-primary focus:ring-brand-primary"
          />
        </label>

        {/* Aspect ratio */}
        <div className="rounded-lg border border-neutral-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-neutral-800">Aspect Ratio</p>
              <p className="text-sm text-neutral-600">Output image dimensions</p>
            </div>
            <select
              value={config.aspectRatio}
              onChange={(e) =>
                onConfigChange({
                  ...config,
                  aspectRatio: e.target.value as EnhancementConfig['aspectRatio'],
                })
              }
              className="rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
            >
              <option value="1:1">1:1 (Square)</option>
              <option value="4:3">4:3 (Standard)</option>
              <option value="3:4">3:4 (Portrait)</option>
              <option value="16:9">16:9 (Widescreen)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// Processing Step
// =============================================================================

interface ProcessingStepProps {
  job: EnhancementJob | null
  generatedImages: ProductImage[]
}

function ProcessingStep({ job, generatedImages }: ProcessingStepProps) {
  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-neutral-700">Generating images...</span>
          <span className="text-neutral-600">{job?.progress || 0}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-neutral-200">
          <div
            className="h-full bg-brand-primary transition-all duration-300"
            style={{ width: `${job?.progress || 0}%` }}
          />
        </div>
      </div>

      {/* Current variant status */}
      {job?.variants && (
        <div className="space-y-2">
          {job.variants.map((variant, index) => (
            <div
              key={index}
              className="flex items-center gap-3 rounded-lg bg-neutral-50 px-4 py-3"
            >
              {/* Status icon */}
              {variant.status === 'pending' && (
                <div className="h-5 w-5 rounded-full border-2 border-neutral-300" />
              )}
              {variant.status === 'processing' && (
                <svg className="h-5 w-5 animate-spin text-brand-primary" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              )}
              {variant.status === 'completed' && (
                <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              )}
              {variant.status === 'failed' && (
                <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              )}

              {/* Label */}
              <span className={`text-sm ${variant.status === 'processing' ? 'font-medium text-neutral-900' : 'text-neutral-600'}`}>
                {getImageTypeLabel(variant.type)}
              </span>

              {/* Error message */}
              {variant.error && (
                <span className="ml-auto text-xs text-red-600">{variant.error}</span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Preview of generated images */}
      {generatedImages.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-medium text-neutral-700">Generated so far:</p>
          <div className="grid grid-cols-4 gap-2">
            {generatedImages.map((img) => (
              <div key={img.id} className="aspect-square overflow-hidden rounded-lg bg-neutral-100">
                <img src={img.url} alt="" className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// =============================================================================
// Results Step
// =============================================================================

interface ResultsStepProps {
  generatedImages: ProductImage[]
  selectedImages: Set<string>
  onToggleImage: (id: string) => void
  onSelectAll: () => void
  onSelectNone: () => void
  error: string | null
}

function ResultsStep({
  generatedImages,
  selectedImages,
  onToggleImage,
  onSelectAll,
  onSelectNone,
  error,
}: ResultsStepProps) {
  return (
    <div className="space-y-4">
      {/* Error message */}
      {error && (
        <div className="rounded-lg bg-amber-50 p-3">
          <p className="text-sm text-amber-800">{error}</p>
        </div>
      )}

      {/* Success message */}
      {generatedImages.length > 0 && (
        <div className="rounded-lg bg-green-50 p-3">
          <p className="text-sm text-green-800">
            Successfully generated {generatedImages.length} image{generatedImages.length !== 1 ? 's' : ''}!
            Select which ones to add to your product.
          </p>
        </div>
      )}

      {/* Selection controls */}
      {generatedImages.length > 1 && (
        <div className="flex gap-2">
          <button
            onClick={onSelectAll}
            className="text-sm text-brand-primary hover:underline"
          >
            Select all
          </button>
          <span className="text-neutral-300">|</span>
          <button
            onClick={onSelectNone}
            className="text-sm text-brand-primary hover:underline"
          >
            Select none
          </button>
        </div>
      )}

      {/* Image grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {generatedImages.map((image) => (
          <button
            key={image.id}
            onClick={() => onToggleImage(image.id)}
            className={`
              group relative aspect-square overflow-hidden rounded-lg border-2 transition-all
              ${selectedImages.has(image.id) ? 'border-brand-primary ring-2 ring-brand-primary/20' : 'border-transparent hover:border-neutral-300'}
            `}
          >
            <img
              src={image.url}
              alt={getImageTypeLabel(image.type)}
              className="h-full w-full object-cover"
            />

            {/* Type badge */}
            <div className={`absolute bottom-2 left-2 rounded px-2 py-1 text-xs font-medium ${getImageTypeBadgeColor(image.type)}`}>
              {getImageTypeLabel(image.type)}
            </div>

            {/* Selection indicator */}
            <div
              className={`
                absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all
                ${selectedImages.has(image.id) ? 'border-brand-primary bg-brand-primary' : 'border-white bg-white/80'}
              `}
            >
              {selectedImages.has(image.id) && (
                <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Empty state */}
      {generatedImages.length === 0 && !error && (
        <div className="py-8 text-center">
          <p className="text-neutral-600">No images were generated. Please try again.</p>
        </div>
      )}
    </div>
  )
}

// =============================================================================
// Helpers
// =============================================================================

function getTotalVariants(config: EnhancementConfig): number {
  let count = 0
  if (config.generateCleanShot) count++
  count += config.productShotCount
  if (config.lifestyleShot) count++
  return count
}

import { useState, useRef, useCallback, type DragEvent, type ChangeEvent } from 'react'
import {
  validateImageFile,
  fileToBase64,
  getImageDimensions,
} from '../lib/imageUtils'
import { IMAGE_CONSTRAINTS, SUPPORTED_IMAGE_FORMATS } from '../types/images'

// =============================================================================
// Types
// =============================================================================

export interface UploadedImage {
  id: string
  file: File
  previewUrl: string
  width: number
  height: number
}

interface ImageUploaderProps {
  onImagesSelected: (images: UploadedImage[]) => void
  maxImages?: number
  existingCount?: number
  className?: string
}

// =============================================================================
// ImageUploader Component
// =============================================================================

export function ImageUploader({
  onImagesSelected,
  maxImages = IMAGE_CONSTRAINTS.maxImagesPerProduct,
  existingCount = 0,
  className = '',
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const remainingSlots = maxImages - existingCount

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      if (remainingSlots <= 0) {
        setError(`Maximum ${maxImages} images allowed`)
        return
      }

      setIsProcessing(true)
      setError(null)

      const fileArray = Array.from(files).slice(0, remainingSlots)
      const validImages: UploadedImage[] = []
      const errors: string[] = []

      for (const file of fileArray) {
        const validation = validateImageFile(file)
        if (!validation.valid) {
          errors.push(`${file.name}: ${validation.error}`)
          continue
        }

        try {
          const previewUrl = await fileToBase64(file)
          const dimensions = await getImageDimensions(previewUrl)

          // Check minimum dimensions
          if (
            dimensions.width < IMAGE_CONSTRAINTS.minWidth ||
            dimensions.height < IMAGE_CONSTRAINTS.minHeight
          ) {
            errors.push(
              `${file.name}: Image too small (minimum ${IMAGE_CONSTRAINTS.minWidth}x${IMAGE_CONSTRAINTS.minHeight}px)`
            )
            continue
          }

          validImages.push({
            id: `upload_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
            file,
            previewUrl,
            width: dimensions.width,
            height: dimensions.height,
          })
        } catch {
          errors.push(`${file.name}: Failed to process image`)
        }
      }

      setIsProcessing(false)

      if (errors.length > 0) {
        setError(errors.join('\n'))
      }

      if (validImages.length > 0) {
        onImagesSelected(validImages)
      }
    },
    [maxImages, remainingSlots, onImagesSelected]
  )

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)

      const files = e.dataTransfer.files
      if (files.length > 0) {
        handleFiles(files)
      }
    },
    [handleFiles]
  )

  const handleFileInput = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (files && files.length > 0) {
        handleFiles(files)
      }
      // Reset input so same file can be selected again
      e.target.value = ''
    },
    [handleFiles]
  )

  const openFilePicker = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const acceptTypes = SUPPORTED_IMAGE_FORMATS.join(',')

  return (
    <div className={className}>
      {/* Drop zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFilePicker}
        className={`
          relative cursor-pointer rounded-xl border-2 border-dashed p-8
          transition-all duration-200
          ${
            isDragging
              ? 'border-brand-primary bg-brand-primary/5'
              : 'border-neutral-300 hover:border-brand-primary hover:bg-neutral-50'
          }
          ${isProcessing ? 'pointer-events-none opacity-50' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptTypes}
          multiple
          onChange={handleFileInput}
          className="hidden"
          disabled={remainingSlots <= 0}
        />

        <div className="flex flex-col items-center text-center">
          {/* Upload icon */}
          <div
            className={`
              mb-4 rounded-full p-3
              ${isDragging ? 'bg-brand-primary/10' : 'bg-neutral-100'}
            `}
          >
            <svg
              className={`h-8 w-8 ${isDragging ? 'text-brand-primary' : 'text-neutral-400'}`}
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
              />
            </svg>
          </div>

          {/* Instructions */}
          <p className="mb-1 text-sm font-medium text-neutral-700">
            {isDragging ? (
              'Drop images here'
            ) : (
              <>
                <span className="text-brand-primary">Click to upload</span> or drag and drop
              </>
            )}
          </p>
          <p className="text-xs text-neutral-500">
            PNG, JPG, WebP or GIF (max {IMAGE_CONSTRAINTS.maxFileSizeDisplay})
          </p>
          {remainingSlots < maxImages && (
            <p className="mt-2 text-xs text-neutral-500">
              {remainingSlots} of {maxImages} slots remaining
            </p>
          )}

          {/* Processing indicator */}
          {isProcessing && (
            <div className="mt-4 flex items-center gap-2 text-sm text-neutral-600">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Processing images...
            </div>
          )}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="mt-3 rounded-lg bg-red-50 p-3">
          <div className="flex items-start gap-2">
            <svg
              className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                clipRule="evenodd"
              />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">Upload Error</p>
              <pre className="mt-1 whitespace-pre-wrap text-xs text-red-700">{error}</pre>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setError(null)
              }}
              className="text-red-500 hover:text-red-700"
            >
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// =============================================================================
// ImagePreviewGrid - Display uploaded images with actions
// =============================================================================

interface ImagePreviewGridProps {
  images: Array<{
    id: string
    url: string
    isPrimary?: boolean
    type?: string
  }>
  onRemove: (id: string) => void
  onSetPrimary?: (id: string) => void
  onReorder?: (fromIndex: number, toIndex: number) => void
  onEnhance?: (id: string) => void
  className?: string
}

export function ImagePreviewGrid({
  images,
  onRemove,
  onSetPrimary,
  onEnhance,
  className = '',
}: ImagePreviewGridProps) {
  if (images.length === 0) return null

  return (
    <div className={`grid grid-cols-3 gap-3 sm:grid-cols-4 ${className}`}>
      {images.map((image, index) => (
        <div
          key={image.id}
          className="group relative aspect-square overflow-hidden rounded-lg bg-neutral-100"
        >
          {/* Image */}
          <img
            src={image.url}
            alt={`Product image ${index + 1}`}
            className="h-full w-full object-cover"
          />

          {/* Primary badge */}
          {image.isPrimary && (
            <div className="absolute left-1 top-1 rounded bg-brand-primary px-1.5 py-0.5 text-xs font-medium text-white">
              Primary
            </div>
          )}

          {/* Type badge */}
          {image.type && image.type !== 'original' && (
            <div className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-xs text-white">
              {image.type.replace('_', ' ')}
            </div>
          )}

          {/* Hover overlay with actions */}
          <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
            {onSetPrimary && !image.isPrimary && (
              <button
                onClick={() => onSetPrimary(image.id)}
                className="rounded-full bg-white/90 p-1.5 text-neutral-700 transition-colors hover:bg-white hover:text-brand-primary"
                title="Set as primary"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                </svg>
              </button>
            )}
            {onEnhance && image.type === 'original' && (
              <button
                onClick={() => onEnhance(image.id)}
                className="rounded-full bg-white/90 p-1.5 text-neutral-700 transition-colors hover:bg-white hover:text-brand-primary"
                title="Enhance with AI"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                </svg>
              </button>
            )}
            <button
              onClick={() => onRemove(image.id)}
              className="rounded-full bg-white/90 p-1.5 text-neutral-700 transition-colors hover:bg-white hover:text-red-600"
              title="Remove image"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

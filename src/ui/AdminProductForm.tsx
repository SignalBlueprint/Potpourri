import { useState, useEffect, type FormEvent, useMemo, useCallback } from 'react'
import { Button, Input } from './index'
import type { AdminProduct } from './AdminProductsTable'
import { ImageUploader, ImagePreviewGrid, type UploadedImage } from './ImageUploader'
import { EnhancementModal } from './EnhancementModal'
import type { ProductImage } from '../types/images'
import { generateImageId } from '../types/images'
import { saveImage, getProductImages, deleteImage, setPrimaryImage as setStoredPrimaryImage } from '../api/imageStorage'
import { createThumbnail } from '../lib/imageUtils'

// =============================================================================
// Types
// =============================================================================

export interface ProductFormData {
  name: string
  category: string
  price: string
  stock: string
  status: AdminProduct['status']
  images?: ProductImage[]
}

interface AdminProductFormProps {
  isOpen: boolean
  onClose: () => void
  onSave: (product: ProductFormData) => void
  product?: AdminProduct | null
  categories?: string[]
}

// =============================================================================
// Default categories
// =============================================================================

const defaultCategories = [
  'Home Decor',
  'Kitchen & Dining',
  'Garden & Outdoor',
  'Gift Sets',
  'Seasonal',
]

// =============================================================================
// Form validation
// =============================================================================

interface FormErrors {
  name?: string
  category?: string
  price?: string
  stock?: string
}

function validateForm(data: ProductFormData): FormErrors {
  const errors: FormErrors = {}

  if (!data.name.trim()) {
    errors.name = 'Product name is required'
  } else if (data.name.trim().length < 2) {
    errors.name = 'Product name must be at least 2 characters'
  }

  if (!data.category.trim()) {
    errors.category = 'Category is required'
  }

  const price = parseFloat(data.price)
  if (!data.price.trim()) {
    errors.price = 'Price is required'
  } else if (isNaN(price) || price < 0) {
    errors.price = 'Price must be a valid positive number'
  }

  const stock = parseInt(data.stock, 10)
  if (!data.stock.trim()) {
    errors.stock = 'Stock is required'
  } else if (isNaN(stock) || stock < 0 || !Number.isInteger(stock)) {
    errors.stock = 'Stock must be a valid non-negative integer'
  }

  return errors
}

// =============================================================================
// Form content component (remounts when key changes to reset state)
// =============================================================================

interface ProductFormContentProps {
  product?: AdminProduct | null
  categories: string[]
  onClose: () => void
  onSave: (product: ProductFormData) => void
}

function ProductFormContent({
  product,
  categories,
  onClose,
  onSave,
}: ProductFormContentProps) {
  const isEditing = !!product
  // Generate stable ID for new products - useState initializer only runs once
  const [newProductId] = useState(() => `new_${Date.now()}`)
  const productId = product?.id || newProductId

  // Compute initial form data based on product
  const initialFormData = useMemo<ProductFormData>(() => {
    if (product) {
      return {
        name: product.name,
        category: product.category,
        price: product.price.toString(),
        stock: product.stock.toString(),
        status: product.status,
      }
    }
    return {
      name: '',
      category: categories[0] || '',
      price: '',
      stock: '',
      status: 'active',
    }
  }, [product, categories])

  const [formData, setFormData] = useState<ProductFormData>(initialFormData)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Image management state
  const [images, setImages] = useState<ProductImage[]>([])
  const [isLoadingImages, setIsLoadingImages] = useState(false)
  const [isSavingImages, setIsSavingImages] = useState(false)
  const [saveProgress, setSaveProgress] = useState({ current: 0, total: 0 })
  const [enhancementModalOpen, setEnhancementModalOpen] = useState(false)
  const [selectedImageForEnhancement, setSelectedImageForEnhancement] = useState<ProductImage | null>(null)

  // Load existing images for product
  useEffect(() => {
    if (isEditing && product?.id) {
      // Loading state is set synchronously, then async data fetch updates it
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsLoadingImages(true)
      getProductImages(product.id)
        .then(setImages)
        .catch(console.error)
        .finally(() => setIsLoadingImages(false))
    }
  }, [isEditing, product?.id])

  const handleImagesSelected = useCallback(async (uploadedImages: UploadedImage[]) => {
    const newImages: ProductImage[] = []
    setIsSavingImages(true)
    setSaveProgress({ current: 0, total: uploadedImages.length })

    for (let i = 0; i < uploadedImages.length; i++) {
      const uploaded = uploadedImages[i]!
      setSaveProgress({ current: i + 1, total: uploadedImages.length })

      // Create thumbnail
      let thumbnailUrl: string | undefined
      try {
        thumbnailUrl = await createThumbnail(uploaded.previewUrl, 200)
      } catch {
        // Continue without thumbnail
      }

      const newImage: ProductImage = {
        id: generateImageId(),
        productId,
        url: uploaded.previewUrl,
        thumbnailUrl,
        type: 'original',
        isPrimary: images.length === 0 && newImages.length === 0, // First image is primary
        sortOrder: images.length + newImages.length,
        width: uploaded.width,
        height: uploaded.height,
        createdAt: new Date(),
      }

      newImages.push(newImage)

      // Save to IndexedDB
      try {
        await saveImage(newImage)
      } catch (error) {
        console.error('Failed to save image:', error)
      }
    }

    setIsSavingImages(false)
    setSaveProgress({ current: 0, total: 0 })
    setImages((prev) => [...prev, ...newImages])
  }, [productId, images.length])

  const handleRemoveImage = useCallback(async (imageId: string) => {
    try {
      await deleteImage(imageId)
      setImages((prev) => {
        const filtered = prev.filter((img) => img.id !== imageId)
        // If removed image was primary, make first remaining image primary
        const firstImage = filtered[0]
        if (firstImage && !filtered.some((img) => img.isPrimary)) {
          firstImage.isPrimary = true
        }
        return filtered
      })
    } catch (error) {
      console.error('Failed to delete image:', error)
    }
  }, [])

  const handleSetPrimaryImage = useCallback(async (imageId: string) => {
    try {
      await setStoredPrimaryImage(productId, imageId)
      setImages((prev) =>
        prev.map((img) => ({
          ...img,
          isPrimary: img.id === imageId,
        }))
      )
    } catch (error) {
      console.error('Failed to set primary image:', error)
    }
  }, [productId])

  const handleEnhanceImage = useCallback((imageId: string) => {
    const image = images.find((img) => img.id === imageId)
    if (image) {
      setSelectedImageForEnhancement(image)
      setEnhancementModalOpen(true)
    }
  }, [images])

  const handleEnhancementComplete = useCallback((generatedImages: ProductImage[]) => {
    setImages((prev) => [...prev, ...generatedImages])
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    const validationErrors = validateForm(formData)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setIsSubmitting(true)
    // Simulate async save
    await new Promise((resolve) => setTimeout(resolve, 500))
    onSave({ ...formData, images })
    setIsSubmitting(false)
    onClose()
  }

  const handleInputChange = (field: keyof ProductFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h2
          id="product-form-title"
          className="text-xl font-semibold text-neutral-900"
        >
          {isEditing ? 'Edit Product' : 'Add New Product'}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
          aria-label="Close modal"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Product Name */}
        <Input
          label="Product Name"
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="Enter product name"
          error={errors.name}
          autoFocus
        />

        {/* Category */}
        <div className="space-y-1.5">
          <label
            htmlFor="category"
            className="block text-sm font-medium text-neutral-800"
          >
            Category
          </label>
          <select
            id="category"
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className={`
              block w-full rounded-lg border bg-white
              px-4 py-2.5 text-neutral-900
              transition-colors duration-200
              hover:border-neutral-300
              focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20
              ${errors.category ? 'border-red-300' : 'border-neutral-200'}
            `}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-sm text-red-600">{errors.category}</p>
          )}
        </div>

        {/* Product Images */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-neutral-800">
            Product Images
          </label>

          {/* Existing images grid */}
          {isLoadingImages ? (
            <div className="flex items-center justify-center py-8">
              <svg className="h-6 w-6 animate-spin text-neutral-400" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          ) : (
            <>
              {images.length > 0 && (
                <ImagePreviewGrid
                  images={images.map((img) => ({
                    id: img.id,
                    url: img.thumbnailUrl || img.url,
                    isPrimary: img.isPrimary,
                    type: img.type,
                  }))}
                  onRemove={handleRemoveImage}
                  onSetPrimary={handleSetPrimaryImage}
                  onEnhance={handleEnhanceImage}
                />
              )}

              {/* Saving progress indicator */}
              {isSavingImages && (
                <div className="rounded-lg bg-blue-50 p-3">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium text-blue-700">
                      Saving images...
                    </span>
                    <span className="text-blue-600">
                      {saveProgress.current} / {saveProgress.total}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-blue-200">
                    <div
                      className="h-full rounded-full bg-blue-600 transition-all duration-300"
                      style={{
                        width: `${saveProgress.total > 0 ? (saveProgress.current / saveProgress.total) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Upload area */}
              {!isSavingImages && (
                <ImageUploader
                  onImagesSelected={handleImagesSelected}
                  existingCount={images.length}
                />
              )}

              {/* AI Enhancement hint */}
              {images.some((img) => img.type === 'original') && (
                <p className="text-xs text-neutral-500">
                  Tip: Click the sparkle icon on original images to generate AI-enhanced product shots
                </p>
              )}
            </>
          )}
        </div>

        {/* Price and Stock row */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Price ($)"
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={(e) => handleInputChange('price', e.target.value)}
            placeholder="0.00"
            error={errors.price}
          />
          <Input
            label="Stock"
            type="number"
            step="1"
            min="0"
            value={formData.stock}
            onChange={(e) => handleInputChange('stock', e.target.value)}
            placeholder="0"
            error={errors.stock}
          />
        </div>

        {/* Status */}
        <div className="space-y-1.5">
          <label
            htmlFor="status"
            className="block text-sm font-medium text-neutral-800"
          >
            Status
          </label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) =>
              handleInputChange('status', e.target.value as AdminProduct['status'])
            }
            className="block w-full rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-neutral-900 transition-colors duration-200 hover:border-neutral-300 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
          >
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? 'Saving...'
              : isEditing
                ? 'Save Changes'
                : 'Add Product'}
          </Button>
        </div>
      </form>

      {/* Enhancement Modal */}
      <EnhancementModal
        isOpen={enhancementModalOpen}
        onClose={() => {
          setEnhancementModalOpen(false)
          setSelectedImageForEnhancement(null)
        }}
        sourceImage={selectedImageForEnhancement}
        productName={formData.name || 'Product'}
        productCategory={formData.category}
        onComplete={handleEnhancementComplete}
      />
    </>
  )
}

// =============================================================================
// AdminProductForm component
// =============================================================================

export function AdminProductForm({
  isOpen,
  onClose,
  onSave,
  product,
  categories = defaultCategories,
}: AdminProductFormProps) {
  // Handle escape key to close modal
  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen) return null

  // Use a key to force remount of form content when product changes
  const formKey = product?.id || 'new'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-form-title"
      >
        <ProductFormContent
          key={formKey}
          product={product}
          categories={categories}
          onClose={onClose}
          onSave={onSave}
        />
      </div>
    </div>
  )
}

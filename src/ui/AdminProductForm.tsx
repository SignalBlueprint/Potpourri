import { useState, useEffect, type FormEvent, useMemo } from 'react'
import { Button, Input } from './index'
import type { AdminProduct } from './AdminProductsTable'

// =============================================================================
// Types
// =============================================================================

export interface ProductFormData {
  name: string
  category: string
  price: string
  stock: string
  status: AdminProduct['status']
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
    onSave(formData)
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
        className="relative z-10 w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl"
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

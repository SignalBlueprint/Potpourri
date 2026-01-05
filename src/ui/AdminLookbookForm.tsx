import { useState, useEffect, useCallback, type FormEvent } from 'react'
import { Button, Input } from './index'
import { ImageUploader, ImagePreviewGrid, type UploadedImage } from './ImageUploader'
import type { Lookbook, LookbookPage, LookbookLayout, ProductImage } from '../types/images'
import { generateImageId } from '../types/images'
import { saveLookbook, getLookbook } from '../api/imageStorage'
import { createThumbnail } from '../lib/imageUtils'

// =============================================================================
// Types
// =============================================================================

interface AdminLookbookFormProps {
  isOpen: boolean
  onClose: () => void
  onSave?: () => void
  lookbookId?: string | null
}

interface PageFormData {
  id: string
  title: string
  subtitle: string
  layout: LookbookLayout
  backgroundColor: string
  textColor: string
  images: ProductImage[]
}

// =============================================================================
// Layout options
// =============================================================================

const layoutOptions: { value: LookbookLayout; label: string; description: string }[] = [
  { value: 'hero', label: 'Hero', description: 'Single large image' },
  { value: 'grid-2', label: 'Grid 2', description: '2 column grid' },
  { value: 'grid-3', label: 'Grid 3', description: '3 column grid' },
  { value: 'grid-4', label: 'Grid 4', description: '4 column grid' },
  { value: 'masonry', label: 'Masonry', description: 'Pinterest-style layout' },
  { value: 'split', label: 'Split', description: '50/50 split layout' },
]

// =============================================================================
// Form Content
// =============================================================================

interface LookbookFormContentProps {
  lookbookId?: string | null
  onClose: () => void
  onSave?: () => void
}

function LookbookFormContent({ lookbookId, onClose, onSave }: LookbookFormContentProps) {
  const isEditing = !!lookbookId

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isPublished, setIsPublished] = useState(false)
  const [pages, setPages] = useState<PageFormData[]>([])
  const [activePage, setActivePage] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load existing lookbook
  useEffect(() => {
    if (lookbookId) {
      setIsLoading(true)
      getLookbook(lookbookId)
        .then((lb) => {
          if (lb) {
            setName(lb.name)
            setDescription(lb.description || '')
            setIsPublished(lb.isPublished)
            setPages(
              lb.pages.map((p) => ({
                id: p.id,
                title: p.title || '',
                subtitle: p.subtitle || '',
                layout: p.layout,
                backgroundColor: p.backgroundColor || '#fafafa',
                textColor: p.textColor || '#1a1a1a',
                images: p.images,
              }))
            )
          }
        })
        .catch(console.error)
        .finally(() => setIsLoading(false))
    }
  }, [lookbookId])

  // Add a new page
  const addPage = useCallback(() => {
    const newPage: PageFormData = {
      id: `page_${Date.now()}`,
      title: '',
      subtitle: '',
      layout: 'grid-2',
      backgroundColor: '#fafafa',
      textColor: '#1a1a1a',
      images: [],
    }
    setPages((prev) => [...prev, newPage])
    setActivePage(pages.length)
  }, [pages.length])

  // Remove a page
  const removePage = useCallback((index: number) => {
    setPages((prev) => prev.filter((_, i) => i !== index))
    setActivePage((prev) => Math.max(0, prev - 1))
  }, [])

  // Update page field
  const updatePage = useCallback(
    (index: number, field: keyof PageFormData, value: string | LookbookLayout | ProductImage[]) => {
      setPages((prev) =>
        prev.map((p, i) => (i === index ? { ...p, [field]: value } : p))
      )
    },
    []
  )

  // Handle images for current page
  const handleImagesSelected = useCallback(
    async (uploadedImages: UploadedImage[]) => {
      const currentPage = pages[activePage]
      if (!currentPage) return

      const newImages: ProductImage[] = []

      for (const uploaded of uploadedImages) {
        let thumbnailUrl: string | undefined
        try {
          thumbnailUrl = await createThumbnail(uploaded.previewUrl, 200)
        } catch {
          // Continue without thumbnail
        }

        const newImage: ProductImage = {
          id: generateImageId(),
          productId: `lookbook_${currentPage.id}`,
          url: uploaded.previewUrl,
          thumbnailUrl,
          type: 'original',
          isPrimary: currentPage.images.length === 0 && newImages.length === 0,
          sortOrder: currentPage.images.length + newImages.length,
          width: uploaded.width,
          height: uploaded.height,
          createdAt: new Date(),
        }
        newImages.push(newImage)
      }

      updatePage(activePage, 'images', [...currentPage.images, ...newImages])
    },
    [activePage, pages, updatePage]
  )

  const handleRemoveImage = useCallback(
    (imageId: string) => {
      const currentPage = pages[activePage]
      if (!currentPage) return

      const filteredImages = currentPage.images.filter((img) => img.id !== imageId)
      updatePage(activePage, 'images', filteredImages)
    },
    [activePage, pages, updatePage]
  )

  // Save lookbook
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!name.trim()) {
      setError('Lookbook name is required')
      return
    }

    if (pages.length === 0) {
      setError('Add at least one page to your lookbook')
      return
    }

    setIsSaving(true)

    try {
      const lookbook: Lookbook = {
        id: lookbookId || `lookbook_${Date.now()}`,
        name: name.trim(),
        description: description.trim() || undefined,
        coverImage: pages[0]?.images[0],
        pages: pages.map((p, i): LookbookPage => ({
          id: p.id,
          title: p.title.trim() || undefined,
          subtitle: p.subtitle.trim() || undefined,
          layout: p.layout,
          backgroundColor: p.backgroundColor,
          textColor: p.textColor,
          images: p.images,
          sortOrder: i,
        })),
        isPublished,
        publishedAt: isPublished ? new Date() : undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      await saveLookbook(lookbook)
      onSave?.()
      onClose()
    } catch (err) {
      console.error('Failed to save lookbook:', err)
      setError('Failed to save lookbook. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <svg className="h-8 w-8 animate-spin text-neutral-400" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    )
  }

  const currentPage = pages[activePage]

  return (
    <>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-neutral-900">
          {isEditing ? 'Edit Lookbook' : 'Create Lookbook'}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error message */}
        {error && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Basic Info */}
        <div className="space-y-4">
          <Input
            label="Lookbook Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Spring Collection 2024"
            autoFocus
          />

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-neutral-800">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your lookbook..."
              className="block w-full rounded-lg border border-neutral-200 px-4 py-2.5 text-neutral-900 transition-colors hover:border-neutral-300 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
              rows={2}
            />
          </div>

          {/* Publish toggle */}
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="h-4 w-4 rounded border-neutral-300 text-brand-primary focus:ring-brand-primary"
            />
            <span className="text-sm font-medium text-neutral-700">
              Publish lookbook
            </span>
          </label>
        </div>

        {/* Pages Section */}
        <div className="border-t border-neutral-200 pt-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-medium text-neutral-900">Pages ({pages.length})</h3>
            <Button type="button" variant="secondary" size="sm" onClick={addPage}>
              + Add Page
            </Button>
          </div>

          {/* Page tabs */}
          {pages.length > 0 && (
            <div className="mb-4 flex gap-2 overflow-x-auto">
              {pages.map((page, index) => (
                <button
                  key={page.id}
                  type="button"
                  onClick={() => setActivePage(index)}
                  className={`
                    flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm
                    ${index === activePage
                      ? 'bg-brand-primary text-white'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'}
                  `}
                >
                  Page {index + 1}
                  {page.images.length > 0 && (
                    <span className="rounded-full bg-white/20 px-1.5 text-xs">
                      {page.images.length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Current page editor */}
          {currentPage ? (
            <div className="space-y-4 rounded-lg border border-neutral-200 bg-neutral-50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-neutral-700">
                  Page {activePage + 1}
                </span>
                {pages.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePage(activePage)}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Remove page
                  </button>
                )}
              </div>

              {/* Page title & subtitle */}
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Title (optional)"
                  value={currentPage.title}
                  onChange={(e) => updatePage(activePage, 'title', e.target.value)}
                  placeholder="Page title"
                />
                <Input
                  label="Subtitle (optional)"
                  value={currentPage.subtitle}
                  onChange={(e) => updatePage(activePage, 'subtitle', e.target.value)}
                  placeholder="Page subtitle"
                />
              </div>

              {/* Layout selector */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-neutral-800">
                  Layout
                </label>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                  {layoutOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => updatePage(activePage, 'layout', opt.value)}
                      className={`
                        rounded-lg border px-3 py-2 text-xs font-medium transition-colors
                        ${currentPage.layout === opt.value
                          ? 'border-brand-primary bg-brand-primary/5 text-brand-primary'
                          : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300'}
                      `}
                      title={opt.description}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-neutral-800">
                    Background
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={currentPage.backgroundColor}
                      onChange={(e) => updatePage(activePage, 'backgroundColor', e.target.value)}
                      className="h-10 w-10 cursor-pointer rounded border border-neutral-200"
                    />
                    <input
                      type="text"
                      value={currentPage.backgroundColor}
                      onChange={(e) => updatePage(activePage, 'backgroundColor', e.target.value)}
                      className="flex-1 rounded-lg border border-neutral-200 px-3 py-2 text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-neutral-800">
                    Text Color
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={currentPage.textColor}
                      onChange={(e) => updatePage(activePage, 'textColor', e.target.value)}
                      className="h-10 w-10 cursor-pointer rounded border border-neutral-200"
                    />
                    <input
                      type="text"
                      value={currentPage.textColor}
                      onChange={(e) => updatePage(activePage, 'textColor', e.target.value)}
                      className="flex-1 rounded-lg border border-neutral-200 px-3 py-2 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Images */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-neutral-800">
                  Images
                </label>
                {currentPage.images.length > 0 && (
                  <ImagePreviewGrid
                    images={currentPage.images.map((img) => ({
                      id: img.id,
                      url: img.thumbnailUrl || img.url,
                      type: img.type,
                    }))}
                    onRemove={handleRemoveImage}
                  />
                )}
                <ImageUploader
                  onImagesSelected={handleImagesSelected}
                  existingCount={currentPage.images.length}
                  maxImages={12}
                />
              </div>
            </div>
          ) : (
            <div className="rounded-lg border-2 border-dashed border-neutral-300 bg-neutral-50 py-12 text-center">
              <p className="text-neutral-500">No pages yet</p>
              <Button type="button" className="mt-3" onClick={addPage}>
                Create First Page
              </Button>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-neutral-200 pt-4">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Lookbook'}
          </Button>
        </div>
      </form>
    </>
  )
}

// =============================================================================
// AdminLookbookForm component
// =============================================================================

export function AdminLookbookForm({
  isOpen,
  onClose,
  onSave,
  lookbookId,
}: AdminLookbookFormProps) {
  // Handle escape key
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

  const formKey = lookbookId || 'new'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white p-6 shadow-2xl">
        <LookbookFormContent
          key={formKey}
          lookbookId={lookbookId}
          onClose={onClose}
          onSave={onSave}
        />
      </div>
    </div>
  )
}

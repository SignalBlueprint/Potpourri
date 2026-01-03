import { useState, useEffect, type FormEvent } from 'react'
import { Button, Input } from './index'

// =============================================================================
// Types
// =============================================================================

export interface Category {
  id: string
  name: string
  productCount: number
}

interface AdminCategoriesPanelProps {
  isOpen: boolean
  onClose: () => void
  categories: Category[]
  onCategoriesChange: (categories: Category[]) => void
}

// =============================================================================
// Default categories for initial state
// =============================================================================

export const defaultCategories: Category[] = [
  { id: 'cat_1', name: 'Home Decor', productCount: 8 },
  { id: 'cat_2', name: 'Kitchen & Dining', productCount: 6 },
  { id: 'cat_3', name: 'Garden & Outdoor', productCount: 4 },
  { id: 'cat_4', name: 'Gift Sets', productCount: 3 },
  { id: 'cat_5', name: 'Seasonal', productCount: 3 },
]

// =============================================================================
// Category Row Component
// =============================================================================

interface CategoryRowProps {
  category: Category
  onEdit: (category: Category) => void
  onDelete: (category: Category) => void
  isEditing: boolean
  editValue: string
  onEditChange: (value: string) => void
  onEditSave: () => void
  onEditCancel: () => void
}

function CategoryRow({
  category,
  onEdit,
  onDelete,
  isEditing,
  editValue,
  onEditChange,
  onEditSave,
  onEditCancel,
}: CategoryRowProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onEditSave()
    } else if (e.key === 'Escape') {
      onEditCancel()
    }
  }

  if (isEditing) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-brand-primary/30 bg-brand-primary/5 p-3">
        <input
          type="text"
          value={editValue}
          onChange={(e) => onEditChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 rounded-md border border-neutral-200 px-3 py-1.5 text-sm focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
          autoFocus
        />
        <button
          onClick={onEditSave}
          className="rounded-md bg-brand-primary px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
        >
          Save
        </button>
        <button
          onClick={onEditCancel}
          className="rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-50"
        >
          Cancel
        </button>
      </div>
    )
  }

  return (
    <div className="group flex items-center justify-between rounded-lg border border-neutral-200 bg-white p-3 transition-colors hover:border-neutral-300">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-neutral-100 text-neutral-600">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
          </svg>
        </div>
        <div>
          <p className="font-medium text-neutral-900">{category.name}</p>
          <p className="text-xs text-neutral-500">{category.productCount} products</p>
        </div>
      </div>
      <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          onClick={() => onEdit(category)}
          className="rounded-md p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
          aria-label={`Edit ${category.name}`}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
          </svg>
        </button>
        <button
          onClick={() => onDelete(category)}
          className="rounded-md p-2 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-600"
          aria-label={`Delete ${category.name}`}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
          </svg>
        </button>
      </div>
    </div>
  )
}

// =============================================================================
// Panel Content Component
// =============================================================================

interface PanelContentProps {
  categories: Category[]
  onCategoriesChange: (categories: Category[]) => void
  onClose: () => void
}

function PanelContent({ categories, onCategoriesChange, onClose }: PanelContentProps) {
  const [newCategoryName, setNewCategoryName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const [error, setError] = useState('')

  // Handle escape key to close modal
  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        if (editingId) {
          setEditingId(null)
          setEditValue('')
        } else {
          onClose()
        }
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [editingId, onClose])

  const handleAddCategory = (e: FormEvent) => {
    e.preventDefault()
    const trimmedName = newCategoryName.trim()

    if (!trimmedName) {
      setError('Category name is required')
      return
    }

    if (categories.some(c => c.name.toLowerCase() === trimmedName.toLowerCase())) {
      setError('Category already exists')
      return
    }

    const newCategory: Category = {
      id: `cat_${Date.now()}`,
      name: trimmedName,
      productCount: 0,
    }

    onCategoriesChange([...categories, newCategory])
    setNewCategoryName('')
    setError('')
  }

  const handleEditStart = (category: Category) => {
    setEditingId(category.id)
    setEditValue(category.name)
  }

  const handleEditSave = () => {
    const trimmedValue = editValue.trim()

    if (!trimmedValue) {
      return
    }

    if (categories.some(c => c.id !== editingId && c.name.toLowerCase() === trimmedValue.toLowerCase())) {
      return
    }

    onCategoriesChange(
      categories.map(c =>
        c.id === editingId ? { ...c, name: trimmedValue } : c
      )
    )
    setEditingId(null)
    setEditValue('')
  }

  const handleEditCancel = () => {
    setEditingId(null)
    setEditValue('')
  }

  const handleDelete = (category: Category) => {
    onCategoriesChange(categories.filter(c => c.id !== category.id))
  }

  return (
    <>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 id="categories-panel-title" className="text-xl font-semibold text-neutral-900">
            Manage Categories
          </h2>
          <p className="mt-1 text-sm text-neutral-600">
            Add, edit, or remove product categories
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
          aria-label="Close panel"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Add Category Form */}
      <form onSubmit={handleAddCategory} className="mb-6">
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              type="text"
              value={newCategoryName}
              onChange={(e) => {
                setNewCategoryName(e.target.value)
                setError('')
              }}
              placeholder="Enter new category name"
              error={error}
            />
          </div>
          <Button type="submit" className="shrink-0">
            Add Category
          </Button>
        </div>
      </form>

      {/* Categories List */}
      <div className="space-y-2">
        {categories.length === 0 ? (
          <div className="rounded-lg border border-dashed border-neutral-300 bg-neutral-50 p-8 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100">
              <svg className="h-6 w-6 text-neutral-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
              </svg>
            </div>
            <p className="font-medium text-neutral-900">No categories yet</p>
            <p className="mt-1 text-sm text-neutral-600">Add your first category above</p>
          </div>
        ) : (
          categories.map((category) => (
            <CategoryRow
              key={category.id}
              category={category}
              onEdit={handleEditStart}
              onDelete={handleDelete}
              isEditing={editingId === category.id}
              editValue={editValue}
              onEditChange={setEditValue}
              onEditSave={handleEditSave}
              onEditCancel={handleEditCancel}
            />
          ))
        )}
      </div>

      {/* Footer */}
      <div className="mt-6 flex justify-end border-t border-neutral-200 pt-4">
        <Button variant="secondary" onClick={onClose}>
          Done
        </Button>
      </div>
    </>
  )
}

// =============================================================================
// AdminCategoriesPanel Component
// =============================================================================

export function AdminCategoriesPanel({
  isOpen,
  onClose,
  categories,
  onCategoriesChange,
}: AdminCategoriesPanelProps) {
  if (!isOpen) return null

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
        className="relative z-10 max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="categories-panel-title"
      >
        <PanelContent
          categories={categories}
          onCategoriesChange={onCategoriesChange}
          onClose={onClose}
        />
      </div>
    </div>
  )
}

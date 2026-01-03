import { useEffect, useState } from 'react'
import { Button } from './index'

// =============================================================================
// Types
// =============================================================================

interface DeleteConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  itemName: string
  description?: string
}

// =============================================================================
// Modal content component (remounts when key changes to reset state)
// =============================================================================

interface DeleteConfirmContentProps {
  onClose: () => void
  onConfirm: () => void
  title: string
  itemName: string
  description?: string
}

function DeleteConfirmContent({
  onClose,
  onConfirm,
  title,
  itemName,
  description,
}: DeleteConfirmContentProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  // Handle escape key to close modal
  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape' && !isDeleting) {
        onClose()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isDeleting, onClose])

  const handleConfirm = async () => {
    setIsDeleting(true)
    // Simulate async delete
    await new Promise((resolve) => setTimeout(resolve, 300))
    onConfirm()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={isDeleting ? undefined : onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="relative z-10 w-full max-w-md rounded-xl bg-white p-6 shadow-2xl"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-modal-title"
        aria-describedby="delete-modal-description"
      >
        {/* Icon */}
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <svg
            className="h-6 w-6 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
            />
          </svg>
        </div>

        {/* Content */}
        <div className="text-center">
          <h3
            id="delete-modal-title"
            className="text-lg font-semibold text-neutral-900"
          >
            {title}
          </h3>
          <p
            id="delete-modal-description"
            className="mt-2 text-sm text-neutral-600"
          >
            {description || (
              <>
                Are you sure you want to delete{' '}
                <span className="font-medium text-neutral-900">"{itemName}"</span>?
                This action cannot be undone.
              </>
            )}
          </p>
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="bg-red-600 hover:bg-red-700 active:bg-red-800"
            onClick={handleConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// DeleteConfirmModal component
// =============================================================================

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Delete Product',
  itemName,
  description,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null

  // Use a key based on itemName to force remount when a different item is selected
  // This ensures the isDeleting state is reset for each new delete action
  return (
    <DeleteConfirmContent
      key={itemName}
      onClose={onClose}
      onConfirm={onConfirm}
      title={title}
      itemName={itemName}
      description={description}
    />
  )
}

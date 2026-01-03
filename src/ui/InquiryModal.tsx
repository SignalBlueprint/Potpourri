import { useState, useEffect, useRef, useCallback, type FormEvent } from 'react'
import { Button, Input } from './index'
import { submitInquiry } from '../api/inquiries'
import { trackEvent } from '../lib/analytics'

// =============================================================================
// InquiryModal - Modal form for product inquiries
// =============================================================================

interface InquiryModalProps {
  isOpen: boolean
  onClose: () => void
  productName: string
  productId: string
}

export function InquiryModal({ isOpen, onClose, productName, productId }: InquiryModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const nameInputRef = useRef<HTMLInputElement>(null)

  // Reset form state when closing
  const handleClose = useCallback(() => {
    setFormData({ name: '', email: '', message: '' })
    setIsSubmitted(false)
    setError(null)
    onClose()
  }, [onClose])

  // Focus trap and escape key handling
  useEffect(() => {
    if (isOpen) {
      // Track that inquiry modal was opened
      trackEvent('inquiry_start', { productId, productName })

      // Focus the first input when modal opens
      nameInputRef.current?.focus()

      // Prevent body scroll
      document.body.style.overflow = 'hidden'

      // Handle escape key
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') handleClose()
      }
      document.addEventListener('keydown', handleEscape)

      return () => {
        document.body.style.overflow = ''
        document.removeEventListener('keydown', handleEscape)
      }
    }
  }, [isOpen, handleClose, productId, productName])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    trackInquiry('submit', { productId, productName })

    const result = await submitInquiry({
      productId,
      productName,
      ...formData,
    })

    setIsSubmitting(false)

    if (result.success) {
      trackEvent('inquiry_success', { productId, productName })
      setIsSubmitted(true)
    } else {
      trackEvent('inquiry_error', { productId, productName, error: result.error ?? 'unknown' })
      setError(result.error || 'Failed to submit inquiry. Please try again.')
    }
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="inquiry-modal-title"
    >
      <div
        ref={modalRef}
        className="w-full max-w-md animate-in fade-in zoom-in-95 rounded-xl bg-white p-6 shadow-xl duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 id="inquiry-modal-title" className="text-xl font-semibold text-neutral-900">
              Inquire About This Item
            </h2>
            <p className="mt-1 text-sm text-neutral-600">{productName}</p>
          </div>
          <button
            onClick={handleClose}
            className="rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
            aria-label="Close modal"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {isSubmitted ? (
          // Success state
          <div className="py-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-neutral-900">Inquiry Sent!</h3>
            <p className="mb-6 text-sm text-neutral-600">
              We'll get back to you within 24 hours.
            </p>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </div>
        ) : (
          // Form
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              ref={nameInputRef}
              label="Your Name"
              type="text"
              placeholder="Jane Smith"
              required
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="jane@example.com"
              required
              value={formData.email}
              onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
            />

            <div className="space-y-1.5">
              <label htmlFor="inquiry-message" className="block text-sm font-medium text-neutral-800">
                Message
              </label>
              <textarea
                id="inquiry-message"
                rows={4}
                placeholder="I'm interested in this item and would like to know more about..."
                required
                value={formData.message}
                onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                className="
                  block w-full rounded-lg border border-neutral-200 bg-white
                  px-4 py-2.5 text-neutral-900
                  placeholder:text-neutral-600/50
                  transition-colors duration-200
                  hover:border-neutral-300
                  focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20
                  disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:opacity-50
                "
              />
            </div>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button type="button" variant="secondary" onClick={handleClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
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
                    Sending...
                  </span>
                ) : (
                  'Send Inquiry'
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

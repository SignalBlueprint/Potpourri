import { useCallback, useEffect, useRef } from 'react'
import { Button } from './index'
import type { AdminInquiry } from './AdminInquiriesTable'

// =============================================================================
// InquiryDetailModal - Full view of an inquiry in the admin panel
// =============================================================================

interface InquiryDetailModalProps {
  inquiry: AdminInquiry | null
  isOpen: boolean
  onClose: () => void
  onStatusChange?: (inquiryId: string, status: AdminInquiry['status']) => void
}

export function InquiryDetailModal({
  inquiry,
  isOpen,
  onClose,
  onStatusChange,
}: InquiryDetailModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  // Handle escape key
  const handleClose = useCallback(() => {
    onClose()
  }, [onClose])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') handleClose()
      }
      document.addEventListener('keydown', handleEscape)

      return () => {
        document.body.style.overflow = ''
        document.removeEventListener('keydown', handleEscape)
      }
    }
  }, [isOpen, handleClose])

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  if (!isOpen || !inquiry) return null

  const statusStyles = {
    new: 'bg-blue-100 text-blue-700 border-blue-200',
    contacted: 'bg-amber-100 text-amber-700 border-amber-200',
    closed: 'bg-neutral-100 text-neutral-600 border-neutral-200',
  }

  const formattedDate = new Date(inquiry.timestamp).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="inquiry-detail-title"
    >
      <div
        ref={modalRef}
        className="w-full max-w-lg animate-in fade-in zoom-in-95 rounded-xl bg-white shadow-xl duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-neutral-200 px-6 py-4">
          <div>
            <h2 id="inquiry-detail-title" className="text-lg font-semibold text-neutral-900">
              Inquiry Details
            </h2>
            <p className="mt-1 text-sm text-neutral-500">{formattedDate}</p>
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

        {/* Content */}
        <div className="space-y-6 px-6 py-5">
          {/* Customer Info */}
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-neutral-900">{inquiry.name}</p>
                <a
                  href={`mailto:${inquiry.email}`}
                  className="text-sm text-brand-primary hover:underline"
                >
                  {inquiry.email}
                </a>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
              Inquiring About
            </p>
            <p className="mt-1 font-medium text-neutral-900">{inquiry.productName}</p>
            <p className="text-xs text-neutral-500">Product ID: {inquiry.productId}</p>
          </div>

          {/* Message */}
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
              Message
            </p>
            <p className="mt-2 whitespace-pre-wrap text-neutral-700">{inquiry.message}</p>
          </div>

          {/* Status */}
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-neutral-500">
              Status
            </p>
            <div className="flex flex-wrap gap-2">
              {(['new', 'contacted', 'closed'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => onStatusChange?.(inquiry.id, status)}
                  className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                    inquiry.status === status
                      ? statusStyles[status]
                      : 'border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-neutral-200 px-6 py-4">
          <a
            href={`mailto:${inquiry.email}?subject=Re: Inquiry about ${inquiry.productName}`}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
            </svg>
            Reply via Email
          </a>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}

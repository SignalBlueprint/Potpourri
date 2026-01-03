import { useEffect, useRef, useCallback } from 'react'
import { Button, Badge } from './index'
import type { AdminInquiry } from './AdminInquiriesTable'
import type { InquiryStatus } from '../api/inquiries'

// =============================================================================
// InquiryDetailModal - Modal for viewing full inquiry details
// =============================================================================

const statusStyles = {
  new: 'bg-blue-100 text-blue-700',
  contacted: 'bg-amber-100 text-amber-700',
  closed: 'bg-neutral-200 text-neutral-600',
}

interface InquiryDetailModalProps {
  isOpen: boolean
  onClose: () => void
  inquiry: AdminInquiry | null
  onStatusChange?: (inquiryId: string, status: InquiryStatus) => void
}

export function InquiryDetailModal({
  isOpen,
  onClose,
  inquiry,
  onStatusChange,
}: InquiryDetailModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  // Handle escape key and focus trap
  const handleClose = useCallback(() => {
    onClose()
  }, [onClose])

  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll
      document.body.style.overflow = 'hidden'

      // Handle escape key
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') handleClose()
      }
      document.addEventListener('keydown', handleEscape)

      // Focus the modal
      modalRef.current?.focus()

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

  const date = new Date(inquiry.timestamp)
  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const formattedTime = date.toLocaleTimeString('en-US', {
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
        tabIndex={-1}
        className="w-full max-w-lg animate-in fade-in zoom-in-95 rounded-xl bg-white shadow-xl duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-neutral-200 px-6 py-4">
          <div>
            <h2 id="inquiry-detail-title" className="text-xl font-semibold text-neutral-900">
              Inquiry Details
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              {formattedDate} at {formattedTime}
            </p>
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
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-neutral-900">{inquiry.name}</h3>
              <a
                href={`mailto:${inquiry.email}`}
                className="text-sm text-brand-primary hover:underline"
              >
                {inquiry.email}
              </a>
            </div>
            <Badge className={statusStyles[inquiry.status]}>
              {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
            </Badge>
          </div>

          {/* Product */}
          <div>
            <h4 className="mb-1 text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Product
            </h4>
            <p className="text-neutral-900">{inquiry.productName}</p>
          </div>

          {/* Message */}
          <div>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Message
            </h4>
            <div className="rounded-lg bg-neutral-50 p-4">
              <p className="whitespace-pre-wrap text-neutral-700">{inquiry.message}</p>
            </div>
          </div>

          {/* Status Change */}
          {onStatusChange && (
            <div>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Update Status
              </h4>
              <div className="flex gap-2">
                {(['new', 'contacted', 'closed'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => onStatusChange(inquiry.id, status)}
                    className={`
                      rounded-full px-4 py-1.5 text-sm font-medium transition-all
                      ${inquiry.status === status
                        ? `${statusStyles[status]} ring-2 ring-offset-1`
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                      }
                    `}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-neutral-200 px-6 py-4">
          <a
            href={`mailto:${inquiry.email}?subject=Re: Inquiry about ${inquiry.productName}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-brand-primary hover:underline"
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

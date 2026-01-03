import { useState, type FormEvent } from 'react'
import { trackEvent } from '../lib/analytics'

// =============================================================================
// NewsletterForm - Email capture form for footer
// =============================================================================

const STORAGE_KEY = 'potpourri-newsletter-subscribers'

interface Subscriber {
  email: string
  subscribedAt: string
}

function getSubscribers(): Subscriber[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveSubscriber(email: string): void {
  const subscribers = getSubscribers()
  const exists = subscribers.some((s) => s.email.toLowerCase() === email.toLowerCase())
  if (!exists) {
    subscribers.push({
      email,
      subscribedAt: new Date().toISOString(),
    })
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subscribers))
  }
}

export function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    const trimmedEmail = email.trim()
    if (!trimmedEmail) {
      setErrorMessage('Please enter your email')
      setStatus('error')
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(trimmedEmail)) {
      setErrorMessage('Please enter a valid email')
      setStatus('error')
      return
    }

    setStatus('submitting')

    // Simulate a brief delay for UX
    setTimeout(() => {
      try {
        saveSubscriber(trimmedEmail)
        trackEvent('newsletter_subscribe', { email: trimmedEmail })
        setStatus('success')
        setEmail('')
      } catch {
        setErrorMessage('Something went wrong. Please try again.')
        setStatus('error')
      }
    }, 300)
  }

  if (status === 'success') {
    return (
      <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
        Thanks for subscribing!
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (status === 'error') {
              setStatus('idle')
              setErrorMessage('')
            }
          }}
          placeholder="Enter your email"
          aria-label="Email address"
          className="
            block w-full rounded-lg border border-neutral-200 bg-white
            px-3 py-2 text-sm text-neutral-900
            placeholder:text-neutral-500
            transition-colors duration-200
            hover:border-neutral-300
            focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20
            disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:opacity-50
          "
          disabled={status === 'submitting'}
        />
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="
            shrink-0 rounded-lg bg-brand-primary px-4 py-2
            text-sm font-medium text-white
            transition-colors duration-200
            hover:bg-neutral-800
            focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2
            disabled:pointer-events-none disabled:opacity-50
          "
        >
          {status === 'submitting' ? 'Joining...' : 'Join'}
        </button>
      </div>
      {status === 'error' && errorMessage && (
        <p className="text-sm text-red-600">{errorMessage}</p>
      )}
    </form>
  )
}

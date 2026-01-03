import { useState, type FormEvent } from 'react'
import { createRoute } from '@tanstack/react-router'
import { rootRoute } from '../app'
import { Container, PageHeader, Card, Button, Input } from '../ui'
import { SEO } from '../components/SEO'
import { clientConfig } from '../client.config'

export const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/contact',
  component: ContactPage,
})

function ContactPage() {
  const { contact } = clientConfig
  const { address, coordinates, hours, phone, email } = contact

  return (
    <>
      <SEO
        title="Contact Us"
        description={`Visit us at ${address.street}, ${address.city}, ${address.state} or send us a message. We'd love to hear from you!`}
      />
      <Container>
        <PageHeader
          title="Contact Us"
          subtitle="We'd love to hear from you. Send us a message or visit our store."
        />

        <div className="grid gap-8 pb-16 lg:grid-cols-2">
          {/* Contact Form */}
          <div>
            <ContactForm />
          </div>

          {/* Store Info & Map */}
          <div className="space-y-6">
            {/* Embedded Map */}
            <Card className="overflow-hidden p-0">
              <iframe
                title="Store Location"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${coordinates.lng - 0.01}%2C${coordinates.lat - 0.005}%2C${coordinates.lng + 0.01}%2C${coordinates.lat + 0.005}&layer=mapnik&marker=${coordinates.lat}%2C${coordinates.lng}`}
                className="h-64 w-full border-0 lg:h-72"
                loading="lazy"
              />
              <div className="p-4">
                <a
                  href={`https://www.openstreetmap.org/?mlat=${coordinates.lat}&mlon=${coordinates.lng}#map=16/${coordinates.lat}/${coordinates.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm font-medium text-brand-primary hover:underline"
                >
                  View Larger Map
                  <span aria-hidden="true">→</span>
                </a>
              </div>
            </Card>

            {/* Address & Hours */}
            <div className="grid gap-4 sm:grid-cols-2">
              <Card>
                <h3 className="flex items-center gap-2 font-semibold text-neutral-900">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-accent/20 text-sm">
                    <MapPinIcon />
                  </span>
                  Address
                </h3>
                <address className="mt-3 not-italic leading-relaxed text-neutral-600">
                  {address.street}
                  <br />
                  {address.city}, {address.state} {address.zip}
                </address>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(`${address.street}, ${address.city}, ${address.state} ${address.zip}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-brand-primary hover:underline"
                >
                  Get Directions
                  <span aria-hidden="true">→</span>
                </a>
              </Card>

              <Card>
                <h3 className="flex items-center gap-2 font-semibold text-neutral-900">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-accent/20 text-sm">
                    <ClockIcon />
                  </span>
                  Hours
                </h3>
                <div className="mt-3 space-y-1 text-neutral-600">
                  <p>{hours.weekdays}</p>
                  <p>{hours.saturday}</p>
                  <p>{hours.sunday}</p>
                </div>
              </Card>
            </div>

            {/* Contact Details */}
            <Card>
              <h3 className="flex items-center gap-2 font-semibold text-neutral-900">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-accent/20 text-sm">
                  <PhoneIcon />
                </span>
                Get in Touch
              </h3>
              <div className="mt-3 space-y-2 text-neutral-600">
                <p>
                  <a
                    href={`tel:${phone}`}
                    className="transition-colors hover:text-brand-primary"
                  >
                    {phone}
                  </a>
                </p>
                <p>
                  <a
                    href={`mailto:${email}`}
                    className="transition-colors hover:text-brand-primary"
                  >
                    {email}
                  </a>
                </p>
              </div>
            </Card>
          </div>
        </div>
      </Container>
    </>
  )
}

// =============================================================================
// Contact Form Component
// =============================================================================

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // Submit to API endpoint (falls back to localStorage in demo mode)
      const endpoint = `${clientConfig.tenant.apiBaseUrl}/contact`
      const payload = {
        ...formData,
        tenantId: clientConfig.tenant.id,
        timestamp: new Date().toISOString(),
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        setIsSubmitted(true)
      } else {
        throw new Error('API request failed')
      }
    } catch {
      // Fallback to localStorage for demo mode
      saveContactLocally(formData)
      setIsSubmitted(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <Card className="text-center">
        <div className="py-8">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckIcon />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-neutral-900">
            Message Sent!
          </h3>
          <p className="mb-6 text-neutral-600">
            Thank you for reaching out. We'll get back to you within 24 hours.
          </p>
          <Button
            variant="secondary"
            onClick={() => {
              setFormData({ name: '', email: '', subject: '', message: '' })
              setIsSubmitted(false)
            }}
          >
            Send Another Message
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card>
      <h2 className="mb-6 text-xl font-semibold text-neutral-900">
        Send Us a Message
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Your Name"
          type="text"
          placeholder="Jane Smith"
          required
          value={formData.name}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, name: e.target.value }))
          }
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="jane@example.com"
          required
          value={formData.email}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, email: e.target.value }))
          }
        />

        <Input
          label="Subject"
          type="text"
          placeholder="How can we help?"
          required
          value={formData.subject}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, subject: e.target.value }))
          }
        />

        <div className="space-y-1.5">
          <label
            htmlFor="contact-message"
            className="block text-sm font-medium text-neutral-800"
          >
            Message
          </label>
          <textarea
            id="contact-message"
            rows={5}
            placeholder="Tell us more about your inquiry..."
            required
            value={formData.message}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, message: e.target.value }))
            }
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

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <SpinnerIcon />
              Sending...
            </span>
          ) : (
            'Send Message'
          )}
        </Button>
      </form>
    </Card>
  )
}

// =============================================================================
// Local Storage Fallback (Demo Mode)
// =============================================================================

interface ContactPayload {
  name: string
  email: string
  subject: string
  message: string
}

function saveContactLocally(data: ContactPayload): void {
  const storageKey = 'potpourri_contacts'
  const contactId = `local_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`

  try {
    const existing = localStorage.getItem(storageKey)
    const contacts = existing ? JSON.parse(existing) : []
    contacts.push({
      id: contactId,
      ...data,
      tenantId: clientConfig.tenant.id,
      timestamp: new Date().toISOString(),
    })
    localStorage.setItem(storageKey, JSON.stringify(contacts))
  } catch {
    // Silently fail - form still shows success for UX
  }
}

// =============================================================================
// Icons
// =============================================================================

function MapPinIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4 text-brand-primary"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4 text-brand-primary"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4 text-brand-primary"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
      />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 text-green-600"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}

function SpinnerIcon() {
  return (
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
  )
}

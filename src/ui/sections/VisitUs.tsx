import { Card, SectionTitle } from '../index'
import { clientConfig } from '../../client.config'

export function VisitUs() {
  const { address, hours, phone } = clientConfig.contact

  return (
    <section id="visit-us" className="py-12 sm:py-16 scroll-mt-20">
      <SectionTitle
        subtitle="We'd love to see you in person"
        className="text-center mb-8"
      >
        Visit Us
      </SectionTitle>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Map Placeholder */}
        <Card className="relative aspect-video overflow-hidden bg-neutral-100 lg:aspect-auto lg:min-h-[300px]">
          <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-400">
            <svg
              className="h-16 w-16 mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="text-sm font-medium">Map Coming Soon</span>
            <span className="text-xs mt-1">
              {address.city}, {address.state}
            </span>
          </div>
        </Card>

        {/* Store Info */}
        <div className="flex flex-col gap-6">
          {/* Address */}
          <Card className="flex-1">
            <h3 className="flex items-center gap-2 font-semibold text-neutral-900">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-accent/20 text-sm">
                📍
              </span>
              Location
            </h3>
            <address className="mt-3 not-italic text-neutral-600 leading-relaxed">
              {address.street}<br />
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

          {/* Hours */}
          <Card className="flex-1">
            <h3 className="flex items-center gap-2 font-semibold text-neutral-900">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-accent/20 text-sm">
                🕐
              </span>
              Store Hours
            </h3>
            <div className="mt-3 space-y-1 text-neutral-600">
              <p>{hours.weekdays}</p>
              <p>{hours.saturday}</p>
              <p>{hours.sunday}</p>
            </div>
          </Card>

          {/* Contact */}
          <Card className="flex-1">
            <h3 className="flex items-center gap-2 font-semibold text-neutral-900">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-accent/20 text-sm">
                📞
              </span>
              Get in Touch
            </h3>
            <div className="mt-3 space-y-2 text-neutral-600">
              <p>
                <a href={`tel:${phone}`} className="hover:text-brand-primary transition-colors">
                  {phone}
                </a>
              </p>
              <p>
                <a href={`mailto:${clientConfig.contact.email}`} className="hover:text-brand-primary transition-colors">
                  {clientConfig.contact.email}
                </a>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}

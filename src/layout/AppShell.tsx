import { Link } from '@tanstack/react-router'
import { type ReactNode } from 'react'
import { clientConfig, type TrustBadge } from '../client.config'
import { Container } from '../ui'
import { MobileNav } from './MobileNav'

// =============================================================================
// Trust Badge Icons
// =============================================================================

function TrustBadgeIcon({ icon }: { icon: TrustBadge['icon'] }) {
  const iconClass = 'h-6 w-6 text-brand-primary'

  switch (icon) {
    case 'shield':
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
        </svg>
      )
    case 'truck':
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
        </svg>
      )
    case 'refresh':
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
      )
    case 'lock':
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
        </svg>
      )
    case 'heart':
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
        </svg>
      )
  }
}

// =============================================================================
// AppShell - Main layout wrapper with header, content area, and footer
// =============================================================================
interface AppShellProps {
  children: ReactNode
  searchSlot?: ReactNode
}

export function AppShell({ children, searchSlot }: AppShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header searchSlot={searchSlot} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

// =============================================================================
// Header - Sticky navigation with logo, nav links, and optional search
// =============================================================================
interface HeaderProps {
  searchSlot?: ReactNode
}

function Header({ searchSlot }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/95 backdrop-blur-sm">
      <Container>
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo & Tagline */}
          <Link to="/" className="group flex items-baseline gap-2">
            <span className="text-xl font-semibold text-neutral-900 transition-colors group-hover:text-brand-primary">
              {clientConfig.brand.name}
            </span>
            <span className="hidden text-sm text-neutral-600 sm:inline">
              {clientConfig.brand.tagline}
            </span>
          </Link>

          {/* Search Slot (optional) */}
          {searchSlot && <div className="hidden flex-1 justify-center md:flex">{searchSlot}</div>}

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 md:flex">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/catalog">Shop</NavLink>
            {clientConfig.features.enableAdmin && <NavLink to="/admin">Admin</NavLink>}
          </nav>

          {/* Mobile Navigation */}
          <MobileNav />
        </div>
      </Container>
    </header>
  )
}

// =============================================================================
// NavLink - Styled navigation link with active state
// =============================================================================
interface NavLinkProps {
  to: string
  children: ReactNode
}

function NavLink({ to, children }: NavLinkProps) {
  return (
    <Link
      to={to}
      className="
        rounded-lg px-3 py-2 text-sm font-medium text-neutral-600
        transition-colors duration-200
        hover:bg-neutral-100 hover:text-neutral-900
        [&.active]:bg-brand-primary/10 [&.active]:text-brand-primary
      "
    >
      {children}
    </Link>
  )
}

// =============================================================================
// Footer - Contact info, address, and hours
// =============================================================================
function Footer() {
  const { contact, brand, trustBadges } = clientConfig
  const { address, hours } = contact

  return (
    <footer className="mt-auto border-t border-neutral-200 bg-white">
      <Container>
        <div className="py-12">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {/* Brand */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-neutral-900">{brand.name}</h3>
              <p className="text-sm text-neutral-600">{brand.tagline}</p>
            </div>

            {/* Quick Links */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-neutral-600">
                Quick Links
              </h4>
              <nav className="flex flex-col space-y-2 text-sm">
                <Link to="/" className="text-neutral-600 transition-colors hover:text-brand-primary">
                  Home
                </Link>
                <Link to="/catalog" className="text-neutral-600 transition-colors hover:text-brand-primary">
                  Shop
                </Link>
                <Link to="/contact" className="text-neutral-600 transition-colors hover:text-brand-primary">
                  Contact
                </Link>
                {clientConfig.features.enableAdmin && (
                  <Link to="/admin" className="text-neutral-600 transition-colors hover:text-brand-primary">
                    Admin
                  </Link>
                )}
              </nav>
            </div>

            {/* Contact */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-neutral-600">
                Contact
              </h4>
              <div className="space-y-2 text-sm text-neutral-600">
                <p>
                  <a
                    href={`mailto:${contact.email}`}
                    className="transition-colors hover:text-brand-primary"
                  >
                    {contact.email}
                  </a>
                </p>
                <p>
                  <a
                    href={`tel:${contact.phone.replace(/[^0-9]/g, '')}`}
                    className="transition-colors hover:text-brand-primary"
                  >
                    {contact.phone}
                  </a>
                </p>
              </div>
            </div>

            {/* Address */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-neutral-600">
                Visit Us
              </h4>
              <address className="space-y-1 text-sm not-italic text-neutral-600">
                <p>{address.street}</p>
                <p>
                  {address.city}, {address.state} {address.zip}
                </p>
              </address>
            </div>

            {/* Hours */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-neutral-600">
                Hours
              </h4>
              <div className="space-y-1 text-sm text-neutral-600">
                <p>{hours.weekdays}</p>
                <p>{hours.saturday}</p>
                <p>{hours.sunday}</p>
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="mt-8 border-t border-neutral-200 pt-6">
            <div className="flex flex-wrap items-center justify-center gap-6 text-neutral-500">
              <TrustBadge icon="shield" label="Secure Checkout" />
              <TrustBadge icon="truck" label="Free Shipping $50+" />
              <TrustBadge icon="refresh" label="Easy Returns" />
              <TrustBadge icon="heart" label="Satisfaction Guaranteed" />
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-6 pt-4">
            <p className="text-center text-sm text-neutral-600">
              &copy; {new Date().getFullYear()} {brand.name}. All rights reserved.
            </p>
          </div>
        </div>
      </Container>
    </footer>
  )
}

// =============================================================================
// TrustBadge - Small icon + label for trust indicators
// =============================================================================
interface TrustBadgeProps {
  icon: 'shield' | 'truck' | 'refresh' | 'heart'
  label: string
}

function TrustBadge({ icon, label }: TrustBadgeProps) {
  const iconPaths: Record<TrustBadgeProps['icon'], string> = {
    shield:
      'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    truck:
      'M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12',
    refresh:
      'M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99',
    heart:
      'M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z',
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d={iconPaths[icon]} />
      </svg>
      <span>{label}</span>
    </div>
  )
}

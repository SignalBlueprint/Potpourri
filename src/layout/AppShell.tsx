import { Link } from '@tanstack/react-router'
import { type ReactNode } from 'react'
import { clientConfig } from '../client.config'
import { Container } from '../ui'

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

          {/* Navigation */}
          <nav className="flex items-center gap-1">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/catalog">Shop</NavLink>
            {clientConfig.features.enableAdmin && <NavLink to="/admin">Admin</NavLink>}
          </nav>
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
  const { contact, brand } = clientConfig
  const { address, hours } = contact

  return (
    <footer className="mt-auto border-t border-neutral-200 bg-white">
      <Container>
        <div className="py-12">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-neutral-900">{brand.name}</h3>
              <p className="text-sm text-neutral-600">{brand.tagline}</p>
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

          {/* Copyright */}
          <div className="mt-8 border-t border-neutral-200 pt-6">
            <p className="text-center text-sm text-neutral-600">
              &copy; {new Date().getFullYear()} {brand.name}. All rights reserved.
            </p>
          </div>
        </div>
      </Container>
    </footer>
  )
}

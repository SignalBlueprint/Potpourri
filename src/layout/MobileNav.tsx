import { Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { clientConfig } from '../client.config'

// =============================================================================
// MobileNav - Hamburger menu for mobile devices
// =============================================================================
export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)

  // Close menu when route changes or on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const closeMenu = () => setIsOpen(false)

  return (
    <div className="md:hidden">
      {/* Hamburger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="
          inline-flex items-center justify-center rounded-lg p-2
          text-neutral-600 transition-colors duration-200
          hover:bg-neutral-100 hover:text-neutral-900
          focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2
        "
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
      >
        {isOpen ? <CloseIcon /> : <HamburgerIcon />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 transition-opacity"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

      {/* Slide-out Menu */}
      <div
        className={`
          fixed inset-y-0 right-0 z-50 w-64 transform bg-white shadow-xl
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Menu Header */}
        <div className="flex h-16 items-center justify-between border-b border-neutral-200 px-4">
          <span className="text-lg font-semibold text-neutral-900">
            {clientConfig.brand.name}
          </span>
          <button
            type="button"
            onClick={closeMenu}
            className="
              rounded-lg p-2 text-neutral-600 transition-colors
              hover:bg-neutral-100 hover:text-neutral-900
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2
            "
            aria-label="Close menu"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col p-4">
          <MobileNavLink to="/" onClick={closeMenu}>
            Home
          </MobileNavLink>
          <MobileNavLink to="/catalog" onClick={closeMenu}>
            Shop
          </MobileNavLink>
          <MobileNavLink to="/contact" onClick={closeMenu}>
            Contact
          </MobileNavLink>
          {clientConfig.features.enableAdmin && (
            <MobileNavLink to="/admin" onClick={closeMenu}>
              Admin
            </MobileNavLink>
          )}
        </nav>

        {/* Contact Info */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-neutral-200 p-4">
          <div className="space-y-2 text-sm text-neutral-600">
            <p>{clientConfig.contact.phone}</p>
            <p>{clientConfig.contact.email}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// MobileNavLink - Styled navigation link for mobile menu
// =============================================================================
interface MobileNavLinkProps {
  to: string
  onClick: () => void
  children: React.ReactNode
}

function MobileNavLink({ to, onClick, children }: MobileNavLinkProps) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="
        rounded-lg px-4 py-3 text-base font-medium text-neutral-700
        transition-colors duration-200
        hover:bg-neutral-100 hover:text-neutral-900
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2
        [&.active]:bg-brand-primary/10 [&.active]:text-brand-primary
      "
    >
      {children}
    </Link>
  )
}

// =============================================================================
// Icons
// =============================================================================
function HamburgerIcon() {
  return (
    <svg
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
      />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  )
}

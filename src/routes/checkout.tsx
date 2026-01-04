import { createRoute, Link } from '@tanstack/react-router'
import { rootRoute } from '../app'
import { Container, PageHeader, Card, Button, Input } from '../ui'
import { SEO } from '../components/SEO'
import { clientConfig } from '../client.config'

export const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/checkout',
  component: CheckoutPage,
})

function CheckoutPage() {
  const { enableCheckout } = clientConfig.features

  // Gate checkout behind feature flag
  if (!enableCheckout) {
    return (
      <>
        <SEO title="Checkout" description="Complete your purchase." />
        <Container>
          <CheckoutDisabled />
        </Container>
      </>
    )
  }

  return (
    <>
      <SEO title="Checkout" description="Complete your purchase securely." />
      <Container>
        <PageHeader
          title="Checkout"
          subtitle="Review your order and complete your purchase"
        />

        <div className="grid gap-8 pb-16 lg:grid-cols-3">
          {/* Order Form - 2 columns */}
          <div className="space-y-6 lg:col-span-2">
            {/* Contact Information */}
            <Card>
              <h2 className="mb-4 text-lg font-semibold text-neutral-900">
                Contact Information
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="First Name"
                  type="text"
                  placeholder="Jane"
                  required
                  disabled
                />
                <Input
                  label="Last Name"
                  type="text"
                  placeholder="Smith"
                  required
                  disabled
                />
                <div className="sm:col-span-2">
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="jane@example.com"
                    required
                    disabled
                  />
                </div>
                <div className="sm:col-span-2">
                  <Input
                    label="Phone Number"
                    type="tel"
                    placeholder="(555) 123-4567"
                    disabled
                  />
                </div>
              </div>
            </Card>

            {/* Shipping Address */}
            <Card>
              <h2 className="mb-4 text-lg font-semibold text-neutral-900">
                Shipping Address
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Input
                    label="Street Address"
                    type="text"
                    placeholder="123 Main Street"
                    required
                    disabled
                  />
                </div>
                <div className="sm:col-span-2">
                  <Input
                    label="Apartment, suite, etc. (optional)"
                    type="text"
                    placeholder="Apt 4B"
                    disabled
                  />
                </div>
                <Input
                  label="City"
                  type="text"
                  placeholder="Portland"
                  required
                  disabled
                />
                <Input
                  label="State"
                  type="text"
                  placeholder="OR"
                  required
                  disabled
                />
                <Input
                  label="ZIP Code"
                  type="text"
                  placeholder="97201"
                  required
                  disabled
                />
                <Input
                  label="Country"
                  type="text"
                  placeholder="United States"
                  required
                  disabled
                />
              </div>
            </Card>

            {/* Payment Information (Placeholder) */}
            <Card>
              <h2 className="mb-4 text-lg font-semibold text-neutral-900">
                Payment Information
              </h2>
              <div className="rounded-lg border border-dashed border-neutral-300 bg-neutral-50 p-6 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100">
                  <LockIcon />
                </div>
                <p className="text-sm text-neutral-600">
                  Payment integration coming soon.
                </p>
                <p className="mt-1 text-xs text-neutral-500">
                  Secure payments powered by Stripe
                </p>
              </div>
            </Card>
          </div>

          {/* Order Summary - 1 column */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <h2 className="mb-4 text-lg font-semibold text-neutral-900">
                Order Summary
              </h2>

              {/* Cart Items Placeholder */}
              <div className="space-y-3 border-b border-neutral-100 pb-4">
                <CartItemPlaceholder />
                <CartItemPlaceholder />
              </div>

              {/* Totals */}
              <div className="space-y-2 py-4 text-sm">
                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal</span>
                  <span>$0.00</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Shipping</span>
                  <span>Calculated at next step</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Tax</span>
                  <span>Calculated at next step</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between border-t border-neutral-100 pt-4 text-lg font-semibold text-neutral-900">
                <span>Total</span>
                <span>$0.00</span>
              </div>

              {/* Submit Button */}
              <Button className="mt-6 w-full" disabled>
                Complete Order
              </Button>

              <p className="mt-4 text-center text-xs text-neutral-500">
                {clientConfig.catalog.shippingNote}
              </p>
            </Card>
          </div>
        </div>
      </Container>
    </>
  )
}

// =============================================================================
// Checkout Disabled State
// =============================================================================

function CheckoutDisabled() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
        <ShoppingBagIcon />
      </div>
      <h1 className="mb-2 text-2xl font-semibold text-neutral-900">
        Checkout Not Available
      </h1>
      <p className="mb-6 max-w-md text-neutral-600">
        Online checkout is currently disabled. Please contact us directly to place an order or inquire about our products.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link
          to="/catalog"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-primary px-6 py-3 text-sm font-medium text-white shadow-soft transition-all duration-200 hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
        >
          Browse Products
        </Link>
        <Link
          to="/contact"
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-6 py-3 text-sm font-medium text-neutral-800 transition-all duration-200 hover:border-neutral-300 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
        >
          Contact Us
        </Link>
      </div>
    </div>
  )
}

// =============================================================================
// Cart Item Placeholder
// =============================================================================

function CartItemPlaceholder() {
  return (
    <div className="flex gap-3">
      <div className="h-16 w-16 flex-shrink-0 rounded-lg bg-neutral-100" />
      <div className="flex-1 space-y-1">
        <div className="h-4 w-3/4 rounded bg-neutral-100" />
        <div className="h-3 w-1/2 rounded bg-neutral-100" />
        <div className="h-3 w-1/4 rounded bg-neutral-100" />
      </div>
    </div>
  )
}

// =============================================================================
// Icons
// =============================================================================

function LockIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 text-neutral-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
      />
    </svg>
  )
}

function ShoppingBagIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-8 w-8 text-neutral-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
      />
    </svg>
  )
}

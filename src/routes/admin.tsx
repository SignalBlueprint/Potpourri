import { createRoute, redirect } from '@tanstack/react-router'
import { useState, useEffect, type FormEvent } from 'react'
import { rootRoute } from '../app'
import { clientConfig } from '../client.config'
import { useAuth } from '../hooks/useAuth'
import {
  Container,
  PageHeader,
  SectionTitle,
  AdminStatCard,
  AdminStatCardSkeleton,
  AdminProductsTable,
  AdminProductsTableSkeleton,
  AdminQuickActions,
  AdminQuickActionsSkeleton,
  AdminInquiriesTable,
  AdminInquiriesTableSkeleton,
  AdminProductForm,
  PackageIcon,
  TagIcon,
  InboxIcon,
  ShoppingCartIcon,
} from '../ui'
import type { AdminProduct, ProductFormData } from '../ui'

// =============================================================================
// Route guard: block access if enableAdmin is false
// =============================================================================

export const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  beforeLoad: () => {
    if (!clientConfig.features.enableAdmin) {
      throw redirect({ to: '/' })
    }
  },
  component: AdminPage,
})

// =============================================================================
// Admin Login Form
// =============================================================================

function AdminLoginForm() {
  const [password, setPassword] = useState('')
  const { login, error } = useAuth()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    login(password)
  }

  return (
    <Container>
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <div className="w-full max-w-md rounded-xl border border-neutral-200 bg-white p-8 shadow-sm">
          <div className="mb-6 text-center">
            <div className="mb-4 text-4xl">🔐</div>
            <h1 className="text-2xl font-semibold text-neutral-900">
              Admin Login
            </h1>
            <p className="mt-2 text-sm text-neutral-600">
              Enter the admin password to access the dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-neutral-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-neutral-300 px-4 py-3 text-neutral-900 placeholder-neutral-400 transition-colors focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                placeholder="Enter admin password"
                autoFocus
              />
            </div>

            {error && (
              <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-lg bg-brand-primary px-6 py-3 font-medium text-white transition-colors hover:bg-neutral-800"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-sm text-neutral-500 transition-colors hover:text-neutral-700"
            >
              ← Back to Home
            </a>
          </div>
        </div>
      </div>
    </Container>
  )
}

// =============================================================================
// Admin Dashboard Page
// =============================================================================

function AdminPage() {
  const [isLoading, setIsLoading] = useState(true)
  const { isAuthenticated, logout } = useAuth()

  // Product form modal state
  const [isProductFormOpen, setIsProductFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null)

  // Simulate loading state for demo purposes
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  // Product form handlers
  const handleAddProduct = () => {
    setEditingProduct(null)
    setIsProductFormOpen(true)
  }

  const handleEditProduct = (product: AdminProduct) => {
    setEditingProduct(product)
    setIsProductFormOpen(true)
  }

  const handleCloseProductForm = () => {
    setIsProductFormOpen(false)
    setEditingProduct(null)
  }

  const handleSaveProduct = (formData: ProductFormData) => {
    // Mock save - in real app, this would call an API
    console.log('Saving product:', {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock, 10),
      id: editingProduct?.id || `new_${Date.now()}`,
    })
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return <AdminLoginForm />
  }

  return (
    <Container>
      <div className="mb-8 flex items-start justify-between">
        <PageHeader
          title="Admin Dashboard"
          subtitle="Manage your inventory, view inquiries, and track orders"
        />
        <button
          onClick={logout}
          className="mt-2 rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
        >
          Sign Out
        </button>
      </div>

      {/* Summary Cards */}
      <section className="pb-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {isLoading ? (
            <>
              <AdminStatCardSkeleton />
              <AdminStatCardSkeleton />
              <AdminStatCardSkeleton />
              <AdminStatCardSkeleton />
            </>
          ) : (
            <>
              <AdminStatCard
                label="Total Products"
                value={24}
                icon={<PackageIcon />}
                trend={{ value: 12, label: 'from last month', direction: 'up' }}
              />
              <AdminStatCard
                label="Categories"
                value={5}
                icon={<TagIcon />}
              />
              <AdminStatCard
                label="Inquiries"
                value={8}
                icon={<InboxIcon />}
                trend={{ value: 3, label: 'new this week', direction: 'up' }}
                variant="success"
              />
              <AdminStatCard
                label="Orders"
                value={0}
                icon={<ShoppingCartIcon />}
                variant="default"
              />
            </>
          )}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="pb-8">
        <div className="mb-4">
          <SectionTitle>Quick Actions</SectionTitle>
        </div>
        {isLoading ? (
          <AdminQuickActionsSkeleton />
        ) : (
          <AdminQuickActions
            onAddProduct={handleAddProduct}
            onImportCSV={() => console.log('Import CSV clicked')}
            onManageCategories={() => console.log('Manage categories clicked')}
          />
        )}
      </section>

      {/* Products Table */}
      <section className="pb-12">
        <div className="mb-6">
          <SectionTitle subtitle="View and manage your product catalog">
            Products
          </SectionTitle>
        </div>
        {isLoading ? (
          <AdminProductsTableSkeleton />
        ) : (
          <AdminProductsTable
            onEdit={handleEditProduct}
            onDelete={(product) => console.log('Delete product:', product)}
          />
        )}
      </section>

      {/* Inquiries Table */}
      <section className="pb-16">
        <div className="mb-6">
          <SectionTitle subtitle="View and respond to customer inquiries">
            Inquiries
          </SectionTitle>
        </div>
        {isLoading ? (
          <AdminInquiriesTableSkeleton />
        ) : (
          <AdminInquiriesTable
            onView={(inquiry) => console.log('View inquiry:', inquiry)}
          />
        )}
      </section>

      {/* Product Form Modal */}
      <AdminProductForm
        isOpen={isProductFormOpen}
        onClose={handleCloseProductForm}
        onSave={handleSaveProduct}
        product={editingProduct}
      />
    </Container>
  )
}

// =============================================================================
// Not Found Page (for direct access when admin is disabled)
// =============================================================================

export function AdminNotFound() {
  return (
    <Container>
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <div className="mb-6 text-6xl">🔒</div>
        <h1 className="mb-2 text-2xl font-semibold text-neutral-900">
          Access Restricted
        </h1>
        <p className="mb-6 max-w-md text-neutral-600">
          The admin panel is not available. Please contact your administrator if you
          believe this is an error.
        </p>
        <a
          href="/"
          className="rounded-lg bg-brand-primary px-6 py-3 font-medium text-white transition-colors hover:bg-neutral-800"
        >
          Return Home
        </a>
      </div>
    </Container>
  )
}

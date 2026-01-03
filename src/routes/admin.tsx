import { createRoute, redirect } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { rootRoute } from '../app'
import { clientConfig } from '../client.config'
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
  PackageIcon,
  TagIcon,
  InboxIcon,
  ShoppingCartIcon,
} from '../ui'

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
// Admin Dashboard Page
// =============================================================================

function AdminPage() {
  const [isLoading, setIsLoading] = useState(true)

  // Simulate loading state for demo purposes
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <Container>
      <PageHeader
        title="Admin Dashboard"
        subtitle="Manage your inventory, view inquiries, and track orders"
      />

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
            onAddProduct={() => console.log('Add product clicked')}
            onImportCSV={() => console.log('Import CSV clicked')}
            onManageCategories={() => console.log('Manage categories clicked')}
          />
        )}
      </section>

      {/* Products Table */}
      <section className="pb-16">
        <div className="mb-6">
          <SectionTitle subtitle="View and manage your product catalog">
            Products
          </SectionTitle>
        </div>
        {isLoading ? (
          <AdminProductsTableSkeleton />
        ) : (
          <AdminProductsTable
            onEdit={(product) => console.log('Edit product:', product)}
            onDelete={(product) => console.log('Delete product:', product)}
          />
        )}
      </section>
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

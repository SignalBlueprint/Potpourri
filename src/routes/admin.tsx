import { createRoute } from '@tanstack/react-router'
import { rootRoute } from '../app'
import { Card, Container, PageHeader, Button, Badge } from '../ui'

export const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminPage,
})

function AdminPage() {
  return (
    <Container>
      <PageHeader title="Admin Panel" subtitle="Manage your gift shop" />

      {/* Quick Stats */}
      <section className="space-y-6 pb-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Products" value="24" />
          <StatCard label="Active Orders" value="8" />
          <StatCard label="Revenue Today" value="$342" />
          <StatCard label="Low Stock Items" value="3" trend="warning" />
        </div>
      </section>

      {/* Admin Sections */}
      <section className="space-y-6 pb-16">
        <h2 className="text-xl font-semibold text-neutral-900">Manage</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <AdminCard
            title="Products"
            description="Add, edit, or remove catalog items"
            action="Manage Products"
          />
          <AdminCard
            title="Orders"
            description="View and process customer orders"
            action="View Orders"
          />
          <AdminCard
            title="Categories"
            description="Organize your product categories"
            action="Edit Categories"
          />
          <AdminCard
            title="Settings"
            description="Configure store settings and preferences"
            action="Open Settings"
          />
        </div>
      </section>
    </Container>
  )
}

interface StatCardProps {
  label: string
  value: string
  trend?: 'up' | 'down' | 'warning'
}

function StatCard({ label, value, trend }: StatCardProps) {
  return (
    <Card className="space-y-1">
      <p className="text-sm text-neutral-600">{label}</p>
      <div className="flex items-baseline gap-2">
        <p className="text-2xl font-semibold text-neutral-900">{value}</p>
        {trend === 'warning' && <Badge variant="accent">Attention</Badge>}
      </div>
    </Card>
  )
}

interface AdminCardProps {
  title: string
  description: string
  action: string
}

function AdminCard({ title, description, action }: AdminCardProps) {
  return (
    <Card className="flex flex-col justify-between space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
        <p className="text-sm text-neutral-600">{description}</p>
      </div>
      <Button variant="secondary" className="w-full">
        {action}
      </Button>
    </Card>
  )
}

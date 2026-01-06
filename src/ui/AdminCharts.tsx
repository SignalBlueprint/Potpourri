import { useMemo } from 'react'
import { Card } from './index'
import type { AdminProduct } from './AdminProductsTable'
import type { StoredInquiry } from '../api/inquiries'

// =============================================================================
// AdminCharts - Dashboard analytics visualizations
// =============================================================================

interface AdminChartsProps {
  products: AdminProduct[]
  inquiries: StoredInquiry[]
}

export function AdminCharts({ products, inquiries }: AdminChartsProps) {
  // Calculate inquiry trends (last 7 days)
  const inquiryTrends = useMemo(() => {
    const today = new Date()
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today)
      date.setDate(date.getDate() - (6 - i))
      return {
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        count: 0,
        dateStr: date.toISOString().split('T')[0],
      }
    })

    inquiries.forEach((inquiry) => {
      const inquiryDate = new Date(inquiry.timestamp).toISOString().split('T')[0]
      const day = days.find((d) => d.dateStr === inquiryDate)
      if (day) day.count++
    })

    const maxCount = Math.max(...days.map((d) => d.count), 1)
    return { days, maxCount }
  }, [inquiries])

  // Calculate category distribution
  const categoryDistribution = useMemo(() => {
    const categories: Record<string, number> = {}
    products.forEach((product) => {
      categories[product.category] = (categories[product.category] || 0) + 1
    })

    const total = products.length || 1
    return Object.entries(categories)
      .map(([name, count]) => ({
        name,
        count,
        percentage: Math.round((count / total) * 100),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6)
  }, [products])

  // Calculate inquiry status distribution
  const inquiryStatusDistribution = useMemo(() => {
    const statuses: Record<string, number> = {
      new: 0,
      contacted: 0,
      closed: 0,
    }
    inquiries.forEach((inquiry) => {
      const status = inquiry.status || 'new'
      statuses[status] = (statuses[status] || 0) + 1
    })

    const total = inquiries.length || 1
    return Object.entries(statuses).map(([status, count]) => ({
      status,
      count,
      percentage: Math.round((count / total) * 100),
    }))
  }, [inquiries])

  // Calculate stock status distribution
  const stockDistribution = useMemo(() => {
    const statuses: Record<string, number> = {
      active: 0,
      draft: 0,
      archived: 0,
    }
    products.forEach((product) => {
      statuses[product.status] = (statuses[product.status] || 0) + 1
    })

    const total = products.length || 1
    return Object.entries(statuses).map(([status, count]) => ({
      status,
      count,
      percentage: Math.round((count / total) * 100),
    }))
  }, [products])

  const statusColors: Record<string, string> = {
    new: 'bg-blue-500',
    contacted: 'bg-amber-500',
    closed: 'bg-green-500',
    active: 'bg-green-500',
    draft: 'bg-neutral-400',
    archived: 'bg-red-400',
  }

  const statusLabels: Record<string, string> = {
    new: 'New',
    contacted: 'Contacted',
    closed: 'Closed',
    active: 'Active',
    draft: 'Draft',
    archived: 'Archived',
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Inquiry Trends Chart */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold text-neutral-900">Inquiry Trends (7 Days)</h3>
        <div className="flex h-48 items-end gap-2">
          {inquiryTrends.days.map((day) => (
            <div key={day.dateStr} className="flex flex-1 flex-col items-center gap-2">
              <div className="relative flex h-40 w-full items-end justify-center">
                <div
                  className="w-full max-w-8 rounded-t bg-brand-primary transition-all"
                  style={{
                    height: `${(day.count / inquiryTrends.maxCount) * 100}%`,
                    minHeight: day.count > 0 ? '8px' : '2px',
                  }}
                />
                {day.count > 0 && (
                  <span className="absolute -top-5 text-xs font-medium text-neutral-600">
                    {day.count}
                  </span>
                )}
              </div>
              <span className="text-xs text-neutral-500">{day.date}</span>
            </div>
          ))}
        </div>
        {inquiries.length === 0 && (
          <p className="mt-4 text-center text-sm text-neutral-500">No inquiries yet</p>
        )}
      </Card>

      {/* Category Distribution */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold text-neutral-900">Products by Category</h3>
        <div className="space-y-3">
          {categoryDistribution.map((cat) => (
            <div key={cat.name}>
              <div className="mb-1 flex justify-between text-sm">
                <span className="font-medium text-neutral-700">{cat.name}</span>
                <span className="text-neutral-500">{cat.count} ({cat.percentage}%)</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-neutral-100">
                <div
                  className="h-full rounded-full bg-brand-primary transition-all"
                  style={{ width: `${cat.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        {products.length === 0 && (
          <p className="text-center text-sm text-neutral-500">No products yet</p>
        )}
      </Card>

      {/* Inquiry Status Distribution */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold text-neutral-900">Inquiry Status</h3>
        <div className="flex items-center justify-center">
          <div className="relative h-40 w-40">
            {/* Simple pie chart using conic-gradient */}
            <div
              className="h-full w-full rounded-full"
              style={{
                background: inquiries.length > 0
                  ? `conic-gradient(
                    #3b82f6 0% ${inquiryStatusDistribution[0]?.percentage || 0}%,
                    #f59e0b ${inquiryStatusDistribution[0]?.percentage || 0}% ${(inquiryStatusDistribution[0]?.percentage || 0) + (inquiryStatusDistribution[1]?.percentage || 0)}%,
                    #22c55e ${(inquiryStatusDistribution[0]?.percentage || 0) + (inquiryStatusDistribution[1]?.percentage || 0)}% 100%
                  )`
                  : '#e5e7eb',
              }}
            />
            <div className="absolute inset-4 flex items-center justify-center rounded-full bg-white">
              <span className="text-2xl font-bold text-neutral-900">{inquiries.length}</span>
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-center gap-4">
          {inquiryStatusDistribution.map((item) => (
            <div key={item.status} className="flex items-center gap-2 text-sm">
              <span className={`h-3 w-3 rounded-full ${statusColors[item.status]}`} />
              <span className="text-neutral-600">
                {statusLabels[item.status]} ({item.count})
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Product Status Distribution */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold text-neutral-900">Product Status</h3>
        <div className="flex items-center justify-center">
          <div className="relative h-40 w-40">
            <div
              className="h-full w-full rounded-full"
              style={{
                background: products.length > 0
                  ? `conic-gradient(
                    #22c55e 0% ${stockDistribution[0]?.percentage || 0}%,
                    #9ca3af ${stockDistribution[0]?.percentage || 0}% ${(stockDistribution[0]?.percentage || 0) + (stockDistribution[1]?.percentage || 0)}%,
                    #f87171 ${(stockDistribution[0]?.percentage || 0) + (stockDistribution[1]?.percentage || 0)}% 100%
                  )`
                  : '#e5e7eb',
              }}
            />
            <div className="absolute inset-4 flex items-center justify-center rounded-full bg-white">
              <span className="text-2xl font-bold text-neutral-900">{products.length}</span>
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-center gap-4">
          {stockDistribution.map((item) => (
            <div key={item.status} className="flex items-center gap-2 text-sm">
              <span className={`h-3 w-3 rounded-full ${statusColors[item.status]}`} />
              <span className="text-neutral-600">
                {statusLabels[item.status]} ({item.count})
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

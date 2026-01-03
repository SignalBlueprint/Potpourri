import { type ReactNode } from 'react'

// =============================================================================
// AdminStatCard - Dashboard summary card with icon and optional trend
// =============================================================================

export interface AdminStatCardProps {
  label: string
  value: string | number
  icon: ReactNode
  trend?: {
    value: number
    label: string
    direction: 'up' | 'down' | 'neutral'
  }
  variant?: 'default' | 'warning' | 'success'
}

const variantStyles = {
  default: {
    iconBg: 'bg-brand-primary/10',
    iconColor: 'text-brand-primary',
  },
  warning: {
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
  },
  success: {
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
  },
}

export function AdminStatCard({ label, value, icon, trend, variant = 'default' }: AdminStatCardProps) {
  const styles = variantStyles[variant]

  return (
    <div className="rounded-xl bg-white p-6 shadow-card">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-neutral-600">{label}</p>
          <p className="text-3xl font-semibold tracking-tight text-neutral-900">{value}</p>
          {trend && (
            <div className="flex items-center gap-1.5">
              <span
                className={`text-sm font-medium ${
                  trend.direction === 'up'
                    ? 'text-emerald-600'
                    : trend.direction === 'down'
                      ? 'text-red-600'
                      : 'text-neutral-600'
                }`}
              >
                {trend.direction === 'up' && '↑'}
                {trend.direction === 'down' && '↓'}
                {trend.value > 0 ? '+' : ''}
                {trend.value}%
              </span>
              <span className="text-sm text-neutral-500">{trend.label}</span>
            </div>
          )}
        </div>
        <div className={`rounded-xl p-3 ${styles.iconBg} ${styles.iconColor}`}>{icon}</div>
      </div>
    </div>
  )
}

// =============================================================================
// AdminStatCardSkeleton - Loading state for stat cards
// =============================================================================

export function AdminStatCardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl bg-white p-6 shadow-card">
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <div className="h-4 w-24 rounded bg-neutral-200" />
          <div className="h-8 w-20 rounded bg-neutral-200" />
          <div className="h-4 w-32 rounded bg-neutral-200" />
        </div>
        <div className="h-12 w-12 rounded-xl bg-neutral-200" />
      </div>
    </div>
  )
}

// =============================================================================
// Icons for stat cards
// =============================================================================

export function PackageIcon({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
      />
    </svg>
  )
}

export function TagIcon({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
    </svg>
  )
}

export function InboxIcon({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H6.911a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661Z"
      />
    </svg>
  )
}

export function ShoppingCartIcon({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121 0 2.09-.751 2.385-1.838L21 6.75H5.94M7.5 14.25l-1.5-8.25M17.25 17.25a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm5.25 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"
      />
    </svg>
  )
}

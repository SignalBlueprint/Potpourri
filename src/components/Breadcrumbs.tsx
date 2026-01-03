import { Link } from '@tanstack/react-router'

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="py-4" aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-neutral-600">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li key={index} className="flex items-center gap-2">
              {index > 0 && <span className="text-neutral-400">/</span>}
              {item.href && !isLast ? (
                <Link
                  to={item.href}
                  className="transition-colors hover:text-brand-primary"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={isLast ? 'truncate text-neutral-900' : 'text-neutral-600'}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export function BreadcrumbsSkeleton() {
  return (
    <nav className="py-4" aria-label="Loading">
      <div className="flex items-center gap-2">
        <div className="h-4 w-12 animate-pulse rounded bg-neutral-200" />
        <span className="text-neutral-400">/</span>
        <div className="h-4 w-16 animate-pulse rounded bg-neutral-200" />
        <span className="text-neutral-400">/</span>
        <div className="h-4 w-24 animate-pulse rounded bg-neutral-200" />
      </div>
    </nav>
  )
}

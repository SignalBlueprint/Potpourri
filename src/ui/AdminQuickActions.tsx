import { Button } from './index'

// =============================================================================
// AdminQuickActions - Quick action buttons for common admin tasks
// =============================================================================

export interface QuickAction {
  label: string
  icon: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary'
}

interface AdminQuickActionsProps {
  actions?: QuickAction[]
  onAddProduct?: () => void
  onImportCSV?: () => void
  onManageCategories?: () => void
}

export function AdminQuickActions({
  actions,
  onAddProduct,
  onImportCSV,
  onManageCategories,
}: AdminQuickActionsProps) {
  const defaultActions: QuickAction[] = [
    {
      label: 'Add Product',
      icon: <PlusIcon />,
      onClick: onAddProduct,
      variant: 'primary',
    },
    {
      label: 'Import CSV',
      icon: <UploadIcon />,
      onClick: onImportCSV,
      variant: 'secondary',
    },
    {
      label: 'Manage Categories',
      icon: <FolderIcon />,
      onClick: onManageCategories,
      variant: 'secondary',
    },
  ]

  const displayActions = actions || defaultActions

  return (
    <div className="flex flex-wrap items-center gap-3">
      {displayActions.map((action, index) => (
        <Button
          key={index}
          variant={action.variant || 'secondary'}
          onClick={action.onClick}
          className="gap-2"
        >
          {action.icon}
          {action.label}
        </Button>
      ))}
    </div>
  )
}

// =============================================================================
// AdminQuickActionsSkeleton - Loading state
// =============================================================================

export function AdminQuickActionsSkeleton() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="h-10 w-32 animate-pulse rounded-lg bg-neutral-200"
        />
      ))}
    </div>
  )
}

// =============================================================================
// Icons for quick actions
// =============================================================================

function PlusIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  )
}

function UploadIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
      />
    </svg>
  )
}

function FolderIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
      />
    </svg>
  )
}

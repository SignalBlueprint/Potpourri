import { forwardRef, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode } from 'react'

// Re-export admin components
export { AdminStatCard, AdminStatCardSkeleton, PackageIcon, TagIcon, InboxIcon, ShoppingCartIcon } from './AdminStatCard'

// Re-export search component
export { SearchInput } from './SearchInput'

// Re-export empty state components
export { EmptyState, CatalogEmptyState } from './EmptyState'
export type { EmptyStateProps, CatalogEmptyStateProps } from './EmptyState'
export type { AdminStatCardProps } from './AdminStatCard'
export { AdminProductsTable, AdminProductsTableEmpty, AdminProductsTableSkeleton, mockProducts } from './AdminProductsTable'
export type { AdminProduct } from './AdminProductsTable'
export { AdminQuickActions, AdminQuickActionsSkeleton } from './AdminQuickActions'
export type { QuickAction } from './AdminQuickActions'
export { AdminInquiriesTable, AdminInquiriesTableEmpty, AdminInquiriesTableSkeleton } from './AdminInquiriesTable'
export type { AdminInquiry } from './AdminInquiriesTable'
export { AdminProductForm } from './AdminProductForm'
export type { ProductFormData } from './AdminProductForm'
export { AdminLookbookForm } from './AdminLookbookForm'
export { CSVImportModal } from './CSVImportModal'
export { ImageUploader, ImagePreviewGrid } from './ImageUploader'
export type { UploadedImage } from './ImageUploader'
export { EnhancementModal } from './EnhancementModal'
export { DeleteConfirmModal } from './DeleteConfirmModal'
export { AdminCategoriesPanel, defaultCategories } from './AdminCategoriesPanel'
export type { Category } from './AdminCategoriesPanel'
export { InquiryDetailModal } from './InquiryDetailModal'
export { NewsletterForm } from './NewsletterForm'
export { ShareButtons } from './ShareButtons'
export { FavoriteButton } from './FavoriteButton'
export { ProductReviews, ProductReviewsSkeleton } from './ProductReviews'
export type { Review } from './ProductReviews'

// =============================================================================
// Container - Consistent page wrapper with max-width and padding
// =============================================================================
interface ContainerProps {
  children: ReactNode
  className?: string
}

export function Container({ children, className = '' }: ContainerProps) {
  return (
    <div className={`mx-auto w-full max-w-container px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  )
}

// =============================================================================
// Button - Polished button with variants
// =============================================================================
type ButtonVariant = 'primary' | 'secondary' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  children: ReactNode
}

const buttonVariants: Record<ButtonVariant, string> = {
  primary:
    'bg-brand-primary text-white hover:bg-neutral-800 active:bg-neutral-900 shadow-soft',
  secondary:
    'bg-white text-neutral-800 border border-neutral-200 hover:bg-neutral-100 hover:border-neutral-300 active:bg-neutral-200',
  ghost:
    'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 active:bg-neutral-200',
}

const buttonSizes: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className = '', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`
          inline-flex items-center justify-center gap-2
          rounded-lg font-medium
          transition-all duration-200 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2
          disabled:pointer-events-none disabled:opacity-50
          ${buttonVariants[variant]}
          ${buttonSizes[size]}
          ${className}
        `}
        {...props}
      >
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'

// =============================================================================
// Card - Soft shadow container for content blocks
// =============================================================================
interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
}

export function Card({ children, className = '', hover = false }: CardProps) {
  return (
    <div
      className={`
        rounded-xl bg-white p-6 shadow-card
        ${hover ? 'transition-shadow duration-200 hover:shadow-soft' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  )
}

// =============================================================================
// Badge - Category or status indicator
// =============================================================================
type BadgeVariant = 'default' | 'primary' | 'accent'

interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
  className?: string
}

const badgeVariants: Record<BadgeVariant, string> = {
  default: 'bg-neutral-100 text-neutral-600',
  primary: 'bg-brand-primary/10 text-brand-primary',
  accent: 'bg-brand-accent/20 text-neutral-800',
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center rounded-full px-2.5 py-0.5
        text-xs font-medium
        ${badgeVariants[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  )
}

// =============================================================================
// InventoryBadge - Stock status indicator
// =============================================================================
import type { StockStatus } from '../data/mockProducts'

interface InventoryBadgeProps {
  stock: StockStatus
  size?: 'sm' | 'md'
  className?: string
}

const stockConfig: Record<StockStatus, { label: string; color: string; dotColor: string }> = {
  in_stock: {
    label: 'In Stock',
    color: 'text-green-700',
    dotColor: 'bg-green-500',
  },
  low_stock: {
    label: 'Low Stock',
    color: 'text-amber-700',
    dotColor: 'bg-amber-500',
  },
  out_of_stock: {
    label: 'Out of Stock',
    color: 'text-red-700',
    dotColor: 'bg-red-500',
  },
}

export function InventoryBadge({ stock, size = 'md', className = '' }: InventoryBadgeProps) {
  const config = stockConfig[stock]
  const sizeClasses = size === 'sm' ? 'text-xs' : 'text-sm'
  const dotSize = size === 'sm' ? 'h-1.5 w-1.5' : 'h-2 w-2'

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium ${config.color} ${sizeClasses} ${className}`}>
      <span className={`${dotSize} rounded-full ${config.dotColor}`} />
      {config.label}
    </span>
  )
}

// =============================================================================
// Input - Form input with consistent styling
// =============================================================================
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-neutral-800">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            block w-full rounded-lg border border-neutral-200 bg-white
            px-4 py-2.5 text-neutral-900
            placeholder:text-neutral-600/50
            transition-colors duration-200
            hover:border-neutral-300
            focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20
            disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:opacity-50
            ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : ''}
            ${className}
          `}
          {...props}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'

// =============================================================================
// SectionTitle - Consistent section headers
// =============================================================================
interface SectionTitleProps {
  children: ReactNode
  subtitle?: string
  className?: string
}

export function SectionTitle({ children, subtitle, className = '' }: SectionTitleProps) {
  return (
    <div className={`space-y-1 ${className}`}>
      <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">{children}</h2>
      {subtitle && <p className="text-neutral-600">{subtitle}</p>}
    </div>
  )
}

// =============================================================================
// PageHeader - Hero-style page header
// =============================================================================
interface PageHeaderProps {
  title: string
  subtitle?: string
  className?: string
}

export function PageHeader({ title, subtitle, className = '' }: PageHeaderProps) {
  return (
    <div className={`space-y-2 py-8 sm:py-12 ${className}`}>
      <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
        {title}
      </h1>
      {subtitle && <p className="text-lg text-neutral-600">{subtitle}</p>}
    </div>
  )
}

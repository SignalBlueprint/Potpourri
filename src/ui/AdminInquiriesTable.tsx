import { useState, useMemo, useEffect, useCallback } from 'react'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  type SortingState,
} from '@tanstack/react-table'
import { Button, Input } from './index'
import { getLocalInquiries, updateInquiryStatus, type InquiryStatus } from '../api/inquiries'

// =============================================================================
// Inquiry type for the table
// =============================================================================

export interface AdminInquiry {
  id: string
  productId: string
  productName: string
  name: string
  email: string
  message: string
  timestamp: string
  status: 'new' | 'contacted' | 'closed'
}

// =============================================================================
// Mock data for the inquiries table (when no localStorage data exists)
// =============================================================================

const mockInquiries: AdminInquiry[] = [
  {
    id: 'inq_001',
    productId: '1',
    productName: 'Artisan Candle Set',
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    message: 'Hi, I was wondering if you have this set available in lavender scent?',
    timestamp: '2026-01-03T14:30:00Z',
    status: 'new',
  },
  {
    id: 'inq_002',
    productId: '2',
    productName: 'Ceramic Vase Collection',
    name: 'Michael Chen',
    email: 'mchen@example.com',
    message: 'Can you ship internationally to Canada? What would be the shipping cost?',
    timestamp: '2026-01-03T10:15:00Z',
    status: 'new',
  },
  {
    id: 'inq_003',
    productId: '7',
    productName: 'Gourmet Gift Basket',
    name: 'Emily Davis',
    email: 'emily.d@example.com',
    message: 'I need to order 5 gift baskets for a corporate event. Do you offer bulk discounts?',
    timestamp: '2026-01-02T16:45:00Z',
    status: 'contacted',
  },
  {
    id: 'inq_004',
    productId: '10',
    productName: 'Cozy Throw Blanket',
    name: 'James Wilson',
    email: 'jwilson@example.com',
    message: 'What materials is the blanket made from? Is it machine washable?',
    timestamp: '2026-01-02T09:20:00Z',
    status: 'closed',
  },
]

// =============================================================================
// Column helper and definitions
// =============================================================================

const columnHelper = createColumnHelper<AdminInquiry>()

const statusStyles = {
  new: 'bg-blue-100 text-blue-700',
  contacted: 'bg-amber-100 text-amber-700',
  closed: 'bg-neutral-200 text-neutral-600',
}

// =============================================================================
// Sort indicator component
// =============================================================================

function SortIndicator({ direction }: { direction: 'asc' | 'desc' | false }) {
  if (!direction) {
    return (
      <svg className="ml-1 h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
      </svg>
    )
  }
  return direction === 'asc' ? (
    <svg className="ml-1 h-4 w-4 text-brand-primary" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
    </svg>
  ) : (
    <svg className="ml-1 h-4 w-4 text-brand-primary" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
  )
}

// =============================================================================
// AdminInquiriesTable component
// =============================================================================

interface AdminInquiriesTableProps {
  inquiries?: AdminInquiry[]
  isLoading?: boolean
  onView?: (inquiry: AdminInquiry) => void
}

export function AdminInquiriesTable({
  inquiries: propInquiries,
  isLoading = false,
  onView,
}: AdminInquiriesTableProps) {
  const [sorting, setSorting] = useState<SortingState>([{ id: 'timestamp', desc: true }])
  const [globalFilter, setGlobalFilter] = useState('')
  const [inquiries, setInquiries] = useState<AdminInquiry[]>([])

  // Handle status change
  const handleStatusChange = useCallback((inquiryId: string, newStatus: InquiryStatus) => {
    // Update in localStorage
    updateInquiryStatus(inquiryId, newStatus)
    // Update local state
    setInquiries((prev) =>
      prev.map((inq) => (inq.id === inquiryId ? { ...inq, status: newStatus } : inq))
    )
  }, [])

  // Load inquiries from localStorage or use mock data
  useEffect(() => {
    if (propInquiries) {
      setInquiries(propInquiries)
    } else {
      const localInquiries = getLocalInquiries()
      if (localInquiries.length > 0) {
        // Transform local inquiries to match AdminInquiry shape
        const transformed: AdminInquiry[] = localInquiries.map((inq) => ({
          id: inq.id,
          productId: inq.productId,
          productName: inq.productName,
          name: inq.name,
          email: inq.email,
          message: inq.message,
          timestamp: inq.timestamp,
          status: inq.status || 'new',
        }))
        setInquiries(transformed)
      } else {
        // Use mock data if no local inquiries
        setInquiries(mockInquiries)
      }
    }
  }, [propInquiries])

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: 'Customer',
        cell: (info) => (
          <div>
            <div className="font-medium text-neutral-900">{info.getValue()}</div>
            <div className="text-sm text-neutral-500">{info.row.original.email}</div>
          </div>
        ),
      }),
      columnHelper.accessor('productName', {
        header: 'Product',
        cell: (info) => (
          <span className="text-neutral-700">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor('message', {
        header: 'Message',
        cell: (info) => (
          <span className="line-clamp-2 max-w-xs text-neutral-600">
            {info.getValue()}
          </span>
        ),
        enableSorting: false,
      }),
      columnHelper.accessor('timestamp', {
        header: 'Date',
        cell: (info) => {
          const date = new Date(info.getValue())
          return (
            <span className="text-neutral-600">
              {date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          )
        },
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: (info) => {
          const status = info.getValue()
          const inquiryId = info.row.original.id
          return (
            <select
              value={status}
              onChange={(e) => handleStatusChange(inquiryId, e.target.value as InquiryStatus)}
              className={`
                cursor-pointer rounded-full px-3 py-1 text-xs font-medium
                border-0 outline-none focus:ring-2 focus:ring-brand-primary/20
                ${statusStyles[status]}
              `}
              aria-label={`Change status for inquiry from ${info.row.original.name}`}
            >
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="closed">Closed</option>
            </select>
          )
        },
      }),
      columnHelper.display({
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <div className="flex items-center justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onView?.(row.original)}
              aria-label={`View inquiry from ${row.original.name}`}
            >
              View
            </Button>
          </div>
        ),
      }),
    ],
    [onView, handleStatusChange]
  )

  const table = useReactTable({
    data: inquiries,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  if (isLoading) {
    return <AdminInquiriesTableSkeleton />
  }

  if (inquiries.length === 0) {
    return <AdminInquiriesTableEmpty />
  }

  return (
    <div className="space-y-4">
      {/* Search input */}
      <div className="flex items-center justify-between gap-4">
        <div className="w-full max-w-sm">
          <Input
            type="search"
            placeholder="Search inquiries..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
        </div>
        <div className="text-sm text-neutral-500">
          {table.getFilteredRowModel().rows.length} of {inquiries.length} inquiries
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-600 ${
                        header.column.getCanSort()
                          ? 'cursor-pointer select-none hover:bg-neutral-100'
                          : ''
                      }`}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() && (
                          <SortIndicator direction={header.column.getIsSorted()} />
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="transition-colors hover:bg-neutral-50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="whitespace-nowrap px-6 py-4 text-sm">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* No results state */}
        {table.getFilteredRowModel().rows.length === 0 && globalFilter && (
          <div className="px-6 py-12 text-center">
            <p className="text-neutral-600">
              No inquiries found matching "{globalFilter}"
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2"
              onClick={() => setGlobalFilter('')}
            >
              Clear search
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

// =============================================================================
// Empty state
// =============================================================================

export function AdminInquiriesTableEmpty() {
  return (
    <div className="rounded-xl border-2 border-dashed border-neutral-300 bg-white px-6 py-16 text-center">
      <svg
        className="mx-auto h-12 w-12 text-neutral-400"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21.75 9v.906a2.25 2.25 0 0 1-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 0 0 1.183 1.981l6.478 3.488m8.839 2.51-4.66-2.51m0 0-1.023-.55a2.25 2.25 0 0 0-2.134 0l-1.022.55m0 0-4.661 2.51m16.5 1.615a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V8.844a2.25 2.25 0 0 1 1.183-1.981l7.5-4.039a2.25 2.25 0 0 1 2.134 0l7.5 4.039a2.25 2.25 0 0 1 1.183 1.98V19.5Z"
        />
      </svg>
      <h3 className="mt-4 text-lg font-semibold text-neutral-900">No inquiries yet</h3>
      <p className="mt-2 text-sm text-neutral-600">
        When customers submit inquiries about products, they will appear here.
      </p>
    </div>
  )
}

// =============================================================================
// Skeleton loading state
// =============================================================================

export function AdminInquiriesTableSkeleton() {
  return (
    <div className="space-y-4">
      {/* Search skeleton */}
      <div className="flex items-center justify-between gap-4">
        <div className="h-10 w-full max-w-sm animate-pulse rounded-lg bg-neutral-200" />
        <div className="h-5 w-32 animate-pulse rounded bg-neutral-200" />
      </div>

      {/* Table skeleton */}
      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                {['Customer', 'Product', 'Message', 'Date', 'Status', ''].map((header, i) => (
                  <th
                    key={i}
                    className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-600"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {Array.from({ length: 4 }).map((_, rowIdx) => (
                <tr key={rowIdx}>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="space-y-1">
                      <div className="h-5 w-32 animate-pulse rounded bg-neutral-200" />
                      <div className="h-4 w-40 animate-pulse rounded bg-neutral-200" />
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="h-5 w-28 animate-pulse rounded bg-neutral-200" />
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="h-5 w-48 animate-pulse rounded bg-neutral-200" />
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="h-5 w-20 animate-pulse rounded bg-neutral-200" />
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="h-5 w-16 animate-pulse rounded-full bg-neutral-200" />
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex justify-end">
                      <div className="h-8 w-12 animate-pulse rounded bg-neutral-200" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

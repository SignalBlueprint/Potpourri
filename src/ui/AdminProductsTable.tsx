import { useState, useMemo } from 'react'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  type SortingState,
} from '@tanstack/react-table'
import { Badge, Button, Input } from './index'

// =============================================================================
// Product type for the table
// =============================================================================

export interface AdminProduct {
  id: string
  name: string
  category: string
  price: number
  stock: number
  status: 'active' | 'draft' | 'archived'
  imageUrl?: string
  lastUpdated?: string
  createdAt?: string
}

// =============================================================================
// Mock data for the products table
// =============================================================================

export const mockProducts: AdminProduct[] = [
  {
    id: '1',
    name: 'Artisan Candle Set',
    category: 'Home Decor',
    price: 34.99,
    stock: 24,
    status: 'active',
    createdAt: '2025-01-02',
  },
  {
    id: '2',
    name: 'Ceramic Vase Collection',
    category: 'Home Decor',
    price: 89.0,
    stock: 12,
    status: 'active',
    createdAt: '2025-01-01',
  },
  {
    id: '3',
    name: 'Bamboo Cutting Board',
    category: 'Kitchen & Dining',
    price: 45.0,
    stock: 8,
    status: 'active',
    createdAt: '2024-12-28',
  },
  {
    id: '4',
    name: 'Linen Table Runner',
    category: 'Kitchen & Dining',
    price: 28.5,
    stock: 0,
    status: 'draft',
    createdAt: '2024-12-25',
  },
  {
    id: '5',
    name: 'Garden Tool Set',
    category: 'Garden & Outdoor',
    price: 65.0,
    stock: 15,
    status: 'active',
    createdAt: '2024-12-20',
  },
  {
    id: '6',
    name: 'Seasonal Wreath',
    category: 'Seasonal',
    price: 55.0,
    stock: 3,
    status: 'active',
    createdAt: '2024-12-18',
  },
  {
    id: '7',
    name: 'Gourmet Gift Basket',
    category: 'Gift Sets',
    price: 125.0,
    stock: 7,
    status: 'active',
    createdAt: '2024-12-15',
  },
  {
    id: '8',
    name: 'Vintage Photo Frame',
    category: 'Home Decor',
    price: 22.0,
    stock: 30,
    status: 'active',
    createdAt: '2024-12-10',
  },
  {
    id: '9',
    name: 'Herb Growing Kit',
    category: 'Garden & Outdoor',
    price: 38.0,
    stock: 0,
    status: 'archived',
    createdAt: '2024-12-05',
  },
  {
    id: '10',
    name: 'Cozy Throw Blanket',
    category: 'Home Decor',
    price: 75.0,
    stock: 18,
    status: 'active',
    createdAt: '2024-12-01',
  },
]

// =============================================================================
// Column helper and definitions
// =============================================================================

const columnHelper = createColumnHelper<AdminProduct>()

const statusStyles = {
  active: 'bg-emerald-100 text-emerald-700',
  draft: 'bg-amber-100 text-amber-700',
  archived: 'bg-neutral-200 text-neutral-600',
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
// AdminProductsTable component
// =============================================================================

interface AdminProductsTableProps {
  products?: AdminProduct[]
  isLoading?: boolean
  onEdit?: (product: AdminProduct) => void
  onDelete?: (product: AdminProduct) => void
  onAddProduct?: () => void
}

export function AdminProductsTable({
  products = mockProducts,
  isLoading = false,
  onEdit,
  onDelete,
  onAddProduct,
}: AdminProductsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState('')

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: 'Product Name',
        cell: (info) => (
          <div className="font-medium text-neutral-900">{info.getValue()}</div>
        ),
      }),
      columnHelper.accessor('category', {
        header: 'Category',
        cell: (info) => (
          <Badge variant="default">{info.getValue()}</Badge>
        ),
      }),
      columnHelper.accessor('price', {
        header: 'Price',
        cell: (info) => (
          <span className="font-medium text-neutral-900">
            ${info.getValue().toFixed(2)}
          </span>
        ),
      }),
      columnHelper.accessor('stock', {
        header: 'Stock',
        cell: (info) => {
          const stock = info.getValue()
          return (
            <span
              className={`font-medium ${
                stock === 0
                  ? 'text-red-600'
                  : stock < 5
                    ? 'text-amber-600'
                    : 'text-neutral-900'
              }`}
            >
              {stock}
            </span>
          )
        },
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: (info) => {
          const status = info.getValue()
          return (
            <span
              className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusStyles[status]}`}
            >
              {status}
            </span>
          )
        },
      }),
      columnHelper.display({
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit?.(row.original)}
              aria-label={`Edit ${row.original.name}`}
            >
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={() => onDelete?.(row.original)}
              aria-label={`Delete ${row.original.name}`}
            >
              Delete
            </Button>
          </div>
        ),
      }),
    ],
    [onEdit, onDelete]
  )

  const table = useReactTable({
    data: products,
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
    return <AdminProductsTableSkeleton />
  }

  if (products.length === 0) {
    return <AdminProductsTableEmpty onAddProduct={onAddProduct} />
  }

  return (
    <div className="space-y-4">
      {/* Search input */}
      <div className="flex items-center justify-between gap-4">
        <div className="w-full max-w-sm">
          <Input
            type="search"
            placeholder="Search products..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
        </div>
        <div className="text-sm text-neutral-500">
          {table.getFilteredRowModel().rows.length} of {products.length} products
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
              No products found matching "{globalFilter}"
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

interface AdminProductsTableEmptyProps {
  onAddProduct?: () => void
}

export function AdminProductsTableEmpty({ onAddProduct }: AdminProductsTableEmptyProps) {
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
          d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
        />
      </svg>
      <h3 className="mt-4 text-lg font-semibold text-neutral-900">No products yet</h3>
      <p className="mt-2 text-sm text-neutral-600">
        Get started by adding your first product to the catalog.
      </p>
      <Button className="mt-6" onClick={onAddProduct}>Add Your First Product</Button>
    </div>
  )
}

// =============================================================================
// Skeleton loading state
// =============================================================================

export function AdminProductsTableSkeleton() {
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
                {['Product Name', 'Category', 'Price', 'Stock', 'Status', ''].map((header, i) => (
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
              {Array.from({ length: 5 }).map((_, rowIdx) => (
                <tr key={rowIdx}>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="h-5 w-40 animate-pulse rounded bg-neutral-200" />
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="h-5 w-24 animate-pulse rounded-full bg-neutral-200" />
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="h-5 w-16 animate-pulse rounded bg-neutral-200" />
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="h-5 w-10 animate-pulse rounded bg-neutral-200" />
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="h-5 w-16 animate-pulse rounded-full bg-neutral-200" />
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <div className="h-8 w-12 animate-pulse rounded bg-neutral-200" />
                      <div className="h-8 w-14 animate-pulse rounded bg-neutral-200" />
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

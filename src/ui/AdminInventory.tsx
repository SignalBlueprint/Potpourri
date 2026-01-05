import { useState, useMemo } from 'react'
import { Card, Button } from './index'
import type { AdminProduct } from './AdminProductsTable'

// =============================================================================
// AdminInventory - Inventory management panel
// =============================================================================

interface AdminInventoryProps {
  products: AdminProduct[]
  onUpdateStock: (productId: string, newStock: number) => void
  lowStockThreshold?: number
}

export function AdminInventory({
  products,
  onUpdateStock,
  lowStockThreshold = 5,
}: AdminInventoryProps) {
  const [filter, setFilter] = useState<'all' | 'low' | 'out'>('all')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')

  // Calculate inventory stats
  const stats = useMemo(() => {
    const total = products.length
    const lowStock = products.filter(
      (p) => p.stock <= lowStockThreshold && p.stock > 0
    ).length
    const outOfStock = products.filter((p) => p.stock === 0).length
    const inStock = total - lowStock - outOfStock
    const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0)

    return { total, lowStock, outOfStock, inStock, totalValue }
  }, [products, lowStockThreshold])

  // Filter products
  const filteredProducts = useMemo(() => {
    let filtered = [...products]

    if (filter === 'low') {
      filtered = filtered.filter((p) => p.stock <= lowStockThreshold && p.stock > 0)
    } else if (filter === 'out') {
      filtered = filtered.filter((p) => p.stock === 0)
    }

    // Sort by stock level (lowest first)
    return filtered.sort((a, b) => a.stock - b.stock)
  }, [products, filter, lowStockThreshold])

  const handleStartEdit = (product: AdminProduct) => {
    setEditingId(product.id)
    setEditValue(product.stock.toString())
  }

  const handleSaveEdit = (productId: string) => {
    const newStock = parseInt(editValue, 10)
    if (!isNaN(newStock) && newStock >= 0) {
      onUpdateStock(productId, newStock)
    }
    setEditingId(null)
    setEditValue('')
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditValue('')
  }

  const getStockBadge = (stock: number) => {
    if (stock === 0) {
      return (
        <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
          Out of Stock
        </span>
      )
    }
    if (stock <= lowStockThreshold) {
      return (
        <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
          Low Stock
        </span>
      )
    }
    return (
      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
        In Stock
      </span>
    )
  }

  return (
    <div className="space-y-6">
      {/* Inventory Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card className="p-4">
          <p className="text-sm text-neutral-500">Total Products</p>
          <p className="text-2xl font-bold text-neutral-900">{stats.total}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-neutral-500">In Stock</p>
          <p className="text-2xl font-bold text-green-600">{stats.inStock}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-neutral-500">Low Stock</p>
          <p className="text-2xl font-bold text-amber-600">{stats.lowStock}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-neutral-500">Out of Stock</p>
          <p className="text-2xl font-bold text-red-600">{stats.outOfStock}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-neutral-500">Inventory Value</p>
          <p className="text-2xl font-bold text-neutral-900">
            ${stats.totalValue.toLocaleString()}
          </p>
        </Card>
      </div>

      {/* Low Stock Alerts */}
      {stats.lowStock > 0 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-amber-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-amber-800">Low Stock Alert</h4>
              <p className="text-sm text-amber-700">
                {stats.lowStock} product{stats.lowStock !== 1 ? 's' : ''} running low
                (≤{lowStockThreshold} units). Consider restocking soon.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            filter === 'all'
              ? 'bg-brand-primary text-white'
              : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
          }`}
        >
          All ({stats.total})
        </button>
        <button
          onClick={() => setFilter('low')}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            filter === 'low'
              ? 'bg-amber-500 text-white'
              : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
          }`}
        >
          Low Stock ({stats.lowStock})
        </button>
        <button
          onClick={() => setFilter('out')}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            filter === 'out'
              ? 'bg-red-500 text-white'
              : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
          }`}
        >
          Out of Stock ({stats.outOfStock})
        </button>
      </div>

      {/* Inventory Table */}
      <Card className="overflow-hidden">
        <table className="w-full">
          <thead className="bg-neutral-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-neutral-600">
                Product
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-neutral-600">
                Category
              </th>
              <th className="px-4 py-3 text-center text-sm font-medium text-neutral-600">
                Status
              </th>
              <th className="px-4 py-3 text-center text-sm font-medium text-neutral-600">
                Stock
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-neutral-600">
                Value
              </th>
              <th className="px-4 py-3 text-center text-sm font-medium text-neutral-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {filteredProducts.map((product) => (
              <tr key={product.id} className="hover:bg-neutral-50">
                <td className="px-4 py-3">
                  <div className="font-medium text-neutral-900">{product.name}</div>
                  <div className="text-sm text-neutral-500">${product.price}</div>
                </td>
                <td className="px-4 py-3 text-sm text-neutral-600">
                  {product.category}
                </td>
                <td className="px-4 py-3 text-center">
                  {getStockBadge(product.stock)}
                </td>
                <td className="px-4 py-3 text-center">
                  {editingId === product.id ? (
                    <input
                      type="number"
                      min="0"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveEdit(product.id)
                        if (e.key === 'Escape') handleCancelEdit()
                      }}
                      className="w-20 rounded border border-neutral-300 px-2 py-1 text-center text-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
                      autoFocus
                    />
                  ) : (
                    <span
                      className={`font-medium ${
                        product.stock === 0
                          ? 'text-red-600'
                          : product.stock <= lowStockThreshold
                          ? 'text-amber-600'
                          : 'text-neutral-900'
                      }`}
                    >
                      {product.stock}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-right text-sm text-neutral-700">
                  ${(product.price * product.stock).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-center">
                  {editingId === product.id ? (
                    <div className="flex justify-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleSaveEdit(product.id)}
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleStartEdit(product)}
                    >
                      Update
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredProducts.length === 0 && (
          <div className="py-12 text-center text-neutral-500">
            No products match the current filter.
          </div>
        )}
      </Card>
    </div>
  )
}

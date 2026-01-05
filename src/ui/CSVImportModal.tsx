import { useState, useRef, useCallback, type ChangeEvent, type DragEvent } from 'react'
import { Button } from './index'
import { saveProduct, type StoredProduct } from '../api/productStorage'

// =============================================================================
// Types
// =============================================================================

interface CSVImportModalProps {
  isOpen: boolean
  onClose: () => void
  onImportComplete: () => void
  categories: string[]
}

interface ParsedProduct {
  name: string
  category: string
  price: number
  stock: number
  status: 'active' | 'draft' | 'archived'
  error?: string
}

interface ImportResult {
  success: number
  failed: number
  errors: string[]
}

// =============================================================================
// CSV Parser
// =============================================================================

function parseCSV(csvText: string, validCategories: string[]): ParsedProduct[] {
  const lines = csvText.trim().split('\n')
  if (lines.length < 2) {
    return []
  }

  // Parse header row
  const headerLine = lines[0]!
  const headers = headerLine.split(',').map((h) => h.trim().toLowerCase().replace(/"/g, ''))

  // Find column indices
  const nameIdx = headers.findIndex((h) => h === 'name' || h === 'product name' || h === 'product')
  const categoryIdx = headers.findIndex((h) => h === 'category')
  const priceIdx = headers.findIndex((h) => h === 'price')
  const stockIdx = headers.findIndex((h) => h === 'stock' || h === 'quantity' || h === 'qty')
  const statusIdx = headers.findIndex((h) => h === 'status')

  if (nameIdx === -1) {
    return [{ name: '', category: '', price: 0, stock: 0, status: 'active', error: 'CSV must have a "name" column' }]
  }

  const products: ParsedProduct[] = []

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]!.trim()
    if (!line) continue

    // Simple CSV parsing (handles basic quoted fields)
    const values = parseCSVLine(line)

    const name = values[nameIdx]?.trim() || ''
    const category = values[categoryIdx]?.trim() || validCategories[0] || 'Uncategorized'
    const priceStr = values[priceIdx]?.replace(/[$,]/g, '').trim() || '0'
    const stockStr = values[stockIdx]?.trim() || '0'
    const statusStr = values[statusIdx]?.toLowerCase().trim() || 'active'

    const price = parseFloat(priceStr)
    const stock = parseInt(stockStr, 10)
    const status = ['active', 'draft', 'archived'].includes(statusStr)
      ? (statusStr as 'active' | 'draft' | 'archived')
      : 'active'

    const errors: string[] = []
    if (!name) errors.push('Missing name')
    if (isNaN(price) || price < 0) errors.push('Invalid price')
    if (isNaN(stock) || stock < 0) errors.push('Invalid stock')
    if (!validCategories.includes(category) && category !== 'Uncategorized') {
      errors.push(`Unknown category: ${category}`)
    }

    products.push({
      name,
      category,
      price: isNaN(price) ? 0 : price,
      stock: isNaN(stock) ? 0 : stock,
      status,
      error: errors.length > 0 ? errors.join(', ') : undefined,
    })
  }

  return products
}

function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]!
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }
  result.push(current.trim())

  return result
}

// =============================================================================
// CSVImportModal Component
// =============================================================================

export function CSVImportModal({
  isOpen,
  onClose,
  onImportComplete,
  categories,
}: CSVImportModalProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [parsedProducts, setParsedProducts] = useState<ParsedProduct[]>([])
  const [isImporting, setIsImporting] = useState(false)
  const [importResult, setImportResult] = useState<ImportResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const resetState = useCallback(() => {
    setParsedProducts([])
    setImportResult(null)
    setError(null)
  }, [])

  const handleClose = useCallback(() => {
    resetState()
    onClose()
  }, [onClose, resetState])

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.name.endsWith('.csv')) {
        setError('Please upload a CSV file')
        return
      }

      try {
        const text = await file.text()
        const products = parseCSV(text, categories)

        if (products.length === 0) {
          setError('No products found in CSV. Make sure it has a header row and at least one data row.')
          return
        }

        if (products.length === 1 && products[0]?.error?.includes('CSV must have')) {
          setError(products[0].error)
          return
        }

        setParsedProducts(products)
        setError(null)
      } catch {
        setError('Failed to read CSV file')
      }
    },
    [categories]
  )

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      const file = e.dataTransfer.files[0]
      if (file) {
        handleFile(file)
      }
    },
    [handleFile]
  )

  const handleFileSelect = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        handleFile(file)
      }
    },
    [handleFile]
  )

  const handleImport = useCallback(async () => {
    const validProducts = parsedProducts.filter((p) => !p.error)
    if (validProducts.length === 0) {
      setError('No valid products to import')
      return
    }

    setIsImporting(true)
    const errors: string[] = []
    let success = 0

    for (const product of validProducts) {
      try {
        const storedProduct: StoredProduct = {
          id: `prod_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
          name: product.name,
          category: product.category,
          price: product.price,
          stock: product.stock,
          status: product.status,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        saveProduct(storedProduct)
        success++
      } catch {
        errors.push(`Failed to import: ${product.name}`)
      }
    }

    const failed = parsedProducts.filter((p) => p.error).length + errors.length
    setImportResult({ success, failed, errors })
    setIsImporting(false)

    if (success > 0) {
      onImportComplete()
    }
  }, [parsedProducts, onImportComplete])

  if (!isOpen) return null

  const validCount = parsedProducts.filter((p) => !p.error).length
  const invalidCount = parsedProducts.filter((p) => p.error).length

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />

      {/* Modal */}
      <div className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
          <h2 className="text-xl font-semibold text-neutral-900">Import Products from CSV</h2>
          <button
            onClick={handleClose}
            className="rounded-lg p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[60vh] overflow-y-auto p-6">
          {importResult ? (
            // Import Results
            <div className="space-y-4">
              <div className={`rounded-lg p-4 ${importResult.success > 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                <h3 className={`font-medium ${importResult.success > 0 ? 'text-green-800' : 'text-red-800'}`}>
                  Import Complete
                </h3>
                <p className={`mt-1 text-sm ${importResult.success > 0 ? 'text-green-700' : 'text-red-700'}`}>
                  Successfully imported {importResult.success} product{importResult.success !== 1 ? 's' : ''}.
                  {importResult.failed > 0 && ` ${importResult.failed} failed.`}
                </p>
              </div>
              {importResult.errors.length > 0 && (
                <div className="rounded-lg bg-red-50 p-4">
                  <h4 className="text-sm font-medium text-red-800">Errors:</h4>
                  <ul className="mt-2 list-inside list-disc text-sm text-red-700">
                    {importResult.errors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : parsedProducts.length > 0 ? (
            // Preview parsed products
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-neutral-600">
                  <span className="font-medium text-green-600">{validCount} valid</span>
                  {invalidCount > 0 && (
                    <span className="ml-2 font-medium text-red-600">{invalidCount} with errors</span>
                  )}
                </div>
                <button onClick={resetState} className="text-sm text-neutral-500 hover:text-neutral-700">
                  Choose different file
                </button>
              </div>

              <div className="max-h-64 overflow-auto rounded-lg border border-neutral-200">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-neutral-50">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium text-neutral-600">Name</th>
                      <th className="px-3 py-2 text-left font-medium text-neutral-600">Category</th>
                      <th className="px-3 py-2 text-right font-medium text-neutral-600">Price</th>
                      <th className="px-3 py-2 text-right font-medium text-neutral-600">Stock</th>
                      <th className="px-3 py-2 text-left font-medium text-neutral-600">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {parsedProducts.map((product, i) => (
                      <tr key={i} className={product.error ? 'bg-red-50' : ''}>
                        <td className="px-3 py-2">
                          {product.name || <span className="text-neutral-400">-</span>}
                          {product.error && (
                            <div className="mt-1 text-xs text-red-600">{product.error}</div>
                          )}
                        </td>
                        <td className="px-3 py-2 text-neutral-600">{product.category}</td>
                        <td className="px-3 py-2 text-right">${product.price.toFixed(2)}</td>
                        <td className="px-3 py-2 text-right">{product.stock}</td>
                        <td className="px-3 py-2 capitalize text-neutral-600">{product.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            // Upload area
            <div className="space-y-4">
              {error && (
                <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
              )}

              <div
                onDragOver={(e) => {
                  e.preventDefault()
                  setIsDragging(true)
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`
                  cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors
                  ${isDragging ? 'border-brand-primary bg-brand-primary/5' : 'border-neutral-300 hover:border-neutral-400'}
                `}
              >
                <svg
                  className="mx-auto h-12 w-12 text-neutral-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
                  />
                </svg>
                <p className="mt-2 text-sm text-neutral-600">
                  <span className="font-medium text-brand-primary">Click to upload</span> or drag and drop
                </p>
                <p className="mt-1 text-xs text-neutral-500">CSV file with product data</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              {/* CSV Format Help */}
              <div className="rounded-lg bg-neutral-50 p-4">
                <h4 className="text-sm font-medium text-neutral-700">Expected CSV Format</h4>
                <p className="mt-1 text-xs text-neutral-500">
                  Your CSV should have a header row with these columns:
                </p>
                <code className="mt-2 block rounded bg-neutral-200 px-2 py-1 text-xs">
                  name,category,price,stock,status
                </code>
                <p className="mt-2 text-xs text-neutral-500">
                  Example row: <code className="rounded bg-neutral-200 px-1">Ceramic Vase,Home Decor,29.99,15,active</code>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-neutral-200 px-6 py-4">
          <Button variant="secondary" onClick={handleClose}>
            {importResult ? 'Close' : 'Cancel'}
          </Button>
          {parsedProducts.length > 0 && !importResult && (
            <Button onClick={handleImport} disabled={isImporting || validCount === 0}>
              {isImporting ? 'Importing...' : `Import ${validCount} Product${validCount !== 1 ? 's' : ''}`}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

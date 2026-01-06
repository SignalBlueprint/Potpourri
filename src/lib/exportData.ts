// =============================================================================
// CSV Export Utility - Download products and inquiries as CSV files
// =============================================================================

import { mockProducts, type Product } from '../data/mockProducts'
import { getLocalInquiries, type StoredInquiry } from '../api/inquiries'

/**
 * Escape a value for CSV format.
 * Wraps in quotes if it contains commas, quotes, or newlines.
 */
function escapeCSV(value: unknown): string {
  if (value === null || value === undefined) {
    return ''
  }
  const str = String(value)
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

/**
 * Convert an array of objects to CSV string.
 */
function toCSV<T extends object>(
  data: T[],
  columns: { key: keyof T; header: string }[]
): string {
  const header = columns.map((col) => escapeCSV(col.header)).join(',')
  const rows = data.map((item) =>
    columns.map((col) => escapeCSV(item[col.key])).join(',')
  )
  return [header, ...rows].join('\n')
}

/**
 * Trigger a file download in the browser.
 */
function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Export all products as a CSV file.
 */
export function exportProductsCSV(): void {
  const columns: { key: keyof Product; header: string }[] = [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Name' },
    { key: 'category', header: 'Category' },
    { key: 'price', header: 'Price' },
    { key: 'description', header: 'Description' },
    { key: 'stock', header: 'Stock Status' },
    { key: 'isNew', header: 'Is New' },
    { key: 'isFeatured', header: 'Is Featured' },
  ]

  // Convert Date to ISO string for export
  const exportData = mockProducts.map((p) => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
  }))

  const csv = toCSV(exportData, columns)
  const timestamp = new Date().toISOString().slice(0, 10)
  downloadFile(csv, `products-${timestamp}.csv`, 'text/csv;charset=utf-8;')
}

/**
 * Export all inquiries as a CSV file.
 */
export function exportInquiriesCSV(): void {
  const inquiries = getLocalInquiries()

  const columns: { key: keyof StoredInquiry; header: string }[] = [
    { key: 'id', header: 'ID' },
    { key: 'timestamp', header: 'Date' },
    { key: 'status', header: 'Status' },
    { key: 'productId', header: 'Product ID' },
    { key: 'productName', header: 'Product Name' },
    { key: 'name', header: 'Customer Name' },
    { key: 'email', header: 'Email' },
    { key: 'message', header: 'Message' },
    { key: 'type', header: 'Type' },
    { key: 'quantity', header: 'Quantity' },
  ]

  const csv = toCSV(inquiries, columns)
  const timestamp = new Date().toISOString().slice(0, 10)
  downloadFile(csv, `inquiries-${timestamp}.csv`, 'text/csv;charset=utf-8;')
}

// =============================================================================
// Inquiry API - Lead capture for product inquiries
// =============================================================================

import { clientConfig } from '../client.config'

export interface InquiryPayload {
  productId: string
  productName: string
  name: string
  email: string
  message: string
}

export interface InquiryResponse {
  success: boolean
  inquiryId?: string
  error?: string
}

/**
 * Submit an inquiry to the API for lead capture.
 * Falls back to localStorage when backend is unavailable (demo mode).
 */
export async function submitInquiry(data: InquiryPayload): Promise<InquiryResponse> {
  const endpoint = `${clientConfig.tenant.apiBaseUrl}/inquiries`
  const payload = {
    ...data,
    tenantId: clientConfig.tenant.id,
    timestamp: new Date().toISOString(),
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (response.ok) {
      const result = await response.json()
      return { success: true, inquiryId: result.id }
    }

    // API returned an error status
    const errorData = await response.json().catch(() => ({}))
    return {
      success: false,
      error: errorData.message || `Request failed with status ${response.status}`,
    }
  } catch {
    // Network error or backend unavailable - fall back to localStorage (demo mode)
    return saveInquiryLocally(payload)
  }
}

/**
 * Demo fallback: save inquiries to localStorage when no backend is available.
 * This allows the UI to function for demos while providing persistence.
 */
function saveInquiryLocally(data: InquiryPayload & { tenantId: string; timestamp: string }): InquiryResponse {
  const storageKey = 'potpourri_inquiries'
  const inquiryId = `local_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`

  try {
    const existing = localStorage.getItem(storageKey)
    const inquiries = existing ? JSON.parse(existing) : []
    inquiries.push({ id: inquiryId, ...data })
    localStorage.setItem(storageKey, JSON.stringify(inquiries))

    return { success: true, inquiryId }
  } catch {
    return { success: false, error: 'Failed to save inquiry locally' }
  }
}

export type InquiryStatus = 'new' | 'contacted' | 'closed'

export interface StoredInquiry extends InquiryPayload {
  id: string
  tenantId: string
  timestamp: string
  status: InquiryStatus
}

const STORAGE_KEY = 'potpourri_inquiries'

/**
 * Retrieve locally stored inquiries (for admin/debug purposes).
 */
export function getLocalInquiries(): StoredInquiry[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    const inquiries = data ? JSON.parse(data) : []
    // Ensure all inquiries have a status (migration for old data)
    return inquiries.map((inq: StoredInquiry) => ({
      ...inq,
      status: inq.status || 'new',
    }))
  } catch {
    return []
  }
}

/**
 * Update the status of an inquiry.
 */
export function updateInquiryStatus(inquiryId: string, status: InquiryStatus): boolean {
  try {
    const inquiries = getLocalInquiries()
    const updatedInquiries = inquiries.map((inq) =>
      inq.id === inquiryId ? { ...inq, status } : inq
    )
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedInquiries))
    return true
  } catch {
    return false
  }
}

/**
 * Delete an inquiry by ID.
 */
export function deleteInquiry(inquiryId: string): boolean {
  try {
    const inquiries = getLocalInquiries()
    const filteredInquiries = inquiries.filter((inq) => inq.id !== inquiryId)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredInquiries))
    return true
  } catch {
    return false
  }
}

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

/**
 * Retrieve locally stored inquiries (for admin/debug purposes).
 */
export function getLocalInquiries(): Array<InquiryPayload & { id: string; tenantId: string; timestamp: string }> {
  const storageKey = 'potpourri_inquiries'
  try {
    const data = localStorage.getItem(storageKey)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

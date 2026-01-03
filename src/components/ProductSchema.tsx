// =============================================================================
// ProductSchema - JSON-LD structured data for products
// Generates schema.org Product markup for rich snippets in search results
// =============================================================================

import { useEffect } from 'react'
import { clientConfig } from '../client.config'

export interface ProductSchemaProps {
  id: string
  name: string
  description: string
  price: number
  imageUrl: string | null
  category: string
  isNew?: boolean
}

/**
 * Injects JSON-LD Product structured data into the document head.
 * This enables rich snippets in Google search results showing product info.
 */
export function ProductSchema({
  id,
  name,
  description,
  price,
  imageUrl,
  category,
}: ProductSchemaProps) {
  useEffect(() => {
    const { brand, contact } = clientConfig
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''

    const productSchema = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name,
      description,
      image: imageUrl ?? undefined,
      sku: id,
      category,
      offers: {
        '@type': 'Offer',
        url: `${baseUrl}/item/${id}`,
        priceCurrency: 'USD',
        price: price.toFixed(2),
        availability: 'https://schema.org/InStock',
        seller: {
          '@type': 'Organization',
          name: brand.name,
          telephone: contact.phone,
          email: contact.email,
          address: {
            '@type': 'PostalAddress',
            streetAddress: contact.address.street,
            addressLocality: contact.address.city,
            addressRegion: contact.address.state,
            postalCode: contact.address.zip,
            addressCountry: contact.address.country,
          },
        },
      },
      brand: {
        '@type': 'Organization',
        name: brand.name,
      },
    }

    // Create script element for JSON-LD
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.id = `product-schema-${id}`
    script.textContent = JSON.stringify(productSchema)

    // Remove any existing product schema for this product
    const existing = document.getElementById(`product-schema-${id}`)
    if (existing) {
      existing.remove()
    }

    // Append to head
    document.head.appendChild(script)

    // Cleanup on unmount
    return () => {
      const element = document.getElementById(`product-schema-${id}`)
      if (element) {
        element.remove()
      }
    }
  }, [id, name, description, price, imageUrl, category])

  // This component renders nothing - it only manages the JSON-LD in head
  return null
}

import { useEffect } from 'react'
import { clientConfig } from '../client.config'

export interface SEOProps {
  title?: string
  description?: string
  image?: string
  url?: string
  type?: 'website' | 'product' | 'article'
}

/**
 * SEO component for dynamic meta tags and Open Graph support.
 * Updates document head with title, description, and OG tags.
 *
 * Usage:
 *   <SEO title="Catalog" description="Browse our curated collection" />
 */
export function SEO({
  title,
  description,
  image,
  url,
  type = 'website',
}: SEOProps) {
  const { brand } = clientConfig
  const fullTitle = title ? `${title} | ${brand.name}` : `${brand.name} | ${brand.tagline}`
  const metaDescription = description ?? brand.tagline
  const ogImage = image ?? '/og-image.png'
  const canonicalUrl = url ?? (typeof window !== 'undefined' ? window.location.href : '')

  useEffect(() => {
    // Update document title
    document.title = fullTitle

    // Helper to set or create meta tag
    const setMetaTag = (
      attr: 'name' | 'property',
      key: string,
      content: string
    ) => {
      let element = document.querySelector(`meta[${attr}="${key}"]`)
      if (!element) {
        element = document.createElement('meta')
        element.setAttribute(attr, key)
        document.head.appendChild(element)
      }
      element.setAttribute('content', content)
    }

    // Standard meta tags
    setMetaTag('name', 'description', metaDescription)

    // Open Graph tags
    setMetaTag('property', 'og:title', fullTitle)
    setMetaTag('property', 'og:description', metaDescription)
    setMetaTag('property', 'og:image', ogImage)
    setMetaTag('property', 'og:url', canonicalUrl)
    setMetaTag('property', 'og:type', type)
    setMetaTag('property', 'og:site_name', brand.name)

    // Twitter Card tags
    setMetaTag('name', 'twitter:card', 'summary_large_image')
    setMetaTag('name', 'twitter:title', fullTitle)
    setMetaTag('name', 'twitter:description', metaDescription)
    setMetaTag('name', 'twitter:image', ogImage)
  }, [fullTitle, metaDescription, ogImage, canonicalUrl, type, brand.name])

  return null
}

export default SEO

import { useHead } from '@unhead/vue'
import { siteConfig } from '@/data/navigation'

/**
 * Composable for setting page head meta tags with consistent patterns
 * @param {Object} options - Page head options
 * @param {string} options.title - Page title (will be appended with site title)
 * @param {string} options.description - Page meta description
 * @param {string} [options.ogType='website'] - Open Graph type
 * @param {Object} [options.schema] - JSON-LD structured data schema
 * @param {boolean} [options.includeImage=false] - Include og:image and twitter meta tags
 * @param {boolean} [options.includeUrl=false] - Include og:url meta tag
 */
export function usePageHead({
  title,
  description,
  ogType = 'website',
  schema = null,
  includeImage = false,
  includeUrl = false
}) {
  const fullTitle = title.includes(siteConfig.title)
    ? title
    : `${title} - ${siteConfig.title}`

  const meta = [
    { name: 'description', content: description },
    { property: 'og:title', content: fullTitle },
    { property: 'og:description', content: description },
    { property: 'og:type', content: ogType }
  ]

  if (includeUrl) {
    meta.push({ property: 'og:url', content: siteConfig.url })
  }

  if (includeImage) {
    const imageUrl = `${siteConfig.url}${siteConfig.image}`
    meta.push(
      { property: 'og:image', content: imageUrl },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: fullTitle },
      { name: 'twitter:description', content: description }
    )
  }

  const headConfig = { title: fullTitle, meta }

  if (schema) {
    headConfig.script = [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify(schema)
      }
    ]
  }

  useHead(headConfig)
}

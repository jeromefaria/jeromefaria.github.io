import { useHead } from '@unhead/vue'
import { useRoute } from 'vue-router'
import { siteConfig } from '@/data/navigation'

/**
 * Composable for setting page head meta tags with consistent patterns
 * @param {Object} options - Page head options
 * @param {string} options.title - Page title (will be appended with site title)
 * @param {string} options.description - Page meta description
 * @param {string} [options.ogType='website'] - Open Graph type
 * @param {Object} [options.schema] - JSON-LD structured data schema
 * @param {boolean} [options.includeImage=false] - Include og:image and twitter:image meta tags
 */
export function usePageHead({
  title,
  description,
  ogType = 'website',
  schema = null,
  includeImage = false
}) {
  const route = useRoute()
  const fullTitle = title.includes(siteConfig.title)
    ? title
    : `${title} - ${siteConfig.title}`

  const canonicalUrl = `${siteConfig.url}${route.path}`

  const meta = [
    { name: 'description', content: description },
    { property: 'og:title', content: fullTitle },
    { property: 'og:description', content: description },
    { property: 'og:type', content: ogType },
    { property: 'og:url', content: canonicalUrl },
    { property: 'og:site_name', content: siteConfig.title },
    { name: 'twitter:card', content: includeImage ? 'summary_large_image' : 'summary' },
    { name: 'twitter:title', content: fullTitle },
    { name: 'twitter:description', content: description }
  ]

  if (includeImage) {
    const imageUrl = `${siteConfig.url}${siteConfig.image}`
    meta.push(
      { property: 'og:image', content: imageUrl },
      { name: 'twitter:image', content: imageUrl }
    )
  }

  const link = [
    { rel: 'canonical', href: canonicalUrl }
  ]

  const headConfig = { title: fullTitle, meta, link }

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

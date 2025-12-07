<script setup>
import { useHead } from '@unhead/vue'
import { siteConfig, social } from '@/data/navigation'

// Person schema for structured data
const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: siteConfig.author.name,
  url: siteConfig.url,
  jobTitle: siteConfig.tagline,
  description: siteConfig.description,
  image: `${siteConfig.url}${siteConfig.image}`,
  sameAs: social.map(s => s.url)
}

useHead({
  title: `${siteConfig.title} - ${siteConfig.tagline}`,
  meta: [
    { name: 'description', content: siteConfig.description },
    { property: 'og:title', content: `${siteConfig.title} - ${siteConfig.tagline}` },
    { property: 'og:description', content: siteConfig.description },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: siteConfig.url },
    { property: 'og:image', content: `${siteConfig.url}${siteConfig.image}` },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: `${siteConfig.title} - ${siteConfig.tagline}` },
    { name: 'twitter:description', content: siteConfig.description }
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(personSchema)
    }
  ]
})
</script>

<template>
  <div class="container-wide">
    <div class="home">
      <section
        class="hero"
        role="img"
        aria-label="Jerome Faria performing live"
        :style="{ backgroundImage: 'url(/images/performance.jpg)' }"
      />
    </div>
  </div>
</template>

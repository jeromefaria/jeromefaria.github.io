<script setup>
import { usePageHead } from '@/composables/usePageHead'
import { siteConfig, social } from '@/data/navigation'

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

usePageHead({
  title: `${siteConfig.title} - ${siteConfig.tagline}`,
  description: siteConfig.description,
  schema: personSchema,
  includeImage: true
})
</script>

<template>
  <div class="container-wide">
    <div class="home">
      <section
        class="hero"
        role="img"
        aria-label="Jerome Faria performing live"
        :style="{ backgroundImage: 'url(/images/performance.webp)' }"
      />
    </div>
  </div>
</template>

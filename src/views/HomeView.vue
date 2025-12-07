<script setup>
import { useHead } from '@unhead/vue'
import { siteConfig } from '@/data/navigation'

useHead({
  title: `${siteConfig.title} - ${siteConfig.tagline}`,
  meta: [
    { name: 'description', content: siteConfig.description },
    { property: 'og:title', content: `${siteConfig.title} - ${siteConfig.tagline}` },
    { property: 'og:description', content: siteConfig.description },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: siteConfig.url },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: `${siteConfig.title} - ${siteConfig.tagline}` },
    { name: 'twitter:description', content: siteConfig.description }
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

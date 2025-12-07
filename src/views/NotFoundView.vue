<script setup>
import { useHead } from '@unhead/vue'
import { siteConfig } from '@/data/navigation'

useHead({
  title: `Page Not Found - ${siteConfig.title}`,
  meta: [
    { name: 'robots', content: 'noindex' }
  ]
})
</script>

<template>
  <div class="container-wide">
    <article class="page">
      <h1>Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <p><RouterLink to="/">Return to homepage</RouterLink></p>
    </article>
  </div>
</template>

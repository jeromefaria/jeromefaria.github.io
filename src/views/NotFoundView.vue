<script setup>
import { onMounted } from 'vue'
import { siteConfig } from '@/data/navigation'

onMounted(() => {
  document.title = `Page Not Found - ${siteConfig.title}`
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

<script setup>
import { onMounted } from 'vue'
import { siteConfig } from '@/data/navigation'

onMounted(() => {
  document.title = `${siteConfig.title} - ${siteConfig.tagline}`
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

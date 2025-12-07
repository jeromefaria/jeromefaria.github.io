<script setup>
import { onMounted } from 'vue'
import { siteConfig } from '@/data/navigation'
import { aboutContent } from '@/data/about'

onMounted(() => {
  document.title = `About - ${siteConfig.title}`
})
</script>

<template>
  <div class="container-wide">
    <article class="page" data-page="about">
      <div class="prose" v-html="aboutContent" />
    </article>
  </div>
</template>

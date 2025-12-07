<script setup>
import { useHead } from '@unhead/vue'
import { siteConfig } from '@/data/navigation'
import { aboutContent } from '@/data/about'

useHead({
  title: `About - ${siteConfig.title}`,
  meta: [
    { name: 'description', content: 'Biography and background of Jerome Faria, Portuguese sound artist and electronic music composer.' },
    { property: 'og:title', content: `About - ${siteConfig.title}` },
    { property: 'og:description', content: 'Biography and background of Jerome Faria, Portuguese sound artist and electronic music composer.' },
    { property: 'og:type', content: 'profile' }
  ]
})
</script>

<template>
  <div class="container-wide">
    <article class="page" data-page="about">
      <div class="prose" v-html="aboutContent" />
    </article>
  </div>
</template>

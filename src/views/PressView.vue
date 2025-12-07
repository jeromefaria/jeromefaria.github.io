<script setup>
import { useHead } from '@unhead/vue'
import { siteConfig } from '@/data/navigation'
import { pressQuotes } from '@/data/press'

useHead({
  title: `Press - ${siteConfig.title}`,
  meta: [
    { name: 'description', content: 'Press coverage and reviews of Jerome Faria\'s work from The Quietus, Bodyspace, Indie Rock Mag, and more.' },
    { property: 'og:title', content: `Press - ${siteConfig.title}` },
    { property: 'og:description', content: 'Press coverage and reviews of Jerome Faria\'s work from The Quietus, Bodyspace, Indie Rock Mag, and more.' }
  ]
})
</script>

<template>
  <div class="container-wide">
    <article class="page" data-page="press">
      <blockquote v-for="(item, index) in pressQuotes" :key="index">
        <p v-html="item.quote" />
        <strong>
          <a :href="item.url" target="_blank" rel="noopener noreferrer">{{ item.source }}</a>
        </strong>
      </blockquote>
    </article>
  </div>
</template>

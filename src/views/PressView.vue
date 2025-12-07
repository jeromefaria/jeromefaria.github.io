<script setup>
import { onMounted } from 'vue'
import { siteConfig } from '@/data/navigation'
import { pressQuotes } from '@/data/press'

onMounted(() => {
  document.title = `Press - ${siteConfig.title}`
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

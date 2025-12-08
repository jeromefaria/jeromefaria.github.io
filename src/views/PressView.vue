<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { usePageHead } from '@/composables/usePageHead'
import { pressQuotes } from '@/data/press'

usePageHead({
  title: 'Press',
  description: 'Press coverage and reviews of Jerome Faria\'s work from The Quietus, Bodyspace, Indie Rock Mag, and more.'
})

const route = useRoute()

onMounted(() => {
  if (route.hash) {
    const id = route.hash.replace('#', '')
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }
})
</script>

<template>
  <div class="container-wide">
    <article class="page" data-page="press">
      <blockquote v-for="item in pressQuotes" :key="item.id" :id="item.id">
        <p v-html="item.quote" />
        <strong>
          <a v-if="item.url" :href="item.url" target="_blank" rel="noopener noreferrer">{{ item.source }}</a>
          <template v-else>{{ item.source }}</template>
        </strong>
      </blockquote>
    </article>
  </div>
</template>

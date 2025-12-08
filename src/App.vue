<script setup>
import { onMounted, watch, nextTick } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import SiteHeader from '@/components/SiteHeader.vue'
import SiteFooter from '@/components/SiteFooter.vue'

const route = useRoute()

const processExternalLinks = () => {
  const links = document.querySelectorAll('a[href^="http"]:not([target])')
  links.forEach(link => {
    if (!link.hostname.includes(window.location.hostname)) {
      link.setAttribute('target', '_blank')
      link.setAttribute('rel', 'noopener noreferrer')
    }
  })
}

onMounted(() => {
  processExternalLinks()
  document.body.classList.add('ready')
})
watch(() => route.path, async () => {
  await nextTick()
  processExternalLinks()
})
</script>

<template>
  <a href="#main-content" class="skip-link">Skip to main content</a>
  <div class="site">
    <SiteHeader />
    <main id="main-content">
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <Suspense>
            <component :is="Component" />
            <template #fallback>
              <div class="page-loading" aria-label="Loading page">
                <span class="loading-dot" />
                <span class="loading-dot" />
                <span class="loading-dot" />
              </div>
            </template>
          </Suspense>
        </Transition>
      </RouterView>
    </main>
    <SiteFooter />
  </div>
</template>

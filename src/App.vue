<script setup lang="ts">
import { nextTick, onMounted, watch } from 'vue';
import { RouterView, useRoute } from 'vue-router';

import SiteFooter from '@/components/SiteFooter.vue';
import SiteHeader from '@/components/SiteHeader.vue';

const route = useRoute();

const processExternalLinks = () => {
  // Only process links in main content area, not entire document
  const main = document.querySelector('main');
  if (!main) return;

  const links = main.querySelectorAll<HTMLAnchorElement>('a[href^="http"]:not([target])');
  links.forEach(link => {
    if (!link.hostname.includes(window.location.hostname)) {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    }
  });
};

onMounted(() => {
  processExternalLinks();
  document.body.classList.add('ready');
});
watch(() => route.path, async () => {
  await nextTick();
  processExternalLinks();
});
</script>

<template>
  <a
    href="#main-content"
    class="skip-link"
  >Skip to main content</a>
  <div class="site">
    <SiteHeader />
    <main id="main-content">
      <RouterView v-slot="{ Component }">
        <Transition
          name="page"
          mode="out-in"
        >
          <Suspense>
            <component :is="Component" />
            <template #fallback>
              <div
                class="page-loading"
                aria-label="Loading page"
              >
                <span class="page-loading__dot" />
                <span class="page-loading__dot" />
                <span class="page-loading__dot" />
              </div>
            </template>
          </Suspense>
        </Transition>
      </RouterView>
    </main>
    <SiteFooter />
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted } from 'vue';
import { RouterView } from 'vue-router';

import SiteFooter from '@/components/SiteFooter.vue';
import SiteHeader from '@/components/SiteHeader.vue';

const processExternalLinks = () => {
  // Only process links in main content area, not entire document
  const main = document.querySelector('main');
  if (!main) return;

  const links = main.querySelectorAll<HTMLAnchorElement>('a[href^="http"]:not([target])');
  links.forEach(link => {
    if (link.hostname !== window.location.hostname) {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    }
  });
};

// The routed view renders inside <Suspense>, so on navigation the new page is
// committed asynchronously — later than a route watcher's nextTick would fire.
// Reprocessing on the Suspense `resolve` event guarantees the freshly rendered
// page (including links inside v-html content) is in the DOM before we scan it.
const handleContentResolved = () => {
  void nextTick(() => processExternalLinks());
};

onMounted(() => {
  processExternalLinks();
  document.body.classList.add('ready');
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
          <Suspense @resolve="handleContentResolved">
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

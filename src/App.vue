<script setup lang="ts">
import { defineAsyncComponent, nextTick, onMounted } from 'vue';
import { RouterView } from 'vue-router';

import SiteFooter from '@/components/SiteFooter.vue';
import SiteHeader from '@/components/SiteHeader.vue';
import { audioPlayerEnabled, initFeatureFlags } from '@/composables/useFeatureFlags';
import { helpMounted, paletteMounted, useOverlayHotkeys } from '@/composables/useOverlays';
import { usePlayer } from '@/composables/usePlayer';
import { initTheme } from '@/composables/useTheme';
import { useT } from '@/i18n/useT';

// Lazy-loaded so the palette's registry, fuzzy ranker, and the data it reads stay
// out of the main bundle — they ship only once the overlay is first summoned.
const CommandPalette = defineAsyncComponent(() => import('@/components/CommandPalette.vue'));
const KeyboardHelp = defineAsyncComponent(() => import('@/components/KeyboardHelp.vue'));
const PlayerBar = defineAsyncComponent(() => import('@/components/PlayerBar.vue'));
const PlayerScreen = defineAsyncComponent(() => import('@/components/PlayerScreen.vue'));

const { expanded: playerExpanded } = usePlayer();

useOverlayHotkeys();

// Every external link opens in a new tab and gets a visually-hidden cue so
// screen readers announce it. This is the single source of that cue: links that
// already carry one (the ExternalLink component, or an aria-label that conveys
// it) are left alone, so nothing is announced twice.
const t = useT();

const addNewTabCue = (link: HTMLAnchorElement) => {
  if (link.hasAttribute('aria-label') || link.querySelector('.visually-hidden')) return;

  const cue = document.createElement('span');
  cue.className = 'visually-hidden';
  cue.textContent = ` ${t('common.newTabCue')}`;
  link.appendChild(cue);
};

const processExternalLinks = () => {
  const main = document.querySelector('main');
  if (!main) return;

  const links = main.querySelectorAll<HTMLAnchorElement>('a[href^="http"]');
  links.forEach(link => {
    if (link.hostname === window.location.hostname) return;

    if (!link.hasAttribute('target')) {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    }

    addNewTabCue(link);
  });
};

// The routed view renders inside <Suspense>, committed asynchronously later than
// a route watcher's nextTick; reprocessing on `resolve` guarantees the freshly
// rendered page (including links in v-html) is in the DOM before we scan it.
const handleContentResolved = () => {
  void nextTick(() => processExternalLinks());
};

onMounted(() => {
  initTheme();
  initFeatureFlags();
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
  <CommandPalette v-if="paletteMounted" />
  <KeyboardHelp v-if="helpMounted" />
  <PlayerBar v-if="audioPlayerEnabled" />
  <Transition name="player-slide">
    <PlayerScreen v-if="audioPlayerEnabled && playerExpanded" />
  </Transition>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, nextTick, onMounted } from 'vue';
import { RouterView } from 'vue-router';

import SiteFooter from '@/components/SiteFooter.vue';
import SiteHeader from '@/components/SiteHeader.vue';
import { audioPlayerEnabled, initFeatureFlags } from '@/composables/useFeatureFlags';
import { helpMounted, helpOpen, paletteMounted, paletteOpen, useOverlayHotkeys } from '@/composables/useOverlays';
import { usePlayer } from '@/composables/usePlayer';
import { initTheme } from '@/composables/useTheme';
import { useT } from '@/i18n/useT';

const CommandPalette = defineAsyncComponent(() => import('@/components/CommandPalette.vue'));
const KeyboardHelp = defineAsyncComponent(() => import('@/components/KeyboardHelp.vue'));
const PlayerBar = defineAsyncComponent(() => import('@/components/PlayerBar.vue'));
const PlayerScreen = defineAsyncComponent(() => import('@/components/PlayerScreen.vue'));

const { expanded: playerExpanded } = usePlayer();

const overlayActive = computed(() => paletteOpen.value || helpOpen.value || playerExpanded.value);

useOverlayHotkeys();

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
  >{{ t('common.skipToMain') }}</a>
  <div
    class="site"
    :inert="overlayActive"
  >
    <SiteHeader />
    <main
      id="main-content"
      tabindex="-1"
    >
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
                :aria-label="t('common.loadingPage')"
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

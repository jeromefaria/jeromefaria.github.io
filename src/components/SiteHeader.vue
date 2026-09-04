<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch } from 'vue';
import { RouterLink, useRoute } from 'vue-router';

import { navigation, siteConfig } from '@/data/navigation';
import { useLocalized } from '@/i18n/localized';
import { useT } from '@/i18n/useT';
import { TIMING } from '@/utils/constants';

const t = useT();
const { localize, toLocalePath } = useLocalized();
const route = useRoute();
const navOpen = ref(false);
const navClosing = ref(false);
const navToggle = ref<HTMLButtonElement | null>(null);
const navMenu = ref<HTMLElement | null>(null);

const closeNav = () => {
  navClosing.value = true;
  navOpen.value = false;
  setTimeout(() => {
    navClosing.value = false;
  }, TIMING.NAV_ANIMATION);
};

const openNav = () => {
  navOpen.value = true;
  void nextTick(() => {
    navMenu.value?.focus({ preventScroll: true });
  });
};

const toggleNav = () => {
  navOpen.value ? closeNav() : openNav();
};

const handleNavKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && navOpen.value) {
    closeNav();
    navToggle.value?.focus();
  }
};

watch(() => route.path, () => {
  if (navOpen.value) closeNav();
});

const handleOutsidePointer = (event: PointerEvent) => {
  const target = event.target as Node | null;
  if (target && !navMenu.value?.contains(target) && !navToggle.value?.contains(target)) {
    closeNav();
  }
};

watch(navOpen, open => {
  if (!open) {
    document.removeEventListener('pointerdown', handleOutsidePointer);
    return;
  }
  // eslint-disable-next-line local/no-comments -- binding immediately lets the opening tap also fire this handler and close the menu
  // Bind on the next tick so the tap that opened the menu doesn't close it.
  void nextTick(() => {
    document.addEventListener('pointerdown', handleOutsidePointer);
  });
});

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', handleOutsidePointer);
});
</script>

<template>
  <header class="masthead">
    <div class="masthead-inner">
      <p class="masthead-title">
        <RouterLink :to="toLocalePath('/')">
          {{ siteConfig.title }}
        </RouterLink>
        <span class="masthead-tagline">{{ localize(siteConfig.tagline) }}</span>
      </p>

      <div class="masthead-controls">
        <button
          ref="navToggle"
          class="nav-toggle"
          type="button"
          :aria-label="t('nav.toggleMenu')"
          aria-controls="primary-nav"
          :aria-expanded="navOpen"
          @click="toggleNav"
        >
          <svg
            class="nav-toggle__icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            aria-hidden="true"
            focusable="false"
          >
            <line
              class="nav-toggle__line nav-toggle__line--top"
              x1="4"
              y1="12"
              x2="20"
              y2="12"
            />
            <line
              class="nav-toggle__line nav-toggle__line--bottom"
              x1="4"
              y1="12"
              x2="20"
              y2="12"
            />
          </svg>
        </button>
      </div>

      <nav
        id="primary-nav"
        ref="navMenu"
        class="nav"
        :class="{ 'nav--open': navOpen, 'nav--closing': navClosing }"
        :aria-label="t('nav.mainLabel')"
        tabindex="-1"
        @keydown="handleNavKeydown"
      >
        <div class="nav__inner">
          <RouterLink
            v-for="nav in navigation"
            :key="nav.url"
            :to="toLocalePath(nav.url)"
            class="nav__link"
          >
            {{ t(nav.labelKey) }}
          </RouterLink>
        </div>
      </nav>
    </div>
  </header>
</template>

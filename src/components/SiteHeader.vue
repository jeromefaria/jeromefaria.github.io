<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';
import { RouterLink, useRoute } from 'vue-router';

import { navigation, siteConfig } from '@/data/navigation';
import { TIMING } from '@/utils/constants';

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
  // Move focus into the menu once it's rendered so keyboard users land in it.
  void nextTick(() => {
    navMenu.value?.querySelector<HTMLElement>('.nav__link')?.focus();
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
</script>

<template>
  <header class="masthead">
    <div class="masthead-inner">
      <p class="masthead-title">
        <RouterLink to="/">
          {{ siteConfig.title }}
        </RouterLink>
        <span class="masthead-tagline">{{ siteConfig.tagline }}</span>
      </p>

      <div class="masthead-controls">
        <button
          ref="navToggle"
          class="nav-toggle"
          type="button"
          aria-label="Toggle menu"
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
        aria-label="Main navigation"
        @keydown="handleNavKeydown"
      >
        <div class="nav__inner">
          <RouterLink
            v-for="nav in navigation"
            :key="nav.url"
            :to="nav.url"
            class="nav__link"
          >
            {{ nav.title }}
          </RouterLink>
        </div>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { siteConfig, navigation } from '@/data/navigation'

const route = useRoute()
const navOpen = ref(false)
const navClosing = ref(false)

function toggleNav() {
  if (navOpen.value) {
    navClosing.value = true
    navOpen.value = false
    setTimeout(() => {
      navClosing.value = false
    }, 300)
  } else {
    navOpen.value = true
  }
}

watch(() => route.path, () => {
  if (navOpen.value) {
    navClosing.value = true
    navOpen.value = false
    setTimeout(() => {
      navClosing.value = false
    }, 300)
  }
})
</script>

<template>
  <header class="masthead">
    <div class="masthead-inner">
      <h1 class="masthead-title">
        <RouterLink to="/">{{ siteConfig.title }}</RouterLink>
        <span class="masthead-tagline">{{ siteConfig.tagline }}</span>
      </h1>

      <div class="masthead-controls">
        <button
          class="nav-toggle"
          type="button"
          aria-label="Toggle menu"
          :aria-expanded="navOpen"
          @click="toggleNav"
        >
          <svg class="nav-toggle-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <line class="nav-toggle-line nav-toggle-line-1" x1="4" y1="12" x2="20" y2="12"></line>
            <line class="nav-toggle-line nav-toggle-line-2" x1="4" y1="12" x2="20" y2="12"></line>
          </svg>
        </button>
      </div>

      <nav
        class="nav"
        :class="{ 'is-open': navOpen, 'is-closing': navClosing }"
        aria-label="Main navigation"
      >
        <div class="nav-inner">
          <RouterLink
            v-for="nav in navigation"
            :key="nav.url"
            :to="nav.url"
            class="nav-link"
          >
            {{ nav.title }}
          </RouterLink>
        </div>
      </nav>
    </div>
  </header>
</template>

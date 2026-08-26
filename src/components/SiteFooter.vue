<script setup lang="ts">
import { RouterLink } from 'vue-router';

import { navigation, siteConfig, social } from '@/data/navigation';

import ExternalLink from './ExternalLink.vue';

const currentYear = new Date().getFullYear();
</script>

<template>
  <footer>
    <div class="container">
      <div class="footer__content">
        <nav
          class="footer__nav"
          aria-label="Footer navigation"
        >
          <RouterLink
            v-for="nav in navigation"
            :key="nav.url"
            :to="nav.url"
          >
            {{ nav.title }}
          </RouterLink>
        </nav>
        <div class="social-links">
          <ExternalLink
            v-for="item in social"
            :key="item.name"
            :href="item.url"
            :aria-label="`${siteConfig.author.name} on ${item.name} (opens in a new tab)`"
          >
            {{ item.name }}
          </ExternalLink>
        </div>
        <p class="footer__copyright">
          &copy; {{ currentYear }} <RouterLink to="/contact">
            {{ siteConfig.author.name }}
          </RouterLink>
          <span class="footer__separator">·</span>
          <RouterLink to="/privacy">
            Privacy
          </RouterLink>
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';

import { navigation, siteConfig } from '@/data/navigation';

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
        <p class="footer__copyright">
          &copy; {{ currentYear }} <RouterLink to="/contact">
            {{ siteConfig.author.name }}
          </RouterLink>
          •
          <RouterLink to="/privacy">
            Privacy
          </RouterLink>
          •
          <RouterLink to="/colophon">
            Colophon
          </RouterLink>
        </p>
      </div>
    </div>
  </footer>
</template>

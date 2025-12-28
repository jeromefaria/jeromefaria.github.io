<script setup>
import { RouterLink } from 'vue-router';

import { navigation, siteConfig, social } from '@/data/navigation';

const currentYear = new Date().getFullYear();
</script>

<template>
  <footer>
    <div class="container">
      <div class="footer-content">
        <nav
          class="footer-nav"
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
          <a
            v-for="item in social"
            :key="item.name"
            :href="item.url"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="`${siteConfig.author.name} on ${item.name}`"
          >
            {{ item.name }}
          </a>
        </div>
        <p class="footer__copyright">
          &copy; {{ currentYear }} <RouterLink to="/contact">{{ siteConfig.author.name }}</RouterLink>
        </p>
      </div>
    </div>
  </footer>
</template>

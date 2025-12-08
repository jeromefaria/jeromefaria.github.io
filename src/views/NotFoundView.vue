<script setup>
import { RouterLink } from 'vue-router';
import { usePageHead } from '@/composables/usePageHead';
import { navigation } from '@/data/navigation';

usePageHead({
  title: 'Page Not Found',
  description: 'The page you are looking for does not exist.',
  noIndex: true
});
</script>

<template>
  <div class="container-wide">
    <article class="page not-found">
      <h1>Page Not Found</h1>
      <p>The page you're looking for doesn't exist or may have been moved.</p>
      <nav
        class="not-found-nav"
        aria-label="Site navigation"
      >
        <p>Try one of these pages:</p>
        <ul>
          <li>
            <RouterLink to="/">
              Home
            </RouterLink>
          </li>
          <li
            v-for="nav in navigation"
            :key="nav.url"
          >
            <RouterLink :to="nav.url">
              {{ nav.title }}
            </RouterLink>
          </li>
        </ul>
      </nav>
    </article>
  </div>
</template>

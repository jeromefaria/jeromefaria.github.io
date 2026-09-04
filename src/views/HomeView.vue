<script setup lang="ts">
import { usePageHead } from '@/composables/usePageHead';
import { siteConfig } from '@/data/navigation';
import { pageMeta } from '@/data/pageMeta';
import { useLocalized } from '@/i18n/localized';
import { createPersonSchema } from '@/utils/pageSchemas';

const { localize, current } = useLocalized();

usePageHead({
  ...pageMeta.home,
  schema: createPersonSchema(current.value),
  preloadImages: [
    { href: '/images/responsive/performance-1280w.webp', media: '(max-width: 640px)' },
    { href: '/images/performance.webp', media: '(min-width: 641px)' },
  ],
});
</script>

<template>
  <div class="container-wide">
    <div class="home">
      <h1 class="visually-hidden">
        {{ siteConfig.title }} — {{ localize(siteConfig.tagline) }}
      </h1>
      <section class="hero" />
    </div>
  </div>
</template>

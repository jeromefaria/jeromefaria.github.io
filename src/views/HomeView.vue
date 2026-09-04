<script setup lang="ts">
import { usePageHead } from '@/composables/usePageHead';
import { siteConfig } from '@/data/navigation';
import { pageMeta } from '@/data/pageMeta';
import { useLocalized } from '@/i18n/localized';
import { createPersonSchema } from '@/utils/pageSchemas';

const { localize, current } = useLocalized();

const heroImageSrc = '/images/performance.webp';
const heroImageSrcset = '/images/responsive/performance-1280w.webp 1280w, /images/performance.webp 2560w';

usePageHead({
  ...pageMeta.home,
  schema: createPersonSchema(current.value),
  preloadImage: heroImageSrc,
  preloadImageSrcset: heroImageSrcset,
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

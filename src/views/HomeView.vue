<script setup lang="ts">
import { usePageHead } from '@/composables/usePageHead';
import { siteConfig } from '@/data/navigation';
import { pageMeta } from '@/data/pageMeta';
import { useLocalized } from '@/i18n/localized';
import { createPersonSchema } from '@/utils/pageSchemas';

const { localize, current } = useLocalized();

// The hero background is applied in the critical CSS (index.html) so it paints at
// first paint; here we only preload it responsively — phones fetch the 1280px
// variant, larger screens the full-res file. (An inline style can't be overridden
// by the media queries, which is why the background lives in CSS.)
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

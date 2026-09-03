<script setup lang="ts">
import { usePageHead } from '@/composables/usePageHead';
import { siteConfig } from '@/data/navigation';
import { pageMeta } from '@/data/pageMeta';
import { useLocalized } from '@/i18n/localized';
import { createPersonSchema } from '@/utils/pageSchemas';

const { localize, current } = useLocalized();
const heroImageSrc = '/images/performance.webp';

usePageHead({
  ...pageMeta.home,
  schema: createPersonSchema(current.value),
  preloadImage: heroImageSrc,
});
</script>

<template>
  <div class="container-wide">
    <div class="home">
      <h1 class="visually-hidden">
        {{ siteConfig.title }} — {{ localize(siteConfig.tagline) }}
      </h1>
      <!-- Painted at first paint: the background is in the SSR markup and preloaded
           with fetchpriority=high, so it is the LCP element — no JS reveal gate. -->
      <section
        class="hero"
        :style="{ backgroundImage: `url(${heroImageSrc})` }"
      />
    </div>
  </div>
</template>

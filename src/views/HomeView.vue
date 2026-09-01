<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { usePageHead } from '@/composables/usePageHead';
import { siteConfig } from '@/data/navigation';
import { pageMeta } from '@/data/pageMeta';
import { useLocalized } from '@/i18n/localized';
import { useLocale } from '@/i18n/useLocale';
import { createPersonSchema } from '@/utils/pageSchemas';

const localize = useLocalized();
const { current } = useLocale();
const heroImageSrc = '/images/performance.webp';

usePageHead({
  ...pageMeta.home,
  schema: createPersonSchema(current.value),
  preloadImage: heroImageSrc,
});

const heroImageLoaded = ref(false);

onMounted(() => {
  const heroImage = new Image();
  heroImage.onload = () => {
    heroImageLoaded.value = true;
  };
  // Reveal the hero even if the image fails, so the loader never spins forever.
  heroImage.onerror = () => {
    heroImageLoaded.value = true;
  };
  heroImage.src = heroImageSrc;
});
</script>

<template>
  <div class="container-wide">
    <div class="home">
      <h1 class="visually-hidden">
        {{ siteConfig.title }} — {{ localize(siteConfig.tagline) }}
      </h1>
      <section
        class="hero"
        :class="{ 'hero--loaded': heroImageLoaded }"
        :style="{ backgroundImage: `url(${heroImageSrc})` }"
      >
        <div
          v-if="!heroImageLoaded"
          class="hero__loading"
        >
          <div class="hero__loading-dot" />
          <div class="hero__loading-dot" />
          <div class="hero__loading-dot" />
        </div>
      </section>
    </div>
  </div>
</template>

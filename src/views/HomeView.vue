<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { usePageHead } from '@/composables/usePageHead';
import { siteConfig, social } from '@/data/navigation';

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: siteConfig.author.name,
  url: siteConfig.url,
  jobTitle: siteConfig.tagline,
  description: siteConfig.description,
  image: `${siteConfig.url}${siteConfig.image}`,
  sameAs: social.map(s => s.url),
};

usePageHead({
  title: `${siteConfig.title} - ${siteConfig.tagline}`,
  description: siteConfig.description,
  schema: personSchema,
  includeImage: true,
});

const heroImageLoaded = ref(false);
const heroImageSrc = '/images/performance.jpg';

onMounted(() => {
  const img = new Image();
  img.src = heroImageSrc;
  img.onload = () => {
    heroImageLoaded.value = true;
  };
});
</script>

<template>
  <div class="container-wide">
    <div class="home">
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

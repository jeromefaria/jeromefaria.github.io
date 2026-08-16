<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';

import LightboxHost from '@/components/LightboxHost.vue';
import { usePageHead } from '@/composables/usePageHead';
import { aboutSections } from '@/data/about';
import { pageMeta } from '@/data/pageMeta';
import { getImageStyles } from '@/utils/imageStyles';
import { toLightboxImage } from '@/utils/lightboxAdapters';
import { responsiveSrcset, toWebp } from '@/utils/responsiveImage';

usePageHead(pageMeta.about);

const lightbox = useTemplateRef<InstanceType<typeof LightboxHost>>('lightbox');

// All image-group images, flattened to lightbox items.
const allImages = computed(() => {
  return aboutSections
    .filter(section => section.type === 'image-group' && 'images' in section)
    .flatMap(section => section.images.map(toLightboxImage));
});

// Pre-compute section starting indices for O(1) lookup
const sectionStartIndices = computed(() => {
  let currentIndex = 0;
  return aboutSections.map(section => {
    const startIndex = currentIndex;
    if (section.type === 'image-group' && 'images' in section) {
      currentIndex += section.images.length;
    }
    return startIndex;
  });
});

// Global index of an image — O(1) via the precomputed section starts.
const getGlobalIndex = (sectionIndex: number, imageIndex: number): number => {
  return (sectionStartIndices.value[sectionIndex] ?? 0) + imageIndex;
};
</script>

<template>
  <div class="container-wide">
    <article
      class="page"
      data-page="about"
    >
      <h1 class="visually-hidden">
        About
      </h1>
      <template
        v-for="(section, sectionIndex) in aboutSections"
        :key="section.id"
      >
        <!-- Short bio -->
        <div
          v-if="section.type === 'short-bio'"
          class="short-bio"
          v-html="section.content"
        />

        <!-- Text section -->
        <div
          v-else-if="!section.type"
          class="prose"
          v-html="section.content"
        />

        <!-- Image group (magazine-style layout) -->
        <div
          v-else-if="section.type === 'image-group'"
          class="about-image-group"
        >
          <figure
            v-for="(image, imageIndex) in section.images"
            :key="imageIndex"
            class="about-image-group__image"
            @click="lightbox?.openLightbox(allImages, getGlobalIndex(sectionIndex, imageIndex))"
          >
            <picture>
              <source
                v-if="responsiveSrcset(image.src)"
                :srcset="responsiveSrcset(image.src) ?? undefined"
                sizes="(min-width: 768px) 45vw, 48vw"
                type="image/webp"
              >
              <source
                :srcset="toWebp(image.src)"
                type="image/webp"
              >
              <img
                :src="image.src"
                :alt="image.alt"
                :style="getImageStyles(image)"
                loading="lazy"
                decoding="async"
              >
            </picture>
          </figure>
        </div>

        <!-- Single image divider (legacy support) -->
        <figure
          v-else-if="section.type === 'image' && 'src' in section && 'alt' in section"
          class="about-image"
        >
          <img
            :src="section.src"
            :alt="section.alt"
            loading="lazy"
            decoding="async"
          >
        </figure>
      </template>
    </article>

    <LightboxHost ref="lightbox" />
  </div>
</template>

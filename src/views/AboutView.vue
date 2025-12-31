<script setup>
import { computed } from 'vue';

import LightboxOverlay from '@/components/LightboxOverlay.vue';
import { useLightboxWithSwipe } from '@/composables/useLightboxWithSwipe';
import { usePageHead } from '@/composables/usePageHead';
import { aboutSections } from '@/data/about';
import { getImageStyles } from '@/utils/imageStyles';

usePageHead({
  title: 'About',
  description: 'Biography and background of Jerome Faria, Portuguese sound artist and electronic music composer.',
  ogType: 'profile',
});

const { isOpen, currentItem, currentIndex, items, openLightbox, closeLightbox, goToNext, goToPrev, handleTouchStart, handleTouchEnd } = useLightboxWithSwipe();

// Collect all images from all image groups
const allImages = computed(() => {
  return aboutSections
    .filter(section => section.type === 'image-group')
    .flatMap(section => section.images);
});

// Pre-compute section starting indices for O(1) lookup
const sectionStartIndices = computed(() => {
  let currentIndex = 0;
  return aboutSections.map(section => {
    const startIndex = currentIndex;
    if (section.type === 'image-group') {
      currentIndex += section.images.length;
    }
    return startIndex;
  });
});

// Helper to get global index of an image - O(1) instead of O(n)
const getGlobalIndex = (sectionIndex, imageIndex) => {
  return sectionStartIndices.value[sectionIndex] + imageIndex;
};
</script>

<template>
  <div class="container-wide">
    <article
      class="page"
      data-page="about"
    >
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
            @click="openLightbox(allImages, getGlobalIndex(sectionIndex, imageIndex))"
          >
            <picture>
              <source
                :srcset="image.src.replace('.jpg', '.webp')"
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
          v-else-if="section.type === 'image'"
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

    <!-- Lightbox overlay -->
    <LightboxOverlay
      :is-open="isOpen"
      :current-item="currentItem"
      :current-index="currentIndex"
      :total-items="items.length"
      variant="compact"
      @close="closeLightbox"
      @prev="goToPrev"
      @next="goToNext"
      @touchstart="handleTouchStart"
      @touchend="handleTouchEnd"
    />
  </div>
</template>

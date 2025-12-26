<script setup>
import { computed } from 'vue';
import { usePageHead } from '@/composables/usePageHead';
import { useLightbox } from '@/composables/useLightbox';
import { aboutSections } from '@/data/about';

usePageHead({
  title: 'About',
  description: 'Biography and background of Jerome Faria, Portuguese sound artist and electronic music composer.',
  ogType: 'profile',
});

const { isOpen, currentImage, currentIndex, images, openLightbox, closeLightbox, goToNext, goToPrev } = useLightbox();

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

// Pre-compute all image styles once (static data, never changes)
const imageStylesCache = new Map();

const getImageStyles = (image) => {
  if (imageStylesCache.has(image)) {
    return imageStylesCache.get(image);
  }

  const styles = {};

  if (image.position) {
    styles.objectPosition = image.position;
  }

  if (image.scale || image.rotate) {
    const transforms = [];
    if (image.scale) transforms.push(`scale(${image.scale})`);
    if (image.rotate) transforms.push(`rotate(${image.rotate}deg)`);
    styles.transform = transforms.join(' ');
  }

  imageStylesCache.set(image, styles);
  return styles;
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
    <Transition name="lightbox">
      <div
        v-if="isOpen"
        class="lightbox"
        @click="closeLightbox"
      >
        <button
          v-if="currentIndex > 0"
          class="lightbox__nav lightbox__nav--prev"
          @click.stop="goToPrev"
          aria-label="Previous image"
        />

        <picture v-if="currentImage">
          <source
            :srcset="currentImage.src.replace('.jpg', '.webp')"
            type="image/webp"
          >
          <img
            :src="currentImage.src"
            :alt="currentImage.alt"
            class="lightbox__image"
            @click.stop
          >
        </picture>

        <button
          v-if="currentIndex < images.length - 1"
          class="lightbox__nav lightbox__nav--next"
          @click.stop="goToNext"
          aria-label="Next image"
        />

        <!-- Keyboard hints -->
        <div class="lightbox__hints">
          <span class="lightbox__hint">ESC to close</span>
          <span
            v-if="images.length > 1"
            class="lightbox__hint"
          >← → to navigate</span>
        </div>
      </div>
    </Transition>
  </div>
</template>

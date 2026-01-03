<script setup lang="ts">
import { computed } from 'vue';

import type { LightboxItem } from '@/types';
import { isLightboxImage, isLightboxVideo } from '@/types';

const props = withDefaults(defineProps<{
  isOpen: boolean;
  currentItem: LightboxItem | null;
  currentIndex: number;
  totalItems: number;
  variant?: 'default' | 'compact';
}>(), {
  variant: 'default',
});

const emit = defineEmits<{
  close: [];
  prev: [];
  next: [];
  touchstart: [e: TouchEvent];
  touchend: [e: TouchEvent];
}>();

// Determine if current item is a video or image
const isVideo = computed(() => props.currentItem !== null && isLightboxVideo(props.currentItem));
const isImage = computed(() => props.currentItem !== null && isLightboxImage(props.currentItem));

// Computed photographer credit (if exists on current image)
const photographer = computed(() => {
  if (props.currentItem && isLightboxImage(props.currentItem)) {
    return props.currentItem.photographer || null;
  }
  return null;
});

const handleClose = () => emit('close');
const handlePrev = () => emit('prev');
const handleNext = () => emit('next');
const handleTouchStart = (e: TouchEvent) => emit('touchstart', e);
const handleTouchEnd = (e: TouchEvent) => emit('touchend', e);
</script>

<template>
  <Transition name="lightbox">
    <div
      v-if="isOpen"
      class="lightbox"
      @click="handleClose"
      @touchstart="handleTouchStart"
      @touchend="handleTouchEnd"
    >
      <!-- Default variant: separate close button + side navigation -->
      <template v-if="variant === 'default'">
        <button
          class="lightbox__close"
          aria-label="Close lightbox"
          @click.stop="handleClose"
        />

        <button
          v-if="currentIndex > 0"
          class="lightbox__nav lightbox__nav--prev"
          aria-label="Previous item"
          @click.stop="handlePrev"
        />

        <!-- Video -->
        <iframe
          v-if="isVideo && currentItem && isLightboxVideo(currentItem)"
          :src="currentItem.url"
          class="lightbox__video"
          :title="currentItem.title || 'Video'"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
          @click.stop
        />

        <!-- Image -->
        <picture v-else-if="isImage && currentItem && isLightboxImage(currentItem)">
          <source
            :srcset="currentItem.src.replace('.jpg', '.webp')"
            type="image/webp"
          >
          <img
            :src="currentItem.src"
            :alt="currentItem.alt"
            class="lightbox__image"
          >
        </picture>

        <button
          v-if="currentIndex < totalItems - 1"
          class="lightbox__nav lightbox__nav--next"
          aria-label="Next item"
          @click.stop="handleNext"
        />

        <!-- Keyboard hints -->
        <div class="lightbox__hints">
          <span class="lightbox__hint">ESC to close</span>
          <span
            v-if="totalItems > 1"
            class="lightbox__hint"
          >← → to navigate</span>
        </div>
      </template>

      <!-- Compact variant: button hints + photographer credit -->
      <template v-else-if="variant === 'compact'">
        <!-- Video -->
        <iframe
          v-if="isVideo && currentItem && isLightboxVideo(currentItem)"
          :src="currentItem.url"
          class="lightbox__video"
          :title="currentItem.title || 'Video'"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
          @click.stop
        />

        <!-- Image -->
        <picture v-else-if="isImage && currentItem && isLightboxImage(currentItem)">
          <source
            :srcset="currentItem.src.replace('.jpg', '.webp')"
            type="image/webp"
          >
          <img
            :src="currentItem.src"
            :alt="currentItem.alt"
            class="lightbox__image"
          >
        </picture>

        <!-- Navigation hints as buttons -->
        <div class="lightbox__hints">
          <button
            class="lightbox__hint lightbox__hint--prev"
            :disabled="currentIndex === 0"
            aria-label="Previous image"
            @click.stop="handlePrev"
          >
            ←
          </button>
          <button
            class="lightbox__hint lightbox__hint--close"
            aria-label="Close lightbox"
            @click.stop="handleClose"
          >
            ×
          </button>
          <button
            class="lightbox__hint lightbox__hint--next"
            :disabled="currentIndex >= totalItems - 1"
            aria-label="Next item"
            @click.stop="handleNext"
          >
            →
          </button>
        </div>

        <!-- Photographer credit -->
        <div
          v-if="photographer"
          class="lightbox__credit"
        >
          Photo by <a
            v-if="photographer.url"
            :href="photographer.url"
            target="_blank"
            rel="noopener noreferrer"
          >{{ photographer.name }}</a>
          <span v-else>{{ photographer.name }}</span>
        </div>
      </template>
    </div>
  </Transition>
</template>

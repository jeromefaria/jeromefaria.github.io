<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue';

import type { LightboxItem } from '@/types';
import { isLightboxImage, isLightboxVideo } from '@/types';

import IconArrow from './IconArrow.vue';

const props = defineProps<{
  isOpen: boolean;
  currentItem: LightboxItem | null;
  currentIndex: number;
  totalItems: number;
}>();

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
    return props.currentItem.photographer ?? null;
  }
  return null;
});

const handleClose = () => emit('close');
const handlePrev = () => emit('prev');
const handleNext = () => emit('next');
const handleTouchStart = (e: TouchEvent) => emit('touchstart', e);
const handleTouchEnd = (e: TouchEvent) => emit('touchend', e);

// Accessible name for the dialog, reflecting current media/position
const dialogLabel = computed(() => {
  if (isVideo.value) return 'Video viewer';
  if (props.totalItems > 1) return `Image ${props.currentIndex + 1} of ${props.totalItems}`;
  return 'Image viewer';
});

// Focus management: move focus into the dialog on open and trap Tab within
// it, so keyboard users can't reach the inert background behind the overlay.
const dialogRef = ref<HTMLElement | null>(null);

const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])';

const getFocusable = (): HTMLElement[] =>
  dialogRef.value ? Array.from(dialogRef.value.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)) : [];

const handleKeydown = (event: KeyboardEvent): void => {
  if (event.key !== 'Tab') return;

  const focusable = getFocusable();
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (!first || !last) {
    event.preventDefault();
    dialogRef.value?.focus();
    return;
  }

  const active = document.activeElement;

  if (event.shiftKey && (active === first || active === dialogRef.value)) {
    event.preventDefault();
    last.focus();
    return;
  }

  if (!event.shiftKey && active === last) {
    event.preventDefault();
    first.focus();
  }
};

onMounted(async () => {
  await nextTick();
  dialogRef.value?.focus();
});
</script>

<template>
  <Transition name="lightbox">
    <div
      v-if="isOpen"
      ref="dialogRef"
      class="lightbox"
      role="dialog"
      aria-modal="true"
      :aria-label="dialogLabel"
      tabindex="-1"
      @click="handleClose"
      @keydown="handleKeydown"
      @touchstart="handleTouchStart"
      @touchend="handleTouchEnd"
    >
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
          <IconArrow direction="left" />
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
          <IconArrow direction="right" />
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
        >{{ photographer.name }}<span class="visually-hidden"> (opens in a new tab)</span></a>
        <span v-else>{{ photographer.name }}</span>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue';

import type { LightboxItem } from '@/types';
import { isLightboxImage, isLightboxVideo } from '@/types';
import { toWebp } from '@/utils/responsiveImage';

import ExternalLink from './ExternalLink.vue';
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
  touchstart: [event: TouchEvent];
  touchend: [event: TouchEvent];
}>();

const isVideo = computed(() => props.currentItem !== null && isLightboxVideo(props.currentItem));
const isImage = computed(() => props.currentItem !== null && isLightboxImage(props.currentItem));

// Credit for the current item: "Photo by" for an image's photographer,
// "Video by" for a video's author. Null when the current item has neither.
const credit = computed(() => {
  const item = props.currentItem;
  if (item && isLightboxImage(item) && item.photographer) return { prefix: 'Photo by', ...item.photographer };
  if (item && isLightboxVideo(item) && item.author) return { prefix: 'Video by', ...item.author };
  return null;
});

const handleClose = () => emit('close');
const handlePrev = () => emit('prev');
const handleNext = () => emit('next');
const handleTouchStart = (event: TouchEvent) => emit('touchstart', event);
const handleTouchEnd = (event: TouchEvent) => emit('touchend', event);

// Accessible name for the dialog, reflecting current media/position
const dialogLabel = computed(() => {
  const noun = isVideo.value ? 'Video' : 'Image';
  if (props.totalItems > 1) return `${noun} ${props.currentIndex + 1} of ${props.totalItems}`;
  return `${noun} viewer`;
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

      <picture v-else-if="isImage && currentItem && isLightboxImage(currentItem)">
        <source
          :srcset="toWebp(currentItem.src)"
          type="image/webp"
        >
        <img
          :src="currentItem.src"
          :alt="currentItem.alt"
          class="lightbox__image"
        >
      </picture>

      <!-- Bottom controls; layout differs by breakpoint (see styles). -->
      <div class="lightbox__controls">
        <p
          v-if="totalItems > 1"
          class="lightbox__counter"
          aria-hidden="true"
        >
          {{ currentIndex + 1 }} / {{ totalItems }}
        </p>

        <div
          v-if="credit"
          class="lightbox__credit"
        >
          {{ credit.prefix }} <ExternalLink
            v-if="credit.url"
            :href="credit.url"
          >
            {{ credit.name }}
          </ExternalLink>
          <span v-else>{{ credit.name }}</span>
        </div>

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
      </div>
    </div>
  </Transition>
</template>

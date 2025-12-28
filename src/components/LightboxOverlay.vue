<script setup>
import { computed } from 'vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  currentImage: {
    type: Object,
    default: null,
  },
  currentIndex: {
    type: Number,
    required: true,
  },
  totalImages: {
    type: Number,
    required: true,
  },
  variant: {
    type: String,
    default: 'default', // 'default' or 'compact'
    validator: value => ['default', 'compact'].includes(value),
  },
});

const emit = defineEmits(['close', 'prev', 'next', 'touchstart', 'touchend']);

// Computed photographer credit (if exists on current image)
const photographer = computed(() => props.currentImage?.photographer || null);

const handleClose = () => emit('close');
const handlePrev = () => emit('prev');
const handleNext = () => emit('next');
const handleTouchStart = (e) => emit('touchstart', e);
const handleTouchEnd = (e) => emit('touchend', e);
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
          @click.stop="handleClose"
          aria-label="Close lightbox"
        />

        <button
          v-if="currentIndex > 0"
          class="lightbox__nav lightbox__nav--prev"
          @click.stop="handlePrev"
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
          >
        </picture>

        <button
          v-if="currentIndex < totalImages - 1"
          class="lightbox__nav lightbox__nav--next"
          @click.stop="handleNext"
          aria-label="Next image"
        />

        <!-- Keyboard hints -->
        <div class="lightbox__hints">
          <span class="lightbox__hint">ESC to close</span>
          <span
            v-if="totalImages > 1"
            class="lightbox__hint"
          >← → to navigate</span>
        </div>
      </template>

      <!-- Compact variant: button hints + photographer credit -->
      <template v-else-if="variant === 'compact'">
        <picture v-if="currentImage">
          <source
            :srcset="currentImage.src.replace('.jpg', '.webp')"
            type="image/webp"
          >
          <img
            :src="currentImage.src"
            :alt="currentImage.alt"
            class="lightbox__image"
          >
        </picture>

        <!-- Navigation hints as buttons -->
        <div class="lightbox__hints">
          <button
            class="lightbox__hint lightbox__hint--prev"
            :disabled="currentIndex === 0"
            @click.stop="handlePrev"
            aria-label="Previous image"
          >
            ←
          </button>
          <button
            class="lightbox__hint lightbox__hint--close"
            @click.stop="handleClose"
            aria-label="Close lightbox"
          >
            ×
          </button>
          <button
            class="lightbox__hint lightbox__hint--next"
            :disabled="currentIndex >= totalImages - 1"
            @click.stop="handleNext"
            aria-label="Next image"
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

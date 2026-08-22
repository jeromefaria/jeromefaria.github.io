<script setup lang="ts">
import LightboxOverlay from '@/components/LightboxOverlay.vue';
import { useLightboxWithSwipe } from '@/composables/useLightboxWithSwipe';

const {
  isOpen,
  currentItem,
  currentIndex,
  items,
  openLightbox,
  closeLightbox,
  goToNext,
  goToPrev,
  handleTouchStart,
  handleTouchEnd,
} = useLightboxWithSwipe();

defineExpose({ openLightbox });
</script>

<template>
  <LightboxOverlay
    v-if="currentItem"
    :is-open="isOpen"
    :current-item="currentItem"
    :current-index="currentIndex"
    :total-items="items.length"
    @close="closeLightbox"
    @prev="goToPrev"
    @next="goToNext"
    @touchstart="handleTouchStart"
    @touchend="handleTouchEnd"
  />
</template>

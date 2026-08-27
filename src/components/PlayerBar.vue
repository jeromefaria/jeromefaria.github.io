<script setup lang="ts">
import { computed } from 'vue';

import { usePlayer } from '@/composables/usePlayer';

const { status, currentTrack, currentTime, duration, error, hasNext, hasPrevious, toggle, next, previous, seek } =
  usePlayer();

const isPlaying = computed(() => status.value === 'playing');
const isBusy = computed(() => status.value === 'loading' || status.value === 'buffering');

const formatTime = (seconds: number): string => {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';

  const whole = Math.floor(seconds);
  const minutes = Math.floor(whole / 60);
  const remainder = whole % 60;

  return `${minutes}:${remainder.toString().padStart(2, '0')}`;
};

const statusMessage = computed(() => {
  if (error.value) return error.value;
  if (!currentTrack.value) return '';

  const verb = isPlaying.value ? 'Playing' : isBusy.value ? 'Loading' : 'Paused';

  return `${verb}: ${currentTrack.value.title}`;
});

const onSeek = (event: Event): void => {
  seek(Number((event.target as HTMLInputElement).value));
};
</script>

<template>
  <div
    v-if="currentTrack"
    class="player-bar"
    role="region"
    aria-label="Audio player"
  >
    <p class="player-bar__title">
      {{ currentTrack.title }}
    </p>

    <div class="player-bar__controls">
      <button
        type="button"
        class="player-bar__button"
        :disabled="!hasPrevious && currentTime < 3"
        aria-label="Previous track"
        @click="previous"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M6 6h2v12H6zm3.5 6 8.5 6V6z" /></svg>
      </button>

      <button
        type="button"
        class="player-bar__button player-bar__button--primary"
        :aria-label="isPlaying ? 'Pause' : 'Play'"
        @click="toggle"
      >
        <svg
          v-if="isPlaying"
          viewBox="0 0 24 24"
          aria-hidden="true"
          focusable="false"
        ><path fill="currentColor" d="M6 5h4v14H6zm8 0h4v14h-4z" /></svg>
        <svg
          v-else
          viewBox="0 0 24 24"
          aria-hidden="true"
          focusable="false"
        ><path fill="currentColor" d="M8 5v14l11-7z" /></svg>
      </button>

      <button
        type="button"
        class="player-bar__button"
        :disabled="!hasNext"
        aria-label="Next track"
        @click="next"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M16 6h2v12h-2zM6 18l8.5-6L6 6z" /></svg>
      </button>
    </div>

    <div class="player-bar__seek">
      <span class="player-bar__time">{{ formatTime(currentTime) }}</span>
      <input
        class="player-bar__slider"
        type="range"
        min="0"
        :max="duration || 0"
        step="1"
        :value="currentTime"
        :aria-label="`Seek within ${currentTrack.title}`"
        @input="onSeek"
      >
      <span class="player-bar__time">{{ formatTime(duration) }}</span>
    </div>

    <p
      class="player-bar__status"
      role="status"
      aria-live="polite"
    >
      {{ statusMessage }}
    </p>
  </div>
</template>

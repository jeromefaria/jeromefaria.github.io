<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

import { useFocusTrap } from '@/composables/useFocusTrap';
import { usePlayer } from '@/composables/usePlayer';
import { useScrollLock } from '@/composables/useScrollLock';
import type { AudioTrack } from '@/types/audio';
import { formatTime } from '@/utils/formatTime';

const { status, currentTrack, queue, currentTime, duration, context, hasNext, hasPrevious, toggle, next, previous, seek, select, collapse } =
  usePlayer();

const isPlaying = computed(() => status.value === 'playing');
const currentIndex = computed(() => queue.value.findIndex(track => track.key === currentTrack.value?.key));

const onSeek = (event: Event): void => {
  seek(Number((event.target as HTMLInputElement).value));
};

const trackLabel = (track: AudioTrack): string => (track.artist ? `${track.artist} — ${track.title}` : track.title);

// role="dialog" aria-modal: trap Tab within the screen, restore focus to the
// trigger on close, and lock background scroll — matching the palette/lightbox.
const dialog = ref<HTMLElement | null>(null);
const { onKeydown: trapTab } = useFocusTrap(dialog);
const { lock, unlock } = useScrollLock();

let previouslyFocused: HTMLElement | null = null;

const onKeydown = (event: KeyboardEvent): void => {
  if (event.key === 'Escape') {
    collapse();
    return;
  }

  trapTab(event);
};

onMounted(() => {
  previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  lock();
  dialog.value?.focus();
});

onBeforeUnmount(() => {
  unlock();
  previouslyFocused?.focus();
});
</script>

<template>
  <div
    ref="dialog"
    class="player-screen"
    role="dialog"
    aria-modal="true"
    aria-label="Now playing"
    tabindex="-1"
    @keydown="onKeydown"
  >
    <button
      type="button"
      class="player-screen__collapse"
      aria-label="Collapse player"
      @click="collapse"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="m7 10 5 5 5-5z" /></svg>
    </button>

    <div class="player-screen__art">
      <img
        v-if="context.artwork"
        :src="context.artwork"
        alt=""
      >
    </div>

    <div class="player-screen__meta">
      <p class="player-screen__title">
        {{ currentTrack?.title }}
      </p>
      <p class="player-screen__artist">
        {{ currentTrack?.artist ?? 'Jerome Faria' }}
      </p>
      <p
        v-if="context.album"
        class="player-screen__album"
      >
        {{ context.album }}
      </p>
    </div>

    <div class="player-screen__seek">
      <span class="player-screen__time">{{ formatTime(currentTime) }}</span>
      <input
        class="player-screen__slider"
        type="range"
        min="0"
        :max="duration || 0"
        step="1"
        :value="currentTime"
        aria-label="Seek"
        :aria-valuetext="`${formatTime(currentTime)} of ${formatTime(duration)}`"
        @input="onSeek"
      >
      <span class="player-screen__time">{{ formatTime(duration) }}</span>
    </div>

    <div class="player-screen__controls">
      <button
        type="button"
        class="player-screen__button"
        :disabled="!hasPrevious && currentTime < 3"
        aria-label="Previous track"
        @click="previous"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M6 6h2v12H6zm3.5 6 8.5 6V6z" /></svg>
      </button>

      <button
        type="button"
        class="player-screen__button player-screen__button--primary"
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
        class="player-screen__button"
        :disabled="!hasNext"
        aria-label="Next track"
        @click="next"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M16 6h2v12h-2zM6 18l8.5-6L6 6z" /></svg>
      </button>
    </div>

    <ol
      v-if="queue.length > 1"
      class="player-screen__queue"
      aria-label="Queue"
    >
      <li
        v-for="(track, index) in queue"
        :key="track.key"
      >
        <button
          type="button"
          class="player-screen__queue-item"
          :class="{ 'is-current': index === currentIndex }"
          @click="select(index)"
        >
          <span class="player-screen__queue-num">{{ index + 1 }}</span>
          <span class="player-screen__queue-title">{{ trackLabel(track) }}</span>
        </button>
      </li>
    </ol>
  </div>
</template>

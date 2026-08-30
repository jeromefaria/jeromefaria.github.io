<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

import PlayerSeek from '@/components/PlayerSeek.vue';
import TransportControls from '@/components/TransportControls.vue';
import { useFocusReturn } from '@/composables/useFocusReturn';
import { useFocusTrap } from '@/composables/useFocusTrap';
import { usePlayer } from '@/composables/usePlayer';
import { useScrollLock } from '@/composables/useScrollLock';
import { useSwipeDismiss } from '@/composables/useSwipeDismiss';
import type { AudioTrack } from '@/types/audio';

const { status, currentTrack, queue, currentTime, duration, context, hasNext, hasPrevious, toggle, next, previous, seek, select, collapse } =
  usePlayer();

const isPlaying = computed(() => status.value === 'playing');
const isBusy = computed(() => status.value === 'loading' || status.value === 'buffering');
const currentIndex = computed(() => queue.value.findIndex(track => track.key === currentTrack.value?.key));

const trackLabel = (track: AudioTrack): string => (track.artist ? `${track.artist} — ${track.title}` : track.title);

const dialog = ref<HTMLElement | null>(null);
const { onKeydown: trapTab } = useFocusTrap(dialog);
const { lock, unlock } = useScrollLock();
const { capture, restore } = useFocusReturn();
const { handleTouchStart, handleTouchEnd } = useSwipeDismiss(collapse, () => (dialog.value?.scrollTop ?? 0) <= 0);

const onKeydown = (event: KeyboardEvent): void => {
  if (event.key === 'Escape') {
    collapse();
    return;
  }

  trapTab(event);
};

onMounted(() => {
  capture();
  lock();
  dialog.value?.focus();
});

onBeforeUnmount(() => {
  unlock();
  restore();
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
    @touchstart.passive="handleTouchStart"
    @touchend.passive="handleTouchEnd"
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

    <PlayerSeek
      :current-time="currentTime"
      :duration="duration"
      label="Seek"
      @seek="seek"
    />

    <TransportControls
      :playing="isPlaying"
      :busy="isBusy"
      :has-previous="hasPrevious"
      :has-next="hasNext"
      :current-time="currentTime"
      @previous="previous"
      @toggle="toggle"
      @next="next"
    />

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
          :aria-current="index === currentIndex ? 'true' : undefined"
          @click="select(index)"
        >
          <span class="player-screen__queue-num">{{ index + 1 }}</span>
          <span class="player-screen__queue-title">{{ trackLabel(track) }}</span>
        </button>
      </li>
    </ol>
  </div>
</template>

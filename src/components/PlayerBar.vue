<script setup lang="ts">
import { computed } from 'vue';

import PlayerSeek from '@/components/PlayerSeek.vue';
import TransportControls from '@/components/TransportControls.vue';
import { usePlayer } from '@/composables/usePlayer';
import { useT } from '@/i18n/useT';

const { status, currentTrack, currentTime, duration, error, hasNext, hasPrevious, toggle, next, previous, seek, expand, stop } =
  usePlayer();

const t = useT();

const isPlaying = computed(() => status.value === 'playing');
const isBusy = computed(() => status.value === 'loading' || status.value === 'buffering');

const statusMessage = computed(() => {
  if (error.value) return error.value;
  if (!currentTrack.value) return '';

  const key = isPlaying.value ? 'player.statusPlaying' : isBusy.value ? 'player.statusLoading' : 'player.statusPaused';

  return t(key, { title: currentTrack.value.title });
});
</script>

<template>
  <div
    v-if="currentTrack"
    class="player-bar"
    role="region"
    :aria-label="t('player.label')"
  >
    <button
      type="button"
      class="player-bar__title"
      :aria-label="t('player.expand')"
      @click="expand"
    >
      {{ currentTrack.title }}
    </button>

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

    <PlayerSeek
      :current-time="currentTime"
      :duration="duration"
      :label="t('player.seek', { title: currentTrack.title })"
      @seek="seek"
    />

    <button
      type="button"
      class="player-bar__close"
      :aria-label="t('player.close')"
      @click="stop"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        d="M6 6l12 12M18 6 6 18"
      /></svg>
    </button>

    <p
      class="player-bar__status"
      role="status"
      aria-live="polite"
    >
      {{ statusMessage }}
    </p>
  </div>
</template>

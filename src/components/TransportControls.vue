<script setup lang="ts">
import { usePlayer } from '@/composables/usePlayer';
import { useT } from '@/i18n/useT';

import IconPause from './IconPause.vue';
import IconPlay from './IconPlay.vue';
import IconSpinner from './IconSpinner.vue';

const { currentTime, hasNext, hasPrevious, isPlaying, isBusy, toggle, next, previous } = usePlayer();

const t = useT();
</script>

<template>
  <div class="transport-controls">
    <button
      type="button"
      class="transport-controls__button"
      :disabled="!hasPrevious && currentTime < 3"
      :aria-label="t('player.previous')"
      @click="previous"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M6 6h2v12H6zm3.5 6 8.5 6V6z" /></svg>
    </button>

    <button
      type="button"
      class="transport-controls__button transport-controls__button--primary"
      :aria-label="t(isPlaying ? 'player.pause' : 'player.play')"
      :aria-busy="isBusy"
      @click="toggle"
    >
      <IconSpinner
        v-if="isBusy"
        class="transport-controls__spinner"
      />
      <IconPause v-else-if="isPlaying" />
      <IconPlay v-else />
    </button>

    <button
      type="button"
      class="transport-controls__button"
      :disabled="!hasNext"
      :aria-label="t('player.next')"
      @click="next"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M16 6h2v12h-2zM6 18l8.5-6L6 6z" /></svg>
    </button>
  </div>
</template>

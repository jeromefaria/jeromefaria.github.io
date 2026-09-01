<script setup lang="ts">
import IconPause from './IconPause.vue';
import IconPlay from './IconPlay.vue';

withDefaults(defineProps<{
  playing: boolean;
  hasPrevious: boolean;
  hasNext: boolean;
  currentTime: number;
  busy?: boolean;
}>(), { busy: false });

defineEmits<{
  previous: [];
  toggle: [];
  next: [];
}>();
</script>

<template>
  <div class="transport-controls">
    <button
      type="button"
      class="transport-controls__button"
      :disabled="!hasPrevious && currentTime < 3"
      aria-label="Previous track"
      @click="$emit('previous')"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M6 6h2v12H6zm3.5 6 8.5 6V6z" /></svg>
    </button>

    <button
      type="button"
      class="transport-controls__button transport-controls__button--primary"
      :aria-label="playing ? 'Pause' : 'Play'"
      @click="$emit('toggle')"
    >
      <svg
        v-if="busy"
        class="transport-controls__spinner"
        viewBox="0 0 24 24"
        aria-hidden="true"
        focusable="false"
      ><circle
        cx="12"
        cy="12"
        r="9"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-dasharray="44 20"
        stroke-linecap="round"
      /></svg>
      <IconPause v-else-if="playing" />
      <IconPlay v-else />
    </button>

    <button
      type="button"
      class="transport-controls__button"
      :disabled="!hasNext"
      aria-label="Next track"
      @click="$emit('next')"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M16 6h2v12h-2zM6 18l8.5-6L6 6z" /></svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import IconPause from './IconPause.vue';
import IconPlay from './IconPlay.vue';
import ResponsivePicture from './ResponsivePicture.vue';

defineProps<{
  src: string;
  alt: string;
  title: string;
  active: boolean;
  busy: boolean;
}>();

defineEmits<{
  toggle: [];
  error: [];
}>();
</script>

<template>
  <div
    class="release-cover release-cover--playable"
    :class="{ 'is-active': active }"
  >
    <ResponsivePicture
      :src="src"
      :alt="alt"
      sizes="(min-width: 768px) 200px, 90vw"
      @error="$emit('error')"
    />
    <button
      type="button"
      class="release-cover__play"
      :aria-label="`${active ? 'Pause' : 'Play'} ${title}`"
      @click="$emit('toggle')"
    >
      <svg
        v-if="busy"
        class="release-cover__spinner"
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
      <IconPause v-else-if="active" />
      <IconPlay v-else />
    </button>
  </div>
</template>

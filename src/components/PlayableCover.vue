<script setup lang="ts">
import { useT } from '@/i18n/useT';

import IconPause from './IconPause.vue';
import IconPlay from './IconPlay.vue';
import IconSpinner from './IconSpinner.vue';
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

const t = useT();
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
      :aria-label="t(active ? 'player.pauseTitle' : 'player.playTitle', { title })"
      @click="$emit('toggle')"
    >
      <IconSpinner
        v-if="busy"
        class="release-cover__spinner"
      />
      <IconPause v-else-if="active" />
      <IconPlay v-else />
    </button>
  </div>
</template>

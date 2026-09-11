<script setup lang="ts">
import { computed } from 'vue';

import { usePlayer } from '@/composables/usePlayer';
import { toWebp } from '@/utils/responsiveImage';

const { currentTrack, context } = usePlayer();

const artwork = computed(() => currentTrack.value?.artwork ?? context.value.artwork);
</script>

<template>
  <Transition name="player-art">
    <picture
      v-if="artwork"
      :key="artwork"
    >
      <source
        :srcset="toWebp(artwork)"
        type="image/webp"
      >
      <img
        :src="artwork"
        alt=""
      >
    </picture>
  </Transition>
</template>

<script setup lang="ts">
import { usePlayer } from '@/composables/usePlayer';
import { toWebp } from '@/utils/responsiveImage';

const { displayArtwork: artwork } = usePlayer();
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

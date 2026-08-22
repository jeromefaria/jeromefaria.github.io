<script setup lang="ts">
import { computed } from 'vue';

import type { Track } from '@/types/works';

const props = defineProps<{ track: Track }>();

const prefix = computed(() => {
  const { artist } = props.track;
  if (!artist) return '';
  return artist.url ? ' — ' : `${artist.text} — `;
});
</script>

<template>
  <a
    v-if="track.artist?.url"
    :href="track.artist.url"
  >{{ track.artist.text }}</a>{{ prefix }}{{ track.title }}
</template>

<script setup lang="ts">
import { computed } from 'vue';

import type { Track } from '@/types/works';

const props = defineProps<{ track: Track }>();

// Text before the title: a linked artist renders as an <a>, so it only needs
// the separator; an unlinked artist is inlined here; a plain track has neither.
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

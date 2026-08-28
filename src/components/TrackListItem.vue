<script setup lang="ts">
import { computed } from 'vue';

import type { Track } from '@/types/works';

const props = defineProps<{ track: Track; href?: string }>();

defineEmits<{ play: [] }>();

const prefix = computed(() => {
  const { artist } = props.track;
  if (!artist) return '';
  return artist.url ? ' — ' : `${artist.name} — `;
});
</script>

<template>
  <a
    v-if="track.artist?.url"
    :href="track.artist.url"
  >{{ track.artist.name }}</a><span v-if="prefix">{{ prefix }}</span><a
    v-if="href"
    class="track-title-link"
    :href="href"
    @click.prevent="$emit('play')"
  >{{ track.title }}</a><span v-else>{{ track.title }}</span>
</template>

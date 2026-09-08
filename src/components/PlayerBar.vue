<script setup lang="ts">
import { computed } from 'vue';

import IconClose from '@/components/IconClose.vue';
import PlayerSeek from '@/components/PlayerSeek.vue';
import TransportControls from '@/components/TransportControls.vue';
import { usePlayer } from '@/composables/usePlayer';
import { useT } from '@/i18n/useT';

const { currentTrack, context, currentChapter, displayTitle, queue, error, isPlaying, isBusy, expand, stop } = usePlayer();

const t = useT();

const metaLabel = computed(() => {
  const track = currentTrack.value;
  if (!track) return '';

  const hasSiblings = queue.value.length > 1 || Boolean(currentChapter.value);
  if (!hasSiblings) return '';

  const parts: string[] = [];
  const { album } = context.value;
  if (album && album !== displayTitle.value) parts.push(album);
  if (track.artist && track.artist !== displayTitle.value) parts.push(track.artist);

  return parts.join(' · ');
});

const statusMessage = computed(() => {
  if (error.value) return error.value;
  if (!currentTrack.value) return '';

  const key = isPlaying.value ? 'player.statusPlaying' : isBusy.value ? 'player.statusLoading' : 'player.statusPaused';

  return t(key, { title: currentTrack.value.title });
});
</script>

<template>
  <Transition name="player-slide">
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
        <span
          v-if="metaLabel"
          class="player-bar__meta"
        >{{ metaLabel }}</span>
        <span
          v-if="metaLabel"
          class="player-bar__sep"
          aria-hidden="true"
        >—</span>
        <span class="player-bar__track">{{ displayTitle }}</span>
      </button>

      <TransportControls />

      <PlayerSeek :label="t('player.seek', { title: currentTrack.title })" />

      <button
        type="button"
        class="player-bar__close"
        :aria-label="t('player.close')"
        @click="stop"
      >
        <IconClose />
      </button>

      <p
        class="player-bar__status"
        role="status"
        aria-live="polite"
      >
        {{ statusMessage }}
      </p>
    </div>
  </Transition>
</template>

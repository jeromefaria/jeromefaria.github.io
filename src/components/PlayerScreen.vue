<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';

import PlayerArtwork from '@/components/PlayerArtwork.vue';
import PlayerImmersive from '@/components/PlayerImmersive.vue';
import PlayerSeek from '@/components/PlayerSeek.vue';
import TransportControls from '@/components/TransportControls.vue';
import { useFocusReturn } from '@/composables/useFocusReturn';
import { useFocusTrap } from '@/composables/useFocusTrap';
import { usePlayer } from '@/composables/usePlayer';
import { useScrollLock } from '@/composables/useScrollLock';
import { useSwipeDismiss } from '@/composables/useSwipeDismiss';
import { useT } from '@/i18n/useT';
import type { AudioTrack } from '@/types/audio';

const { currentTrack, queue, context, currentChapter, displayTitle, immersive, seek, select, collapse, enterImmersive, exitImmersive } = usePlayer();

const artwork = computed(() => currentTrack.value?.artwork ?? context.value.artwork);

const t = useT();

const trackLabel = (track: AudioTrack): string => (track.artist ? `${track.artist} — ${track.title}` : track.title);

const currentIndex = computed(() => queue.value.findIndex(track => track.key === currentTrack.value?.key));

interface QueueEntry { key: string; label: string; isCurrent: boolean; activate: () => void }

const entries = computed<QueueEntry[]>(() => {
  if (queue.value.length > 1) {
    return queue.value.map((track, index) => ({
      key: track.key,
      label: trackLabel(track),
      isCurrent: index === currentIndex.value,
      activate: () => void select(index),
    }));
  }

  return (context.value.chapters ?? []).map(chapter => ({
    key: String(chapter.start),
    label: chapter.title,
    isCurrent: chapter.start === currentChapter.value?.start,
    activate: () => seek(chapter.start),
  }));
});

const entriesLabel = computed(() => t(queue.value.length > 1 ? 'player.queue' : 'player.chapters'));

const dialog = ref<HTMLElement | null>(null);
const zoomButton = ref<HTMLElement>();

watch(immersive, async open => {
  if (open) return;

  await nextTick();
  zoomButton.value?.focus();
});

const { onKeydown: trapTab } = useFocusTrap(dialog);
const { lock, unlock } = useScrollLock();
const { capture, restore } = useFocusReturn();
const { handleTouchStart, handleTouchEnd } = useSwipeDismiss(collapse, () => (dialog.value?.scrollTop ?? 0) <= 0);

const onKeydown = (event: KeyboardEvent): void => {
  if (event.key === 'Escape') {
    if (immersive.value) {
      exitImmersive();
      return;
    }

    collapse();
    return;
  }

  trapTab(event);
};

onMounted(() => {
  capture();
  lock();
  dialog.value?.focus();
});

onBeforeUnmount(() => {
  unlock();
  restore();
});
</script>

<template>
  <div
    ref="dialog"
    class="player-screen"
    role="dialog"
    aria-modal="true"
    :aria-label="t('player.nowPlaying')"
    tabindex="-1"
    @keydown="onKeydown"
    @touchstart.passive="handleTouchStart"
    @touchend.passive="handleTouchEnd"
  >
    <button
      type="button"
      class="player-screen__collapse"
      :aria-label="t('player.collapse')"
      :inert="immersive"
      @click="collapse"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="m7 10 5 5 5-5z" /></svg>
    </button>

    <div
      class="player-screen__art"
      :inert="immersive"
    >
      <PlayerArtwork />
      <button
        v-if="artwork"
        ref="zoomButton"
        type="button"
        class="player-screen__zoom"
        :aria-label="t('player.viewArtwork')"
        @click="enterImmersive"
      />
    </div>

    <div
      class="player-screen__panel"
      :inert="immersive"
    >
      <div class="player-screen__meta">
        <p class="player-screen__title">
          {{ displayTitle }}
        </p>
        <p class="player-screen__artist">
          {{ currentTrack?.artist ?? 'Jerome Faria' }}
        </p>
        <p
          v-if="context.album"
          class="player-screen__album"
        >
          {{ context.album }}
        </p>
      </div>

      <PlayerSeek :label="t('player.seekGeneric')" />

      <TransportControls />

      <ol
        v-if="entries.length"
        class="player-screen__queue"
        :aria-label="entriesLabel"
      >
        <li
          v-for="(entry, index) in entries"
          :key="entry.key"
        >
          <button
            type="button"
            class="player-screen__queue-item"
            :class="{ 'is-current': entry.isCurrent }"
            :aria-current="entry.isCurrent ? 'true' : undefined"
            @click="entry.activate()"
          >
            <span class="player-screen__queue-num">{{ index + 1 }}</span>
            <span class="player-screen__queue-title">{{ entry.label }}</span>
          </button>
        </li>
      </ol>
    </div>

    <Transition name="player-immersive">
      <PlayerImmersive
        v-if="immersive"
        @exit="exitImmersive"
      />
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

import IconClose from '@/components/IconClose.vue';
import PlayerArtwork from '@/components/PlayerArtwork.vue';
import PlayerSeek from '@/components/PlayerSeek.vue';
import TransportControls from '@/components/TransportControls.vue';
import { useT } from '@/i18n/useT';

const emit = defineEmits<{ exit: [] }>();

const t = useT();

const closeButton = ref<HTMLElement>();

onMounted(() => closeButton.value?.focus());
</script>

<template>
  <div
    class="player-screen__immersive"
    @click="emit('exit')"
    @touchstart.stop
    @touchend.stop
  >
    <div class="player-screen__immersive-art">
      <PlayerArtwork />
    </div>

    <div
      class="player-screen__immersive-bar"
      @click.stop
    >
      <TransportControls />

      <PlayerSeek :label="t('player.seekGeneric')" />
    </div>

    <button
      ref="closeButton"
      type="button"
      class="player-screen__immersive-close"
      :aria-label="t('player.exitArtwork')"
      @click.stop="emit('exit')"
    >
      <IconClose />
    </button>
  </div>
</template>

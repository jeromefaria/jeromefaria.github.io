<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

import IconClose from '@/components/IconClose.vue';
import PlayerSeek from '@/components/PlayerSeek.vue';
import TransportControls from '@/components/TransportControls.vue';
import { usePlayer } from '@/composables/usePlayer';
import { useT } from '@/i18n/useT';
import { toWebp } from '@/utils/responsiveImage';

const { currentTrack, context } = usePlayer();

const emit = defineEmits<{ exit: [] }>();

const t = useT();

const artwork = computed(() => currentTrack.value?.artwork ?? context.value.artwork);
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

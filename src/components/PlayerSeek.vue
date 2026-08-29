<script setup lang="ts">
import { formatTime } from '@/utils/formatTime';

defineProps<{
  currentTime: number;
  duration: number;
  label: string;
}>();

const emit = defineEmits<{
  seek: [value: number];
}>();

const onInput = (event: Event): void => {
  emit('seek', Number((event.target as HTMLInputElement).value));
};
</script>

<template>
  <div class="player-seek">
    <span class="player-seek__time">{{ formatTime(currentTime) }}</span>
    <input
      class="player-seek__slider"
      type="range"
      min="0"
      :max="duration || 0"
      step="1"
      :value="currentTime"
      :aria-label="label"
      :aria-valuetext="`${formatTime(currentTime)} of ${formatTime(duration)}`"
      @input="onInput"
    >
    <span class="player-seek__time">{{ formatTime(duration) }}</span>
  </div>
</template>

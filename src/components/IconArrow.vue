<script setup lang="ts">
import { computed } from 'vue';

type ArrowDirection = 'left' | 'right' | 'up-right';

const props = defineProps<{
  direction: ArrowDirection;
}>();

const isDiagonal = computed(() => props.direction === 'up-right');

const rotation = computed(() => (props.direction === 'left' ? 180 : 0));
</script>

<template>
  <svg
    class="icon-arrow"
    :style="{ transform: `rotate(${rotation}deg)` }"
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    fill="none"
    stroke="currentColor"
    stroke-width="1.6"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <template v-if="isDiagonal">
      <line
        x1="5.5"
        y1="18.5"
        x2="18.5"
        y2="5.5"
      />
      <polyline points="8 5.5 18.5 5.5 18.5 16" />
    </template>
    <template v-else>
      <line
        x1="4"
        y1="12"
        x2="20"
        y2="12"
      />
      <polyline points="13.5 5.5 20 12 13.5 18.5" />
    </template>
  </svg>
</template>

<style scoped>
.icon-arrow {
  display: inline-block;
  flex-shrink: 0;
  vertical-align: -0.125em;
}
</style>

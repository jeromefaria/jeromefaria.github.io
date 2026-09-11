<script setup lang="ts">
import MaybeLink from '@/components/MaybeLink.vue';
import type { SharedStage } from '@/types/epk';

defineProps<{ acts: SharedStage[] }>();
</script>

<template>
  <ul class="epk__roster">
    <li
      v-for="act in acts"
      :key="act.name"
      class="epk__roster-item"
    >
      <MaybeLink
        class="epk__link"
        :href="act.url"
      >
        {{ act.name }}
      </MaybeLink>
    </li>
  </ul>
</template>

<script setup lang="ts">
import ExternalLink from '@/components/ExternalLink.vue';
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
      <ExternalLink
        v-if="act.url"
        class="epk__link"
        :href="act.url"
      >
        {{ act.name }}
      </ExternalLink>
      <template v-else>
        {{ act.name }}
      </template>
    </li>
  </ul>
</template>

<script setup lang="ts">
import MaybeLink from '@/components/MaybeLink.vue';
import { type Localized, useLocalized } from '@/i18n/localized';

defineProps<{
  quote: Localized<string>;
  source: string;
  url?: string | undefined;
}>();

const { localize } = useLocalized();
</script>

<template>
  <blockquote>
    <p v-html="localize(quote)" />
    <strong>
      <MaybeLink :href="url">{{ source }}</MaybeLink>
    </strong>
  </blockquote>
</template>

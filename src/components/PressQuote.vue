<script setup lang="ts">
import ExternalLink from '@/components/ExternalLink.vue';
import { type Localized, useLocalized } from '@/i18n/localized';

defineProps<{
  quote: Localized<string>;
  source: string;
  url?: string | undefined;
}>();

const localize = useLocalized();
</script>

<template>
  <blockquote>
    <p v-html="localize(quote)" />
    <strong>
      <ExternalLink
        v-if="url"
        :href="url"
      >{{ source }}</ExternalLink>
      <template v-else>{{ source }}</template>
    </strong>
  </blockquote>
</template>

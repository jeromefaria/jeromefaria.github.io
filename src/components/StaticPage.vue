<script setup lang="ts">
import PageShell from '@/components/PageShell.vue';
import { usePageHead } from '@/composables/usePageHead';
import { useLocalized } from '@/i18n/localized';

const props = defineProps<{
  head: Parameters<typeof usePageHead>[0];
  dataPage: string;
}>();

const { localize } = useLocalized();

usePageHead(props.head);
</script>

<template>
  <div class="container-wide">
    <PageShell
      :data-page="dataPage"
      :title="localize(head.title)"
    >
      <slot />
    </PageShell>
  </div>
</template>

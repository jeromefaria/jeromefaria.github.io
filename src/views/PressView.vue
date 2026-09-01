<script setup lang="ts">
import PageShell from '@/components/PageShell.vue';
import PressQuote from '@/components/PressQuote.vue';
import { useHashScroll } from '@/composables/useHashScroll';
import { usePageHead } from '@/composables/usePageHead';
import { pageMeta } from '@/data/pageMeta';
import { pressQuotes } from '@/data/press';
import { useLocalized } from '@/i18n/localized';
import { prefersReducedMotion } from '@/utils/scroll';

usePageHead(pageMeta.press);

const localize = useLocalized();

const scrollToHash = (hash: string) => {
  const element = document.getElementById(hash.replace('#', ''));
  element?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
};

useHashScroll(scrollToHash);
</script>

<template>
  <div class="container-wide">
    <PageShell
      data-page="press"
      :title="localize(pageMeta.press.title)"
    >
      <PressQuote
        v-for="item in pressQuotes"
        :id="item.id"
        :key="item.id"
        :quote="item.quote"
        :source="item.source"
        :url="item.url"
      />
    </PageShell>
  </div>
</template>

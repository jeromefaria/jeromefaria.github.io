<script setup lang="ts">
import { computed } from 'vue';

import PressQuote from '@/components/PressQuote.vue';
import StaticPage from '@/components/StaticPage.vue';
import { useHashScroll } from '@/composables/useHashScroll';
import { pageMeta } from '@/data/pageMeta';
import { pressQuotes } from '@/data/press';
import { useLocalized } from '@/i18n/localized';
import { createPressPageSchema } from '@/utils/pageSchemas';
import { prefersReducedMotion } from '@/utils/scroll';

const { current } = useLocalized();

const head = computed(() => ({ ...pageMeta.press, schema: createPressPageSchema(current.value) }));

const scrollToHash = (hash: string) => {
  const element = document.getElementById(hash.replace('#', ''));
  element?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
};

useHashScroll(scrollToHash);
</script>

<template>
  <StaticPage
    :head="head"
    data-page="press"
  >
    <ul class="press-list">
      <li
        v-for="item in pressQuotes"
        :key="item.id"
      >
        <PressQuote
          :id="item.id"
          :quote="item.quote"
          :source="item.source"
          :url="item.url"
        />
      </li>
    </ul>
  </StaticPage>
</template>

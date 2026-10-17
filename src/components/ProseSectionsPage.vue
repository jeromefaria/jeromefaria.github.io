<script setup lang="ts">
import StaticPage from '@/components/StaticPage.vue';
import type { usePageHead } from '@/composables/usePageHead';
import { useProse } from '@/composables/useProse';
import { useProseClick } from '@/composables/useProseClick';
import type { Localized } from '@/i18n/localized';
import { useLocalized } from '@/i18n/localized';
import type { ProseSection } from '@/types/prose';

defineProps<{
  head: Parameters<typeof usePageHead>[0];
  block: string;
  intro: Localized<string>;
  sections: ProseSection[];
}>();

const { localize } = useLocalized();
const renderProse = useProse();
const onProseClick = useProseClick();
</script>

<template>
  <StaticPage
    :head="head"
    :data-page="block"
  >
    <div
      :class="block"
      @click="onProseClick"
    >
      <p :class="`${block}__intro`">
        {{ localize(intro) }}
      </p>

      <section
        v-for="(section, index) in sections"
        :key="index"
        :class="`${block}__section`"
      >
        <h2 :class="`${block}__heading`">
          {{ localize(section.heading) }}
        </h2>
        <p
          :class="`${block}__body`"
          v-html="renderProse(section.body)"
        />
      </section>

      <slot />
    </div>
  </StaticPage>
</template>

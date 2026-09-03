<script setup lang="ts">
import StaticPage from '@/components/StaticPage.vue';
import { useProse } from '@/composables/useProse';
import { useProseClick } from '@/composables/useProseClick';
import { colophonContent } from '@/data/colophon';
import { pageMeta } from '@/data/pageMeta';
import { useLocalized } from '@/i18n/localized';

const { localize } = useLocalized();
const renderProse = useProse();
const onProseClick = useProseClick();
</script>

<template>
  <StaticPage
    :head="pageMeta.colophon"
    data-page="colophon"
  >
    <div
      class="colophon"
      @click="onProseClick"
    >
      <p class="colophon__intro">
        {{ localize(colophonContent.intro) }}
      </p>

      <section
        v-for="(section, index) in colophonContent.sections"
        :key="index"
        class="colophon__section"
      >
        <h2 class="colophon__heading">
          {{ localize(section.heading) }}
        </h2>
        <p
          class="colophon__body"
          v-html="renderProse(section.body)"
        />
      </section>

      <p
        class="colophon__body colophon__body--source"
        v-html="renderProse(colophonContent.source)"
      />
    </div>
  </StaticPage>
</template>

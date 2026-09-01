<script setup lang="ts">
import PageShell from '@/components/PageShell.vue';
import { usePageHead } from '@/composables/usePageHead';
import { useProse } from '@/composables/useProse';
import { useProseClick } from '@/composables/useProseClick';
import { colophonContent } from '@/data/colophon';
import { pageMeta } from '@/data/pageMeta';
import { useLocalized } from '@/i18n/localized';

usePageHead(pageMeta.colophon);

const localize = useLocalized();
const renderProse = useProse();
const onProseClick = useProseClick();
</script>

<template>
  <div class="container-wide">
    <PageShell
      data-page="colophon"
      :title="localize(pageMeta.colophon.title)"
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
    </PageShell>
  </div>
</template>

<script setup lang="ts">
import PageShell from '@/components/PageShell.vue';
import { openCommandPalette } from '@/composables/useOverlays';
import { usePageHead } from '@/composables/usePageHead';
import { useProseLinks } from '@/composables/useProseLinks';
import { colophonContent } from '@/data/colophon';
import { pageMeta } from '@/data/pageMeta';
import { externalizeLinks } from '@/utils/externalizeLinks';

usePageHead(pageMeta.colophon);

const routeProseLink = useProseLinks();

const onProseClick = (event: MouseEvent): void => {
  if ((event.target as HTMLElement).closest('.palette-cue')) {
    openCommandPalette();
    return;
  }

  routeProseLink(event);
};
</script>

<template>
  <div class="container-wide">
    <PageShell
      data-page="colophon"
      title="Colophon"
    >
      <div
        class="colophon"
        @click="onProseClick"
      >
        <p class="colophon__intro">
          {{ colophonContent.intro }}
        </p>

        <section
          v-for="section in colophonContent.sections"
          :key="section.heading"
          class="colophon__section"
        >
          <h2 class="colophon__heading">
            {{ section.heading }}
          </h2>
          <p
            class="colophon__body"
            v-html="externalizeLinks(section.body)"
          />
        </section>

        <p
          class="colophon__body colophon__body--source"
          v-html="externalizeLinks(colophonContent.source)"
        />
      </div>
    </PageShell>
  </div>
</template>

<script setup lang="ts">
import PageShell from '@/components/PageShell.vue';
import { openCommandPalette } from '@/composables/useOverlays';
import { usePageHead } from '@/composables/usePageHead';
import { useProseLinks } from '@/composables/useProseLinks';
import { pageMeta } from '@/data/pageMeta';
import { privacyContent } from '@/data/privacy';
import { externalizeLinks } from '@/utils/externalizeLinks';

usePageHead(pageMeta.privacy);

const routeProseLink = useProseLinks();

// The palette cue is a button inside the v-html body; a careful reader who clicks it
// gets the hidden palette. Everything else falls through to internal-link routing.
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
      data-page="privacy"
      title="Privacy"
    >
      <div
        class="privacy"
        @click="onProseClick"
      >
        <p class="privacy__intro">
          {{ privacyContent.intro }}
        </p>

        <section
          v-for="section in privacyContent.sections"
          :key="section.heading"
          class="privacy__section"
        >
          <h2 class="privacy__heading">
            {{ section.heading }}
          </h2>
          <p
            class="privacy__body"
            v-html="externalizeLinks(section.body)"
          />
        </section>

        <p class="privacy__updated">
          Last updated {{ privacyContent.updated }}.
        </p>
      </div>
    </PageShell>
  </div>
</template>

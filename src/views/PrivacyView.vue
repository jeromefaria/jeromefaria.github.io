<script setup lang="ts">
import PageShell from '@/components/PageShell.vue';
import { openCommandPalette } from '@/composables/useOverlays';
import { usePageHead } from '@/composables/usePageHead';
import { pageMeta } from '@/data/pageMeta';
import { privacyContent } from '@/data/privacy';
import { externalizeLinks } from '@/utils/externalizeLinks';

usePageHead(pageMeta.privacy);

// The notice names the (otherwise hidden) command palette; reward the careful reader
// who clicks it by actually opening it. The cue lives inside a v-html body, so it's
// caught by delegation rather than a bound handler.
const revealCommandPalette = (event: MouseEvent): void => {
  if ((event.target as HTMLElement).closest('.palette-cue')) openCommandPalette();
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
        @click="revealCommandPalette"
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

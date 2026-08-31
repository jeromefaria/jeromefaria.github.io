<script setup lang="ts">
import PageShell from '@/components/PageShell.vue';
import { openCommandPalette } from '@/composables/useOverlays';
import { usePageHead } from '@/composables/usePageHead';
import { useProse } from '@/composables/useProse';
import { useProseLinks } from '@/composables/useProseLinks';
import { pageMeta } from '@/data/pageMeta';
import { privacyContent } from '@/data/privacy';
import { useLocalized } from '@/i18n/localized';
import { useT } from '@/i18n/useT';

usePageHead(pageMeta.privacy);

const t = useT();
const localize = useLocalized();
const renderProse = useProse();
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
      :title="localize(pageMeta.privacy.title)"
    >
      <div
        class="privacy"
        @click="onProseClick"
      >
        <p class="privacy__intro">
          {{ localize(privacyContent.intro) }}
        </p>

        <section
          v-for="(section, index) in privacyContent.sections"
          :key="index"
          class="privacy__section"
        >
          <h2 class="privacy__heading">
            {{ localize(section.heading) }}
          </h2>
          <p
            class="privacy__body"
            v-html="renderProse(section.body)"
          />
        </section>

        <p class="privacy__updated">
          {{ t('privacy.lastUpdated', { date: localize(privacyContent.updated) }) }}
        </p>
      </div>
    </PageShell>
  </div>
</template>

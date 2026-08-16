<script setup lang="ts">
import { useTemplateRef } from 'vue';

import AccordionSection from '@/components/AccordionSection.vue';
import EventItem from '@/components/EventItem.vue';
import LightboxHost from '@/components/LightboxHost.vue';
import { useAccordion } from '@/composables/useAccordion';
import { usePageHead } from '@/composables/usePageHead';
import { liveYears, sortedLiveData } from '@/data/live';
import { pageMeta } from '@/data/pageMeta';
import { updateHash } from '@/utils/navigation';
import { createLiveEventsSchema } from '@/utils/pageSchemas';

usePageHead({
  ...pageMeta.live,
  schema: createLiveEventsSchema(),
});

const findYearForEvent = (eventId: string): string | null =>
  liveYears.find(year => sortedLiveData[year]?.items?.some(e => e.id === eventId)) ?? null;

const { openSection, handleToggle } = useAccordion(liveYears[0] ?? '', liveYears, findYearForEvent);
const lightbox = useTemplateRef<InstanceType<typeof LightboxHost>>('lightbox');
</script>

<template>
  <div class="container-wide">
    <article
      class="page"
      data-page="live"
    >
      <h1 class="visually-hidden">
        Live
      </h1>
      <AccordionSection
        v-for="year in liveYears"
        :id="year"
        :key="year"
        :title="sortedLiveData[year]?.title || year"
        :model-value="openSection === year"
        @update:model-value="handleToggle(year, $event)"
      >
        <EventItem
          v-for="event in sortedLiveData[year]?.items || []"
          :key="event.id"
          :event="event"
          @update-hash="updateHash"
          @open-lightbox="lightbox?.openLightbox"
        />
      </AccordionSection>
    </article>

    <LightboxHost ref="lightbox" />
  </div>
</template>

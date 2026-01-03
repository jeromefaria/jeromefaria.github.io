<script setup lang="ts">
import { computed } from 'vue';

import AccordionSection from '@/components/AccordionSection.vue';
import EventItem from '@/components/EventItem.vue';
import LightboxOverlay from '@/components/LightboxOverlay.vue';
import { useAccordion } from '@/composables/useAccordion';
import { useLightboxWithSwipe } from '@/composables/useLightboxWithSwipe';
import { usePageHead } from '@/composables/usePageHead';
import { liveData, liveYears } from '@/data/live';
import { siteConfig } from '@/data/navigation';
import type { LiveData } from '@/types';
import { updateHash } from '@/utils/navigation';
import { createItemListSchema, createMusicEventSchema } from '@/utils/schemaHelpers';

// Sort events within each year by date (most recent first)
// ISO dates can be compared as strings: '2022-07-02' > '2022-03-05'
const sortedLiveData = computed<LiveData>(() => {
  const sorted: LiveData = {};
  for (const year in liveData) {
    const yearData = liveData[year];
    if (yearData) {
      sorted[year] = {
        ...yearData,
        items: [...(yearData.items || [])].sort((a, b) => {
          const dateA = a.date || '';
          const dateB = b.date || '';
          return dateB.localeCompare(dateA); // Descending
        }),
      };
    }
  }
  return sorted;
});

const eventSchemas = computed(() =>
  liveYears.flatMap(year => {
    const yearData = sortedLiveData.value[year];
    return (yearData?.items || []).map(event =>
      createMusicEventSchema(event, siteConfig.author.name, year),
    );
  }),
);

const eventsSchema = computed(() =>
  createItemListSchema(
    eventSchemas.value,
    `${siteConfig.author.name} Live Performances`,
    'Live performance history from 2005 to present',
  ),
);

usePageHead({
  title: 'Live',
  description: 'Live performance history of Jerome Faria from 2005 to present, including festivals, concerts, and collaborations.',
  schema: eventsSchema.value as unknown as Record<string, unknown>,
});

const findYearForEvent = (eventId: string): string | null =>
  liveYears.find(year => {
    const yearData = sortedLiveData.value[year];
    return yearData?.items?.some(e => e.id === eventId);
  }) ?? null;

const { openSection, handleToggle } = useAccordion(liveYears[0] || '', liveYears, findYearForEvent);
const { isOpen, currentItem, currentIndex, items, openLightbox, closeLightbox, goToNext, goToPrev, handleTouchStart, handleTouchEnd } = useLightboxWithSwipe();
</script>

<template>
  <div class="container-wide">
    <article
      class="page"
      data-page="live"
    >
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
          @open-lightbox="openLightbox"
        />
      </AccordionSection>
    </article>

    <!-- Lightbox overlay -->
    <LightboxOverlay
      v-if="currentItem"
      :is-open="isOpen"
      :current-item="currentItem"
      :current-index="currentIndex"
      :total-items="items.length"
      variant="compact"
      @close="closeLightbox"
      @prev="goToPrev"
      @next="goToNext"
      @touchstart="handleTouchStart"
      @touchend="handleTouchEnd"
    />
  </div>
</template>

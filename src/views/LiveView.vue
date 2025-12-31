<script setup>
import { computed } from 'vue';

import AccordionSection from '@/components/AccordionSection.vue';
import EventItem from '@/components/EventItem.vue';
import LightboxOverlay from '@/components/LightboxOverlay.vue';
import { useAccordion } from '@/composables/useAccordion';
import { useLightboxWithSwipe } from '@/composables/useLightboxWithSwipe';
import { usePageHead } from '@/composables/usePageHead';
import { liveData, liveYears } from '@/data/live';
import { siteConfig } from '@/data/navigation';
import { updateHash } from '@/utils/navigation';
import { createMusicEventSchema, createItemListSchema } from '@/utils/schemaHelpers';

// Sort events within each year by date (most recent first)
// ISO dates can be compared as strings: '2022-07-02' > '2022-03-05'
const sortedLiveData = computed(() => {
  const sorted = {};
  for (const year in liveData) {
    sorted[year] = {
      ...liveData[year],
      items: [...(liveData[year].items || [])].sort((a, b) => {
        const dateA = a.date || '';
        const dateB = b.date || '';
        return dateB.localeCompare(dateA); // Descending
      }),
    };
  }
  return sorted;
});

const eventSchemas = computed(() =>
  liveYears.flatMap(year =>
    (sortedLiveData.value[year]?.items || []).map(event =>
      createMusicEventSchema(event, siteConfig.author.name, year),
    ),
  ),
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
  schema: eventsSchema.value,
});

const findYearForEvent = eventId =>
  liveYears.find(year =>
    sortedLiveData.value[year]?.items?.some(e => e.id === eventId),
  ) ?? null;

const { openSection, handleToggle } = useAccordion(liveYears[0], liveYears, findYearForEvent);
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
        :title="sortedLiveData[year].title"
        :model-value="openSection === year"
        @update:model-value="handleToggle(year, $event)"
      >
        <EventItem
          v-for="event in sortedLiveData[year].items"
          :key="event.id"
          :event="event"
          @update-hash="updateHash"
          @open-lightbox="openLightbox"
        />
      </AccordionSection>
    </article>

    <!-- Lightbox overlay -->
    <LightboxOverlay
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

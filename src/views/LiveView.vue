<script setup>
import AccordionSection from '@/components/AccordionSection.vue';
import EventItem from '@/components/EventItem.vue';
import LightboxOverlay from '@/components/LightboxOverlay.vue';
import { useAccordion } from '@/composables/useAccordion';
import { useLightbox } from '@/composables/useLightbox';
import { usePageHead } from '@/composables/usePageHead';
import { useSwipeNavigation } from '@/composables/useSwipeNavigation';
import { liveData, liveYears } from '@/data/live';
import { siteConfig } from '@/data/navigation';
import { parseVenue, stripHtml } from '@/utils/formatters';

const eventSchemas = liveYears.flatMap(year =>
  (liveData[year]?.items || []).map(event => {
    const venue = parseVenue(event.venue);
    return {
      '@type': 'MusicEvent',
      name: stripHtml(event.title),
      startDate: year,
      location: {
        '@type': 'Place',
        name: venue.name,
        address: {
          '@type': 'PostalAddress',
          addressLocality: venue.addressLocality,
          addressCountry: venue.addressCountry,
        },
      },
      performer: {
        '@type': 'Person',
        name: siteConfig.author.name,
      },
    };
  }),
);

const eventsSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: `${siteConfig.author.name} Live Performances`,
  description: 'Live performance history from 2005 to present',
  numberOfItems: eventSchemas.length,
  itemListElement: eventSchemas.map((event, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: event,
  })),
};

usePageHead({
  title: 'Live',
  description: 'Live performance history of Jerome Faria from 2005 to present, including festivals, concerts, and collaborations.',
  schema: eventsSchema,
});

const findYearForEvent = eventId =>
  liveYears.find(year =>
    liveData[year]?.items?.some(e => e.id === eventId),
  ) ?? null;

const { openSection, handleToggle } = useAccordion(liveYears[0], liveYears, findYearForEvent);
const { isOpen, currentItem, currentIndex, items, openLightbox, closeLightbox, goToNext, goToPrev } = useLightbox();
const { handleTouchStart, handleTouchEnd } = useSwipeNavigation(goToNext, goToPrev);

// Update URL hash when event is clicked
const updateHash = id => {
  window.history.replaceState(null, '', `#${id}`);
};
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
        :title="liveData[year].title"
        :model-value="openSection === year"
        @update:model-value="handleToggle(year, $event)"
      >
        <EventItem
          v-for="event in liveData[year].items"
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

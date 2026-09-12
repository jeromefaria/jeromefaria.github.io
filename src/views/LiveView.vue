<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import AccordionPage from '@/components/AccordionPage.vue';
import EventItem from '@/components/EventItem.vue';
import NotFound from '@/components/NotFound.vue';
import { liveYears, sortedLiveData } from '@/data/live';
import { siteConfig } from '@/data/navigation';
import { pageMeta } from '@/data/pageMeta';
import { useLocalized } from '@/i18n/localized';
import { findLiveEvent, liveEventHead } from '@/utils/liveEventPermalink';
import { createLiveEventSchema, createLiveEventsSchema } from '@/utils/liveSchema';

const route = useRoute();
const { localize, current } = useLocalized();

const eventId = computed(() => (typeof route.params['eventId'] === 'string' ? route.params['eventId'] : ''));

const focusEvent = computed(() => (eventId.value ? findLiveEvent(eventId.value) : null));

const notFound = computed(() => eventId.value !== '' && !focusEvent.value);

const head = computed(() => {
  if (focusEvent.value) {
    const canonicalUrl = `${siteConfig.url}${route.path}`;
    return {
      ...liveEventHead(focusEvent.value, current.value),
      schema: createLiveEventSchema(focusEvent.value, current.value, canonicalUrl),
    };
  }

  return { ...pageMeta.live, schema: createLiveEventsSchema(current.value) };
});
</script>

<template>
  <NotFound v-if="notFound" />
  <AccordionPage
    v-else
    data-page="live"
    :title="localize(pageMeta.live.title)"
    :sections="liveYears"
    :section-data="sortedLiveData"
    :initial-section="liveYears[0] ?? ''"
    :focus-id="eventId"
    :head="head"
  >
    <template #item="{ item, openLightbox, updateHash }">
      <EventItem
        :event="item"
        @update-hash="updateHash"
        @open-lightbox="openLightbox"
      />
    </template>
  </AccordionPage>
</template>

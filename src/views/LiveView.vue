<script setup lang="ts">
import AccordionPage from '@/components/AccordionPage.vue';
import EventItem from '@/components/EventItem.vue';
import NotFound from '@/components/NotFound.vue';
import { useAccordionDetailPage } from '@/composables/useAccordionDetailPage';
import { liveYears, sortedLiveData } from '@/data/live';
import { pageMeta } from '@/data/pageMeta';
import { useLocalized } from '@/i18n/localized';
import { findLiveEvent, liveEventHead } from '@/utils/liveEventPermalink';
import { createLiveEventSchema, createLiveEventsSchema } from '@/utils/liveSchema';

const { localize, current } = useLocalized();

const { focusId: eventId, notFound, head } = useAccordionDetailPage({
  paramName: 'eventId',
  find: findLiveEvent,
  detailHead: (event, canonicalUrl) => ({
    ...liveEventHead(event, current.value),
    schema: createLiveEventSchema(event, current.value, canonicalUrl),
  }),
  listHead: () => ({ ...pageMeta.live, schema: createLiveEventsSchema(current.value) }),
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

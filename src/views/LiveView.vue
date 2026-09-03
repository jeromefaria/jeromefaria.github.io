<script setup lang="ts">
import AccordionPage from '@/components/AccordionPage.vue';
import EventItem from '@/components/EventItem.vue';
import { liveYears, sortedLiveData } from '@/data/live';
import { pageMeta } from '@/data/pageMeta';
import { useLocalized } from '@/i18n/localized';
import { createLiveEventsSchema } from '@/utils/liveSchema';

const { localize, current } = useLocalized();
</script>

<template>
  <AccordionPage
    data-page="live"
    :title="localize(pageMeta.live.title)"
    :sections="liveYears"
    :section-data="sortedLiveData"
    :initial-section="liveYears[0] ?? ''"
    :head="{ ...pageMeta.live, schema: createLiveEventsSchema(current) }"
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

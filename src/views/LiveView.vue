<script setup lang="ts">
import AccordionListPage from '@/components/AccordionListPage.vue';
import EventItem from '@/components/EventItem.vue';
import { liveYears, sortedLiveData } from '@/data/live';
import { pageMeta } from '@/data/pageMeta';
import { createLiveEventsSchema } from '@/utils/pageSchemas';
</script>

<template>
  <AccordionListPage
    data-page="live"
    title="Live"
    :sections="liveYears"
    :section-data="sortedLiveData"
    :initial-section="liveYears[0] ?? ''"
    :head="{ ...pageMeta.live, schema: createLiveEventsSchema() }"
  >
    <template #item="{ item, openLightbox, updateHash }">
      <EventItem
        :event="item"
        @update-hash="updateHash"
        @open-lightbox="openLightbox"
      />
    </template>
  </AccordionListPage>
</template>

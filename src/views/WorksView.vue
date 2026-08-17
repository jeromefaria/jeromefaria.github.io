<script setup lang="ts">
import AccordionListPage from '@/components/AccordionListPage.vue';
import ReleaseItem from '@/components/ReleaseItem.vue';
import { pageMeta } from '@/data/pageMeta';
import { worksData, worksSections } from '@/data/works';
import { createWorksPageSchema } from '@/utils/pageSchemas';
</script>

<template>
  <AccordionListPage
    data-page="works"
    title="Works"
    :sections="worksSections"
    :section-data="worksData"
    initial-section="solo"
    :head="{ ...pageMeta.works, schema: createWorksPageSchema() }"
  >
    <template #item="{ item, openLightbox, updateHash }">
      <ReleaseItem
        :release="item"
        :text-only="!('coverImage' in item && item.coverImage)"
        @update-hash="updateHash"
        @open-lightbox="openLightbox"
      />
    </template>
  </AccordionListPage>
</template>

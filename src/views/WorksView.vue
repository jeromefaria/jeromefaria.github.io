<script setup lang="ts">
import { computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';

import AccordionPage from '@/components/AccordionPage.vue';
import EngineeringCreditItem from '@/components/EngineeringCreditItem.vue';
import ReleaseItem from '@/components/ReleaseItem.vue';
import { pageMeta } from '@/data/pageMeta';
import { worksData, worksSections } from '@/data/works';
import { createWorksPageSchema } from '@/utils/pageSchemas';
import { canPlayRelease, findRelease, playReleaseAt, releaseHead } from '@/utils/releasePermalink';

const route = useRoute();

const releaseId = computed(() => (typeof route.params['releaseId'] === 'string' ? route.params['releaseId'] : ''));

const focusRelease = computed(() => (releaseId.value ? findRelease(releaseId.value) : null));

const head = computed(() => {
  const schema = createWorksPageSchema();
  return focusRelease.value ? { ...releaseHead(focusRelease.value), schema } : { ...pageMeta.works, schema };
});

// Best-effort playback from a shared link; a blocked autoplay leaves the player cued and paused.
const playFromRoute = (): void => {
  const release = focusRelease.value;
  if (!release || !canPlayRelease(release.id)) return;

  playReleaseAt(release, { track: Number(route.query['track']), t: Number(route.query['t']) });
};

onMounted(playFromRoute);
watch(() => [releaseId.value, route.query['track'], route.query['t']], playFromRoute);
</script>

<template>
  <AccordionPage
    data-page="works"
    title="Works"
    :sections="worksSections"
    :section-data="worksData"
    initial-section="solo"
    :focus-id="releaseId"
    :head="head"
  >
    <template #item="{ item, openLightbox, updateHash }">
      <EngineeringCreditItem
        v-if="item.meta.kind === 'engineering'"
        :release="item"
      />
      <ReleaseItem
        v-else
        :release="item"
        :text-only="!('coverImage' in item && item.coverImage)"
        @update-hash="updateHash"
        @open-lightbox="openLightbox"
      />
    </template>
  </AccordionPage>
</template>

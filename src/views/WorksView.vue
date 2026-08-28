<script setup lang="ts">
import { computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';

import AccordionPage from '@/components/AccordionPage.vue';
import ReleaseItem from '@/components/ReleaseItem.vue';
import { audioPlayerEnabled } from '@/composables/useFeatureFlags';
import { play, playFrom } from '@/composables/usePlayer';
import { getReleaseAudio, hasPlayableAudio } from '@/data/audio';
import { pageMeta } from '@/data/pageMeta';
import { worksData, worksSections } from '@/data/works';
import { createWorksPageSchema } from '@/utils/pageSchemas';
import { buildReleaseContext, findRelease, releaseHead } from '@/utils/releasePermalink';

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
  if (!release || !audioPlayerEnabled.value || !hasPlayableAudio(release.id)) return;

  const tracks = getReleaseAudio(release.id);
  const context = buildReleaseContext(release);
  const offset = Number(route.query['t']);
  const track = Number(route.query['track']);

  if (Number.isFinite(offset) && offset > 0) {
    void playFrom(tracks, offset, context);
    return;
  }
  if (Number.isFinite(track) && track >= 1 && track <= tracks.length) {
    void play(tracks, track - 1, context);
    return;
  }
  void play(tracks, 0, context);
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
      <ReleaseItem
        :release="item"
        :text-only="!('coverImage' in item && item.coverImage)"
        @update-hash="updateHash"
        @open-lightbox="openLightbox"
      />
    </template>
  </AccordionPage>
</template>

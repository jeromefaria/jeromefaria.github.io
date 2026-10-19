<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';

import AccordionPage from '@/components/AccordionPage.vue';
import EngineeringCreditItem from '@/components/EngineeringCreditItem.vue';
import NotFound from '@/components/NotFound.vue';
import ReleaseItem from '@/components/ReleaseItem.vue';
import { useAccordionDetailPage } from '@/composables/useAccordionDetailPage';
import { useImmersivePermalink } from '@/composables/useImmersivePermalink';
import { pageMeta } from '@/data/pageMeta';
import { worksData, worksSections } from '@/data/works';
import { useLocalized } from '@/i18n/localized';
import { canPlayRelease, findRelease, playReleaseAt, releaseHead } from '@/utils/releasePermalink';
import { createReleaseBreadcrumbSchema, createReleaseSchema, createWorksPageSchema } from '@/utils/worksSchema';

const route = useRoute();
const { localize, current } = useLocalized();

const { focusId: releaseId, focusEntity: focusRelease, notFound, head } = useAccordionDetailPage({
  paramName: 'releaseId',
  find: findRelease,
  detailHead: (release, canonicalUrl) => ({
    ...releaseHead(release, current.value),
    schema: [
      createReleaseSchema(release, current.value, canonicalUrl),
      createReleaseBreadcrumbSchema(release, current.value, canonicalUrl),
    ],
  }),
  listHead: () => ({ ...pageMeta.works, schema: createWorksPageSchema() }),
});

const playFromRoute = (): void => {
  const release = focusRelease.value;
  if (!release || !canPlayRelease(release.id)) return;

  playReleaseAt(release, {
    track: Number(route.query['track']),
    t: Number(route.query['t']),
    immersive: route.query['i'] === '1',
  });
};

useImmersivePermalink(releaseId);

onMounted(playFromRoute);
watch([releaseId, () => route.query['track'], () => route.query['t']], playFromRoute);
</script>

<template>
  <NotFound v-if="notFound" />
  <AccordionPage
    v-else
    data-page="works"
    :title="localize(pageMeta.works.title)"
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

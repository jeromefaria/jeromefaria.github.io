import type { ComputedRef } from 'vue';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import type { usePageHead } from '@/composables/usePageHead';
import { siteConfig } from '@/data/navigation';

type PageHead = Parameters<typeof usePageHead>[0];

interface AccordionDetailPageOptions<Entity> {
  paramName: string;
  find: (id: string) => Entity | null | undefined;
  detailHead: (entity: Entity, canonicalUrl: string) => PageHead;
  listHead: () => PageHead;
}

interface AccordionDetailPageReturn<Entity> {
  focusId: ComputedRef<string>;
  focusEntity: ComputedRef<Entity | null | undefined>;
  notFound: ComputedRef<boolean>;
  head: ComputedRef<PageHead>;
}

export const useAccordionDetailPage = <Entity>({
  paramName,
  find,
  detailHead,
  listHead,
}: AccordionDetailPageOptions<Entity>): AccordionDetailPageReturn<Entity> => {
  const route = useRoute();

  const focusId = computed(() => {
    const value = route.params[paramName];
    return typeof value === 'string' ? value : '';
  });

  const focusEntity = computed(() => (focusId.value ? find(focusId.value) : undefined));

  const notFound = computed(() => focusId.value !== '' && !focusEntity.value);

  const head = computed<PageHead>(() => {
    const entity = focusEntity.value;
    if (entity) return detailHead(entity, `${siteConfig.url}${route.path}`);

    return listHead();
  });

  return { focusId, focusEntity, notFound, head };
};

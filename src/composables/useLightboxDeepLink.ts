import type { Ref } from 'vue';
import { nextTick, onMounted, onUnmounted } from 'vue';

import type { LightboxItem } from '@/types/lightbox';
import { type LightboxMediaKind, type LightboxSource, parseMediaFragment } from '@/utils/lightboxPermalink';

type Galleries = Partial<Record<LightboxMediaKind, Ref<LightboxItem[]>>>;

export const useLightboxDeepLink = (
  entityId: string,
  galleries: Galleries,
  open: (items: LightboxItem[], index: number, source: LightboxSource) => void,
): void => {
  const controller = new AbortController();

  const openIfTargeted = (): void => {
    if (controller.signal.aborted) return;

    const parsed = parseMediaFragment(window.location.hash.slice(1));
    if (!parsed) return;
    if (parsed.id !== entityId) return;

    const items = galleries[parsed.kind]?.value ?? [];
    if (parsed.index >= items.length) return;

    open(items, parsed.index, { id: entityId, kind: parsed.kind });
  };

  onMounted(() => {
    void nextTick(openIfTargeted);
    window.addEventListener('popstate', openIfTargeted, { signal: controller.signal });
  });

  onUnmounted(() => controller.abort());
};

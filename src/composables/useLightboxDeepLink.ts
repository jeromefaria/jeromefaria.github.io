import type { Ref } from 'vue';
import { nextTick, onMounted } from 'vue';

import type { LightboxItem } from '@/types/lightbox';
import { type LightboxMediaKind, type LightboxSource, parseMediaFragment } from '@/utils/lightboxPermalink';

type Galleries = Partial<Record<LightboxMediaKind, Ref<LightboxItem[]>>>;

// Opens the lightbox on load when the URL hash targets this entity's media
// (#<id>/<kind>/<index>). Deferred a tick so the host lightbox is mounted.
export const useLightboxDeepLink = (
  entityId: string,
  galleries: Galleries,
  open: (items: LightboxItem[], index: number, source: LightboxSource) => void,
): void => {
  onMounted(() => {
    const parsed = parseMediaFragment(window.location.hash.slice(1));
    if (!parsed) return;
    if (parsed.id !== entityId) return;

    const items = galleries[parsed.kind]?.value ?? [];
    if (parsed.index >= items.length) return;

    void nextTick(() => open(items, parsed.index, { id: entityId, kind: parsed.kind }));
  });
};

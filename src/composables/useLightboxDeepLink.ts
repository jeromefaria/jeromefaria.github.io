import type { Ref } from 'vue';
import { nextTick, onMounted, onUnmounted } from 'vue';

import type { LightboxItem } from '@/types/lightbox';
import { type LightboxMediaKind, type LightboxSource, parseMediaFragment } from '@/utils/lightboxPermalink';

type Galleries = Partial<Record<LightboxMediaKind, Ref<LightboxItem[]>>>;

// Opens the lightbox when the URL hash targets this entity's media
// (#<id>/<kind>/<index>) — on load and on forward-navigation back into it.
export const useLightboxDeepLink = (
  entityId: string,
  galleries: Galleries,
  open: (items: LightboxItem[], index: number, source: LightboxSource) => void,
): void => {
  const openIfTargeted = (): void => {
    const parsed = parseMediaFragment(window.location.hash.slice(1));
    if (!parsed) return;
    if (parsed.id !== entityId) return;

    const items = galleries[parsed.kind]?.value ?? [];
    if (parsed.index >= items.length) return;

    open(items, parsed.index, { id: entityId, kind: parsed.kind });
  };

  // Deferred a tick on load so the host lightbox is mounted before we open it.
  onMounted(() => void nextTick(openIfTargeted));

  onMounted(() => window.addEventListener('popstate', openIfTargeted));
  onUnmounted(() => window.removeEventListener('popstate', openIfTargeted));
};

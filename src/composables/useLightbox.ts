import type { Ref } from 'vue';
import { onMounted, onUnmounted, ref } from 'vue';

import type { LightboxItem } from '@/types/lightbox';
import { baseFragment, type LightboxSource, mediaFragment } from '@/utils/lightboxPermalink';
import { clearHash, updateHash } from '@/utils/navigation';

import { useFocusReturn } from './useFocusReturn';
import { useScrollLock } from './useScrollLock';

export interface UseLightboxReturn {
  isOpen: Ref<boolean>;
  currentItem: Ref<LightboxItem | null>;
  currentIndex: Ref<number>;
  items: Ref<LightboxItem[]>;
  openLightbox: (allItems: LightboxItem[], index?: number, source?: LightboxSource) => void;
  closeLightbox: () => void;
  goToNext: () => void;
  goToPrev: () => void;
}

export const useLightbox = (): UseLightboxReturn => {
  const isOpen = ref(false);
  const currentItem = ref<LightboxItem | null>(null);
  const currentIndex = ref(0);
  const items = ref<LightboxItem[]>([]);

  const { lock, unlock } = useScrollLock();
  const { capture, restore } = useFocusReturn();

  let source: LightboxSource | null = null;
  let preOpenFragment = '';

  const writeMediaHash = (index: number): void => {
    if (source) updateHash(mediaFragment(source, index));
  };

  const openLightbox = (allItems: LightboxItem[] = [], index = 0, itemSource?: LightboxSource): void => {
    capture();
    preOpenFragment = window.location.hash.slice(1);
    source = itemSource ?? null;
    items.value = allItems;
    currentIndex.value = index;
    updateCurrentItem(index);
    isOpen.value = true;
    lock();
    writeMediaHash(index);
  };

  const closeLightbox = (): void => {
    isOpen.value = false;
    currentItem.value = null;
    items.value = [];
    currentIndex.value = 0;
    unlock();
    restore();

    if (source) {
      const anchor = baseFragment(preOpenFragment);
      if (anchor) {
        updateHash(anchor);
      } else {
        clearHash();
      }
    }
    source = null;
  };

  const updateCurrentItem = (index: number): void => {
    const item = items.value[index];
    if (!item) return;

    currentItem.value = item;
  };

  const goToNext = (): void => {
    if (currentIndex.value >= items.value.length - 1) return;

    currentIndex.value++;
    updateCurrentItem(currentIndex.value);
    writeMediaHash(currentIndex.value);
  };

  const goToPrev = (): void => {
    if (currentIndex.value <= 0) return;

    currentIndex.value--;
    updateCurrentItem(currentIndex.value);
    writeMediaHash(currentIndex.value);
  };

  const keyHandlers: Record<string, () => void> = {
    Escape: closeLightbox,
    ArrowRight: goToNext,
    ArrowLeft: goToPrev,
  };

  const handleKeydown = (event: KeyboardEvent): void => {
    if (!isOpen.value) return;

    const handler = keyHandlers[event.key];
    handler?.();
  };

  const abortController = new AbortController();

  onMounted(() => {
    document.addEventListener('keydown', handleKeydown, { signal: abortController.signal });
  });

  onUnmounted(() => {
    abortController.abort();
  });

  return {
    isOpen,
    currentItem,
    currentIndex,
    items,
    openLightbox,
    closeLightbox,
    goToNext,
    goToPrev,
  };
};

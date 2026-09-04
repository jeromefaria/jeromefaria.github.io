import type { Ref } from 'vue';
import { onMounted, onUnmounted, ref } from 'vue';

import type { LightboxItem } from '@/types/lightbox';
import { baseFragment, type LightboxSource, mediaFragment } from '@/utils/lightboxPermalink';

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

interface LightboxHistoryState {
  lightbox?: boolean;
}

const LIGHTBOX_STATE: LightboxHistoryState = { lightbox: true };

const currentFragment = (): string => window.location.hash.slice(1);
const isLightboxEntry = (): boolean => (window.history.state as LightboxHistoryState | null)?.lightbox === true;

export const useLightbox = (): UseLightboxReturn => {
  const isOpen = ref(false);
  const currentItem = ref<LightboxItem | null>(null);
  const currentIndex = ref(0);
  const items = ref<LightboxItem[]>([]);

  const { lock, unlock } = useScrollLock();
  const { capture, restore } = useFocusReturn();

  let source: LightboxSource | null = null;

  const updateCurrentItem = (index: number): void => {
    const item = items.value[index];
    if (!item) return;

    currentItem.value = item;
  };

  const openLightbox = (allItems: LightboxItem[] = [], index = 0, itemSource?: LightboxSource): void => {
    const media = itemSource ? mediaFragment(itemSource, index) : null;
    if (isOpen.value && media && currentFragment() === media) return;

    capture();
    source = itemSource ?? null;
    items.value = allItems;
    currentIndex.value = index;
    updateCurrentItem(index);
    isOpen.value = true;
    lock();

    if (!media) return;

    if (currentFragment() !== media) {
      window.history.pushState(LIGHTBOX_STATE, '', `#${media}`);
    } else if (!isLightboxEntry()) {
      window.history.replaceState(null, '', `#${baseFragment(media)}`);
      window.history.pushState(LIGHTBOX_STATE, '', `#${media}`);
    }
  };

  const resetState = (): void => {
    isOpen.value = false;
    currentItem.value = null;
    items.value = [];
    currentIndex.value = 0;
    source = null;
    unlock();
    restore();
  };

  const closeLightbox = (): void => {
    if (isOpen.value && source && isLightboxEntry()) {
      window.history.back();
      return;
    }
    resetState();
  };

  const goToNext = (): void => {
    if (currentIndex.value >= items.value.length - 1) return;

    currentIndex.value++;
    updateCurrentItem(currentIndex.value);
    if (source) window.history.replaceState(LIGHTBOX_STATE, '', `#${mediaFragment(source, currentIndex.value)}`);
  };

  const goToPrev = (): void => {
    if (currentIndex.value <= 0) return;

    currentIndex.value--;
    updateCurrentItem(currentIndex.value);
    if (source) window.history.replaceState(LIGHTBOX_STATE, '', `#${mediaFragment(source, currentIndex.value)}`);
  };

  const onPopState = (): void => {
    if (!isOpen.value) return;

    const openMedia = source ? mediaFragment(source, currentIndex.value) : '';
    if (currentFragment() !== openMedia) resetState();
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
    window.addEventListener('popstate', onPopState, { signal: abortController.signal });
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

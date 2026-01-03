import type { Ref } from 'vue';
import { onMounted, onUnmounted, ref } from 'vue';

import type { LightboxItem } from '@/types/lightbox';

interface UseLightboxReturn {
  isOpen: Ref<boolean>;
  currentItem: Ref<LightboxItem | null>;
  currentIndex: Ref<number>;
  items: Ref<LightboxItem[]>;
  openLightbox: (allItems: LightboxItem[], index?: number) => void;
  closeLightbox: () => void;
  goToNext: () => void;
  goToPrev: () => void;
}

/**
 * Lightbox state management for viewing images and videos in fullscreen
 * Handles keyboard navigation (Escape, Left/Right arrows) and state management
 * @returns Lightbox state and controls
 */
export const useLightbox = (): UseLightboxReturn => {
  const isOpen = ref(false);
  const currentItem = ref<LightboxItem | null>(null);
  const currentIndex = ref(0);
  const items = ref<LightboxItem[]>([]);

  const openLightbox = (allItems: LightboxItem[] = [], index = 0): void => {
    items.value = allItems;
    currentIndex.value = index;
    updateCurrentItem(index);
    isOpen.value = true;
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = (): void => {
    isOpen.value = false;
    currentItem.value = null;
    items.value = [];
    currentIndex.value = 0;
    document.body.style.overflow = '';
  };

  const updateCurrentItem = (index: number): void => {
    const item = items.value[index];
    if (!item) return;

    // Support both image and video items
    // Images have 'src', videos have 'url'
    currentItem.value = item;
  };

  const goToNext = (): void => {
    if (currentIndex.value >= items.value.length - 1) return;

    currentIndex.value++;
    updateCurrentItem(currentIndex.value);
  };

  const goToPrev = (): void => {
    if (currentIndex.value <= 0) return;

    currentIndex.value--;
    updateCurrentItem(currentIndex.value);
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
    document.body.style.overflow = '';
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

import type { Ref } from 'vue';

import type { LightboxItem } from '@/types/lightbox';

import { useLightbox } from './useLightbox';
import { useSwipeNavigation } from './useSwipeNavigation';

interface UseLightboxWithSwipeReturn {
  isOpen: Ref<boolean>;
  currentItem: Ref<LightboxItem | null>;
  currentIndex: Ref<number>;
  items: Ref<LightboxItem[]>;
  openLightbox: (allItems: LightboxItem[], index?: number) => void;
  closeLightbox: () => void;
  goToNext: () => void;
  goToPrev: () => void;
  handleTouchStart: (e: TouchEvent) => void;
  handleTouchEnd: (e: TouchEvent) => void;
}

/**
 * Combines lightbox functionality with swipe navigation
 * @returns Combined lightbox and swipe handlers
 */
export const useLightboxWithSwipe = (): UseLightboxWithSwipeReturn => {
  const { isOpen, currentItem, currentIndex, items, openLightbox, closeLightbox, goToNext, goToPrev } = useLightbox();
  const { handleTouchStart, handleTouchEnd } = useSwipeNavigation(goToNext, goToPrev);

  return {
    // Lightbox state
    isOpen,
    currentItem,
    currentIndex,
    items,
    // Lightbox actions
    openLightbox,
    closeLightbox,
    goToNext,
    goToPrev,
    // Swipe handlers
    handleTouchStart,
    handleTouchEnd,
  };
};

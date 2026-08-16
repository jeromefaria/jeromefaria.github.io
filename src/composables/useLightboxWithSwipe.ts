import { useLightbox, type UseLightboxReturn } from './useLightbox';
import { useSwipeNavigation, type UseSwipeNavigationReturn } from './useSwipeNavigation';

// Lightbox state/actions plus the swipe handlers, combined verbatim.
type UseLightboxWithSwipeReturn = UseLightboxReturn & UseSwipeNavigationReturn;

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

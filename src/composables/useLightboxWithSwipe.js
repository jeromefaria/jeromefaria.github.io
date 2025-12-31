import { useLightbox } from './useLightbox';
import { useSwipeNavigation } from './useSwipeNavigation';

/**
 * Combines lightbox functionality with swipe navigation
 * @returns {Object} Combined lightbox and swipe handlers
 */
export const useLightboxWithSwipe = () => {
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

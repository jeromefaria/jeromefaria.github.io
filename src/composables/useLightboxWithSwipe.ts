import { useLightbox, type UseLightboxReturn } from './useLightbox';
import { useSwipeNavigation, type UseSwipeNavigationReturn } from './useSwipeNavigation';

type UseLightboxWithSwipeReturn = UseLightboxReturn & UseSwipeNavigationReturn;

export const useLightboxWithSwipe = (): UseLightboxWithSwipeReturn => {
  const { isOpen, currentItem, currentIndex, items, openLightbox, closeLightbox, goToNext, goToPrev } = useLightbox();
  const { handleTouchStart, handleTouchEnd } = useSwipeNavigation(goToNext, goToPrev);

  return {
    isOpen,
    currentItem,
    currentIndex,
    items,
    openLightbox,
    closeLightbox,
    goToNext,
    goToPrev,
    handleTouchStart,
    handleTouchEnd,
  };
};

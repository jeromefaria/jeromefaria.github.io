import { useLightbox, type UseLightboxReturn } from './useLightbox';
import { useSwipeNavigation, type UseSwipeNavigationReturn } from './useSwipeNavigation';

type UseLightboxWithSwipeReturn = UseLightboxReturn & UseSwipeNavigationReturn;

export const useLightboxWithSwipe = (): UseLightboxWithSwipeReturn => {
  const lightbox = useLightbox();
  const swipe = useSwipeNavigation(lightbox.goToNext, lightbox.goToPrev);

  return { ...lightbox, ...swipe };
};

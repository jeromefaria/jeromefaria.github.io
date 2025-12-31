import { useLightbox } from './useLightbox';
import { useSwipeNavigation } from './useSwipeNavigation';

/**
 * @typedef {Object} LightboxWithSwipe
 * @property {import('vue').Ref<boolean>} isOpen - Whether lightbox is open
 * @property {import('vue').Ref<Object|null>} currentItem - Current item (image or video)
 * @property {import('vue').Ref<number>} currentIndex - Current item index
 * @property {import('vue').Ref<Array<Object>>} items - Array of all items
 * @property {Function} openLightbox - Open lightbox with items array and index
 * @property {Function} closeLightbox - Close lightbox
 * @property {Function} goToNext - Navigate to next item
 * @property {Function} goToPrev - Navigate to previous item
 * @property {Function} handleTouchStart - Handle touch start for swipe
 * @property {Function} handleTouchEnd - Handle touch end for swipe
 */

/**
 * Combines lightbox functionality with swipe navigation
 * @returns {LightboxWithSwipe} Combined lightbox and swipe handlers
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

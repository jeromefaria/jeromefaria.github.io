import { ref } from 'vue';

import { TOUCH } from '@/utils/constants';

/**
 * Composable for handling horizontal swipe gestures
 * @param {Function} onSwipeLeft - Callback when swiping left
 * @param {Function} onSwipeRight - Callback when swiping right
 * @returns {Object} Touch event handlers
 */
export const useSwipeNavigation = (onSwipeLeft, onSwipeRight) => {
  const touchStart = ref({ x: 0, y: 0, time: 0 });

  const handleTouchStart = e => {
    const touch = e.touches[0];
    touchStart.value = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };
  };

  const handleTouchEnd = e => {
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStart.value.x;
    const deltaY = touch.clientY - touchStart.value.y;
    const deltaTime = Date.now() - touchStart.value.time;

    // Check if it's a horizontal swipe (not vertical scroll)
    const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY);
    const isValidDistance = Math.abs(deltaX) > TOUCH.MIN_SWIPE_DISTANCE;
    const isValidSpeed = deltaTime < TOUCH.MAX_SWIPE_TIME;

    if (isHorizontalSwipe && isValidDistance && isValidSpeed) {
      if (deltaX > 0) {
        // Swipe right
        onSwipeRight?.();
      } else {
        // Swipe left
        onSwipeLeft?.();
      }
    }
  };

  return {
    handleTouchStart,
    handleTouchEnd,
  };
};

import type { Ref } from 'vue';
import { ref } from 'vue';

import { TOUCH } from '@/utils/constants';

export interface UseSwipeNavigationReturn {
  handleTouchStart: (event: TouchEvent) => void;
  handleTouchEnd: (event: TouchEvent) => void;
}

interface TouchPosition {
  x: number;
  y: number;
  time: number;
}

/**
 * Composable for handling horizontal swipe gestures
 * @param onSwipeLeft - Callback when swiping left
 * @param onSwipeRight - Callback when swiping right
 * @returns Touch event handlers
 */
export const useSwipeNavigation = (
  onSwipeLeft: () => void,
  onSwipeRight: () => void,
): UseSwipeNavigationReturn => {
  const touchStart: Ref<TouchPosition> = ref({ x: 0, y: 0, time: 0 });

  const handleTouchStart = (event: TouchEvent): void => {
    const touch = event.touches[0];
    if (!touch) return;

    touchStart.value = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };
  };

  const handleTouchEnd = (event: TouchEvent): void => {
    const touch = event.changedTouches[0];
    if (!touch) return;

    const deltaX = touch.clientX - touchStart.value.x;
    const deltaY = touch.clientY - touchStart.value.y;
    const deltaTime = Date.now() - touchStart.value.time;

    // Check if it's a horizontal swipe (not vertical scroll)
    const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY);
    const isValidDistance = Math.abs(deltaX) > TOUCH.MIN_SWIPE_DISTANCE;
    const isValidSpeed = deltaTime < TOUCH.MAX_SWIPE_TIME;

    if (isHorizontalSwipe && isValidDistance && isValidSpeed) {
      if (deltaX > 0) {
        onSwipeRight();
      } else {
        onSwipeLeft();
      }
    }
  };

  return {
    handleTouchStart,
    handleTouchEnd,
  };
};

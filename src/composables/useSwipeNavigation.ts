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

export const useSwipeNavigation = (
  onSwipeLeft: () => void,
  onSwipeRight: () => void,
): UseSwipeNavigationReturn => {
  let touchStart: TouchPosition = { x: 0, y: 0, time: 0 };

  const handleTouchStart = (event: TouchEvent): void => {
    const touch = event.touches[0];
    if (!touch) return;

    touchStart = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };
  };

  const handleTouchEnd = (event: TouchEvent): void => {
    const touch = event.changedTouches[0];
    if (!touch) return;

    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;
    const deltaTime = Date.now() - touchStart.time;

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

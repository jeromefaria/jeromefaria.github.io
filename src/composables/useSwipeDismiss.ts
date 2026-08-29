import { TOUCH } from '@/utils/constants';

export interface UseSwipeDismissReturn {
  handleTouchStart: (event: TouchEvent) => void;
  handleTouchEnd: (event: TouchEvent) => void;
}

interface TouchOrigin {
  x: number;
  y: number;
  time: number;
  atTop: boolean;
}

export const useSwipeDismiss = (
  onDismiss: () => void,
  isAtTop: () => boolean,
): UseSwipeDismissReturn => {
  let origin: TouchOrigin = { x: 0, y: 0, time: 0, atTop: false };

  const handleTouchStart = (event: TouchEvent): void => {
    const touch = event.touches[0];
    if (!touch) return;

    origin = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
      atTop: isAtTop(),
    };
  };

  const handleTouchEnd = (event: TouchEvent): void => {
    const touch = event.changedTouches[0];
    if (!touch) return;

    const deltaX = touch.clientX - origin.x;
    const deltaY = touch.clientY - origin.y;
    const deltaTime = Date.now() - origin.time;

    const isVerticalSwipe = Math.abs(deltaY) > Math.abs(deltaX);
    const isDownwardPastThreshold = deltaY > TOUCH.MIN_DISMISS_DISTANCE;
    const isValidSpeed = deltaTime < TOUCH.MAX_SWIPE_TIME;

    if (origin.atTop && isVerticalSwipe && isDownwardPastThreshold && isValidSpeed) {
      onDismiss();
    }
  };

  return { handleTouchStart, handleTouchEnd };
};

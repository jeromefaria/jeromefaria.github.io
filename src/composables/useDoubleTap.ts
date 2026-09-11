const DOUBLE_TAP_MS = 350;

export const useDoubleTap = (onDoubleTap: () => void, withinMs = DOUBLE_TAP_MS): ((event: PointerEvent) => void) => {
  let lastTap = -Infinity;

  return (event: PointerEvent) => {
    if (event.pointerType !== 'touch') return;

    if (event.timeStamp - lastTap < withinMs) {
      lastTap = -Infinity;
      onDoubleTap();
      return;
    }

    lastTap = event.timeStamp;
  };
};

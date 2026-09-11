import { describe, expect, it, vi } from 'vitest';

import { useDoubleTap } from './useDoubleTap';

const tap = (pointerType: string, timeStamp: number): PointerEvent =>
  ({ pointerType, timeStamp }) as PointerEvent;

describe('useDoubleTap', () => {
  it('fires when two touch taps land within the window', () => {
    const onDoubleTap = vi.fn();
    const handler = useDoubleTap(onDoubleTap);

    handler(tap('touch', 1000));
    handler(tap('touch', 1200));

    expect(onDoubleTap).toHaveBeenCalledTimes(1);
  });

  it('does not fire on a single tap', () => {
    const onDoubleTap = vi.fn();
    const handler = useDoubleTap(onDoubleTap);

    handler(tap('touch', 1000));

    expect(onDoubleTap).not.toHaveBeenCalled();
  });

  it('does not fire when the taps are too far apart', () => {
    const onDoubleTap = vi.fn();
    const handler = useDoubleTap(onDoubleTap);

    handler(tap('touch', 1000));
    handler(tap('touch', 1500));

    expect(onDoubleTap).not.toHaveBeenCalled();
  });

  it('ignores non-touch pointers so mouse double-clicks do nothing', () => {
    const onDoubleTap = vi.fn();
    const handler = useDoubleTap(onDoubleTap);

    handler(tap('mouse', 1000));
    handler(tap('mouse', 1100));

    expect(onDoubleTap).not.toHaveBeenCalled();
  });

  it('resets after firing so a third tap starts a fresh pair', () => {
    const onDoubleTap = vi.fn();
    const handler = useDoubleTap(onDoubleTap);

    handler(tap('touch', 1000));
    handler(tap('touch', 1100));
    handler(tap('touch', 1200));

    expect(onDoubleTap).toHaveBeenCalledTimes(1);
  });
});

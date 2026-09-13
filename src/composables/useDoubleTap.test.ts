import { afterEach, describe, expect, it, vi } from 'vitest';

import { useDoubleTap } from './useDoubleTap';

const touch = (): PointerEvent => ({ pointerType: 'touch' }) as PointerEvent;
const pointer = (pointerType: string): PointerEvent => ({ pointerType }) as PointerEvent;

const clockAt = (...times: number[]): void => {
  const spy = vi.spyOn(performance, 'now');
  times.forEach(time => spy.mockReturnValueOnce(time));
};

afterEach(() => vi.restoreAllMocks());

describe('useDoubleTap', () => {
  it('fires when two touch taps land within the window', () => {
    clockAt(1000, 1200);
    const onDoubleTap = vi.fn();
    const handler = useDoubleTap(onDoubleTap);

    handler(touch());
    handler(touch());

    expect(onDoubleTap).toHaveBeenCalledTimes(1);
  });

  it('does not fire on a single tap', () => {
    clockAt(1000);
    const onDoubleTap = vi.fn();
    const handler = useDoubleTap(onDoubleTap);

    handler(touch());

    expect(onDoubleTap).not.toHaveBeenCalled();
  });

  it('does not fire when the taps are too far apart', () => {
    clockAt(1000, 1500);
    const onDoubleTap = vi.fn();
    const handler = useDoubleTap(onDoubleTap);

    handler(touch());
    handler(touch());

    expect(onDoubleTap).not.toHaveBeenCalled();
  });

  it('ignores non-touch pointers so mouse double-clicks do nothing', () => {
    const onDoubleTap = vi.fn();
    const handler = useDoubleTap(onDoubleTap);

    handler(pointer('mouse'));
    handler(pointer('mouse'));

    expect(onDoubleTap).not.toHaveBeenCalled();
  });

  it('resets after firing so a third tap starts a fresh pair', () => {
    clockAt(1000, 1100, 1200);
    const onDoubleTap = vi.fn();
    const handler = useDoubleTap(onDoubleTap);

    handler(touch());
    handler(touch());
    handler(touch());

    expect(onDoubleTap).toHaveBeenCalledTimes(1);
  });
});

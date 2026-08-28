import { describe, expect, it } from 'vitest';

import { formatTime } from './formatTime';

describe('formatTime', () => {
  it('formats seconds as m:ss', () => {
    expect(formatTime(0)).toBe('0:00');
    expect(formatTime(9)).toBe('0:09');
    expect(formatTime(90)).toBe('1:30');
    expect(formatTime(648)).toBe('10:48');
  });

  it('returns 0:00 for non-finite or negative input', () => {
    expect(formatTime(Number.NaN)).toBe('0:00');
    expect(formatTime(Number.POSITIVE_INFINITY)).toBe('0:00');
    expect(formatTime(-5)).toBe('0:00');
  });
});

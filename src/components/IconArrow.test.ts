import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import IconArrow from './IconArrow.vue';

const HORIZONTAL_HEAD = '13.5 5.5 20 12 13.5 18.5';
const DIAGONAL_HEAD = '8 5.5 18.5 5.5 18.5 16';

describe('IconArrow', () => {
  it('renders a decorative, focusable-off svg', () => {
    const wrapper = mount(IconArrow, { props: { direction: 'right' } });
    const svg = wrapper.get('svg.icon-arrow');
    expect(svg.attributes('aria-hidden')).toBe('true');
    expect(svg.attributes('focusable')).toBe('false');
  });

  it('draws the horizontal arrow pointing right with no rotation', () => {
    const wrapper = mount(IconArrow, { props: { direction: 'right' } });
    expect(wrapper.get('svg').attributes('style')).toContain('transform: rotate(0deg)');
    expect(wrapper.get('polyline').attributes('points')).toBe(HORIZONTAL_HEAD);
  });

  it('flips the same horizontal arrow to point left via a 180° rotation', () => {
    const wrapper = mount(IconArrow, { props: { direction: 'left' } });
    expect(wrapper.get('svg').attributes('style')).toContain('transform: rotate(180deg)');
    expect(wrapper.get('polyline').attributes('points')).toBe(HORIZONTAL_HEAD);
  });

  it('draws the up-right arrow with its own axis-aligned head, not a rotation', () => {
    const wrapper = mount(IconArrow, { props: { direction: 'up-right' } });
    expect(wrapper.get('svg').attributes('style')).toContain('transform: rotate(0deg)');
    expect(wrapper.get('polyline').attributes('points')).toBe(DIAGONAL_HEAD);
  });
});

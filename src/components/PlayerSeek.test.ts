import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import PlayerSeek from './PlayerSeek.vue';

const props = {
  currentTime: 50,
  duration: 100,
  label: 'Seek within One',
};

describe('PlayerSeek', () => {
  it('renders the elapsed and total time', () => {
    const wrapper = mount(PlayerSeek, { props });
    const times = wrapper.findAll('.player-seek__time');

    expect(times[0].text()).toBe('0:50');
    expect(times[1].text()).toBe('1:40');
  });

  it('wires the slider to the current time and duration', () => {
    const slider = mount(PlayerSeek, { props }).find('input[type="range"]');

    expect(slider.attributes('max')).toBe('100');
    expect((slider.element as HTMLInputElement).value).toBe('50');
    expect(slider.attributes('aria-label')).toBe('Seek within One');
    expect(slider.attributes('aria-valuetext')).toBe('0:50 of 1:40');
  });

  it('falls back to a zero range before the duration is known', () => {
    const slider = mount(PlayerSeek, { props: { ...props, currentTime: 0, duration: 0 } }).find('input[type="range"]');

    expect(slider.attributes('max')).toBe('0');
    expect(slider.attributes('aria-valuetext')).toBe('0:00 of 0:00');
  });

  it('emits the numeric seek value on input', async () => {
    const wrapper = mount(PlayerSeek, { props });

    await wrapper.find('input[type="range"]').setValue(75);

    expect(wrapper.emitted('seek')).toEqual([[75]]);
  });
});

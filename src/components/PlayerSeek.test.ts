import { flushPromises, mount, type VueWrapper } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const TRACK = { key: 'x/1.m4a', title: 'One', duration: 100 };

type PlayerModule = typeof import('@/composables/usePlayer');

describe('PlayerSeek', () => {
  let player: PlayerModule;
  let component: typeof import('./PlayerSeek.vue').default;

  beforeEach(async () => {
    vi.resetModules();
    HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined);
    HTMLMediaElement.prototype.pause = vi.fn();
    HTMLMediaElement.prototype.load = vi.fn();
    player = await import('@/composables/usePlayer');
    component = (await import('./PlayerSeek.vue')).default;
  });

  const mounted = async (): Promise<VueWrapper> => {
    const wrapper = mount(component, { props: { label: 'Seek within One' } });
    await flushPromises();
    return wrapper;
  };

  it('renders the elapsed and total time', async () => {
    await player.play([TRACK]);
    player.seek(50);
    const times = (await mounted()).findAll('.player-seek__time');

    expect(times[0].text()).toBe('0:50');
    expect(times[1].text()).toBe('1:40');
  });

  it('wires the slider to the current time and duration', async () => {
    await player.play([TRACK]);
    player.seek(50);
    const slider = (await mounted()).find('input[type="range"]');

    expect(slider.attributes('max')).toBe('100');
    expect((slider.element as HTMLInputElement).value).toBe('50');
    expect(slider.attributes('aria-label')).toBe('Seek within One');
    expect(slider.attributes('aria-valuetext')).toBe('0:50 of 1:40');
  });

  it('falls back to a zero range before a track is loaded', async () => {
    const slider = (await mounted()).find('input[type="range"]');

    expect(slider.attributes('max')).toBe('0');
    expect(slider.attributes('aria-valuetext')).toBe('0:00 of 0:00');
  });

  it('seeks to the numeric value on input', async () => {
    await player.play([TRACK]);
    const wrapper = await mounted();

    await wrapper.find('input[type="range"]').setValue(75);
    expect(player.usePlayer().currentTime.value).toBe(75);
  });
});

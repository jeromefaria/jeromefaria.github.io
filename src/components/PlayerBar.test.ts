import { flushPromises, mount, type VueWrapper } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const TRACKS = [
  { key: 'x/1.m4a', title: 'One', duration: 100 },
  { key: 'x/2.m4a', title: 'Two', duration: 200 },
];

type PlayerModule = typeof import('@/composables/usePlayer');

describe('PlayerBar', () => {
  let player: PlayerModule;
  let component: typeof import('./PlayerBar.vue').default;

  beforeEach(async () => {
    vi.resetModules();
    HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined);
    HTMLMediaElement.prototype.pause = vi.fn();
    HTMLMediaElement.prototype.load = vi.fn();
    player = await import('@/composables/usePlayer');
    component = (await import('./PlayerBar.vue')).default;
  });

  const mounted = async (): Promise<VueWrapper> => {
    const wrapper = mount(component);
    await flushPromises();
    return wrapper;
  };

  it('renders nothing until a track is loaded', () => {
    expect(mount(component).find('.player-bar').exists()).toBe(false);
  });

  it('renders the docked bar with title, three controls, and a seek slider', async () => {
    await player.play(TRACKS);
    const wrapper = await mounted();

    expect(wrapper.find('.player-bar__title').text()).toBe('One');
    expect(wrapper.findAll('.player-bar__button')).toHaveLength(3);
    expect(wrapper.find('input[type="range"]').attributes('aria-label')).toContain('One');
    expect(wrapper.findAll('.player-bar__time')[1].text()).toBe('1:40');
  });

  it('shows a spinner while busy and hides it once playing', async () => {
    await player.play(TRACKS);
    const wrapper = await mounted();
    expect(wrapper.find('.player-bar__spinner').exists()).toBe(true);

    player.getMediaElement().dispatchEvent(new Event('playing'));
    await flushPromises();
    expect(wrapper.find('.player-bar__spinner').exists()).toBe(false);
  });

  it('announces playback state in the live region', async () => {
    await player.play(TRACKS);
    const wrapper = await mounted();
    expect(wrapper.find('.player-bar__status').text()).toBe('Loading: One');

    player.getMediaElement().dispatchEvent(new Event('playing'));
    await flushPromises();
    expect(wrapper.find('.player-bar__status').text()).toBe('Playing: One');
  });

  it('toggles playback from the primary control', async () => {
    await player.play(TRACKS);
    const wrapper = await mounted();
    player.getMediaElement().dispatchEvent(new Event('playing'));
    await flushPromises();

    await wrapper.findAll('.player-bar__button')[1].trigger('click');
    expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled();
  });

  it('steps to the next track from the control', async () => {
    await player.play(TRACKS, 0);
    const wrapper = await mounted();

    await wrapper.findAll('.player-bar__button')[2].trigger('click');
    await flushPromises();
    expect(wrapper.find('.player-bar__title').text()).toBe('Two');
  });

  it('seeks from the slider and reflects the time', async () => {
    await player.play(TRACKS);
    const wrapper = await mounted();

    await wrapper.find('input[type="range"]').setValue(50);
    expect(wrapper.findAll('.player-bar__time')[0].text()).toBe('0:50');
  });

  it('disables previous at the queue head and next at the tail', async () => {
    await player.play(TRACKS, 1);
    const wrapper = await mounted();
    const [previous, , next] = wrapper.findAll('.player-bar__button');

    expect(next.attributes('disabled')).toBeDefined();
    expect(previous.attributes('disabled')).toBeUndefined();
  });

  it('expands to the full view when the title is tapped', async () => {
    await player.play(TRACKS);
    const wrapper = await mounted();

    await wrapper.find('.player-bar__title').trigger('click');
    expect(player.usePlayer().expanded.value).toBe(true);
  });

  it('dismisses the bar when the close button is pressed', async () => {
    await player.play(TRACKS);
    const wrapper = await mounted();

    await wrapper.find('.player-bar__close').trigger('click');
    await flushPromises();
    expect(wrapper.find('.player-bar').exists()).toBe(false);
  });

  it('surfaces an error in the live region', async () => {
    vi.useFakeTimers();
    await player.play(TRACKS);
    const wrapper = await mounted();
    const element = player.getMediaElement();

    element.dispatchEvent(new Event('error'));
    await vi.advanceTimersByTimeAsync(600);
    element.dispatchEvent(new Event('error'));
    await vi.advanceTimersByTimeAsync(1200);
    element.dispatchEvent(new Event('error'));
    vi.useRealTimers();
    await flushPromises();

    expect(wrapper.find('.player-bar__status').text()).toContain('failed');
  });
});

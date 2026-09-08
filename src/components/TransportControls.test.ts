import { flushPromises, mount, type VueWrapper } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const TRACKS = [
  { key: 'x/1.m4a', title: 'One', duration: 100 },
  { key: 'x/2.m4a', title: 'Two', duration: 200 },
];

type PlayerModule = typeof import('@/composables/usePlayer');

describe('TransportControls', () => {
  let player: PlayerModule;
  let component: typeof import('./TransportControls.vue').default;

  beforeEach(async () => {
    vi.resetModules();
    HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined);
    HTMLMediaElement.prototype.pause = vi.fn();
    HTMLMediaElement.prototype.load = vi.fn();
    player = await import('@/composables/usePlayer');
    component = (await import('./TransportControls.vue')).default;
  });

  const mounted = async (): Promise<VueWrapper> => {
    const wrapper = mount(component);
    await flushPromises();
    return wrapper;
  };

  const playing = async (): Promise<void> => {
    player.getMediaElement().dispatchEvent(new Event('playing'));
    await flushPromises();
  };

  it('renders previous, primary, and next controls', async () => {
    await player.play(TRACKS, 0);
    const buttons = (await mounted()).findAll('.transport-controls__button');

    expect(buttons).toHaveLength(3);
    expect(buttons[0].attributes('aria-label')).toBe('Previous track');
    expect(buttons[1].attributes('aria-label')).toBe('Play');
    expect(buttons[2].attributes('aria-label')).toBe('Next track');
  });

  it('labels the primary control Pause while playing', async () => {
    await player.play(TRACKS, 0);
    await playing();
    const wrapper = await mounted();

    expect(wrapper.findAll('.transport-controls__button')[1].attributes('aria-label')).toBe('Pause');
  });

  it('shows only the spinner and marks itself busy while buffering', async () => {
    await player.play(TRACKS, 0);
    const wrapper = await mounted();
    const primary = wrapper.findAll('.transport-controls__button')[1];

    expect(wrapper.find('.transport-controls__spinner').exists()).toBe(true);
    expect(primary.findAll('path')).toHaveLength(0);
    expect(primary.attributes('aria-busy')).toBe('true');

    await playing();
    expect(wrapper.find('.transport-controls__spinner').exists()).toBe(false);
    expect(primary.attributes('aria-busy')).toBe('false');
  });

  it('disables previous only at the queue head within the first three seconds', async () => {
    await player.play(TRACKS, 0);
    await playing();
    const wrapper = await mounted();
    const previous = wrapper.findAll('.transport-controls__button')[0];

    expect(previous.attributes('disabled')).toBeDefined();

    player.seek(5);
    await flushPromises();
    expect(previous.attributes('disabled')).toBeUndefined();
  });

  it('disables next at the queue tail', async () => {
    await player.play(TRACKS, 1);
    await playing();
    const wrapper = await mounted();

    expect(wrapper.findAll('.transport-controls__button')[2].attributes('disabled')).toBeDefined();
  });

  it('drives playback and track changes on click', async () => {
    await player.play(TRACKS, 0);
    await playing();
    const wrapper = await mounted();
    const buttons = wrapper.findAll('.transport-controls__button');

    await buttons[1].trigger('click');
    expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled();

    await buttons[2].trigger('click');
    await flushPromises();
    expect(player.usePlayer().currentTrack.value?.title).toBe('Two');
  });
});

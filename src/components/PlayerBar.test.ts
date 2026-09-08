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
    expect(wrapper.findAll('.transport-controls__button')).toHaveLength(3);
    expect(wrapper.find('input[type="range"]').attributes('aria-label')).toContain('One');
    expect(wrapper.findAll('.player-seek__time')[1].text()).toBe('1:40');
  });

  it('prefixes a multi-track release with its title', async () => {
    await player.play(TRACKS, 0, { album: 'Overlapse' });
    const wrapper = await mounted();

    expect(wrapper.find('.player-bar__meta').text()).toBe('Overlapse');
    expect(wrapper.find('.player-bar__track').text()).toBe('One');
  });

  it('prefixes the release title and the track artist together', async () => {
    const remixTracks = [
      { key: 'r/1.m4a', title: 'Attack (Prelude)', duration: 100, artist: 'CAVERNANCIA' },
      { key: 'r/2.m4a', title: 'Release', duration: 200, artist: 'Fábio Fernandes' },
    ];
    await player.play(remixTracks, 0, { album: 'Overlapse XIII' });
    const wrapper = await mounted();

    expect(wrapper.find('.player-bar__meta').text()).toBe('Overlapse XIII · CAVERNANCIA');
    expect(wrapper.find('.player-bar__track').text()).toBe('Attack (Prelude)');
  });

  it('shows the current chapter as the track for a chaptered single-file release', async () => {
    const chapters = [
      { title: 'Prólogo: Estado Novo', start: 0 },
      { title: 'Fado: Estados Socialistas', start: 205 },
    ];
    await player.play([{ key: 'b/2504.m4a', title: '2504', duration: 1504 }], 0, { album: '2504', chapters });
    const wrapper = await mounted();

    expect(wrapper.find('.player-bar__meta').text()).toBe('2504');
    expect(wrapper.find('.player-bar__track').text()).toBe('Prólogo: Estado Novo');

    const element = player.getMediaElement();
    element.currentTime = 300;
    element.dispatchEvent(new Event('timeupdate'));
    await flushPromises();

    expect(wrapper.find('.player-bar__track').text()).toBe('Fado: Estados Socialistas');
  });

  it('keeps a single-track release bare — no album or artist prefix', async () => {
    await player.play([{ key: 's/1.m4a', title: 'Depolarized', duration: 100, artist: 'Jerome Faria + Nelson P. Ferreira' }], 0, { album: 'Depolarized' });
    const wrapper = await mounted();

    expect(wrapper.find('.player-bar__meta').exists()).toBe(false);
    expect(wrapper.find('.player-bar__title').text()).toBe('Depolarized');
  });

  it('omits the prefix entirely when no release context is playing', async () => {
    await player.play(TRACKS);
    const wrapper = await mounted();

    expect(wrapper.find('.player-bar__meta').exists()).toBe(false);
    expect(wrapper.find('.player-bar__title').text()).toBe('One');
  });

  it('shows a spinner while busy and hides it once playing', async () => {
    await player.play(TRACKS);
    const wrapper = await mounted();
    expect(wrapper.find('.transport-controls__spinner').exists()).toBe(true);

    player.getMediaElement().dispatchEvent(new Event('playing'));
    await flushPromises();
    expect(wrapper.find('.transport-controls__spinner').exists()).toBe(false);
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

    await wrapper.findAll('.transport-controls__button')[1].trigger('click');
    expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled();
  });

  it('steps to the next track from the control', async () => {
    await player.play(TRACKS, 0);
    const wrapper = await mounted();

    await wrapper.findAll('.transport-controls__button')[2].trigger('click');
    await flushPromises();
    expect(wrapper.find('.player-bar__title').text()).toBe('Two');
  });

  it('seeks from the slider and reflects the time', async () => {
    await player.play(TRACKS);
    const wrapper = await mounted();

    await wrapper.find('input[type="range"]').setValue(50);
    expect(wrapper.findAll('.player-seek__time')[0].text()).toBe('0:50');
  });

  it('disables previous at the queue head and next at the tail', async () => {
    await player.play(TRACKS, 1);
    const wrapper = await mounted();
    const [previous, , next] = wrapper.findAll('.transport-controls__button');

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

import { createHead } from '@unhead/vue/client';
import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createMemoryHistory, createRouter } from 'vue-router';

import { audioPlayerEnabled } from '@/composables/useFeatureFlags';
import { canPlayRelease, playReleaseAt } from '@/utils/releasePermalink';

import WritingEssayView from './WritingEssayView.vue';

vi.mock('@/utils/releasePermalink', async importOriginal => {
  const actual = await importOriginal<typeof import('@/utils/releasePermalink')>();
  return { ...actual, playReleaseAt: vi.fn(), canPlayRelease: vi.fn(actual.canPlayRelease) };
});

const mountEssay = async (path: string) => {
  const head = createHead();
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/writing/:slug', component: { template: '<div />' } },
      { path: '/writing', component: { template: '<div />' } },
      { path: '/works/:slug', component: { template: '<div />' } },
      { path: '/:pathMatch(.*)*', component: { template: '<div />' } },
    ],
  });
  router.push(path);
  await router.isReady();
  return mount(WritingEssayView, { global: { plugins: [router, head] } });
};

const clickListen = (wrapper: Awaited<ReturnType<typeof mountEssay>>, options: object = {}) =>
  wrapper.find('.writing-listen').trigger('click', options);

describe('WritingEssayView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    audioPlayerEnabled.value = true;
  });

  afterEach(() => {
    audioPlayerEnabled.value = true;
  });

  it('renders the essay body and its in-text links', async () => {
    const wrapper = await mountEssay('/writing/orchestration');
    const html = wrapper.html();

    expect(html).toContain('Orchestration');
    expect(html).toContain('The conducting is still the part I keep');
    expect(html).toContain('href="/works/2504"');
    expect(html).toContain('href="/cv"');
    expect(html).toContain('github.com/jeromefaria/jeromefaria.github.io');
  });

  it('offers a Listen affordance carrying the release href when the essay is about one', async () => {
    const link = (await mountEssay('/writing/2504')).find('.writing-listen');

    expect(link.exists()).toBe(true);
    expect(link.attributes('href')).toBe('/works/2504');
    expect(link.text()).toContain('Listen');
  });

  it('plays the release in place on a plain Listen click', async () => {
    await clickListen(await mountEssay('/writing/2504'));

    expect(playReleaseAt).toHaveBeenCalledTimes(1);
  });

  it('lets a cmd/ctrl Listen click through to the release page', async () => {
    const wrapper = await mountEssay('/writing/2504');

    await clickListen(wrapper, { metaKey: true });
    await clickListen(wrapper, { ctrlKey: true });

    expect(playReleaseAt).not.toHaveBeenCalled();
  });

  it('falls back to navigation when the audio player is disabled', async () => {
    audioPlayerEnabled.value = false;

    await clickListen(await mountEssay('/writing/2504'));

    expect(playReleaseAt).not.toHaveBeenCalled();
  });

  it('falls back to navigation when the release has no playable audio', async () => {
    vi.mocked(canPlayRelease).mockReturnValueOnce(false);

    await clickListen(await mountEssay('/writing/2504'));

    expect(playReleaseAt).not.toHaveBeenCalled();
  });

  it('offers a bottom back-link to the writing index', async () => {
    const back = (await mountEssay('/writing/2504')).find('.writing-back');

    expect(back.exists()).toBe(true);
    expect(back.attributes('href')).toBe('/writing');
  });

  it('omits the Listen affordance for a standalone essay', async () => {
    const wrapper = await mountEssay('/writing/orchestration');

    expect(wrapper.find('.writing-listen').exists()).toBe(false);
  });

  it('shows a fallback for an unknown essay slug', async () => {
    const wrapper = await mountEssay('/writing/does-not-exist');

    expect(wrapper.text()).toContain('could not be found');
  });
});

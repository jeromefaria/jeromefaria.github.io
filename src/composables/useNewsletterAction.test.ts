import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, h } from 'vue';

import { type NewsletterActionMode, useNewsletterAction } from './useNewsletterAction';

const okResponse = (body: unknown): Response => ({ ok: true, json: async () => body }) as unknown as Response;
const errResponse = (): Response => ({ ok: false, json: async () => ({}) }) as unknown as Response;
const nonJsonResponse = (): Response =>
  ({ ok: true, json: async () => { throw new Error('not json'); } }) as unknown as Response;

const run = (mode: NewsletterActionMode, token = 'tok', endpoint = 'https://w.example/newsletter/confirm') => {
  let api!: ReturnType<typeof useNewsletterAction>;

  mount(defineComponent({
    setup() {
      api = useNewsletterAction(mode, token, endpoint);
      return () => h('div');
    },
  }));

  return api;
};

describe('useNewsletterAction', () => {
  let fetchMock: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    fetchMock = vi.spyOn(globalThis, 'fetch');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('starts idle and does not auto-submit in unsubscribe mode', () => {
    const api = run('unsubscribe');

    expect(api.state.value).toBe('idle');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('auto-submits on mount in confirm mode and resolves done', async () => {
    fetchMock.mockResolvedValue(okResponse({ ok: true }));

    const api = run('confirm', 'ct');
    await flushPromises();

    expect(fetchMock).toHaveBeenCalledWith('https://w.example/newsletter/confirm?token=ct', { method: 'POST' });
    expect(api.state.value).toBe('done');
  });

  it('marks invalid when the body reports ok:false', async () => {
    fetchMock.mockResolvedValue(okResponse({ ok: false }));

    const api = run('unsubscribe');
    await api.submit();

    expect(api.state.value).toBe('invalid');
  });

  it('marks invalid on a non-ok response', async () => {
    fetchMock.mockResolvedValue(errResponse());

    const api = run('unsubscribe');
    await api.submit();

    expect(api.state.value).toBe('invalid');
  });

  it('marks invalid when the request throws', async () => {
    fetchMock.mockRejectedValue(new Error('network'));

    const api = run('unsubscribe');
    await api.submit();

    expect(api.state.value).toBe('invalid');
  });

  it('treats a non-JSON ok response as success', async () => {
    fetchMock.mockResolvedValue(nonJsonResponse());

    const api = run('unsubscribe');
    await api.submit();

    expect(api.state.value).toBe('done');
  });
});

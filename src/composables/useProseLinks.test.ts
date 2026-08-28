import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { defineComponent } from 'vue';
import { createMemoryHistory, createRouter, type Router } from 'vue-router';

import { useProseLinks } from './useProseLinks';

const mountHandler = async (): Promise<{ handle: (event: MouseEvent) => void; router: Router }> => {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/:pathMatch(.*)*', component: { template: '<div />' } }],
  });
  await router.push('/');
  await router.isReady();

  let handle: ((event: MouseEvent) => void) | null = null;
  mount(
    defineComponent({
      setup() {
        handle = useProseLinks();
        return () => null;
      },
    }),
    { global: { plugins: [router] } },
  );

  if (!handle) throw new Error('useProseLinks did not initialise');
  return { handle, router };
};

const anchor = (attributes: Record<string, string>): HTMLAnchorElement => {
  const element = document.createElement('a');
  for (const [name, value] of Object.entries(attributes)) element.setAttribute(name, value);
  return element;
};

const clickOn = (target: HTMLElement, overrides: Partial<MouseEvent> = {}): MouseEvent => {
  const event = new MouseEvent('click', { cancelable: true, button: 0 });
  Object.defineProperty(event, 'target', { value: target });
  Object.assign(event, overrides);
  return event;
};

describe('useProseLinks', () => {
  let handle: (event: MouseEvent) => void;
  let router: Router;
  let push: ReturnType<typeof vi.spyOn>;

  beforeEach(async () => {
    ({ handle, router } = await mountHandler());
    push = vi.spyOn(router, 'push');
  });

  it('routes an internal link through the router and prevents the reload', () => {
    const event = clickOn(anchor({ href: '/contact' }));

    handle(event);

    expect(event.defaultPrevented).toBe(true);
    expect(push).toHaveBeenCalledWith('/contact');
  });

  it('preserves the hash on a deep link', () => {
    const link = anchor({ href: '/works#nny' });
    const child = document.createElement('em');
    link.appendChild(child);

    handle(clickOn(child));

    expect(push).toHaveBeenCalledWith('/works#nny');
  });

  it.each([
    ['external', anchor({ href: 'https://example.com' })],
    ['protocol-relative', anchor({ href: '//example.com' })],
    ['hash-only', anchor({ href: '#section' })],
    ['new-tab', anchor({ href: '/works', target: '_blank' })],
    ['download', anchor({ href: '/press-kit.zip', download: '' })],
  ])('leaves a %s link to the browser', (_label, link) => {
    const event = clickOn(link);

    handle(event);

    expect(event.defaultPrevented).toBe(false);
    expect(push).not.toHaveBeenCalled();
  });

  it('ignores clicks that miss an anchor', () => {
    handle(clickOn(document.createElement('p')));
    expect(push).not.toHaveBeenCalled();
  });

  it('respects modifier and non-primary clicks (new-tab intent)', () => {
    handle(clickOn(anchor({ href: '/contact' }), { metaKey: true }));
    handle(clickOn(anchor({ href: '/contact' }), { button: 1 }));

    expect(push).not.toHaveBeenCalled();
  });
});

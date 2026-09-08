import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, h } from 'vue';

import { usePageLifecycle } from './usePageLifecycle';

const setVisibility = (state: 'visible' | 'hidden'): void => {
  Object.defineProperty(document, 'visibilityState', { value: state, configurable: true });
};

const pageShow = (persisted: boolean): void => {
  const event = new Event('pageshow');
  Object.defineProperty(event, 'persisted', { value: persisted });
  window.dispatchEvent(event);
};

const mountWith = (handlers: Parameters<typeof usePageLifecycle>[0]) =>
  mount(defineComponent({
    setup() {
      usePageLifecycle(handlers);
      return () => h('div');
    },
  }));

describe('usePageLifecycle', () => {
  beforeEach(() => setVisibility('visible'));

  it('calls onResume when the tab becomes visible and onHidden when it hides', () => {
    const onResume = vi.fn();
    const onHidden = vi.fn();
    mountWith({ onResume, onHidden });

    setVisibility('hidden');
    document.dispatchEvent(new Event('visibilitychange'));
    expect(onHidden).toHaveBeenCalledTimes(1);
    expect(onResume).not.toHaveBeenCalled();

    setVisibility('visible');
    document.dispatchEvent(new Event('visibilitychange'));
    expect(onResume).toHaveBeenCalledTimes(1);
  });

  it('resumes on a bfcache restore (pageshow persisted) but not on a fresh load', () => {
    const onResume = vi.fn();
    mountWith({ onResume });

    pageShow(false);
    expect(onResume).not.toHaveBeenCalled();

    pageShow(true);
    expect(onResume).toHaveBeenCalledTimes(1);
  });

  it('treats pagehide as the tab going away', () => {
    const onHidden = vi.fn();
    mountWith({ onHidden });

    window.dispatchEvent(new Event('pagehide'));
    expect(onHidden).toHaveBeenCalledTimes(1);
  });

  it('tolerates absent handlers', () => {
    mountWith({});

    expect(() => {
      document.dispatchEvent(new Event('visibilitychange'));
      pageShow(true);
      window.dispatchEvent(new Event('pagehide'));
    }).not.toThrow();
  });

  it('detaches its listeners on unmount', () => {
    const onResume = vi.fn();
    const onHidden = vi.fn();
    mountWith({ onResume, onHidden }).unmount();

    document.dispatchEvent(new Event('visibilitychange'));
    pageShow(true);
    window.dispatchEvent(new Event('pagehide'));
    expect(onResume).not.toHaveBeenCalled();
    expect(onHidden).not.toHaveBeenCalled();
  });
});

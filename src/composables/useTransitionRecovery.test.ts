import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { defineComponent, h, type Ref } from 'vue';

import { useTransitionRecovery } from './useTransitionRecovery';

const setVisible = (): void => {
  Object.defineProperty(document, 'visibilityState', { value: 'visible', configurable: true });
};

const mountWith = (): { key: () => number } => {
  let key: Ref<number>;
  mount(defineComponent({
    setup() {
      key = useTransitionRecovery();
      return () => h('div');
    },
  }));
  return { key: () => key.value };
};

const wedgeTransition = (): HTMLElement => {
  const el = document.createElement('div');
  el.className = 'page-leave-active';
  document.body.appendChild(el);
  return el;
};

describe('useTransitionRecovery', () => {
  beforeEach(setVisible);
  afterEach(() => document.querySelectorAll('.page-leave-active').forEach(el => el.remove()));

  it('bumps the remount key on resume when a page leave-transition is stuck', () => {
    const { key } = mountWith();
    wedgeTransition();

    document.dispatchEvent(new Event('visibilitychange'));
    expect(key()).toBe(1);
  });

  it('leaves the key untouched on resume when no transition is stuck', () => {
    const { key } = mountWith();

    document.dispatchEvent(new Event('visibilitychange'));
    expect(key()).toBe(0);
  });
});

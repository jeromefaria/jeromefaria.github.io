import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { createMemoryHistory, createRouter } from 'vue-router';

import type { ReleaseMeta as Meta } from '@/types/works';

import ReleaseMeta from './ReleaseMeta.vue';

const mountMeta = (meta: Meta) => {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/:pathMatch(.*)*', component: { template: '<div />' } }],
  });
  return mount(ReleaseMeta, { props: { meta }, global: { plugins: [router] } });
};

describe('ReleaseMeta', () => {
  it('opens a linked label in a new tab with a safe rel', () => {
    const wrapper = mountMeta({
      kind: 'music',
      mediums: ['Digital'],
      editions: [{ label: { text: 'Enough Records', url: 'https://enoughrecords.scene.org/' } }],
      year: 2004,
    });
    const anchor = wrapper.get('a');

    expect(anchor.attributes('href')).toBe('https://enoughrecords.scene.org/');
    expect(anchor.attributes('target')).toBe('_blank');
    expect(anchor.attributes('rel')).toBe('noopener noreferrer');
  });

  it('renders a plain-text label without an anchor', () => {
    const wrapper = mountMeta({ kind: 'music', mediums: ['Digital'], editions: [{ label: { text: 'BRØQN' } }], year: 2012 });

    expect(wrapper.find('a').exists()).toBe(false);
    expect(wrapper.text()).toContain('BRØQN');
  });

  it('wraps a compilation title in an emphasis element', () => {
    const wrapper = mountMeta({
      kind: 'compilation',
      compilation: { text: 'Dark Vault', url: 'https://example.com/dv' },
      mediums: ['MP3'],
      editions: [{ label: { text: 'Enough Records' } }],
      year: 2004,
    });

    expect(wrapper.get('em a').attributes('href')).toBe('https://example.com/dv');
  });
});

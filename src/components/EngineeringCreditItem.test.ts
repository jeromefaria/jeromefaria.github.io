import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { createMemoryHistory, createRouter } from 'vue-router';

import type { Release } from '@/types';

import EngineeringCreditItem from './EngineeringCreditItem.vue';

const router = createRouter({
  history: createMemoryHistory(),
  routes: [{ path: '/:pathMatch(.*)*', component: { template: '<div />' } }],
});

const mountCredit = (release: Release) =>
  mount(EngineeringCreditItem, { props: { release }, global: { plugins: [router] } });

const thirdParty: Release = {
  id: 'master-open',
  title: 'Open',
  externalUrl: 'https://casaamarela.bandcamp.com/album/open',
  meta: { kind: 'engineering', roles: ['mastering'], artist: { name: 'Hugo Calcio' }, editions: [], year: 2021 },
};

const ownRef: Release = {
  id: 'engineering-overlapse-xiii',
  worksRef: 'overlapse-xiii',
  title: 'Overlapse XIII',
  meta: { kind: 'engineering', roles: ['mixing', 'mastering'], editions: [{ label: { text: 'BRØQN' } }], year: 2025 },
};

describe('EngineeringCreditItem', () => {
  it('names the artist and links the title out for a third-party credit', () => {
    const wrapper = mountCredit(thirdParty);
    const title = wrapper.get('.release-title-link');

    expect(wrapper.get('strong').text()).toContain('Hugo Calcio');
    expect(title.text()).toContain('Open');
    expect(title.attributes('href')).toBe('https://casaamarela.bandcamp.com/album/open');
    expect(title.attributes('target')).toBe('_blank');
    expect(wrapper.get('.release-meta').text()).toContain('Mastering');
  });

  it('links back to the full entry with no artist for an own-release credit', () => {
    const wrapper = mountCredit(ownRef);
    const title = wrapper.get('.release-title-link');

    expect(wrapper.get('strong').text()).toBe('Overlapse XIII');
    expect(title.attributes('href')).toBe('/works/overlapse-xiii');
    expect(title.attributes('target')).toBeUndefined();
    expect(wrapper.get('.release-meta').text()).toContain('Mixing & Mastering');
  });
});

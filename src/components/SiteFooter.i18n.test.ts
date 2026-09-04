import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { createMemoryHistory, createRouter } from 'vue-router';

vi.mock('@/i18n/flag', () => ({ i18nEnabled: true }));

import { messages } from '@/i18n/messages';

import SiteFooter from './SiteFooter.vue';

const router = createRouter({
  history: createMemoryHistory(),
  routes: [{ path: '/:pathMatch(.*)*', component: { template: '<div />' } }],
});

describe('SiteFooter with i18n enabled', () => {
  it('renders the language switcher with its accessible label', async () => {
    const wrapper = mount(SiteFooter, { global: { plugins: [router] } });
    await router.isReady();

    const switcher = wrapper.get(`[aria-label="${messages.en.common.switchLanguageLabel}"]`);

    expect(switcher.text()).toBe(messages.en.common.switchLanguage);
    expect(switcher.attributes('href')).toBe('/pt');
  });
});

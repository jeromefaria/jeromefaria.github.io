import { describe, expect, it } from 'vitest';

import { navigation } from '@/data/navigation';
import { messages } from '@/i18n/messages';
import { mountView } from '@/test-support/viewHarness';

import NotFoundView from './NotFoundView.vue';

const enNavLabel = (labelKey: string): string =>
  messages.en.nav[labelKey.slice(4) as keyof typeof messages.en.nav];

describe('NotFoundView', () => {
  it('renders the not-found heading', async () => {
    const wrapper = await mountView(NotFoundView, '/nope');
    expect(wrapper.get('h1').text()).toBe('Page Not Found');
  });

  it('offers a Home link plus every nav destination', async () => {
    const wrapper = await mountView(NotFoundView, '/nope');
    const linkTexts = wrapper.findAll('.not-found-nav a').map(link => link.text());
    expect(linkTexts).toContain('Home');
    navigation.forEach(item => expect(linkTexts).toContain(enNavLabel(item.labelKey)));
  });
});

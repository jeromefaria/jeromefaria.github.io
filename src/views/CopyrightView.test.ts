import { describe, expect, it } from 'vitest';

import { copyrightContent } from '@/data/copyright';
import { mountView } from '@/test-support/viewHarness';

import CopyrightView from './CopyrightView.vue';

describe('CopyrightView', () => {
  it('renders every paragraph', async () => {
    const wrapper = await mountView(CopyrightView);
    expect(wrapper.findAll('.copyright__body')).toHaveLength(copyrightContent.paragraphs.length);
  });

  it('fills the {year} token with the current year as a range', async () => {
    const wrapper = await mountView(CopyrightView);
    const text = wrapper.get('.copyright').text();

    expect(text).toContain(`2004–${new Date().getFullYear()}`);
    expect(text).not.toContain('{year}');
  });

  it('renders the contact and GitHub links', async () => {
    const wrapper = await mountView(CopyrightView);
    const links = wrapper.findAll('.copyright__body a').map(anchor => anchor.attributes('href'));

    expect(links).toContain('/contact');
    expect(links).toContain('https://github.com/jeromefaria/jeromefaria.github.io');
  });

  it('prefixes internal links under /pt on a pt route', async () => {
    const wrapper = await mountView(CopyrightView, '/pt/copyright', { locale: 'pt' });
    const links = wrapper.findAll('.copyright__body a').map(anchor => anchor.attributes('href'));

    expect(links).toContain('/pt/contact');
  });

  it('routes the internal contact link through the router instead of reloading', async () => {
    const wrapper = await mountView(CopyrightView);
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });

    wrapper.get('a[href="/contact"]').element.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
  });
});

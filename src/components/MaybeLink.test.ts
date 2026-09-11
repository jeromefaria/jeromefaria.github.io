import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import MaybeLink from './MaybeLink.vue';

describe('MaybeLink', () => {
  it('renders an external link when an href is given', () => {
    const anchor = mount(MaybeLink, { props: { href: 'https://example.com' }, slots: { default: 'Casa Amarela' } }).get('a');

    expect(anchor.attributes('href')).toBe('https://example.com');
    expect(anchor.attributes('target')).toBe('_blank');
    expect(anchor.text()).toContain('Casa Amarela');
  });

  it('forwards fall-through attributes to the link', () => {
    const wrapper = mount(MaybeLink, { props: { href: 'https://example.com' }, attrs: { class: 'epk__link' }, slots: { default: 'x' } });

    expect(wrapper.get('a').classes()).toContain('epk__link');
  });

  it('renders plain text with no link when there is no href', () => {
    const wrapper = mount(MaybeLink, { slots: { default: 'Casa Amarela' } });

    expect(wrapper.find('a').exists()).toBe(false);
    expect(wrapper.text()).toBe('Casa Amarela');
  });
});

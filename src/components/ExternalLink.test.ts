import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import ExternalLink from './ExternalLink.vue';

const mountLink = (props: Record<string, unknown>, slot = 'Visit') =>
  mount(ExternalLink, { props: { href: 'https://example.com', ...props }, slots: { default: slot } });

describe('ExternalLink', () => {
  it('opens in a new tab with a safe rel', () => {
    const anchor = mountLink({}).get('a');

    expect(anchor.attributes('href')).toBe('https://example.com');
    expect(anchor.attributes('target')).toBe('_blank');
    expect(anchor.attributes('rel')).toBe('noopener noreferrer');
  });

  it('appends a visually-hidden new-tab cue by default', () => {
    const wrapper = mountLink({});

    expect(wrapper.get('a').text()).toContain('Visit');
    expect(wrapper.get('.visually-hidden').text()).toBe('(opens in a new tab)');
    expect(wrapper.get('a').attributes('aria-label')).toBeUndefined();
  });

  it('uses aria-label and omits the visible cue when one is given', () => {
    const wrapper = mountLink({ ariaLabel: 'Jane on Bandcamp (opens in a new tab)' }, 'Bandcamp');

    expect(wrapper.get('a').attributes('aria-label')).toBe('Jane on Bandcamp (opens in a new tab)');
    expect(wrapper.find('.visually-hidden').exists()).toBe(false);
  });
});

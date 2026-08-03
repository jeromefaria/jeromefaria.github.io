import { describe, expect, it } from 'vitest';

import { contactContent } from '@/data/contact';
import { mountView } from '@/test-support/viewHarness';

import ContactView from './ContactView.vue';

describe('ContactView', () => {
  it('posts to the configured form action', async () => {
    const wrapper = await mountView(ContactView);
    expect(wrapper.get('form.contact-form').attributes('action')).toBe(contactContent.form.action);
  });

  it('renders the name, email, subject and message fields', async () => {
    const wrapper = await mountView(ContactView);
    ['name', 'email', 'subject', 'message'].forEach(field => {
      expect(wrapper.find(`#${field}`).exists()).toBe(true);
    });
  });

  it('includes a hidden honeypot field for spam protection', async () => {
    const wrapper = await mountView(ContactView);
    const honeypot = wrapper.get('.contact-form__honeypot');
    expect(honeypot.attributes('tabindex')).toBe('-1');
    expect(honeypot.attributes('aria-label')).toBe('Leave this field empty');
  });

  it('shows the submit label from the content config', async () => {
    const wrapper = await mountView(ContactView);
    expect(wrapper.get('.contact-form__submit').text()).toBe(contactContent.form.submitText);
  });
});

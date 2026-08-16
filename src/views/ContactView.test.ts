import { flushPromises } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

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

  it('marks a required field invalid and exposes an announced error after blur', async () => {
    const wrapper = await mountView(ContactView);
    const name = wrapper.get('#name');

    expect(name.attributes('aria-invalid')).toBe('false');

    await name.trigger('blur');

    expect(name.attributes('aria-invalid')).toBe('true');
    expect(name.attributes('aria-describedby')).toBe('name-error');

    const error = wrapper.get('#name-error');
    expect(error.attributes('role')).toBe('alert');
    expect(error.text()).toBe('Name is required');
  });

  it('validates email and message on blur and accepts optional subject input', async () => {
    const wrapper = await mountView(ContactView);

    const email = wrapper.get('#email');
    await email.trigger('blur');
    expect(email.attributes('aria-invalid')).toBe('true');
    expect(wrapper.get('#email-error').text()).toBe('Email is required');

    const message = wrapper.get('#message');
    await message.trigger('blur');
    expect(message.attributes('aria-invalid')).toBe('true');
    expect(wrapper.get('#message-error').text()).toBe('Message is required');

    const subject = wrapper.get('#subject');
    await subject.setValue('Commission enquiry');
    expect((subject.element as HTMLInputElement).value).toBe('Commission enquiry');
  });

  it('shows the success message after a successful submit', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: true } as Response);
    const wrapper = await mountView(ContactView);

    await wrapper.get('#name').setValue('Jane');
    await wrapper.get('#email').setValue('jane@example.com');
    await wrapper.get('#message').setValue('Hello there, this is a message.');
    await wrapper.get('form.contact-form').trigger('submit');
    await flushPromises();

    expect(wrapper.find('.contact-success').exists()).toBe(true);
    fetchMock.mockRestore();
  });
});

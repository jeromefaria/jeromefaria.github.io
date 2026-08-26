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

  it('renders the inquiry selector and base fields', async () => {
    const wrapper = await mountView(ContactView);
    ['inquiry', 'name', 'email', 'message'].forEach(field => {
      expect(wrapper.find(`#${field}`).exists()).toBe(true);
    });
  });

  it('offers an option for every inquiry type', async () => {
    const wrapper = await mountView(ContactView);
    const values = wrapper.findAll('#inquiry option[value]:not([value=""])').map(option => option.attributes('value'));
    expect(values).toEqual(contactContent.form.inquiryTypes.map(type => type.id));
  });

  it('reveals adaptive fields and a blurb once a type is chosen', async () => {
    const wrapper = await mountView(ContactView);

    expect(wrapper.find('#eventVenue').exists()).toBe(false);
    expect(wrapper.find('.contact-form__blurb').exists()).toBe(false);

    await wrapper.get('#inquiry').setValue('booking');

    ['eventVenue', 'preferredDate', 'location'].forEach(field => {
      expect(wrapper.find(`#${field}`).exists()).toBe(true);
    });
    expect(wrapper.get('.contact-form__blurb').text()).toBe('For festivals, venues, and performance opportunities.');
  });

  it('swaps adaptive fields when the type changes', async () => {
    const wrapper = await mountView(ContactView);

    await wrapper.get('#inquiry').setValue('booking');
    expect(wrapper.find('#eventVenue').exists()).toBe(true);

    await wrapper.get('#inquiry').setValue('licensing');
    expect(wrapper.find('#eventVenue').exists()).toBe(false);
    expect(wrapper.find('#track').exists()).toBe(true);
  });

  it('carries the selected type label and a structured subject into hidden fields', async () => {
    const wrapper = await mountView(ContactView);

    await wrapper.get('#inquiry').setValue('booking');
    await wrapper.get('#name').setValue('Jane Roe');

    expect((wrapper.get('input[name="Inquiry"]').element as HTMLInputElement).value).toBe('Booking');

    const subject = (wrapper.get('input[name="_subject"]').element as HTMLInputElement).value;
    expect(subject).toContain('[Booking]');
    expect(subject).toContain('Jane Roe');
  });

  it('captures input for an adaptive field and validates it on blur', async () => {
    const wrapper = await mountView(ContactView);
    await wrapper.get('#inquiry').setValue('licensing');

    const track = wrapper.get('#track');
    await track.setValue('Overlapse');
    expect((track.element as HTMLInputElement).value).toBe('Overlapse');

    await track.setValue('');
    await track.trigger('blur');
    expect(wrapper.get('#track-error').text()).toBe('Track or release is required');
  });

  it('includes a hidden honeypot field for spam protection', async () => {
    const wrapper = await mountView(ContactView);
    const honeypot = wrapper.get('.contact-form__honeypot');
    expect(honeypot.attributes('tabindex')).toBe('-1');
    expect(honeypot.attributes('aria-label')).toBe('Leave this field empty');
  });

  it('marks required base fields with an indicator', async () => {
    const wrapper = await mountView(ContactView);
    ['inquiry', 'name', 'email', 'message'].forEach(field => {
      expect(wrapper.find(`label[for="${field}"] abbr`).exists()).toBe(true);
    });
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

  it('announces a required error for each base field on blur', async () => {
    const wrapper = await mountView(ContactView);

    await wrapper.get('#inquiry').trigger('blur');
    expect(wrapper.get('#inquiry-error').text()).toBe('Inquiry type is required');

    await wrapper.get('#email').trigger('blur');
    expect(wrapper.get('#email-error').text()).toBe('Email is required');

    await wrapper.get('#message').trigger('blur');
    expect(wrapper.get('#message-error').text()).toBe('Message is required');
  });

  it('shows the success message after a successful submit', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: true } as Response);
    const wrapper = await mountView(ContactView);

    await wrapper.get('#inquiry').setValue('other');
    await wrapper.get('#name').setValue('Jane');
    await wrapper.get('#email').setValue('jane@example.com');
    await wrapper.get('#message').setValue('Hello there, this is a message.');
    await wrapper.get('form.contact-form').trigger('submit');
    await flushPromises();

    expect(wrapper.find('.contact-success').exists()).toBe(true);
    fetchMock.mockRestore();
  });
});

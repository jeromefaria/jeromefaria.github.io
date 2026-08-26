import { flushPromises } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

import { contactContent } from '@/data/contact';
import { mountView } from '@/test-support/viewHarness';

import ContactView from './ContactView.vue';

vi.mock('@/composables/useTurnstile', () => ({
  useTurnstile: () => ({ execute: () => Promise.resolve('test-token') }),
}));

const fillValid = async (wrapper: Awaited<ReturnType<typeof mountView>>): Promise<void> => {
  await wrapper.get('#inquiry').setValue('other');
  await wrapper.get('#name').setValue('Jane');
  await wrapper.get('#email').setValue('jane@example.com');
  await wrapper.get('#message').setValue('Hello there.');
};

describe('ContactView', () => {
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
    await wrapper.get('#inquiry').setValue('booking');

    expect(wrapper.find('#eventVenue').exists()).toBe(true);
    expect(wrapper.get('.contact-form__blurb').text()).toBe('For festivals, venues, and performance opportunities.');
  });

  it('includes a hidden honeypot field', async () => {
    const wrapper = await mountView(ContactView);
    const honeypot = wrapper.get('.contact-form__honeypot');
    expect(honeypot.attributes('tabindex')).toBe('-1');
    expect(honeypot.attributes('aria-hidden')).toBe('true');
  });

  it('shows a privacy notice linking to the privacy page', async () => {
    const wrapper = await mountView(ContactView);
    const notice = wrapper.get('.contact-form__notice');
    expect(notice.text()).toContain('Cloudflare Turnstile');
    expect(notice.get('a').attributes('href')).toBe('/privacy');
  });

  it('announces a required error for each base field on blur', async () => {
    const wrapper = await mountView(ContactView);

    await wrapper.get('#inquiry').trigger('blur');
    expect(wrapper.get('#inquiry-error').text()).toBe('Inquiry type is required');

    await wrapper.get('#name').trigger('blur');
    expect(wrapper.get('#name-error').text()).toBe('Name is required');

    await wrapper.get('#email').trigger('blur');
    expect(wrapper.get('#email-error').text()).toBe('Email is required');

    await wrapper.get('#message').trigger('blur');
    expect(wrapper.get('#message-error').text()).toBe('Message is required');
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

  it('shows the success message after a successful submit', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: true } as Response);
    const wrapper = await mountView(ContactView);

    await fillValid(wrapper);
    await wrapper.get('form.contact-form').trigger('submit');
    await flushPromises();

    expect(wrapper.find('.contact-success').exists()).toBe(true);
    const payload = JSON.parse((fetchMock.mock.calls[0] as [string, RequestInit])[1].body as string);
    expect(payload.token).toBe('test-token');
    expect(payload.inquiry).toBe('Other');
    fetchMock.mockRestore();
  });

  it('surfaces the verification error on a 403', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: false, status: 403 } as Response);
    const wrapper = await mountView(ContactView);

    await fillValid(wrapper);
    await wrapper.get('form.contact-form').trigger('submit');
    await flushPromises();

    expect(wrapper.get('.contact-form__submit-error').text()).toContain('verify');
    fetchMock.mockRestore();
  });
});

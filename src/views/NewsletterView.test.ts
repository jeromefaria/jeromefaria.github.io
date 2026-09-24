import { flushPromises } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { mountView } from '@/test-support/viewHarness';

import NewsletterView from './NewsletterView.vue';

vi.mock('@/composables/useTurnstile', () => ({
  useTurnstile: () => ({ execute: () => Promise.resolve('test-token') }),
}));

const okResponse = (ok: boolean, status = 200): Response => ({ ok, status }) as Response;

describe('NewsletterView', () => {
  let fetchSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    fetchSpy = vi.spyOn(global, 'fetch');
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('renders the intro, email field, honeypot, and privacy notice', async () => {
    const wrapper = await mountView(NewsletterView, '/newsletter');

    expect(wrapper.find('.newsletter__intro').exists()).toBe(true);
    expect(wrapper.find('#newsletter-email').exists()).toBe(true);

    const honeypot = wrapper.get('.contact-form__honeypot');
    expect(honeypot.attributes('tabindex')).toBe('-1');
    expect(honeypot.attributes('aria-hidden')).toBe('true');

    const notice = wrapper.get('.contact-form__notice');
    expect(notice.text()).toContain('Cloudflare Turnstile');
    expect(notice.get('a').attributes('href')).toBe('/privacy');
  });

  it('announces a required error on blur of an empty email', async () => {
    const wrapper = await mountView(NewsletterView, '/newsletter');

    await wrapper.get('#newsletter-email').trigger('blur');

    expect(wrapper.get('#newsletter-email-error').text()).toBe('Email is required');
  });

  it('keeps the form when submitted with an empty email', async () => {
    const wrapper = await mountView(NewsletterView, '/newsletter');

    await wrapper.get('form').trigger('submit');
    await flushPromises();

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(wrapper.find('form').exists()).toBe(true);
    expect(wrapper.get('#newsletter-email-error').text()).toBe('Email is required');
  });

  it('subscribes with the email and honeypot, then shows the confirmation-pending state', async () => {
    fetchSpy.mockResolvedValue(okResponse(true));
    const wrapper = await mountView(NewsletterView, '/newsletter');

    await wrapper.get('.contact-form__honeypot').setValue('bot-trap');
    await wrapper.get('#newsletter-email').setValue('reader@example.com');
    await wrapper.get('form').trigger('submit');
    await flushPromises();

    const [url, init] = fetchSpy.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('https://contact.jeromefaria.workers.dev/newsletter/subscribe');
    expect(JSON.parse(init.body as string)).toEqual({
      token: 'test-token',
      email: 'reader@example.com',
      botField: 'bot-trap',
    });
    expect(wrapper.get('.contact-success').text()).toContain('Please confirm your subscription');
    expect(wrapper.find('form').exists()).toBe(false);
  });

  it('shows a submit error when the request fails', async () => {
    fetchSpy.mockResolvedValue(okResponse(false, 500));
    const wrapper = await mountView(NewsletterView, '/newsletter');

    await wrapper.get('#newsletter-email').setValue('reader@example.com');
    await wrapper.get('form').trigger('submit');
    await flushPromises();

    expect(wrapper.get('#newsletter-email-error').text()).toBe('Something went wrong. Please try again.');
    expect(wrapper.find('form').exists()).toBe(true);
  });

  it('confirms a subscription from the confirmed=1 redirect and hides the form', async () => {
    const wrapper = await mountView(NewsletterView, '/newsletter?confirmed=1');

    expect(wrapper.get('.newsletter__status').text()).toContain("You're subscribed");
    expect(wrapper.find('form').exists()).toBe(false);
  });

  it('replaces the lead paragraph with an error for an invalid confirmation link, keeping the form', async () => {
    const wrapper = await mountView(NewsletterView, '/newsletter?confirmed=0');

    const intro = wrapper.get('.newsletter__intro');
    expect(intro.classes()).toContain('newsletter__intro--error');
    expect(intro.text()).toContain('invalid');
    expect(wrapper.find('.newsletter__status').exists()).toBe(false);
    expect(wrapper.find('form').exists()).toBe(true);
  });

  it('confirms an unsubscribe from the unsubscribed=1 redirect and hides the form', async () => {
    const wrapper = await mountView(NewsletterView, '/newsletter?unsubscribed=1');

    expect(wrapper.get('.newsletter__status').text()).toContain('unsubscribed');
    expect(wrapper.find('form').exists()).toBe(false);
  });

  it('replaces the lead paragraph with an error for an invalid unsubscribe link, keeping the form', async () => {
    const wrapper = await mountView(NewsletterView, '/newsletter?unsubscribed=0');

    const intro = wrapper.get('.newsletter__intro');
    expect(intro.classes()).toContain('newsletter__intro--error');
    expect(intro.text()).toContain('invalid');
    expect(wrapper.find('form').exists()).toBe(true);
  });
});

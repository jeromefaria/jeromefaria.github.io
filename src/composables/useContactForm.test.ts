import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { type Component, defineComponent } from 'vue';

import type { ContactFormConfig } from '@/types/contact';

import { useContactForm } from './useContactForm';

const TEST_URL = 'https://contact.example.dev';

const CONFIG: ContactFormConfig = {
  action: TEST_URL,
  turnstileSiteKey: 'test-site-key',
  inquiry: { id: 'inquiry', label: 'Inquiry type', type: 'select', required: true, placeholder: 'Select one' },
  baseFields: {
    name: { id: 'name', label: 'Name', type: 'text', required: true },
    email: { id: 'email', label: 'Email', type: 'email', required: true },
    message: { id: 'message', label: 'Message', type: 'textarea', required: true },
  },
  inquiryTypes: [
    {
      id: 'booking',
      label: 'Booking',
      subjectPrefix: 'Booking',
      blurb: '',
      fields: [{ id: 'location', label: 'Location', type: 'text', required: false }],
    },
    {
      id: 'licensing',
      label: 'Licensing',
      subjectPrefix: 'Licensing',
      blurb: '',
      fields: [{ id: 'track', label: 'Track or release', type: 'text', required: true }],
    },
  ],
  submitText: 'Send',
};

const requestToken = vi.fn<() => Promise<string>>();

function createTestComponent(): Component {
  return defineComponent({
    setup() {
      const form = useContactForm(CONFIG, requestToken);
      return { ...form };
    },
    template: '<div></div>',
  });
}

const fillBaseFields = (vm: Record<string, Record<string, string>>): void => {
  vm.formData.name = 'John';
  vm.formData.email = 'test@example.com';
  vm.formData.message = 'Hello';
};

const submitEvent = (): Event => ({ preventDefault: vi.fn(), target: document.createElement('form') }) as unknown as Event;

describe('useContactForm', () => {
  let fetchSpy: ReturnType<typeof vi.spyOn>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    fetchSpy = vi.spyOn(global, 'fetch');
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    requestToken.mockReset();
    requestToken.mockResolvedValue('turnstile-token');
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('initializes every field empty, plus the honeypot', () => {
      const wrapper = mount(createTestComponent());

      expect(wrapper.vm.formData).toEqual({
        inquiry: '',
        name: '',
        email: '',
        message: '',
        location: '',
        track: '',
      });
      expect(wrapper.vm.botField).toBe('');
      expect(wrapper.vm.errorMessage).toBe('');
      expect(wrapper.vm.isFormValid).toBe(false);
    });
  });

  describe('validation', () => {
    it('requires an inquiry type alongside the base fields', () => {
      const wrapper = mount(createTestComponent());

      fillBaseFields(wrapper.vm);
      expect(wrapper.vm.isFormValid).toBe(false);

      wrapper.vm.formData.inquiry = 'booking';
      expect(wrapper.vm.isFormValid).toBe(true);
    });

    it('enforces a required adaptive field for the selected type', () => {
      const wrapper = mount(createTestComponent());

      fillBaseFields(wrapper.vm);
      wrapper.vm.formData.inquiry = 'licensing';
      expect(wrapper.vm.isFormValid).toBe(false);

      wrapper.vm.formData.track = 'Overlapse';
      expect(wrapper.vm.isFormValid).toBe(true);
    });
  });

  describe('errors', () => {
    it('surfaces a required-field message after blur and clears it once filled', async () => {
      const wrapper = mount(createTestComponent());

      wrapper.vm.handleBlur('name');
      expect(wrapper.vm.errors.name).toBe('Name is required');

      wrapper.vm.formData.name = 'John';
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.errors.name).toBe('');
    });

    it('handleInput clears both the success flag and the submit error', () => {
      const wrapper = mount(createTestComponent());

      wrapper.vm.showSuccess = true;
      wrapper.vm.errorMessage = 'boom';
      wrapper.vm.handleInput();

      expect(wrapper.vm.showSuccess).toBe(false);
      expect(wrapper.vm.errorMessage).toBe('');
    });
  });

  describe('resetForm', () => {
    it('clears every field, the honeypot, and touched flags', () => {
      const wrapper = mount(createTestComponent());

      wrapper.vm.formData.inquiry = 'booking';
      fillBaseFields(wrapper.vm);
      wrapper.vm.botField = 'spam';
      wrapper.vm.touched.name = true;

      wrapper.vm.resetForm();

      expect(wrapper.vm.formData.name).toBe('');
      expect(wrapper.vm.botField).toBe('');
      expect(wrapper.vm.touched.name).toBe(false);
    });
  });

  describe('handleSubmit', () => {
    const validFor = (wrapper: ReturnType<typeof mount>, type = 'booking'): void => {
      wrapper.vm.formData.inquiry = type;
      fillBaseFields(wrapper.vm);
    };

    it('requests a token, posts a structured JSON payload, and shows success', async () => {
      const wrapper = mount(createTestComponent());
      fetchSpy.mockResolvedValueOnce({ ok: true } as Response);

      validFor(wrapper, 'booking');
      wrapper.vm.formData.location = 'Lisbon';
      wrapper.vm.botField = '';
      await wrapper.vm.handleSubmit(submitEvent());

      expect(requestToken).toHaveBeenCalledOnce();
      const [url, init] = fetchSpy.mock.calls[0] as [string, RequestInit];
      expect(url).toBe(TEST_URL);
      expect(init.method).toBe('POST');
      const payload = JSON.parse(init.body as string);
      expect(payload).toMatchObject({
        token: 'turnstile-token',
        inquiry: 'Booking',
        name: 'John',
        email: 'test@example.com',
        message: 'Hello',
        botField: '',
      });
      expect(payload.fields).toEqual([{ label: 'Location', value: 'Lisbon' }]);
      expect(wrapper.vm.showSuccess).toBe(true);
      expect(wrapper.vm.formData.name).toBe('');
    });

    it('omits blank adaptive fields from the payload', async () => {
      const wrapper = mount(createTestComponent());
      fetchSpy.mockResolvedValueOnce({ ok: true } as Response);

      validFor(wrapper, 'booking');
      await wrapper.vm.handleSubmit(submitEvent());

      const payload = JSON.parse((fetchSpy.mock.calls[0] as [string, RequestInit])[1].body as string);
      expect(payload.fields).toEqual([]);
    });

    it('does nothing when the form is invalid', async () => {
      const wrapper = mount(createTestComponent());

      await wrapper.vm.handleSubmit(submitEvent());

      expect(requestToken).not.toHaveBeenCalled();
      expect(fetchSpy).not.toHaveBeenCalled();
    });

    it('reveals every required error and returns the first invalid id on an incomplete submit', async () => {
      const wrapper = mount(createTestComponent());

      const focusId = await wrapper.vm.handleSubmit(submitEvent());

      expect(focusId).toBe('inquiry');
      expect(wrapper.vm.touched.inquiry).toBe(true);
      expect(wrapper.vm.touched.name).toBe(true);
      expect(wrapper.vm.errors.inquiry).toContain('required');
    });

    it('shows the verification error on a 403', async () => {
      const wrapper = mount(createTestComponent());
      fetchSpy.mockResolvedValueOnce({ ok: false, status: 403 } as Response);

      validFor(wrapper);
      await wrapper.vm.handleSubmit(submitEvent());

      expect(wrapper.vm.errorMessage).toContain('verify');
      expect(wrapper.vm.showSuccess).toBe(false);
    });

    it('shows the generic error on any other non-ok response', async () => {
      const wrapper = mount(createTestComponent());
      fetchSpy.mockResolvedValueOnce({ ok: false, status: 502 } as Response);

      validFor(wrapper);
      await wrapper.vm.handleSubmit(submitEvent());

      expect(wrapper.vm.errorMessage).toContain('went wrong');
    });

    it('shows the generic error and logs when the token request rejects', async () => {
      const wrapper = mount(createTestComponent());
      const error = new Error('Turnstile is not ready');
      requestToken.mockRejectedValueOnce(error);

      validFor(wrapper);
      await wrapper.vm.handleSubmit(submitEvent());

      expect(fetchSpy).not.toHaveBeenCalled();
      expect(wrapper.vm.errorMessage).toContain('went wrong');
      expect(consoleErrorSpy).toHaveBeenCalledWith('Contact submission error:', error);
    });

    it('shows the generic error and logs when the fetch rejects', async () => {
      const wrapper = mount(createTestComponent());
      const error = new Error('Network error');
      fetchSpy.mockRejectedValueOnce(error);

      validFor(wrapper);
      await wrapper.vm.handleSubmit(submitEvent());

      expect(wrapper.vm.errorMessage).toContain('went wrong');
      expect(consoleErrorSpy).toHaveBeenCalledWith('Contact submission error:', error);
    });

    it('toggles isSubmitting around the request', async () => {
      const wrapper = mount(createTestComponent());
      fetchSpy.mockResolvedValueOnce({ ok: true } as Response);

      validFor(wrapper);
      const pending = wrapper.vm.handleSubmit(submitEvent());
      expect(wrapper.vm.isSubmitting).toBe(true);

      await pending;
      expect(wrapper.vm.isSubmitting).toBe(false);
    });
  });
});

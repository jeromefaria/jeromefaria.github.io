import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { type Component, defineComponent } from 'vue';

import type { ContactFormConfig } from '@/types/contact';

import { useContactForm } from './useContactForm';

const TEST_URL = 'https://example.com/submit';

const CONFIG: ContactFormConfig = {
  action: TEST_URL,
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
      fields: [{ id: 'eventVenue', label: 'Event or venue', type: 'text', required: false }],
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

function createTestComponent(): Component {
  return defineComponent({
    setup() {
      const form = useContactForm(CONFIG);
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

const createMockForm = (): HTMLFormElement => {
  const form = document.createElement('form');
  ['name', 'email', 'message'].forEach(field => {
    const input = document.createElement('input');
    input.name = field;
    input.value = 'value';
    form.appendChild(input);
  });

  return form;
};

const submitEvent = (target: EventTarget): Event =>
  ({ preventDefault: vi.fn(), target }) as unknown as Event;

describe('useContactForm', () => {
  let fetchSpy: ReturnType<typeof vi.spyOn>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    fetchSpy = vi.spyOn(global, 'fetch');
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('initializes every field empty, including adaptive ones', () => {
      const wrapper = mount(createTestComponent());

      expect(wrapper.vm.formData).toEqual({
        inquiry: '',
        name: '',
        email: '',
        message: '',
        eventVenue: '',
        track: '',
      });
    });

    it('initializes with no touched fields, is not submitting, and is invalid', () => {
      const wrapper = mount(createTestComponent());

      expect(Object.values(wrapper.vm.touched).every(flag => flag === false)).toBe(true);
      expect(wrapper.vm.isSubmitting).toBe(false);
      expect(wrapper.vm.showSuccess).toBe(false);
      expect(wrapper.vm.isFormValid).toBe(false);
      expect(wrapper.vm.selectedType).toBeNull();
    });
  });

  describe('inquiry selection', () => {
    it('resolves the selected inquiry type', () => {
      const wrapper = mount(createTestComponent());

      wrapper.vm.formData.inquiry = 'booking';

      expect(wrapper.vm.selectedType?.id).toBe('booking');
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

    it('does not require optional adaptive fields', () => {
      const wrapper = mount(createTestComponent());

      fillBaseFields(wrapper.vm);
      wrapper.vm.formData.inquiry = 'booking';

      expect(wrapper.vm.isFormValid).toBe(true);
    });

    it('rejects whitespace-only values', () => {
      const wrapper = mount(createTestComponent());

      wrapper.vm.formData.inquiry = 'booking';
      wrapper.vm.formData.name = '   ';
      wrapper.vm.formData.email = '  ';
      wrapper.vm.formData.message = '   ';

      expect(wrapper.vm.isFormValid).toBe(false);
    });
  });

  describe('touched state and errors', () => {
    it('tracks touched only after blur and surfaces an error for empty required fields', () => {
      const wrapper = mount(createTestComponent());

      expect(wrapper.vm.fieldInvalid.name).toBe(false);

      wrapper.vm.handleBlur('name');

      expect(wrapper.vm.touched.name).toBe(true);
      expect(wrapper.vm.fieldInvalid.name).toBe(true);
      expect(wrapper.vm.errors.name).toBe('Name is required');
    });

    it('clears the error once the field is filled', async () => {
      const wrapper = mount(createTestComponent());

      wrapper.vm.handleBlur('email');
      expect(wrapper.vm.errors.email).toBe('Email is required');

      wrapper.vm.formData.email = 'a@b.com';
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.errors.email).toBe('');
    });

    it('surfaces errors for a required adaptive field', () => {
      const wrapper = mount(createTestComponent());

      wrapper.vm.formData.inquiry = 'licensing';
      wrapper.vm.handleBlur('track');

      expect(wrapper.vm.errors.track).toBe('Track or release is required');
    });
  });

  describe('handleInput and resetForm', () => {
    it('hides the success message when the user types', () => {
      const wrapper = mount(createTestComponent());

      wrapper.vm.showSuccess = true;
      wrapper.vm.handleInput();

      expect(wrapper.vm.showSuccess).toBe(false);
    });

    it('resets every field value and touched flag', () => {
      const wrapper = mount(createTestComponent());

      wrapper.vm.formData.inquiry = 'booking';
      fillBaseFields(wrapper.vm);
      wrapper.vm.formData.eventVenue = 'Festival';
      wrapper.vm.touched.name = true;

      wrapper.vm.resetForm();

      expect(wrapper.vm.formData).toEqual({
        inquiry: '',
        name: '',
        email: '',
        message: '',
        eventVenue: '',
        track: '',
      });
      expect(Object.values(wrapper.vm.touched).every(flag => flag === false)).toBe(true);
    });
  });

  describe('handleSubmit', () => {
    it('posts to the configured action and shows success on ok', async () => {
      const wrapper = mount(createTestComponent());
      fetchSpy.mockResolvedValueOnce({ ok: true } as Response);

      fillBaseFields(wrapper.vm);
      await wrapper.vm.handleSubmit(submitEvent(createMockForm()));

      expect(fetchSpy).toHaveBeenCalledWith(TEST_URL, {
        method: 'POST',
        body: expect.any(FormData),
        headers: { 'Accept': 'application/json' },
      });
      expect(wrapper.vm.showSuccess).toBe(true);
      expect(wrapper.vm.formData.name).toBe('');
      expect(wrapper.vm.isSubmitting).toBe(false);
    });

    it('toggles isSubmitting during the request', async () => {
      const wrapper = mount(createTestComponent());
      fetchSpy.mockResolvedValueOnce({ ok: true } as Response);

      const pending = wrapper.vm.handleSubmit(submitEvent(createMockForm()));
      expect(wrapper.vm.isSubmitting).toBe(true);

      await pending;
      expect(wrapper.vm.isSubmitting).toBe(false);
    });

    it('falls back to native submission on a non-ok response', async () => {
      const wrapper = mount(createTestComponent());
      fetchSpy.mockResolvedValueOnce({ ok: false, status: 400 } as Response);

      const form = createMockForm();
      const submitSpy = vi.spyOn(form, 'submit').mockImplementation(() => {});

      await wrapper.vm.handleSubmit(submitEvent(form));

      expect(submitSpy).toHaveBeenCalled();
      expect(wrapper.vm.showSuccess).toBe(false);
    });

    it('logs and falls back to native submission on a fetch error', async () => {
      const wrapper = mount(createTestComponent());
      const error = new Error('Network error');
      fetchSpy.mockRejectedValueOnce(error);

      const form = createMockForm();
      const submitSpy = vi.spyOn(form, 'submit').mockImplementation(() => {});

      await wrapper.vm.handleSubmit(submitEvent(form));

      expect(consoleErrorSpy).toHaveBeenCalledWith('Form submission error:', error);
      expect(submitSpy).toHaveBeenCalled();
    });

    it('prevents the default submission', async () => {
      const wrapper = mount(createTestComponent());
      fetchSpy.mockResolvedValueOnce({ ok: true } as Response);

      const event = submitEvent(createMockForm());
      await wrapper.vm.handleSubmit(event);

      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('ignores a submit whose target is not a form', async () => {
      const wrapper = mount(createTestComponent());

      await wrapper.vm.handleSubmit(submitEvent(document.createElement('div')));

      expect(fetchSpy).not.toHaveBeenCalled();
      expect(wrapper.vm.isSubmitting).toBe(false);
    });
  });
});

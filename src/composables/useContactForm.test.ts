import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { type Component, defineComponent } from 'vue';

import { useContactForm } from './useContactForm';

/**
 * Create a test component that uses the useContactForm composable
 */
function createTestComponent(submitUrl: string): Component {
  return defineComponent({
    setup() {
      const form = useContactForm(submitUrl);
      return { ...form };
    },
    template: '<div></div>',
  });
}

describe('useContactForm', () => {
  const TEST_URL = 'https://example.com/submit';
  let fetchSpy: ReturnType<typeof vi.spyOn>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    fetchSpy = vi.spyOn(global, 'fetch');
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('should initialize with empty form data', () => {
      const wrapper = mount(createTestComponent(TEST_URL));

      expect(wrapper.vm.formData).toEqual({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    });

    it('should initialize with no touched fields', () => {
      const wrapper = mount(createTestComponent(TEST_URL));

      expect(wrapper.vm.touched).toEqual({
        name: false,
        email: false,
        message: false,
      });
    });

    it('should initialize with isSubmitting as false', () => {
      const wrapper = mount(createTestComponent(TEST_URL));

      expect(wrapper.vm.isSubmitting).toBe(false);
    });

    it('should initialize with showSuccess as false', () => {
      const wrapper = mount(createTestComponent(TEST_URL));

      expect(wrapper.vm.showSuccess).toBe(false);
    });

    it('should initialize as invalid when empty', () => {
      const wrapper = mount(createTestComponent(TEST_URL));

      expect(wrapper.vm.isFormValid).toBe(false);
    });
  });

  describe('field validation', () => {
    it('should validate name as required', () => {
      const wrapper = mount(createTestComponent(TEST_URL));

      wrapper.vm.formData.email = 'test@example.com';
      wrapper.vm.formData.message = 'Hello';

      expect(wrapper.vm.isFormValid).toBe(false);

      wrapper.vm.formData.name = 'John';
      expect(wrapper.vm.isFormValid).toBe(true);
    });

    it('should validate email as required', () => {
      const wrapper = mount(createTestComponent(TEST_URL));

      wrapper.vm.formData.name = 'John';
      wrapper.vm.formData.message = 'Hello';

      expect(wrapper.vm.isFormValid).toBe(false);

      wrapper.vm.formData.email = 'test@example.com';
      expect(wrapper.vm.isFormValid).toBe(true);
    });

    it('should validate message as required', () => {
      const wrapper = mount(createTestComponent(TEST_URL));

      wrapper.vm.formData.name = 'John';
      wrapper.vm.formData.email = 'test@example.com';

      expect(wrapper.vm.isFormValid).toBe(false);

      wrapper.vm.formData.message = 'Hello';
      expect(wrapper.vm.isFormValid).toBe(true);
    });

    it('should reject whitespace-only values', () => {
      const wrapper = mount(createTestComponent(TEST_URL));

      wrapper.vm.formData.name = '   ';
      wrapper.vm.formData.email = '  ';
      wrapper.vm.formData.message = '   ';

      expect(wrapper.vm.isFormValid).toBe(false);
    });

    it('should not require subject field', () => {
      const wrapper = mount(createTestComponent(TEST_URL));

      wrapper.vm.formData.name = 'John';
      wrapper.vm.formData.email = 'test@example.com';
      wrapper.vm.formData.message = 'Hello';
      // subject is empty

      expect(wrapper.vm.isFormValid).toBe(true);
    });
  });

  describe('touched state', () => {
    it('should track touched state for name field', () => {
      const wrapper = mount(createTestComponent(TEST_URL));

      expect(wrapper.vm.touched.name).toBe(false);

      wrapper.vm.handleBlur('name');

      expect(wrapper.vm.touched.name).toBe(true);
    });

    it('should track touched state for email field', () => {
      const wrapper = mount(createTestComponent(TEST_URL));

      expect(wrapper.vm.touched.email).toBe(false);

      wrapper.vm.handleBlur('email');

      expect(wrapper.vm.touched.email).toBe(true);
    });

    it('should track touched state for message field', () => {
      const wrapper = mount(createTestComponent(TEST_URL));

      expect(wrapper.vm.touched.message).toBe(false);

      wrapper.vm.handleBlur('message');

      expect(wrapper.vm.touched.message).toBe(true);
    });
  });

  describe('field validation errors', () => {
    it('should only show errors for touched fields', () => {
      const wrapper = mount(createTestComponent(TEST_URL));

      // Empty form, but not touched
      expect(wrapper.vm.fieldInvalid.name).toBe(false);
      expect(wrapper.vm.fieldInvalid.email).toBe(false);
      expect(wrapper.vm.fieldInvalid.message).toBe(false);

      // Touch name field
      wrapper.vm.handleBlur('name');

      expect(wrapper.vm.fieldInvalid.name).toBe(true);
      expect(wrapper.vm.fieldInvalid.email).toBe(false);
      expect(wrapper.vm.fieldInvalid.message).toBe(false);
    });

    it('should clear errors when field has valid value', () => {
      const wrapper = mount(createTestComponent(TEST_URL));

      wrapper.vm.handleBlur('name');
      expect(wrapper.vm.fieldInvalid.name).toBe(true);

      wrapper.vm.formData.name = 'John';
      expect(wrapper.vm.fieldInvalid.name).toBe(false);
    });

    it('should not show errors for touched fields with values', () => {
      const wrapper = mount(createTestComponent(TEST_URL));

      // Set values
      wrapper.vm.formData.email = 'test@example.com';
      wrapper.vm.formData.message = 'Test message';

      // Touch fields
      wrapper.vm.handleBlur('email');
      wrapper.vm.handleBlur('message');

      // Should not show errors because fields have values
      expect(wrapper.vm.fieldInvalid.email).toBe(false);
      expect(wrapper.vm.fieldInvalid.message).toBe(false);
    });
  });

  describe('handleInput', () => {
    it('should hide success message when user types', () => {
      const wrapper = mount(createTestComponent(TEST_URL));

      wrapper.vm.showSuccess = true;
      wrapper.vm.handleInput();

      expect(wrapper.vm.showSuccess).toBe(false);
    });
  });

  describe('resetForm', () => {
    it('should reset form data to empty values', () => {
      const wrapper = mount(createTestComponent(TEST_URL));

      wrapper.vm.formData.name = 'John';
      wrapper.vm.formData.email = 'test@example.com';
      wrapper.vm.formData.subject = 'Inquiry';
      wrapper.vm.formData.message = 'Hello';

      wrapper.vm.resetForm();

      expect(wrapper.vm.formData).toEqual({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    });

    it('should reset touched state', () => {
      const wrapper = mount(createTestComponent(TEST_URL));

      wrapper.vm.touched.name = true;
      wrapper.vm.touched.email = true;
      wrapper.vm.touched.message = true;

      wrapper.vm.resetForm();

      expect(wrapper.vm.touched).toEqual({
        name: false,
        email: false,
        message: false,
      });
    });
  });

  describe('handleSubmit - successful submission', () => {
    // Helper to create a proper form element with inputs
    const createMockForm = () => {
      const form = document.createElement('form');
      const nameInput = document.createElement('input');
      nameInput.name = 'name';
      nameInput.value = 'John';
      const emailInput = document.createElement('input');
      emailInput.name = 'email';
      emailInput.value = 'test@example.com';
      const messageTextarea = document.createElement('textarea');
      messageTextarea.name = 'message';
      messageTextarea.value = 'Hello';
      form.appendChild(nameInput);
      form.appendChild(emailInput);
      form.appendChild(messageTextarea);
      return form;
    };

    it('should set isSubmitting to true during submission', async () => {
      const wrapper = mount(createTestComponent(TEST_URL));

      fetchSpy.mockResolvedValueOnce({
        ok: true,
      } as Response);

      const form = createMockForm();
      const mockEvent = {
        preventDefault: vi.fn(),
        target: form,
      } as unknown as Event;

      const submitPromise = wrapper.vm.handleSubmit(mockEvent);

      expect(wrapper.vm.isSubmitting).toBe(true);

      await submitPromise;

      expect(wrapper.vm.isSubmitting).toBe(false);
    });

    it('should call fetch with correct parameters', async () => {
      const wrapper = mount(createTestComponent(TEST_URL));

      fetchSpy.mockResolvedValueOnce({
        ok: true,
      } as Response);

      const form = createMockForm();
      const mockEvent = {
        preventDefault: vi.fn(),
        target: form,
      } as unknown as Event;

      await wrapper.vm.handleSubmit(mockEvent);

      expect(fetchSpy).toHaveBeenCalledWith(TEST_URL, {
        method: 'POST',
        body: expect.any(FormData),
        headers: {
          'Accept': 'application/json',
        },
      });
    });

    it('should show success message after successful submission', async () => {
      const wrapper = mount(createTestComponent(TEST_URL));

      fetchSpy.mockResolvedValueOnce({
        ok: true,
      } as Response);

      const form = createMockForm();
      const mockEvent = {
        preventDefault: vi.fn(),
        target: form,
      } as unknown as Event;

      await wrapper.vm.handleSubmit(mockEvent);

      expect(wrapper.vm.showSuccess).toBe(true);
    });

    it('should reset form after successful submission', async () => {
      const wrapper = mount(createTestComponent(TEST_URL));

      wrapper.vm.formData.name = 'John';
      wrapper.vm.formData.email = 'test@example.com';
      wrapper.vm.formData.message = 'Hello';

      fetchSpy.mockResolvedValueOnce({
        ok: true,
      } as Response);

      const form = createMockForm();
      const mockEvent = {
        preventDefault: vi.fn(),
        target: form,
      } as unknown as Event;

      await wrapper.vm.handleSubmit(mockEvent);

      expect(wrapper.vm.formData).toEqual({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    });
  });

  describe('handleSubmit - error handling', () => {
    // Helper to create a proper form element with inputs
    const createMockForm = () => {
      const form = document.createElement('form');
      const nameInput = document.createElement('input');
      nameInput.name = 'name';
      nameInput.value = 'John';
      const emailInput = document.createElement('input');
      emailInput.name = 'email';
      emailInput.value = 'test@example.com';
      const messageTextarea = document.createElement('textarea');
      messageTextarea.name = 'message';
      messageTextarea.value = 'Hello';
      form.appendChild(nameInput);
      form.appendChild(emailInput);
      form.appendChild(messageTextarea);
      return form;
    };

    it('should fall back to native form submission on non-ok response', async () => {
      const wrapper = mount(createTestComponent(TEST_URL));

      fetchSpy.mockResolvedValueOnce({
        ok: false,
        status: 400,
      } as Response);

      const mockForm = createMockForm();
      const submitSpy = vi.spyOn(mockForm, 'submit').mockImplementation(() => {});

      const mockEvent = {
        preventDefault: vi.fn(),
        target: mockForm,
      } as unknown as Event;

      await wrapper.vm.handleSubmit(mockEvent);

      expect(submitSpy).toHaveBeenCalled();
      expect(wrapper.vm.isSubmitting).toBe(false);
      expect(wrapper.vm.showSuccess).toBe(false);
    });

    it('should fall back to native form submission on fetch error', async () => {
      const wrapper = mount(createTestComponent(TEST_URL));

      fetchSpy.mockRejectedValueOnce(new Error('Network error'));

      const mockForm = createMockForm();
      const submitSpy = vi.spyOn(mockForm, 'submit').mockImplementation(() => {});

      const mockEvent = {
        preventDefault: vi.fn(),
        target: mockForm,
      } as unknown as Event;

      await wrapper.vm.handleSubmit(mockEvent);

      expect(submitSpy).toHaveBeenCalled();
      expect(wrapper.vm.isSubmitting).toBe(false);
      expect(wrapper.vm.showSuccess).toBe(false);
    });

    it('should log error to console on fetch failure', async () => {
      const wrapper = mount(createTestComponent(TEST_URL));

      const error = new Error('Network error');
      fetchSpy.mockRejectedValueOnce(error);

      const mockForm = createMockForm();
      vi.spyOn(mockForm, 'submit').mockImplementation(() => {});

      const mockEvent = {
        preventDefault: vi.fn(),
        target: mockForm,
      } as unknown as Event;

      await wrapper.vm.handleSubmit(mockEvent);

      expect(consoleErrorSpy).toHaveBeenCalledWith('Form submission error:', error);
    });

    it('should prevent default form submission', async () => {
      const wrapper = mount(createTestComponent(TEST_URL));

      fetchSpy.mockResolvedValueOnce({
        ok: true,
      } as Response);

      const mockForm = createMockForm();
      const mockEvent = {
        preventDefault: vi.fn(),
        target: mockForm,
      } as unknown as Event;

      await wrapper.vm.handleSubmit(mockEvent);

      expect(mockEvent.preventDefault).toHaveBeenCalled();
    });
  });
});

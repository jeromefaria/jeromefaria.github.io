import type { ComputedRef, Ref } from 'vue';
import { computed, ref } from 'vue';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormState {
  name: boolean;
  email: boolean;
  message: boolean;
}

interface UseContactFormReturn {
  formData: Ref<FormData>;
  touched: Ref<FormState>;
  isSubmitting: Ref<boolean>;
  showSuccess: Ref<boolean>;
  isFormValid: ComputedRef<boolean>;
  fieldInvalid: ComputedRef<FormState>;
  handleBlur: (field: keyof FormState) => void;
  handleInput: () => void;
  handleSubmit: (event: Event) => Promise<void>;
  resetForm: () => void;
}

/**
 * Contact form state and validation logic
 * @param submitUrl - URL to submit the form to
 * @returns Form state, validation, and handlers
 */
export const useContactForm = (submitUrl: string): UseContactFormReturn => {
  // Form state
  const formData = ref<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const touched = ref<FormState>({
    name: false,
    email: false,
    message: false,
  });

  const isSubmitting = ref(false);
  const showSuccess = ref(false);

  // Validation
  const isFormValid = computed(() => {
    return (
      formData.value.name.trim() !== '' &&
      formData.value.email.trim() !== '' &&
      formData.value.message.trim() !== ''
    );
  });

  const fieldInvalid = computed<FormState>(() => ({
    name: touched.value.name && formData.value.name.trim() === '',
    email: touched.value.email && formData.value.email.trim() === '',
    message: touched.value.message && formData.value.message.trim() === '',
  }));

  // Handlers
  const handleBlur = (field: keyof FormState): void => {
    touched.value[field] = true;
  };

  const handleInput = (): void => {
    showSuccess.value = false;
  };

  const resetForm = (): void => {
    formData.value = {
      name: '',
      email: '',
      subject: '',
      message: '',
    };
    touched.value = {
      name: false,
      email: false,
      message: false,
    };
  };

  const handleSubmit = async (event: Event): Promise<void> => {
    event.preventDefault();
    isSubmitting.value = true;

    const form = event.target as HTMLFormElement;
    const formDataToSend = new FormData(form);

    try {
      const response = await fetch(submitUrl, {
        method: 'POST',
        body: formDataToSend,
        headers: {
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        showSuccess.value = true;
        resetForm();
        isSubmitting.value = false;
      } else {
        // If response not ok, use regular form submission
        isSubmitting.value = false;
        form.submit();
      }
    } catch (error) {
      // If fetch fails (CORS, network error), fall back to regular form submission
      console.error('Form submission error:', error);
      isSubmitting.value = false;
      form.submit();
    }
  };

  return {
    // State
    formData,
    touched,
    isSubmitting,
    showSuccess,
    // Validation
    isFormValid,
    fieldInvalid,
    // Handlers
    handleBlur,
    handleInput,
    handleSubmit,
    resetForm,
  };
};

import type { ComputedRef, Ref } from 'vue';
import { computed, ref } from 'vue';

// The validated fields, in one place — everything below is derived from this.
const REQUIRED_FIELDS = ['name', 'email', 'message'] as const;
type RequiredField = (typeof REQUIRED_FIELDS)[number];

const FIELD_LABELS: Record<RequiredField, string> = { name: 'Name', email: 'Email', message: 'Message' };

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

type FieldFlags = Record<RequiredField, boolean>;

// Build a record keyed by every required field (populates all keys, hence the cast).
const byField = <T>(valueFor: (field: RequiredField) => T): Record<RequiredField, T> =>
  Object.fromEntries(REQUIRED_FIELDS.map(field => [field, valueFor(field)])) as Record<RequiredField, T>;

const emptyFormData = (): FormData => ({ name: '', email: '', subject: '', message: '' });

interface UseContactFormReturn {
  formData: Ref<FormData>;
  touched: Ref<FieldFlags>;
  isSubmitting: Ref<boolean>;
  showSuccess: Ref<boolean>;
  isFormValid: ComputedRef<boolean>;
  fieldInvalid: ComputedRef<FieldFlags>;
  errors: ComputedRef<Record<RequiredField, string>>;
  handleBlur: (field: RequiredField) => void;
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
  const formData = ref<FormData>(emptyFormData());
  const touched = ref<FieldFlags>(byField(() => false));

  const isSubmitting = ref(false);
  const showSuccess = ref(false);

  const isFormValid = computed(() =>
    REQUIRED_FIELDS.every(field => formData.value[field].trim() !== ''));

  const fieldInvalid = computed<FieldFlags>(() =>
    byField(field => touched.value[field] && formData.value[field].trim() === ''));

  const errors = computed<Record<RequiredField, string>>(() =>
    byField(field => (fieldInvalid.value[field] ? `${FIELD_LABELS[field]} is required` : '')));

  const handleBlur = (field: RequiredField): void => {
    touched.value[field] = true;
  };

  const handleInput = (): void => {
    showSuccess.value = false;
  };

  const resetForm = (): void => {
    formData.value = emptyFormData();
    touched.value = byField(() => false);
  };

  const handleSubmit = async (event: Event): Promise<void> => {
    event.preventDefault();

    const form = event.target;
    if (!(form instanceof HTMLFormElement)) return;

    isSubmitting.value = true;
    const formDataToSend = new FormData(form);

    // Progressive enhancement: POST via fetch, falling back to a native form
    // submission on a non-2xx response or a network/CORS failure.
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
        return;
      }
      form.submit();
    } catch (error) {
      console.error('Form submission error:', error);
      form.submit();
    } finally {
      isSubmitting.value = false;
    }
  };

  return {
    formData,
    touched,
    isSubmitting,
    showSuccess,
    isFormValid,
    fieldInvalid,
    errors,
    handleBlur,
    handleInput,
    handleSubmit,
    resetForm,
  };
};

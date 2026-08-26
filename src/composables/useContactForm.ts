import type { ComputedRef, Ref } from 'vue';
import { computed, reactive, ref } from 'vue';

import type { ContactField, ContactFormConfig, InquiryType } from '@/types/contact';

type StringMap = Record<string, string>;
type FlagMap = Record<string, boolean>;

const SUBMIT_ERROR = 'Something went wrong sending your message. Please try again.';
const VERIFY_ERROR = 'Could not verify you are human. Please try again.';

const collectFields = (form: ContactFormConfig): ContactField[] => [
  form.inquiry,
  form.baseFields.name,
  form.baseFields.email,
  form.baseFields.message,
  ...form.inquiryTypes.flatMap(type => type.fields),
];

const uniqueFields = (fields: ContactField[]): ContactField[] => {
  const seen = new Set<string>();

  return fields.filter(field => (seen.has(field.id) ? false : seen.add(field.id)));
};

interface ContactPayload {
  token: string;
  inquiry: string;
  name: string;
  email: string;
  message: string;
  fields: { label: string; value: string }[];
  botField: string;
}

interface UseContactFormReturn {
  formData: StringMap;
  touched: FlagMap;
  botField: Ref<string>;
  isSubmitting: Ref<boolean>;
  showSuccess: Ref<boolean>;
  errorMessage: Ref<string>;
  selectedType: ComputedRef<InquiryType | null>;
  isFormValid: ComputedRef<boolean>;
  fieldInvalid: ComputedRef<FlagMap>;
  errors: ComputedRef<StringMap>;
  handleBlur: (id: string) => void;
  handleInput: () => void;
  handleSubmit: (event: Event) => Promise<void>;
  resetForm: () => void;
}

export const useContactForm = (
  form: ContactFormConfig,
  requestToken: () => Promise<string>,
): UseContactFormReturn => {
  const fields = uniqueFields(collectFields(form));
  const labelById = new Map(fields.map(field => [field.id, field.label]));

  const emptyState = <T>(value: T): Record<string, T> =>
    Object.fromEntries(fields.map(field => [field.id, value]));

  const formData = reactive<StringMap>(emptyState(''));
  const touched = reactive<FlagMap>(emptyState(false));

  const botField = ref('');
  const isSubmitting = ref(false);
  const showSuccess = ref(false);
  const errorMessage = ref('');

  const selectedType = computed<InquiryType | null>(() =>
    form.inquiryTypes.find(type => type.id === formData['inquiry']) ?? null);

  const requiredIds = computed<string[]>(() => {
    const base = [form.inquiry, form.baseFields.name, form.baseFields.email, form.baseFields.message]
      .filter(field => field.required)
      .map(field => field.id);

    const adaptive = (selectedType.value?.fields ?? []).filter(field => field.required).map(field => field.id);

    return [...base, ...adaptive];
  });

  const isEmpty = (id: string): boolean => (formData[id] ?? '').trim() === '';

  const isFormValid = computed(() => requiredIds.value.every(id => !isEmpty(id)));

  const fieldInvalid = computed<FlagMap>(() =>
    Object.fromEntries(requiredIds.value.map(id => [id, Boolean(touched[id]) && isEmpty(id)])));

  const errors = computed<StringMap>(() =>
    Object.fromEntries(
      requiredIds.value.map(id => [id, fieldInvalid.value[id] ? `${labelById.get(id)} is required` : '']),
    ));

  const handleBlur = (id: string): void => {
    touched[id] = true;
  };

  const handleInput = (): void => {
    showSuccess.value = false;
    errorMessage.value = '';
  };

  const resetForm = (): void => {
    fields.forEach(field => {
      formData[field.id] = '';
      touched[field.id] = false;
    });
    botField.value = '';
  };

  const buildPayload = (token: string): ContactPayload => ({
    token,
    inquiry: selectedType.value?.label ?? '',
    name: formData['name'] ?? '',
    email: formData['email'] ?? '',
    message: formData['message'] ?? '',
    fields: (selectedType.value?.fields ?? [])
      .map(field => ({ label: field.label, value: formData[field.id] ?? '' }))
      .filter(entry => entry.value.trim() !== ''),
    botField: botField.value,
  });

  const handleSubmit = async (event: Event): Promise<void> => {
    event.preventDefault();
    if (!isFormValid.value || isSubmitting.value) return;

    isSubmitting.value = true;
    errorMessage.value = '';

    try {
      const token = await requestToken();
      const response = await fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildPayload(token)),
      });

      if (response.ok) {
        showSuccess.value = true;
        resetForm();
        return;
      }

      errorMessage.value = response.status === 403 ? VERIFY_ERROR : SUBMIT_ERROR;
    } catch (error) {
      console.error('Contact submission error:', error);
      errorMessage.value = SUBMIT_ERROR;
    } finally {
      isSubmitting.value = false;
    }
  };

  return {
    formData,
    touched,
    botField,
    isSubmitting,
    showSuccess,
    errorMessage,
    selectedType,
    isFormValid,
    fieldInvalid,
    errors,
    handleBlur,
    handleInput,
    handleSubmit,
    resetForm,
  };
};

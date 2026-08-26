import type { ComputedRef, Ref } from 'vue';
import { computed, reactive, ref } from 'vue';

import type { ContactField, ContactFormConfig, InquiryType } from '@/types/contact';

type StringMap = Record<string, string>;
type FlagMap = Record<string, boolean>;

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

interface UseContactFormReturn {
  formData: StringMap;
  touched: FlagMap;
  isSubmitting: Ref<boolean>;
  showSuccess: Ref<boolean>;
  selectedType: ComputedRef<InquiryType | null>;
  isFormValid: ComputedRef<boolean>;
  fieldInvalid: ComputedRef<FlagMap>;
  errors: ComputedRef<StringMap>;
  handleBlur: (id: string) => void;
  handleInput: () => void;
  handleSubmit: (event: Event) => Promise<void>;
  resetForm: () => void;
}

export const useContactForm = (form: ContactFormConfig): UseContactFormReturn => {
  const fields = uniqueFields(collectFields(form));
  const labelById = new Map(fields.map(field => [field.id, field.label]));

  const emptyState = <T>(value: T): Record<string, T> =>
    Object.fromEntries(fields.map(field => [field.id, value]));

  const formData = reactive<StringMap>(emptyState(''));
  const touched = reactive<FlagMap>(emptyState(false));

  const isSubmitting = ref(false);
  const showSuccess = ref(false);

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
  };

  const resetForm = (): void => {
    fields.forEach(field => {
      formData[field.id] = '';
      touched[field.id] = false;
    });
  };

  const handleSubmit = async (event: Event): Promise<void> => {
    event.preventDefault();

    const formElement = event.target;
    if (!(formElement instanceof HTMLFormElement)) return;

    isSubmitting.value = true;

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(formElement),
        headers: {
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        showSuccess.value = true;
        resetForm();
        return;
      }
      formElement.submit();
    } catch (error) {
      console.error('Form submission error:', error);
      formElement.submit();
    } finally {
      isSubmitting.value = false;
    }
  };

  return {
    formData,
    touched,
    isSubmitting,
    showSuccess,
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

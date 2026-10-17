import type { ComputedRef, Ref } from 'vue';
import { computed, reactive } from 'vue';

import { useFormSubmit } from '@/composables/useFormSubmit';
import { useT } from '@/i18n/useT';
import type { ContactField, ContactFormConfig, InquiryType } from '@/types/contact';
import { buildContactPayload } from '@/utils/buildContactPayload';

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
  handleSubmit: (event: Event) => Promise<string | undefined>;
  resetForm: () => void;
}

export const useContactForm = (
  form: ContactFormConfig,
  requestToken: () => Promise<string>,
): UseContactFormReturn => {
  const t = useT();
  const fields = uniqueFields(collectFields(form));

  const inquiryId = form.inquiry.id;
  const nameId = form.baseFields.name.id;
  const emailId = form.baseFields.email.id;
  const messageId = form.baseFields.message.id;

  const requiredFieldLabelKey = (id: string): string => {
    if (id === inquiryId) return 'contact.inquiryLabel';
    if (id === nameId) return 'contact.name';
    if (id === emailId) return 'contact.email';
    if (id === messageId) return 'contact.message';
    return `contact.fields.${id}.label`;
  };

  const emptyState = <T>(value: T): Record<string, T> =>
    Object.fromEntries(fields.map(field => [field.id, value]));

  const formData = reactive<StringMap>(emptyState(''));
  const touched = reactive<FlagMap>(emptyState(false));

  const { botField, isSubmitting, showSuccess, errorMessage, handleInput, submit } = useFormSubmit({
    action: form.action,
    requestToken,
    name: 'Contact',
  });

  const selectedType = computed<InquiryType | null>(() =>
    form.inquiryTypes.find(type => type.id === formData[inquiryId]) ?? null);

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
      requiredIds.value.map(id => [id, fieldInvalid.value[id] ? t('contact.requiredError', { field: t(requiredFieldLabelKey(id)) }) : '']),
    ));

  const handleBlur = (id: string): void => {
    touched[id] = true;
  };

  const resetForm = (): void => {
    fields.forEach(field => {
      formData[field.id] = '';
      touched[field.id] = false;
    });
    botField.value = '';
  };

  const buildPayload = (token: string) =>
    buildContactPayload(form, formData, selectedType.value, token, botField.value);

  const handleSubmit = async (event: Event): Promise<string | undefined> => {
    event.preventDefault();
    if (isSubmitting.value) return undefined;

    if (!isFormValid.value) {
      requiredIds.value.forEach(id => {
        touched[id] = true;
      });

      return requiredIds.value.find(id => isEmpty(id));
    }

    await submit(buildPayload, resetForm);
    return undefined;
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

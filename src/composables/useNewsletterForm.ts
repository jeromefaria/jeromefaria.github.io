import type { ComputedRef, Ref } from 'vue';
import { computed, ref } from 'vue';

import { useFormSubmit } from '@/composables/useFormSubmit';
import { useT } from '@/i18n/useT';

interface UseNewsletterFormReturn {
  email: Ref<string>;
  botField: Ref<string>;
  isSubmitting: Ref<boolean>;
  showSuccess: Ref<boolean>;
  errorMessage: Ref<string>;
  touched: Ref<boolean>;
  invalid: ComputedRef<boolean>;
  error: ComputedRef<string>;
  handleBlur: () => void;
  handleInput: () => void;
  handleSubmit: (event: Event) => Promise<boolean>;
}

export const useNewsletterForm = (
  action: string,
  requestToken: () => Promise<string>,
): UseNewsletterFormReturn => {
  const t = useT();

  const { botField, isSubmitting, showSuccess, errorMessage, handleInput, submit } = useFormSubmit({
    action,
    requestToken,
    name: 'Newsletter',
  });

  const email = ref('');
  const touched = ref(false);

  const isEmpty = computed(() => email.value.trim() === '');
  const invalid = computed(() => touched.value && isEmpty.value);
  const error = computed(() => (invalid.value ? t('newsletter.requiredError') : ''));

  const handleBlur = (): void => {
    touched.value = true;
  };

  const handleSubmit = async (event: Event): Promise<boolean> => {
    event.preventDefault();
    if (isSubmitting.value) return false;

    touched.value = true;
    if (isEmpty.value) return false;

    await submit(
      token => ({ token, email: email.value.trim(), botField: botField.value }),
      () => {
        email.value = '';
        botField.value = '';
        touched.value = false;
      },
    );

    return true;
  };

  return {
    email,
    botField,
    isSubmitting,
    showSuccess,
    errorMessage,
    touched,
    invalid,
    error,
    handleBlur,
    handleInput,
    handleSubmit,
  };
};

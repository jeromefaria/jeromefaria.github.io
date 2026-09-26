import type { ComputedRef, Ref } from 'vue';
import { computed, ref } from 'vue';

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

  const email = ref('');
  const botField = ref('');
  const isSubmitting = ref(false);
  const showSuccess = ref(false);
  const errorMessage = ref('');
  const touched = ref(false);

  const isEmpty = computed(() => email.value.trim() === '');
  const invalid = computed(() => touched.value && isEmpty.value);
  const error = computed(() => (invalid.value ? t('newsletter.requiredError') : ''));

  const handleBlur = (): void => {
    touched.value = true;
  };

  const handleInput = (): void => {
    showSuccess.value = false;
    errorMessage.value = '';
  };

  const handleSubmit = async (event: Event): Promise<boolean> => {
    event.preventDefault();
    if (isSubmitting.value) return false;

    touched.value = true;
    if (isEmpty.value) return false;

    isSubmitting.value = true;
    errorMessage.value = '';

    try {
      const token = await requestToken();
      const response = await fetch(action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, email: email.value.trim(), botField: botField.value }),
      });

      if (response.ok) {
        showSuccess.value = true;
        email.value = '';
        botField.value = '';
        touched.value = false;
        return true;
      }

      errorMessage.value = t(response.status === 403 ? 'newsletter.verifyError' : 'newsletter.submitError');
    } catch (submissionError) {
      console.error('Newsletter submission error:', submissionError);
      errorMessage.value = t('newsletter.submitError');
    } finally {
      isSubmitting.value = false;
    }

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

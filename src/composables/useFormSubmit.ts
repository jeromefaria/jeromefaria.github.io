import type { Ref } from 'vue';
import { ref } from 'vue';

import { useT } from '@/i18n/useT';

interface FormSubmitOptions {
  action: string;
  requestToken: () => Promise<string>;
  name: string;
}

interface UseFormSubmitReturn {
  botField: Ref<string>;
  isSubmitting: Ref<boolean>;
  showSuccess: Ref<boolean>;
  errorMessage: Ref<string>;
  handleInput: () => void;
  submit: (buildBody: (token: string) => unknown, onSuccess: () => void) => Promise<void>;
}

export const useFormSubmit = ({ action, requestToken, name }: FormSubmitOptions): UseFormSubmitReturn => {
  const t = useT();
  const errorKeyPrefix = name.toLowerCase();
  const logLabel = `${name} submission error:`;

  const botField = ref('');
  const isSubmitting = ref(false);
  const showSuccess = ref(false);
  const errorMessage = ref('');

  const handleInput = (): void => {
    showSuccess.value = false;
    errorMessage.value = '';
  };

  const submit = async (buildBody: (token: string) => unknown, onSuccess: () => void): Promise<void> => {
    isSubmitting.value = true;
    errorMessage.value = '';

    try {
      const token = await requestToken();
      const response = await fetch(action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildBody(token)),
      });

      if (response.ok) {
        showSuccess.value = true;
        onSuccess();
        return;
      }

      errorMessage.value = t(response.status === 403 ? `${errorKeyPrefix}.verifyError` : `${errorKeyPrefix}.submitError`);
    } catch (error) {
      console.error(logLabel, error);
      errorMessage.value = t(`${errorKeyPrefix}.submitError`);
    } finally {
      isSubmitting.value = false;
    }
  };

  return { botField, isSubmitting, showSuccess, errorMessage, handleInput, submit };
};

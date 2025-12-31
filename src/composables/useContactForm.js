import { computed, ref } from 'vue';

/**
 * Contact form state and validation logic
 * @param {string} submitUrl - URL to submit the form to
 * @returns {Object} Form state, validation, and handlers
 */
export const useContactForm = submitUrl => {
  // Form state
  const formData = ref({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const touched = ref({
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

  const fieldInvalid = computed(() => ({
    name: touched.value.name && formData.value.name.trim() === '',
    email: touched.value.email && formData.value.email.trim() === '',
    message: touched.value.message && formData.value.message.trim() === '',
  }));

  // Handlers
  const handleBlur = field => {
    touched.value[field] = true;
  };

  const handleInput = () => {
    showSuccess.value = false;
  };

  const resetForm = () => {
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

  const handleSubmit = async event => {
    event.preventDefault();
    isSubmitting.value = true;

    const form = event.target;
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

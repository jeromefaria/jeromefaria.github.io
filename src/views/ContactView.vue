<script setup>
import { computed, ref } from 'vue';
import { usePageHead } from '@/composables/usePageHead';
import { contactContent } from '@/data/contact';
import { siteConfig } from '@/data/navigation';

const contactSchema = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  mainEntity: {
    '@type': 'Person',
    name: siteConfig.author.name,
    email: siteConfig.author.email,
    url: siteConfig.url,
  },
};

usePageHead({
  title: 'Contact',
  description: 'Get in touch with Jerome Faria for commissions, collaborations, performance bookings, and general inquiries.',
  schema: contactSchema,
});

// Form state
const formData = ref({
  name: '',
  email: '',
  subject: '',
  message: '',
});

const isSubmitting = ref(false);
const showSuccess = ref(false);

// Check if all required fields are filled
const isFormValid = computed(() => {
  return (
    formData.value.name.trim() !== '' &&
    formData.value.email.trim() !== '' &&
    formData.value.message.trim() !== ''
  );
});

// Clear success message when user starts typing again
const handleInput = () => {
  showSuccess.value = false;
};

const handleSubmit = async event => {
  event.preventDefault();
  isSubmitting.value = true;

  const form = event.target;
  const formDataToSend = new FormData(form);

  try {
    const response = await fetch(contactContent.form.action, {
      method: 'POST',
      body: formDataToSend,
      headers: {
        'Accept': 'application/json',
      },
    });

    if (response.ok) {
      showSuccess.value = true;
      formData.value = {
        name: '',
        email: '',
        subject: '',
        message: '',
      };
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
</script>

<template>
  <div class="container-wide">
    <article
      class="page"
      data-page="contact"
    >
      <!-- Introduction -->
      <div
        v-show="!showSuccess"
        class="contact-intro"
        v-html="contactContent.intro"
      />

      <!-- Success Message -->
      <div
        v-if="showSuccess"
        class="contact-success"
        role="alert"
      >
        <h2>{{ contactContent.successMessage.title }}</h2>
        <p>{{ contactContent.successMessage.text }}</p>
      </div>

      <!-- Contact Form -->
      <form
        v-show="!showSuccess"
        :action="contactContent.form.action"
        method="POST"
        class="contact-form"
        @submit="handleSubmit"
      >
        <!-- FormSubmit Configuration Fields -->
        <input
          type="hidden"
          name="_subject"
          value="Contact Form Submission"
        >
        <input
          type="hidden"
          name="_captcha"
          value="false"
        >
        <input
          type="text"
          name="_honey"
          class="contact-form__honeypot"
          tabindex="-1"
          autocomplete="off"
          aria-label="Leave this field empty"
        >

        <!-- Name Field -->
        <div class="contact-form__field">
          <label
            for="name"
            class="contact-form__label"
          >
            {{ contactContent.form.fields.name.label }}
            <abbr
              v-if="contactContent.form.fields.name.required"
              title="Required"
            >*</abbr>
          </label>
          <input
            id="name"
            v-model="formData.name"
            type="text"
            name="name"
            class="contact-form__input"
            :autocomplete="contactContent.form.fields.name.autocomplete"
            :required="contactContent.form.fields.name.required"
            @input="handleInput"
          >
        </div>

        <!-- Email Field -->
        <div class="contact-form__field">
          <label
            for="email"
            class="contact-form__label"
          >
            {{ contactContent.form.fields.email.label }}
            <abbr
              v-if="contactContent.form.fields.email.required"
              title="Required"
            >*</abbr>
          </label>
          <input
            id="email"
            v-model="formData.email"
            type="email"
            name="email"
            class="contact-form__input"
            :autocomplete="contactContent.form.fields.email.autocomplete"
            :required="contactContent.form.fields.email.required"
            @input="handleInput"
          >
          <!-- FormSubmit: use email as reply-to -->
          <input
            type="hidden"
            name="_replyto"
            :value="formData.email"
          >
        </div>

        <!-- Subject Field -->
        <div class="contact-form__field">
          <label
            for="subject"
            class="contact-form__label"
          >
            {{ contactContent.form.fields.subject.label }}
          </label>
          <input
            id="subject"
            v-model="formData.subject"
            type="text"
            name="subject"
            class="contact-form__input"
            :autocomplete="contactContent.form.fields.subject.autocomplete"
            @input="handleInput"
          >
        </div>

        <!-- Message Field -->
        <div class="contact-form__field">
          <label
            for="message"
            class="contact-form__label"
          >
            {{ contactContent.form.fields.message.label }}
            <abbr
              v-if="contactContent.form.fields.message.required"
              title="Required"
            >*</abbr>
          </label>
          <textarea
            id="message"
            v-model="formData.message"
            name="message"
            class="contact-form__textarea"
            :rows="contactContent.form.fields.message.rows"
            :required="contactContent.form.fields.message.required"
            @input="handleInput"
          />
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :class="['contact-form__submit', { 'contact-form__submit--valid': isFormValid }]"
          :disabled="isSubmitting"
        >
          {{ isSubmitting ? 'Sending...' : contactContent.form.submitText }}
        </button>
      </form>
    </article>
  </div>
</template>

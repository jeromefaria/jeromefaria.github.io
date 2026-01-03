<script setup lang="ts">
import { useContactForm } from '@/composables/useContactForm';
import { usePageHead } from '@/composables/usePageHead';
import { contactContent } from '@/data/contact';
import { siteConfig } from '@/data/navigation';
import { FORM_SUBMIT } from '@/utils/constants';

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

const { formData, isSubmitting, showSuccess, isFormValid, fieldInvalid, handleBlur, handleInput, handleSubmit } =
  useContactForm(contactContent.form.action);
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
          :name="FORM_SUBMIT.SUBJECT"
          value="Contact Form Submission"
        >
        <input
          type="hidden"
          :name="FORM_SUBMIT.CAPTCHA"
          value="false"
        >
        <input
          type="text"
          :name="FORM_SUBMIT.HONEYPOT"
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
            :class="['contact-form__input', { 'contact-form__input--invalid': fieldInvalid.name }]"
            :autocomplete="contactContent.form.fields.name.autocomplete"
            :required="contactContent.form.fields.name.required"
            @input="handleInput"
            @blur="handleBlur('name')"
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
            :class="['contact-form__input', { 'contact-form__input--invalid': fieldInvalid.email }]"
            :autocomplete="contactContent.form.fields.email.autocomplete"
            :required="contactContent.form.fields.email.required"
            @input="handleInput"
            @blur="handleBlur('email')"
          >
          <!-- FormSubmit: use email as reply-to -->
          <input
            type="hidden"
            :name="FORM_SUBMIT.REPLY_TO"
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
            :class="['contact-form__textarea', { 'contact-form__textarea--invalid': fieldInvalid.message }]"
            :rows="contactContent.form.fields.message.rows"
            :required="contactContent.form.fields.message.required"
            @input="handleInput"
            @blur="handleBlur('message')"
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

<script setup lang="ts">
import { computed, ref } from 'vue';
import { RouterLink } from 'vue-router';

import FormField from '@/components/FormField.vue';
import PageShell from '@/components/PageShell.vue';
import { useContactForm } from '@/composables/useContactForm';
import { usePageHead } from '@/composables/usePageHead';
import { useTurnstile } from '@/composables/useTurnstile';
import { contactContent } from '@/data/contact';
import { pageMeta } from '@/data/pageMeta';
import { useLocalized } from '@/i18n/localized';
import { useLocale } from '@/i18n/useLocale';
import { useT } from '@/i18n/useT';
import { createContactPageSchema } from '@/utils/pageSchemas';

const t = useT();
const localize = useLocalized();
const { toLocalePath } = useLocale();

usePageHead({
  ...pageMeta.contact,
  schema: createContactPageSchema(),
});

const { form } = contactContent;

const turnstileContainer = ref<HTMLElement | null>(null);

const { execute } = useTurnstile(form.turnstileSiteKey, turnstileContainer);

const { formData, botField, isSubmitting, showSuccess, errorMessage, selectedType, isFormValid, fieldInvalid, errors, handleBlur, handleInput, handleSubmit } =
  useContactForm(form, execute);

const inquiryOptions = computed(() =>
  form.inquiryTypes.map(type => ({ value: type.id, label: t(`contact.types.${type.id}.label`) })));
</script>

<template>
  <div class="container-wide">
    <PageShell
      data-page="contact"
      :title="localize(pageMeta.contact.title)"
    >
      <div
        v-if="showSuccess"
        class="contact-success"
        role="alert"
      >
        <h2>{{ t('contact.success.title') }}</h2>
        <p>{{ t('contact.success.text') }}</p>
      </div>

      <form
        v-show="!showSuccess"
        class="contact-form"
        novalidate
        @submit="handleSubmit"
      >
        <input
          v-model="botField"
          type="text"
          name="contact-nickname"
          class="contact-form__honeypot"
          tabindex="-1"
          autocomplete="off"
          aria-hidden="true"
        >

        <FormField
          id="inquiry"
          type="select"
          :model-value="formData['inquiry'] ?? ''"
          :label="t('contact.inquiryLabel')"
          :placeholder="t('contact.inquiryPlaceholder')"
          :options="inquiryOptions"
          :required="form.inquiry.required"
          :invalid="fieldInvalid['inquiry']"
          :error="errors['inquiry']"
          @update:model-value="value => (formData['inquiry'] = value)"
          @input="handleInput"
          @blur="handleBlur('inquiry')"
        />

        <p
          v-if="selectedType"
          class="contact-form__blurb"
        >
          {{ t(`contact.types.${selectedType.id}.blurb`) }}
        </p>

        <FormField
          id="name"
          :model-value="formData['name'] ?? ''"
          :name="form.baseFields.name.label"
          :label="t('contact.name')"
          :required="form.baseFields.name.required"
          :autocomplete="form.baseFields.name.autocomplete"
          :invalid="fieldInvalid['name']"
          :error="errors['name']"
          @update:model-value="value => (formData['name'] = value)"
          @input="handleInput"
          @blur="handleBlur('name')"
        />

        <FormField
          id="email"
          type="email"
          :model-value="formData['email'] ?? ''"
          :name="form.baseFields.email.label"
          :label="t('contact.email')"
          :required="form.baseFields.email.required"
          :autocomplete="form.baseFields.email.autocomplete"
          :invalid="fieldInvalid['email']"
          :error="errors['email']"
          @update:model-value="value => (formData['email'] = value)"
          @input="handleInput"
          @blur="handleBlur('email')"
        />

        <FormField
          v-for="field in selectedType?.fields ?? []"
          :id="field.id"
          :key="field.id"
          :model-value="formData[field.id] ?? ''"
          :name="field.label"
          :label="t(`contact.fields.${field.id}.label`)"
          :placeholder="t(`contact.fields.${field.id}.placeholder`)"
          :required="field.required"
          :invalid="fieldInvalid[field.id]"
          :error="errors[field.id]"
          @update:model-value="value => (formData[field.id] = value)"
          @input="handleInput"
          @blur="handleBlur(field.id)"
        />

        <FormField
          id="message"
          type="textarea"
          :model-value="formData['message'] ?? ''"
          :name="form.baseFields.message.label"
          :label="t('contact.message')"
          :rows="form.baseFields.message.rows"
          :required="form.baseFields.message.required"
          :invalid="fieldInvalid['message']"
          :error="errors['message']"
          @update:model-value="value => (formData['message'] = value)"
          @input="handleInput"
          @blur="handleBlur('message')"
        />

        <div
          ref="turnstileContainer"
          class="contact-form__turnstile"
        />

        <p
          v-if="errorMessage"
          class="contact-form__submit-error"
          role="alert"
        >
          {{ errorMessage }}
        </p>

        <button
          type="submit"
          :class="['contact-form__submit', { 'contact-form__submit--valid': isFormValid }]"
          :disabled="isSubmitting"
        >
          {{ isSubmitting ? t('contact.sending') : t('contact.submit') }}
        </button>

        <p class="contact-form__notice">
          <span>{{ t('contact.turnstileNotice') }}</span>
          <span aria-hidden="true">·</span>
          <RouterLink :to="toLocalePath('/privacy')">
            {{ t('footer.privacy') }}
          </RouterLink>
        </p>
      </form>
    </PageShell>
  </div>
</template>

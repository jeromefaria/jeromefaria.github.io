<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';
import { RouterLink, useRoute } from 'vue-router';

import FormField from '@/components/FormField.vue';
import StaticPage from '@/components/StaticPage.vue';
import { useNewsletterForm } from '@/composables/useNewsletterForm';
import { useTurnstile } from '@/composables/useTurnstile';
import { newsletterContent } from '@/data/newsletter';
import { pageMeta } from '@/data/pageMeta';
import { useLocalized } from '@/i18n/localized';
import { useT } from '@/i18n/useT';

const t = useT();
const route = useRoute();
const { toLocalePath } = useLocalized();

const turnstileContainer = ref<HTMLElement | null>(null);
const { execute } = useTurnstile(newsletterContent.turnstileSiteKey, turnstileContainer);

const { email, botField, isSubmitting, showSuccess, errorMessage, invalid, error, handleBlur, handleInput, handleSubmit } =
  useNewsletterForm(newsletterContent.action, execute);

const finalNotice = computed<string | null>(() => {
  if (route.query['confirmed'] === '1') return t('newsletter.status.confirmed');
  if (route.query['unsubscribed'] === '1') return t('newsletter.status.unsubscribed');
  return null;
});

const blurbError = computed<string | null>(() => {
  if (route.query['confirmed'] === '0') return t('newsletter.status.confirmInvalid');
  if (route.query['unsubscribed'] === '0') return t('newsletter.status.unsubscribeInvalid');
  return null;
});

const hideForm = computed(() => showSuccess.value || finalNotice.value !== null);

const onSubmit = async (event: Event): Promise<void> => {
  const submitted = await handleSubmit(event);
  if (!submitted) {
    await nextTick();
    document.getElementById('newsletter-email')?.focus();
  }
};
</script>

<template>
  <StaticPage
    :head="pageMeta.newsletter"
    data-page="newsletter"
  >
    <p
      v-if="finalNotice"
      class="newsletter__status"
      role="alert"
    >
      {{ finalNotice }}
    </p>

    <div
      v-if="showSuccess"
      class="contact-success"
      role="alert"
    >
      <h2>{{ t('newsletter.success.title') }}</h2>
      <p>{{ t('newsletter.success.text') }}</p>
    </div>

    <template v-if="!hideForm">
      <p
        :class="['newsletter__intro', { 'newsletter__intro--error': blurbError }]"
        :role="blurbError ? 'alert' : undefined"
      >
        {{ blurbError ?? t('newsletter.intro') }}
      </p>

      <form
        class="contact-form"
        novalidate
        @submit="onSubmit"
      >
        <input
          v-model="botField"
          type="text"
          name="newsletter-nickname"
          class="contact-form__honeypot"
          tabindex="-1"
          autocomplete="off"
          aria-hidden="true"
        >

        <FormField
          id="newsletter-email"
          type="email"
          :model-value="email"
          :label="t('newsletter.email')"
          :required="true"
          autocomplete="email"
          :invalid="invalid"
          :error="error || errorMessage"
          @update:model-value="value => (email = value)"
          @input="handleInput"
          @blur="handleBlur"
        />

        <div
          ref="turnstileContainer"
          class="contact-form__turnstile"
        />

        <button
          type="submit"
          :class="['contact-form__submit', { 'contact-form__submit--valid': email.trim() !== '' }]"
          :disabled="isSubmitting"
        >
          {{ isSubmitting ? t('newsletter.sending') : t('newsletter.submit') }}
        </button>

        <p class="contact-form__notice">
          <span>{{ t('newsletter.turnstileNotice') }}</span>
          <span aria-hidden="true">·</span>
          <RouterLink :to="toLocalePath('/privacy')">
            {{ t('footer.privacy') }}
          </RouterLink>
        </p>
      </form>
    </template>
  </StaticPage>
</template>

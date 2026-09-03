<script setup lang="ts">
import { RouterLink } from 'vue-router';

import { navigation, siteConfig } from '@/data/navigation';
import { i18nEnabled } from '@/i18n/flag';
import { useLocale } from '@/i18n/useLocale';
import { useT } from '@/i18n/useT';

const t = useT();
const { toLocalePath, switchPath } = useLocale();
const currentYear = new Date().getFullYear();
</script>

<template>
  <footer>
    <div class="container">
      <div class="footer__content">
        <nav
          class="footer__nav"
          :aria-label="t('nav.footerLabel')"
        >
          <RouterLink
            v-for="nav in navigation"
            :key="nav.url"
            :to="toLocalePath(nav.url)"
          >
            {{ t(nav.labelKey) }}
          </RouterLink>
        </nav>
        <p class="footer__copyright">
          &copy; {{ currentYear }} <RouterLink :to="toLocalePath('/contact')">
            {{ siteConfig.author.name }}
          </RouterLink>
          •
          <RouterLink :to="toLocalePath('/privacy')">
            {{ t('footer.privacy') }}
          </RouterLink>
          •
          <RouterLink :to="toLocalePath('/colophon')">
            {{ t('footer.colophon') }}
          </RouterLink>
          <template v-if="i18nEnabled">
            •
            <RouterLink
              :to="switchPath"
              :aria-label="t('common.switchLanguageLabel')"
            >
              {{ t('common.switchLanguage') }}
            </RouterLink>
          </template>
        </p>
      </div>
    </div>
  </footer>
</template>

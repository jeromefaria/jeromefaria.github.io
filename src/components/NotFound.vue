<script setup lang="ts">
import { RouterLink } from 'vue-router';

import { usePageHead } from '@/composables/usePageHead';
import { navigation } from '@/data/navigation';
import { pageMeta } from '@/data/pageMeta';
import { useLocale } from '@/i18n/useLocale';
import { useT } from '@/i18n/useT';

const t = useT();
const { toLocalePath } = useLocale();

usePageHead({ ...pageMeta.notFound, noIndex: true });
</script>

<template>
  <div class="container-wide">
    <article class="page not-found">
      <h1>{{ t('notFound.heading') }}</h1>
      <p>{{ t('notFound.body') }}</p>
      <nav
        class="not-found-nav"
        :aria-label="t('notFound.navLabel')"
      >
        <p>{{ t('notFound.tryThese') }}</p>
        <ul>
          <li>
            <RouterLink :to="toLocalePath('/')">
              {{ t('palette.home') }}
            </RouterLink>
          </li>
          <li
            v-for="nav in navigation"
            :key="nav.url"
          >
            <RouterLink :to="toLocalePath(nav.url)">
              {{ t(nav.labelKey) }}
            </RouterLink>
          </li>
        </ul>
      </nav>
    </article>
  </div>
</template>

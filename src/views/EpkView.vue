<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';

import ExternalLink from '@/components/ExternalLink.vue';
import PressQuote from '@/components/PressQuote.vue';
import ResponsivePicture from '@/components/ResponsivePicture.vue';
import StaticPage from '@/components/StaticPage.vue';
import { epkManifest } from '@/data/epk';
import { pageMeta } from '@/data/pageMeta';
import { useLocalized } from '@/i18n/localized';
import { useT } from '@/i18n/useT';
import { epkPdfHref, epkRiderHref, epkZipHref, photoDownloadHref, resolveEpkContent } from '@/utils/epk';
import { externalizeLinks } from '@/utils/externalizeLinks';

const head = { ...pageMeta.epk, noIndex: true };

const t = useT();
const { localize, current, toLocalePath } = useLocalized();
const epk = computed(() => resolveEpkContent(epkManifest, current.value));
</script>

<template>
  <StaticPage
    :head="head"
    data-page="epk"
  >
    <section class="epk__section">
      <h2 class="epk__heading">
        {{ t('epk.shortBio') }}
      </h2>
      <div
        class="prose"
        v-html="externalizeLinks(epk.shortBio)"
      />
    </section>

    <section class="epk__section">
      <h2 class="epk__heading">
        {{ t('epk.download') }}
      </h2>
      <p class="media-links">
        <a
          class="link-discrete"
          :href="epkZipHref(current)"
          download
        >{{ t('epk.fullKit') }}</a>
        <span> | </span>
        <a
          class="link-discrete"
          :href="epkPdfHref(current)"
          download
        >{{ t('epk.oneSheet') }}</a>
        <span> | </span>
        <a
          class="link-discrete"
          :href="epkRiderHref(current)"
          download
        >{{ t('epk.rider') }}</a>
      </p>
    </section>

    <section class="epk__section">
      <h2 class="epk__heading">
        {{ t('epk.biography') }}
      </h2>
      <div
        class="prose"
        v-html="externalizeLinks(epk.longBio)"
      />
    </section>

    <section class="epk__section">
      <h2 class="epk__heading">
        {{ t('epk.photography') }}
      </h2>
      <div class="epk__photos">
        <figure
          v-for="(photo, index) in epk.photos"
          :key="photo.src"
          class="epk__photo"
        >
          <ResponsivePicture
            :src="photo.src"
            :alt="localize(photo.alt)"
          />
          <figcaption>
            <template v-if="photo.photographer">
              {{ t('epk.photo') }}:
              <ExternalLink
                v-if="photo.photographer.url"
                :href="photo.photographer.url"
              >
                {{ photo.photographer.name }}
              </ExternalLink>
              <template v-else>
                {{ photo.photographer.name }}
              </template>
              ·
            </template>
            <a
              :href="photoDownloadHref(photo, index)"
              download
            >
              {{ t('epk.download') }}
            </a>
          </figcaption>
        </figure>
      </div>
    </section>

    <section class="epk__section">
      <h2 class="epk__heading">
        {{ t('epk.selectedPerformances') }}
      </h2>
      <ul class="epk__list">
        <li
          v-for="highlight in epk.liveHighlights"
          :key="`${highlight.year}-${highlight.title}`"
          class="epk__list-item"
        >
          <span class="epk__year">{{ highlight.year }}</span>
          <span>
            <RouterLink
              class="epk__link"
              :to="toLocalePath(`/live#${highlight.id}`)"
            >{{ highlight.title }}</RouterLink> — {{ highlight.location }}
          </span>
        </li>
      </ul>
    </section>

    <section class="epk__section">
      <h2 class="epk__heading">
        {{ t('epk.selectedWorks') }}
      </h2>
      <ul class="epk__list">
        <li
          v-for="work in epk.workHighlights"
          :key="`${work.year}-${work.title}`"
          class="epk__list-item"
        >
          <span class="epk__year">{{ work.year }}</span>
          <span>
            <RouterLink
              class="epk__link"
              :to="toLocalePath(`/works#${work.id}`)"
            >{{ work.title }}</RouterLink>
          </span>
        </li>
      </ul>
    </section>

    <section class="epk__section">
      <h2 class="epk__heading">
        {{ t('epk.press') }}
      </h2>
      <PressQuote
        v-for="quote in epk.quotes"
        :key="quote.id"
        class="epk__quote"
        :quote="quote.quote"
        :source="quote.source"
        :url="quote.url"
      />
    </section>
  </StaticPage>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';

import ExternalLink from '@/components/ExternalLink.vue';
import PageShell from '@/components/PageShell.vue';
import { usePageHead } from '@/composables/usePageHead';
import { epkManifest } from '@/data/epk';
import { pageMeta } from '@/data/pageMeta';
import { epkPdfHref, epkRiderHref, epkZipHref, photoDownloadHref, resolveEpkContent } from '@/utils/epk';
import { externalizeLinks } from '@/utils/externalizeLinks';
import { responsiveSrcset, toWebp } from '@/utils/responsiveImage';

usePageHead({ ...pageMeta.epk, noIndex: true });

const epk = resolveEpkContent(epkManifest);
</script>

<template>
  <div class="container-wide">
    <PageShell
      data-page="epk"
      title="Press Kit"
    >
      <section class="epk__section">
        <h2 class="epk__heading">
          Short bio
        </h2>
        <div
          class="prose"
          v-html="externalizeLinks(epk.shortBio)"
        />
      </section>

      <section class="epk__section">
        <h2 class="epk__heading">
          Download
        </h2>
        <p class="media-links">
          <a
            class="link-discrete"
            :href="epkZipHref"
            download
          >Full press kit (ZIP)</a>
          <span> | </span>
          <a
            class="link-discrete"
            :href="epkPdfHref"
            download
          >One-sheet (PDF)</a>
          <span> | </span>
          <a
            class="link-discrete"
            :href="epkRiderHref"
            download
          >Technical rider (PDF)</a>
        </p>
      </section>

      <section class="epk__section">
        <h2 class="epk__heading">
          Biography
        </h2>
        <div
          class="prose"
          v-html="externalizeLinks(epk.longBio)"
        />
      </section>

      <section class="epk__section">
        <h2 class="epk__heading">
          Photography
        </h2>
        <div class="epk__photos">
          <figure
            v-for="(photo, index) in epk.photos"
            :key="photo.src"
            class="epk__photo"
          >
            <picture>
              <source
                v-if="responsiveSrcset(photo.src)"
                :srcset="responsiveSrcset(photo.src) ?? undefined"
                type="image/webp"
              >
              <source
                :srcset="toWebp(photo.src)"
                type="image/webp"
              >
              <img
                :src="photo.src"
                :alt="photo.alt"
                loading="lazy"
                decoding="async"
              >
            </picture>
            <figcaption>
              <template v-if="photo.photographer">
                Photo:
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
                Download
              </a>
            </figcaption>
          </figure>
        </div>
      </section>

      <section class="epk__section">
        <h2 class="epk__heading">
          Selected performances
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
                :to="`/live#${highlight.id}`"
              >{{ highlight.title }}</RouterLink> — {{ highlight.location }}
            </span>
          </li>
        </ul>
      </section>

      <section class="epk__section">
        <h2 class="epk__heading">
          Selected works
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
                :to="`/works#${work.id}`"
              >{{ work.title }}</RouterLink>
            </span>
          </li>
        </ul>
      </section>

      <section class="epk__section">
        <h2 class="epk__heading">
          Press
        </h2>
        <blockquote
          v-for="quote in epk.quotes"
          :key="quote.id"
          class="epk__quote"
        >
          <p v-html="quote.quote" />
          <strong>
            <ExternalLink
              v-if="quote.url"
              :href="quote.url"
            >{{ quote.source }}</ExternalLink>
            <template v-else>{{ quote.source }}</template>
          </strong>
        </blockquote>
      </section>
    </PageShell>
  </div>
</template>

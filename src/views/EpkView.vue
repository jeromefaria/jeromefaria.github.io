<script setup lang="ts">
import ExternalLink from '@/components/ExternalLink.vue';
import PageShell from '@/components/PageShell.vue';
import { usePageHead } from '@/composables/usePageHead';
import { epkManifest } from '@/data/epk';
import { pageMeta } from '@/data/pageMeta';
import { resolveEpkContent } from '@/utils/epk';
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
      <p class="visually-hidden">
        External links open in a new tab.
      </p>

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
            v-for="photo in epk.photos"
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
            <figcaption v-if="photo.photographer">
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
            <span>{{ highlight.title }} — {{ highlight.location }}</span>
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
            <span>{{ work.title }}</span>
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

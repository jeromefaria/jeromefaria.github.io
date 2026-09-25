<script setup lang="ts">
import { computed, ref } from 'vue';
import { RouterLink, useRoute } from 'vue-router';

import NotFound from '@/components/NotFound.vue';
import ResponsivePicture from '@/components/ResponsivePicture.vue';
import StaticPage from '@/components/StaticPage.vue';
import { siteConfig } from '@/data/navigation';
import { issueById } from '@/data/newsletter/issues';
import { pageMeta } from '@/data/pageMeta';
import { resolveIssueBlocks } from '@/utils/newsletterBlocks';

const route = useRoute();

const issue = computed(() => issueById(String(route.params['issue'])));
const notFound = computed(() => !issue.value);

const longDate = (iso: string): string =>
  new Date(iso).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

const blocks = computed(() => (issue.value ? resolveIssueBlocks(issue.value.blocks) : []));

const playing = ref(new Set<number>());
const play = (index: number): void => {
  playing.value = new Set(playing.value).add(index);
};

const head = computed(() => {
  if (!issue.value) return { ...pageMeta.newsletter, noIndex: true };
  return {
    title: `${issue.value.subject} — ${siteConfig.author.name}`,
    description: issue.value.subject,
    ogType: 'article',
  };
});
</script>

<template>
  <NotFound v-if="notFound" />

  <StaticPage
    v-else-if="issue"
    :head="head"
    data-page="newsletter-issue"
  >
    <div class="newsletter-issue">
      <p class="newsletter-issue__eyebrow">
        Newsletter · {{ longDate(issue.date) }}
      </p>

      <template
        v-for="(block, index) in blocks"
        :key="index"
      >
        <div
          v-if="block.kind === 'prose'"
          class="newsletter-issue__prose prose"
          v-html="block.html"
        />

        <figure
          v-else-if="block.kind === 'image'"
          class="newsletter-issue__figure"
        >
          <component
            :is="block.href ? 'a' : 'div'"
            v-bind="block.href ? { href: block.href, target: '_blank', rel: 'noopener noreferrer' } : {}"
          >
            <ResponsivePicture
              :src="block.src"
              :alt="block.alt"
            />
          </component>
          <figcaption v-if="block.caption">
            {{ block.caption }}
          </figcaption>
        </figure>

        <figure
          v-else-if="block.kind === 'video'"
          class="newsletter-issue__figure newsletter-issue__video"
        >
          <div
            v-if="block.embedUrl && playing.has(index)"
            class="newsletter-issue__embed"
          >
            <iframe
              :src="block.embedUrl"
              :title="block.alt"
              allow="autoplay; fullscreen; picture-in-picture"
              allowfullscreen
              loading="lazy"
            />
          </div>
          <button
            v-else-if="block.embedUrl"
            type="button"
            class="newsletter-issue__play"
            :aria-label="`Play ${block.alt}`"
            @click="play(index)"
          >
            <ResponsivePicture
              :src="block.poster"
              :alt="block.alt"
            />
            <span
              class="newsletter-issue__play-icon"
              aria-hidden="true"
            />
          </button>
          <a
            v-else
            :href="block.href"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ResponsivePicture
              :src="block.poster"
              :alt="block.alt"
            />
          </a>
          <figcaption v-if="block.caption">
            {{ block.caption }}
          </figcaption>
        </figure>

        <section
          v-else
          class="newsletter-issue__feature"
        >
          <p class="newsletter-issue__label">
            {{ block.label }}
          </p>
          <h2 class="newsletter-issue__title">
            <RouterLink :to="block.url">
              {{ block.title }}
            </RouterLink>
          </h2>

          <RouterLink
            v-if="block.image"
            :to="block.url"
            class="newsletter-issue__cover"
          >
            <ResponsivePicture
              :src="block.image"
              :alt="block.title"
            />
          </RouterLink>

          <dl
            v-if="block.meta.length"
            class="newsletter-issue__meta"
          >
            <div
              v-for="field in block.meta"
              :key="field.label"
            >
              <dt>{{ field.label }}</dt>
              <dd>{{ field.value }}</dd>
            </div>
          </dl>

          <p
            v-if="block.note"
            class="newsletter-issue__note"
          >
            {{ block.note }}
          </p>

          <RouterLink
            :to="block.url"
            class="newsletter-issue__cta"
          >
            {{ block.cta }}
          </RouterLink>
        </section>
      </template>
    </div>
  </StaticPage>
</template>

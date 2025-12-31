<script setup>
import { computed } from 'vue';

import { formatEventDate } from '@/utils/dateFormatter';

const props = defineProps({
  event: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['update-hash', 'open-lightbox']);

const formattedDate = computed(() => formatEventDate(props.event.date));
</script>

<template>
  <article
    :id="event.id"
    class="event event--text-only"
  >
    <div class="event-details">
      <p>
        <strong>
          <a
            class="event-title-link"
            :href="`#${event.id}`"
            @click.prevent="emit('update-hash', event.id)"
            v-html="event.title"
          />
        </strong>
      </p>
      <p class="event-meta">
        <span
          v-if="event.date"
          class="event-date"
        >{{ formattedDate }} · </span>
        <span v-html="event.venue" />
      </p>
      <p
        v-if="event.description"
        class="event-description"
        v-html="event.description"
      />
      <p
        v-if="event.images?.length || event.videos?.length"
        class="event-photos-link"
      >
        <button
          v-if="event.images?.length"
          class="link-discrete"
          @click="emit('open-lightbox', event.images, 0)"
        >
          View {{ event.images.length === 1 ? 'photo' : 'photos' }}
        </button>
        <span v-if="event.images?.length && event.videos?.length"> | </span>
        <button
          v-if="event.videos?.length"
          class="link-discrete"
          @click="emit('open-lightbox', event.videos, 0)"
        >
          View {{ event.videos.length === 1 ? 'video' : 'videos' }}
        </button>
      </p>
    </div>
  </article>
</template>

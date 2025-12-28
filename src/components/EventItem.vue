<script setup>
const props = defineProps({
  event: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['update-hash', 'open-lightbox']);
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
      <p
        class="event-meta"
        v-html="event.venue"
      />
      <p
        v-if="event.description"
        class="event-description"
        v-html="event.description"
      />
      <p
        v-if="event.images?.length"
        class="event-photos-link"
      >
        <button
          class="link-discrete"
          @click="emit('open-lightbox', event.images, 0)"
        >
          View photos
        </button>
      </p>
    </div>
  </article>
</template>

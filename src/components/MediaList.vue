<script setup>
// US 05 – Conteneur de la liste des résultats
import MediaCard from './MediaCard.vue'

defineProps({
  items: { type: Array, default: () => [] },
  hasSearched: { type: Boolean, default: false },
  showCount: { type: Boolean, default: true },
  query: { type: String, default: '' },
})
</script>

<template>
  <section class="media-list" aria-live="polite">
    <template v-if="items.length">
      <p v-if="showCount" class="media-list__count muted" data-test="count">
        {{ items.length }} résultat{{ items.length > 1 ? 's' : '' }}<template v-if="query">
          pour « {{ query }} »</template
        >
      </p>
      <ul class="media-list__panel panel">
        <MediaCard v-for="brewery in items" :key="brewery.id" :brewery="brewery" />
      </ul>
    </template>

    <div v-else-if="hasSearched" class="media-list__empty" data-test="empty">
      <h2>404 - Not found</h2>
      <p class="muted">
        Aucun élément correspondant à votre recherche n'a été trouvé.<br />
        Essayez une autre recherche.
      </p>
    </div>
  </section>
</template>

<style scoped>
.media-list {
  width: 100%;
  max-width: 860px;
  margin: 0 auto;
  text-align: left;
}
.media-list__count {
  margin: 0 0 10px;
  font-size: 14px;
}
.media-list__panel {
  margin: 0;
  padding: 0;
  list-style: none;
  overflow: hidden;
}
.media-list__empty {
  margin-top: 48px;
  text-align: center;
}
.media-list__empty h2 {
  font-size: 28px;
}
.media-list__empty p {
  margin: 12px 0 0;
}
</style>

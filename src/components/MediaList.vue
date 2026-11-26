<script setup>
// US 05 – Conteneur : affiche une MediaCard par brasserie reçue de l'API
import MediaCard from './MediaCard.vue'

defineProps({
  // Tableau de brasseries tel que renvoyé par l'API Open Brewery DB
  items: { type: Array, default: () => [] },
  // true après une recherche : permet d'afficher « aucun résultat »
  hasSearched: { type: Boolean, default: false },
})

// On fait remonter le clic « Voir les détails » au composant parent
const emit = defineEmits(['details'])
</script>

<template>
  <section class="media-list">
    <template v-if="items.length">
      <p class="media-list__count" data-test="count">
        {{ items.length }} résultat{{ items.length > 1 ? 's' : '' }}
      </p>
      <ul class="media-list__panel">
        <MediaCard
          v-for="brewery in items"
          :key="brewery.id"
          :brewery="brewery"
          @details="(id) => emit('details', id)"
        />
      </ul>
    </template>

    <div v-else-if="hasSearched" class="media-list__empty" data-test="empty">
      <h2>404 - Not found</h2>
      <p>
        Aucun élément correspondant à votre recherche n'a été trouvé.<br />
        Essayez une autre recherche.
      </p>
    </div>
  </section>
</template>

<style scoped>
.media-list {
  width: 100%;
  margin: 24px 0 0;
}
.media-list__count {
  margin: 0 0 14px;
  font-size: 14px;
  color: var(--muted);
}
/* Grille de cartes : 1 à 3 colonnes selon la largeur */
.media-list__panel {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.media-list__empty {
  margin-top: 48px;
  text-align: center;
}
.media-list__empty p {
  color: var(--muted);
}
</style>

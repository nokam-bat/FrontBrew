<script setup>
// US 05 – Composant réutilisable : affiche une brasserie
import { computed } from 'vue'

const props = defineProps({
  brewery: { type: Object, required: true },
})

const emit = defineEmits(['details'])

// « San Diego, California, United States » (on ignore les champs vides)
const location = computed(() =>
  [props.brewery.city, props.brewery.state_province, props.brewery.country]
    .filter(Boolean)
    .join(', '),
)
</script>

<template>
  <li class="media-card" data-test="media-card">
    <div class="media-card__main">
      <h3 class="media-card__name">{{ brewery.name }}</h3>
      <p v-if="brewery.brewery_type" class="media-card__type" data-test="type">
        {{ brewery.brewery_type }}
      </p>
      <p v-if="location" class="media-card__location" data-test="location">{{ location }}</p>
    </div>
    <button type="button" data-test="details" @click="emit('details', brewery.id)">
      Voir les détails
    </button>
  </li>
</template>

<style scoped>
.media-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 18px;
  text-align: left;
}
.media-card + .media-card {
  border-top: 1px solid rgba(128, 128, 128, 0.3);
}
.media-card__main {
  flex: 1;
  min-width: 0;
}
.media-card__name {
  margin: 0;
  font-size: 17px;
}
.media-card__type {
  margin: 2px 0 0;
  font-size: 14px;
  text-transform: capitalize;
  opacity: 0.75;
}
.media-card__location {
  margin: 2px 0 0;
  font-size: 14px;
  opacity: 0.75;
}
button {
  flex: none;
  cursor: pointer;
}
</style>

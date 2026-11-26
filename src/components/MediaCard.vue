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
  flex-direction: column;
  gap: 14px;
  padding: 20px;
  text-align: left;
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 14px;
  transition:
    transform 0.15s ease,
    border-color 0.15s ease;
}
.media-card:hover {
  transform: translateY(-2px);
  border-color: rgba(224, 160, 70, 0.45);
}
.media-card__main {
  flex: 1;
  min-width: 0;
}
.media-card__name {
  margin: 0 0 10px;
  font-family: 'Fraunces', Georgia, serif;
  font-size: 19px;
  line-height: 1.25;
}
/* Le type devient une petite étiquette */
.media-card__type {
  display: inline-block;
  margin: 0 0 8px;
  padding: 2px 10px;
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;
  color: var(--beige);
  background: rgba(243, 211, 174, 0.1);
  border: 1px solid rgba(243, 211, 174, 0.25);
  border-radius: 999px;
}
.media-card__location {
  margin: 0;
  font-size: 14px;
  color: var(--muted);
}
button {
  align-self: flex-start;
  padding: 0.45rem 0.9rem;
  font-size: 14px;
  font-weight: 500;
  color: var(--bg);
  background: var(--beige);
  border-color: var(--beige);
}
button:hover:not(:disabled) {
  background: #f7dfc2;
}
</style>

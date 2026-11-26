<!-- US 09 : filtres basés sur la documentation de l'API (by_name, by_city, by_country, by_type) -->
<script setup>
import { reactive, ref } from 'vue'
import { BREWERY_TYPES } from '../services/breweries.js'

const props = defineProps({ disabled: Boolean })
const emit = defineEmits(['filter'])

const filters = reactive({ name: '', city: '', country: '', type: '' })
const message = ref('')

function submitFilters() {
  if (props.disabled) return
  // On nettoie les espaces et on garde seulement les champs remplis.
  const cleaned = Object.fromEntries(
    Object.entries(filters)
      .map(([key, value]) => [key, value.trim()])
      .filter(([, value]) => value),
  )
  if (!Object.keys(cleaned).length) {
    message.value = 'Remplis au moins un filtre.'
    return
  }
  message.value = ''
  emit('filter', cleaned)
}

function resetFilters() {
  Object.assign(filters, { name: '', city: '', country: '', type: '' })
  message.value = ''
}
</script>

<template>
  <form class="filters" @submit.prevent="submitFilters">
    <label>
      Partie du nom
      <input v-model="filters.name" type="text" placeholder="Ex. : alp" data-test="filter-name" />
    </label>
    <label>
      Ville
      <input v-model="filters.city" type="text" placeholder="Ex. : San Diego" data-test="filter-city" />
    </label>
    <label>
      Pays
      <input v-model="filters.country" type="text" placeholder="Ex. : Ireland" data-test="filter-country" />
    </label>
    <label>
      Type
      <select v-model="filters.type" data-test="filter-type">
        <option value="">Tous</option>
        <option v-for="type in BREWERY_TYPES" :key="type" :value="type">{{ type }}</option>
      </select>
    </label>

    <div class="filters__actions">
      <button type="submit" :disabled="disabled" data-test="filter-submit">Filtrer</button>
      <button type="button" :disabled="disabled" @click="resetFilters">Effacer</button>
    </div>

    <p v-if="message" class="filters__message" role="alert" data-test="filter-message">
      {{ message }}
    </p>
  </form>
</template>

<style scoped>
.filters {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 0.75rem;
  align-items: end;
  margin: 12px 0 0;
  padding: 16px;
  background: rgba(28, 19, 12, 0.85);
  border: 1px solid var(--line);
  border-radius: var(--radius);
}
label {
  display: grid;
  gap: 0.35rem;
}
input,
select {
  width: 100%;
}
button[type='submit'] {
  color: #fff;
  background: var(--brown);
  border-color: var(--brown);
}
button[type='submit']:hover:not(:disabled) {
  background: var(--brown-hover);
}
.filters__actions {
  display: flex;
  gap: 0.5rem;
}
button {
  cursor: pointer;
}
button:disabled {
  opacity: 0.5;
  cursor: wait;
}
.filters__message {
  grid-column: 1 / -1;
  margin: 0;
  color: var(--danger);
}
</style>

<script setup>
import FicheBrasserie from '../components/FicheBrasserie.vue'
import { ref, watch } from 'vue'
import { getBreweryById } from '../services/breweries.js'

const props = defineProps({ id: { type: String, required: true } })
const brewery = ref(null)
const loading = ref(false)
const error = ref('')

watch(() => props.id, async (id, previousId, onCleanup) => {
  let active = true
  onCleanup(() => { active = false })
  loading.value = true
  brewery.value = null
  error.value = ''
  try {
    const data = await getBreweryById(id)
    if (active) brewery.value = data
  } catch (cause) {
    if (active) error.value = 'Fiche indisponible (' +
      (cause.response?.status || 'erreur réseau') + ').'
  } finally {
    if (active) loading.value = false
  }
}, { immediate: true })
</script>

<template>
  <p v-if="loading" role="status">Chargement de la fiche…</p>
  <p v-else-if="error" role="alert">{{ error }}</p>
  <FicheBrasserie v-else-if="brewery" :brewery="brewery" />

  <RouterLink :to="{ name: 'recherche' }">
  Retour aux résultats
</RouterLink>
</template>
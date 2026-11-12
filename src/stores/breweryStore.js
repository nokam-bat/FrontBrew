// État global (Pinia) : recherche (résultats, chargement, erreur) + brasseries déjà vues.
import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  searchBreweries,
  getRandomBreweries,
  getErrorMessage,
} from '../services/breweryService'

export const useBreweryStore = defineStore('brewery', () => {
  const results = ref([])
  const isLoading = ref(false) // US 06 – état réactif du loader
  const error = ref('') // US 06 – message d'erreur affiché dans l'alerte
  const lastQuery = ref('')
  const hasSearched = ref(false)

  // Brasseries déjà chargées (liste, hasard…) : la fiche s'affiche instantanément.
  const known = new Map()
  function remember(list) {
    for (const b of list) if (b?.id) known.set(b.id, b)
  }

  // Permet d'ignorer la réponse d'une ancienne recherche si l'utilisateur
  // en a lancé une nouvelle entre-temps.
  let requestId = 0

  async function search(query) {
    const currentRequest = ++requestId
    lastQuery.value = query
    hasSearched.value = true
    isLoading.value = true
    error.value = ''

    try {
      const data = await searchBreweries(query)
      if (currentRequest !== requestId) return
      results.value = data
      remember(data)
    } catch (err) {
      if (currentRequest !== requestId) return
      results.value = []
      error.value = getErrorMessage(err)
    } finally {
      if (currentRequest === requestId) isLoading.value = false
    }
  }

  function clearError() {
    error.value = ''
  }

  /** Retour à l'écran d'accueil (clic sur le logo). */
  function reset() {
    requestId++
    results.value = []
    isLoading.value = false
    error.value = ''
    lastQuery.value = ''
    hasSearched.value = false
  }

  /** Brasserie déjà connue (évite un appel API inutile). */
  function findById(id) {
    return results.value.find((b) => b.id === id) ?? known.get(id) ?? null
  }

  /** Tire `size` brasseries au hasard et les mémorise. */
  async function fetchRandom(size = 1) {
    const data = await getRandomBreweries(size)
    remember(data)
    return data
  }

  return {
    results,
    isLoading,
    error,
    lastQuery,
    hasSearched,
    search,
    clearError,
    reset,
    findById,
    remember,
    fetchRandom,
  }
})

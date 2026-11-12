// Ouvre la fiche d'une brasserie tirée au hasard (/breweries/random).
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useBreweryStore } from '../stores/breweryStore'
import { getErrorMessage } from '../services/breweryService'

export function useRandomBrewery() {
  const router = useRouter()
  const store = useBreweryStore()
  const isRolling = ref(false)
  const rollError = ref('')

  async function openRandom() {
    if (isRolling.value) return
    isRolling.value = true
    rollError.value = ''
    try {
      const [brewery] = await store.fetchRandom(1)
      if (brewery) await router.push({ name: 'brewery', params: { id: brewery.id } })
    } catch (err) {
      rollError.value = getErrorMessage(err)
    } finally {
      isRolling.value = false
    }
  }

  return { openRandom, isRolling, rollError }
}

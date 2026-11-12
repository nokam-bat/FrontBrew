<script setup>
// Page « Tout voir » : liste paginée de toutes les brasseries
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SearchBar from '../components/SearchBar.vue'
import MediaList from '../components/MediaList.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import ErrorAlert from '../components/ErrorAlert.vue'
import PaginationBar from '../components/PaginationBar.vue'
import { useBreweryStore } from '../stores/breweryStore'
import {
  PER_PAGE,
  getBreweries,
  getBreweriesTotal,
  getErrorMessage,
} from '../services/breweryService'

const route = useRoute()
const router = useRouter()
const store = useBreweryStore()

const items = ref([])
const isLoading = ref(false)
const error = ref('')
const total = ref(null)

// La page courante est dans l'URL (/tout?page=3) pour que « retour » fonctionne.
const page = computed(() => {
  const n = Number.parseInt(route.query.page, 10)
  return Number.isFinite(n) && n > 0 ? n : 1
})
const totalPages = computed(() => (total.value ? Math.ceil(total.value / PER_PAGE) : null))
const hasNext = computed(() =>
  totalPages.value ? page.value < totalPages.value : items.value.length === PER_PAGE,
)

let requestId = 0
async function load() {
  const current = ++requestId
  isLoading.value = true
  error.value = ''
  try {
    const data = await getBreweries(page.value)
    if (current !== requestId) return
    items.value = data
    store.remember(data)
  } catch (err) {
    if (current !== requestId) return
    items.value = []
    error.value = getErrorMessage(err)
  } finally {
    if (current === requestId) isLoading.value = false
  }
}

async function loadTotal() {
  try {
    total.value = await getBreweriesTotal()
  } catch {
    total.value = null // pas grave : la pagination fonctionne sans le total
  }
}

function changePage(newPage) {
  router.push({ name: 'all', query: newPage > 1 ? { page: newPage } : {} })
}

function onSearch(query) {
  router.push({ name: 'home', query: { q: query } })
}

watch(page, load, { immediate: true })
loadTotal()
</script>

<template>
  <section class="all">
    <SearchBar @search="onSearch" />

    <header class="all__header">
      <h1>Toutes les brasseries</h1>
      <p v-if="total" class="muted" data-test="total">
        {{ total.toLocaleString('fr-CH') }} brasseries, par ordre alphabétique
      </p>
    </header>

    <LoadingSpinner v-if="isLoading" label="Chargement…" />
    <ErrorAlert v-else-if="error" :message="error" @close="error = ''" @retry="load" />
    <template v-else>
      <MediaList :items="items" :has-searched="true" :show-count="false" />
      <PaginationBar
        v-if="items.length || page > 1"
        :page="page"
        :total-pages="totalPages"
        :has-next="hasNext"
        :disabled="isLoading"
        @change="changePage"
      />
    </template>
  </section>
</template>

<style scoped>
.all {
  display: flex;
  flex-direction: column;
  gap: 28px;
}
.all__header {
  width: 100%;
  max-width: 860px;
  margin: 0 auto;
}
.all__header h1 {
  font-size: 32px;
}
.all__header p {
  margin: 4px 0 0;
}
</style>

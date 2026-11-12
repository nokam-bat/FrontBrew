<script setup>
// Page d'accueil : recherche (US 04), résultats (US 05), états (US 06)
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import SearchBar from '../components/SearchBar.vue'
import MediaList from '../components/MediaList.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import ErrorAlert from '../components/ErrorAlert.vue'
import DiscoverySection from '../components/DiscoverySection.vue'
import { useBreweryStore } from '../stores/breweryStore'
import { useRandomBrewery } from '../composables/useRandomBrewery'
import { sanitizeQuery } from '../utils/sanitizeQuery'

const route = useRoute()
const router = useRouter()
const store = useBreweryStore()
const { results, isLoading, error, hasSearched, lastQuery } = storeToRefs(store)
const { openRandom, isRolling, rollError } = useRandomBrewery()

const searchBar = ref(null)
const SUGGESTIONS = ['dog', 'Portland', 'Dublin', 'ale']

// Avant la 1re recherche : écran d'accueil. Ensuite : les résultats.
const showResults = computed(() => hasSearched.value || isLoading.value || !!error.value)

// Le mot-clé est gardé dans l'URL (?q=dog) : on peut recharger la page,
// partager le lien ou revenir en arrière depuis la fiche d'une brasserie.
function onSearch(query) {
  router.replace({ name: 'home', query: { q: query } })
  store.search(query)
}

watch(
  () => route.query.q,
  (q) => {
    const { valid, query } = sanitizeQuery(q)
    if (!valid) {
      if (!q) store.reset() // clic sur le logo → retour à l'accueil
      return
    }
    if (query !== lastQuery.value) store.search(query)
  },
  { immediate: true },
)
</script>

<template>
  <section class="home" :class="{ 'home--results': showResults }">
    <h1 v-if="!showResults" class="home__title">Trouvez une brasserie proche de chez vous !</h1>

    <SearchBar
      ref="searchBar"
      :disabled="isLoading"
      :initial-query="String(route.query.q ?? '')"
      @search="onSearch"
    />

    <template v-if="!showResults">
      <p class="home__hint muted">
        Par exemple :
        <template v-for="(s, i) in SUGGESTIONS" :key="s">
          <button type="button" class="link suggestion" @click="searchBar?.setAndSubmit(s)">
            {{ s }}</button
          >{{ i < SUGGESTIONS.length - 1 ? ', ' : '' }}
        </template>
        — ou
        <button
          type="button"
          class="link"
          :disabled="isRolling"
          data-test="random-hero"
          @click="openRandom"
        >
          une brasserie au hasard</button
        >.
      </p>
      <p v-if="rollError" class="home__error" role="alert">{{ rollError }}</p>

      <DiscoverySection class="home__discovery" />
    </template>

    <template v-else>
      <LoadingSpinner v-if="isLoading" />
      <ErrorAlert
        v-else-if="error"
        :message="error"
        @close="store.clearError"
        @retry="store.search(lastQuery)"
      />
      <MediaList v-else :items="results" :has-searched="hasSearched" :query="lastQuery" />
    </template>
  </section>
</template>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  gap: 24px;
  text-align: center;
}
.home--results {
  gap: 32px;
}
.home__title {
  margin-top: clamp(24px, 8vh, 80px);
  font-size: clamp(30px, 4.5vw, 46px);
}
.home__hint {
  margin: -6px 0 0;
  font-size: 15px;
}
.home__error {
  margin: 0;
  color: var(--danger);
}
.home__discovery {
  margin-top: clamp(32px, 8vh, 72px);
}
</style>

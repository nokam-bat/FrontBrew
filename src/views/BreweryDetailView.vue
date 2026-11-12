<script setup>
// Fiche détaillée d'une brasserie (adresse, contact, site web, carte)
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import ErrorAlert from '../components/ErrorAlert.vue'
import BreweryMap from '../components/BreweryMap.vue'
import { useBreweryStore } from '../stores/breweryStore'
import { useRandomBrewery } from '../composables/useRandomBrewery'
import { getBreweryById, getErrorMessage } from '../services/breweryService'
import {
  formatAddressLines,
  formatLocation,
  formatPhone,
  formatType,
  getCoordinates,
} from '../utils/format'

const props = defineProps({
  id: { type: String, required: true },
})

const router = useRouter()
const store = useBreweryStore()
const { openRandom, isRolling } = useRandomBrewery()

const brewery = ref(null)
const isLoading = ref(false)
const error = ref('')

const typeLabel = computed(() => formatType(brewery.value?.brewery_type))
const location = computed(() => formatLocation(brewery.value))
const addressLines = computed(() => formatAddressLines(brewery.value))
const phone = computed(() => formatPhone(brewery.value?.phone, brewery.value?.country))
const coords = computed(() => getCoordinates(brewery.value))
const websiteLabel = computed(() =>
  (brewery.value?.website_url ?? '').replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, ''),
)
const directionsUrl = computed(() =>
  coords.value
    ? `https://www.openstreetmap.org/directions?route=%3B${coords.value.lat}%2C${coords.value.lon}`
    : '',
)

let requestId = 0
async function load() {
  const current = ++requestId
  error.value = ''
  // Affichage immédiat si la brasserie est déjà connue (liste, hasard…)
  brewery.value = store.findById(props.id)
  isLoading.value = !brewery.value
  try {
    const data = await getBreweryById(props.id)
    if (current === requestId) brewery.value = data
  } catch (err) {
    if (current === requestId && !brewery.value) error.value = getErrorMessage(err)
  } finally {
    if (current === requestId) isLoading.value = false
  }
}

watch(() => props.id, load, { immediate: true })

function goBack() {
  // Revient aux résultats si on vient de l'application, sinon à l'accueil
  if (window.history.state?.back) router.back()
  else router.push({ name: 'home' })
}
</script>

<template>
  <section class="detail">
    <div class="detail__toolbar">
      <button type="button" class="link" data-test="back" @click="goBack">‹ Retour</button>
      <button
        type="button"
        class="link"
        :disabled="isRolling"
        data-test="random-detail"
        @click="openRandom"
      >
        Une autre au hasard
      </button>
    </div>

    <LoadingSpinner v-if="isLoading" label="Chargement…" />
    <ErrorAlert v-else-if="error" :message="error" @close="goBack" @retry="load" />

    <article v-else-if="brewery" :key="brewery.id" class="detail__content" data-test="detail">
      <header class="detail__head">
        <h1 class="detail__title">
          {{ brewery.name }}<template v-if="typeLabel"> - {{ typeLabel }}</template>
        </h1>
        <p v-if="location" class="muted">{{ location }}</p>
      </header>

      <div class="detail__grid">
        <dl class="detail__card panel">
          <div class="detail__row">
            <dt>Adresse</dt>
            <dd data-test="address">
              <template v-if="addressLines.length">
                <span v-for="line in addressLines" :key="line">{{ line }}</span>
              </template>
              <span v-else class="muted">Non renseignée</span>
            </dd>
          </div>

          <div class="detail__row">
            <dt>Contact</dt>
            <dd data-test="phone">
              <a v-if="phone" :href="`tel:${brewery.phone}`">{{ phone }}</a>
              <span v-else class="muted">Non renseigné</span>
            </dd>
          </div>

          <div class="detail__row">
            <dt>Site web</dt>
            <dd data-test="website">
              <a
                v-if="brewery.website_url"
                :href="brewery.website_url"
                target="_blank"
                rel="noopener noreferrer"
              >
                {{ websiteLabel }}
              </a>
              <span v-else class="muted">Non renseigné</span>
            </dd>
          </div>

          <div v-if="directionsUrl" class="detail__row">
            <dt>Itinéraire</dt>
            <dd>
              <a :href="directionsUrl" target="_blank" rel="noopener noreferrer">
                Ouvrir dans OpenStreetMap
              </a>
            </dd>
          </div>
        </dl>

        <BreweryMap :coords="coords" :name="brewery.name" />
      </div>
    </article>
  </section>
</template>

<style scoped>
.detail {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.detail__toolbar {
  display: flex;
  justify-content: space-between;
  font-size: 15px;
}
.detail__head {
  margin-bottom: 28px;
}
.detail__title {
  font-size: clamp(28px, 4vw, 40px);
}
.detail__head p {
  margin: 6px 0 0;
  font-size: 17px;
}
.detail__grid {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
  gap: 24px;
  align-items: start;
}
.detail__card {
  margin: 0;
  padding: 8px 24px;
}
.detail__row {
  display: grid;
  grid-template-columns: 110px 1fr;
  gap: 12px;
  padding: 16px 0;
}
.detail__row + .detail__row {
  border-top: 1px solid var(--line);
}
dt {
  color: var(--muted);
}
dd {
  display: flex;
  flex-direction: column;
  min-width: 0;
  margin: 0;
  overflow-wrap: anywhere;
}
dd a {
  color: var(--text);
  text-decoration-color: var(--amber);
  text-underline-offset: 3px;
}
dd a:hover {
  color: var(--beige);
}
@media (max-width: 800px) {
  .detail__grid {
    grid-template-columns: 1fr;
  }
  .detail__card {
    padding: 4px 18px;
  }
  .detail__row {
    grid-template-columns: 1fr;
    gap: 2px;
  }
}
</style>

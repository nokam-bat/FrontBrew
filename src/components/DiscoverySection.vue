<script setup>
// Quelques brasseries tirées au hasard (/breweries/random?size=3)
import { onMounted, ref } from 'vue'
import BreweryTile from './BreweryTile.vue'
import { useBreweryStore } from '../stores/breweryStore'

const store = useBreweryStore()
const items = ref([])
const isLoading = ref(false)
const failed = ref(false)

async function load() {
  isLoading.value = true
  failed.value = false
  try {
    items.value = await store.fetchRandom(3)
  } catch {
    failed.value = true
  } finally {
    isLoading.value = false
  }
}

onMounted(load)
</script>

<template>
  <section v-if="!failed && (items.length || isLoading)" class="discovery">
    <div class="discovery__head">
      <h2>À découvrir</h2>
      <button
        type="button"
        class="link"
        :disabled="isLoading"
        data-test="discovery-refresh"
        @click="load"
      >
        Autres suggestions
      </button>
    </div>

    <div class="discovery__grid">
      <BreweryTile v-for="b in items" :key="b.id" :brewery="b" />
    </div>
  </section>
</template>

<style scoped>
.discovery {
  text-align: left;
}
.discovery__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--line);
}
.discovery h2 {
  font-size: 22px;
}
.discovery__head .link {
  font-size: 14px;
}
.discovery__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 14px;
  min-height: 110px;
}
</style>

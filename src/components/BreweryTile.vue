<script setup>
// Petite carte d'une brasserie (section « À découvrir »)
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { formatLocation, formatType } from '../utils/format'

const props = defineProps({
  brewery: { type: Object, required: true },
})

const location = computed(() => formatLocation(props.brewery))
const typeLabel = computed(() => formatType(props.brewery.brewery_type))
</script>

<template>
  <RouterLink
    :to="{ name: 'brewery', params: { id: brewery.id } }"
    class="tile panel"
    data-test="brewery-tile"
  >
    <span class="tile__name">{{ brewery.name }}</span>
    <span v-if="location" class="tile__meta">{{ location }}</span>
    <span v-if="typeLabel" class="tile__meta">{{ typeLabel }}</span>
  </RouterLink>
</template>

<style scoped>
.tile {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 18px 20px;
  text-decoration: none;
  transition: border-color 0.15s;
}
.tile:hover {
  border-color: rgba(224, 160, 70, 0.6);
}
.tile__name {
  font-family: var(--serif);
  font-size: 18px;
  font-weight: 600;
  line-height: 1.3;
}
.tile__meta {
  font-size: 14px;
  color: var(--muted);
}
</style>

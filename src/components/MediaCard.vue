<script setup>
// US 05 – Ligne réutilisable affichant une brasserie ; un clic ouvre sa fiche détaillée.
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
  <li class="media-card" data-test="media-card">
    <RouterLink
      class="media-card__link"
      :to="{ name: 'brewery', params: { id: brewery.id } }"
      data-test="detail-link"
    >
      <span class="media-card__main">
        <span class="media-card__title">{{ brewery.name }}</span>
        <span class="media-card__meta">
          <span v-if="typeLabel" data-test="type">{{ typeLabel }}</span>
          <span v-if="typeLabel && location" aria-hidden="true"> · </span>
          <span v-if="location" data-test="location">{{ location }}</span>
        </span>
      </span>
      <span class="media-card__arrow" aria-hidden="true">›</span>
    </RouterLink>
  </li>
</template>

<style scoped>
.media-card + .media-card {
  border-top: 1px solid var(--line);
}
.media-card__link {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 20px;
  text-decoration: none;
  transition: background 0.15s;
}
.media-card__link:hover {
  background: rgba(243, 233, 216, 0.05);
}
.media-card__main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.media-card__title {
  font-weight: 600;
}
.media-card__meta {
  font-size: 14px;
  color: var(--muted);
}
.media-card__arrow {
  font-size: 24px;
  line-height: 1;
  color: var(--muted);
}
.media-card__link:hover .media-card__arrow {
  color: var(--amber);
}
@media (max-width: 480px) {
  .media-card__link {
    padding: 12px 14px;
  }
}
</style>

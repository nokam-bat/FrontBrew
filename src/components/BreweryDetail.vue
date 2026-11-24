<!-- US 09 : fiche d'une brasserie (adresse, téléphone, site web) -->
<script setup>
import { computed } from 'vue'

const props = defineProps({
  // Objet renvoyé par GET /breweries/{id}
  brewery: { type: Object, required: true },
})

const emit = defineEmits(['back'])

// On garde seulement les lignes remplies : pas de « null » ni de virgule seule.
const addressLines = computed(() => {
  const b = props.brewery
  const street = [b.address_1 ?? b.street, b.address_2, b.address_3].filter(Boolean)
  const city = [b.postal_code, b.city].filter(Boolean).join(' ')
  const region = [b.state_province, b.country].filter(Boolean).join(', ')
  return [...street, city, region].filter(Boolean)
})

// Le lien est accepté seulement s'il commence par http:// ou https://
const websiteUrl = computed(() => {
  const url = props.brewery.website_url
  return typeof url === 'string' && /^https?:\/\//i.test(url) ? url : ''
})

// « www.exemple.ch » au lieu de « https://www.exemple.ch/ »
const websiteLabel = computed(() => websiteUrl.value.replace(/^https?:\/\//i, '').replace(/\/$/, ''))
</script>

<template>
  <article class="detail" data-test="detail">
    <button type="button" class="detail__back" data-test="back" @click="emit('back')">
      ← Retour à la liste
    </button>

    <h1>
      {{ brewery.name }}<template v-if="brewery.brewery_type"> - {{ brewery.brewery_type }}</template>
    </h1>

    <dl>
      <dt>Adresse</dt>
      <dd data-test="address">
        <template v-if="addressLines.length">
          <span v-for="line in addressLines" :key="line">{{ line }}</span>
        </template>
        <span v-else class="detail__empty">Non renseignée</span>
      </dd>

      <dt>Contact</dt>
      <dd data-test="phone">
        <a v-if="brewery.phone" :href="`tel:${brewery.phone}`">{{ brewery.phone }}</a>
        <span v-else class="detail__empty">Non renseigné</span>
      </dd>

      <dt>Site web</dt>
      <dd data-test="website">
        <a v-if="websiteUrl" :href="websiteUrl" target="_blank" rel="noopener noreferrer">
          {{ websiteLabel }}
        </a>
        <span v-else class="detail__empty">Non renseigné</span>
      </dd>
    </dl>
  </article>
</template>

<style scoped>
.detail {
  max-width: 640px;
  margin: 24px auto 0;
  text-align: left;
}
.detail__back {
  margin-bottom: 16px;
  cursor: pointer;
}
h1 {
  margin: 0 0 16px;
  font-size: 1.8rem;
}
dl {
  margin: 0;
}
dt {
  margin-top: 16px;
  font-weight: 600;
}
dd {
  display: flex;
  flex-direction: column;
  margin: 4px 0 0;
  overflow-wrap: anywhere;
}
.detail__empty {
  font-style: italic;
  opacity: 0.7;
}
</style>

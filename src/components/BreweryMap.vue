<script setup>
// Carte OpenStreetMap (gratuite, sans clé API) centrée sur la brasserie
import { computed } from 'vue'

const props = defineProps({
  coords: { type: Object, default: null }, // { lat, lon } ou null
  name: { type: String, default: '' },
})

const DELTA = 0.008

const embedUrl = computed(() => {
  if (!props.coords) return ''
  const { lat, lon } = props.coords
  const bbox = [lon - DELTA, lat - DELTA / 1.6, lon + DELTA, lat + DELTA / 1.6].join(',')
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`
})

const fullMapUrl = computed(() =>
  props.coords
    ? `https://www.openstreetmap.org/?mlat=${props.coords.lat}&mlon=${props.coords.lon}#map=16/${props.coords.lat}/${props.coords.lon}`
    : '',
)
</script>

<template>
  <figure class="map" data-test="map">
    <template v-if="coords">
      <iframe
        :src="embedUrl"
        :title="`Carte : ${name}`"
        loading="lazy"
        referrerpolicy="no-referrer"
      ></iframe>
      <figcaption>
        <a :href="fullMapUrl" target="_blank" rel="noopener noreferrer">Agrandir la carte</a>
      </figcaption>
    </template>
    <div v-else class="map__empty panel" data-test="map-empty">
      Pas de localisation disponible pour cette brasserie.
    </div>
  </figure>
</template>

<style scoped>
.map {
  margin: 0;
}
iframe {
  display: block;
  width: 100%;
  aspect-ratio: 1;
  border: 1px solid var(--line);
  border-radius: var(--radius);
}
figcaption {
  margin-top: 8px;
  font-size: 14px;
  text-align: right;
}
figcaption a {
  color: var(--amber);
}
.map__empty {
  display: grid;
  place-items: center;
  aspect-ratio: 1;
  padding: 24px;
  color: var(--muted);
  text-align: center;
}
@media (max-width: 800px) {
  iframe,
  .map__empty {
    aspect-ratio: 4 / 3;
  }
}
</style>

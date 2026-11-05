<!-- composant utilisant la composition API de type script setup pour appeler l'API, stocker les résultats dans une variable réactive et les afficher-->
 <!-- Ce test ne prends pas en compte les erreurs ni le chargement-->
<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api.js'


<!-- onMounted est un crochet de cycle de vie qui s'éxecute automatiquement -->

const breweries = ref([])

onMounted(async () => {
  const res = await api.get('/breweries?per_page=5')
  breweries.value = res.data
})
</script>

<template>
  <ul>
    <li v-for="b in breweries" :key="b.id">{{ b.name }}</li>
  </ul>
</template>
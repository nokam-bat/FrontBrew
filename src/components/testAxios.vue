<template>
  <div>
    <input type="text" v-model="searchQuery" placeholder="Rechercher une brasserie" />
    <button @click="searchBreweries">Rechercher</button>
    <button @click="ShowBreweries">Voir tout</button>
    <button @click="HideBreweries">Cacher tout</button>

    <ul v-if="breweries.length > 0">
      <li
        v-for="brewery in breweries"
        :key="brewery.id"
      >
        {{ brewery.name }} - {{ brewery.brewery_type }} - {{ brewery.country }}
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      breweries: []
    }
  },

  methods: {
    // Récupérer toutes les brasseries
    async ShowBreweries() {
      try {
        const response = await axios.get(
          'https://api.openbrewerydb.org/v1/breweries'
        )

        this.breweries = response.data
      } catch (error) {
        console.error(error)
      }
    },
    // Faire autre chose pour cacher les brasseries --> ici on vide le tableau des brasseries, mais on pourrait aussi faire un v-if sur le tableau des brasseries pour ne pas les afficher
    HideBreweries() {
      this.breweries = []
    },
    // Chercher les brasseries en fonction de la requête de recherche (ex tester avec : Brouwhuys)
    async searchBreweries() {
      try {
        const response = await axios.get(
          `https://api.openbrewerydb.org/v1/breweries/search?query=${this.searchQuery}`
        )

        this.breweries = response.data
      } catch (error) {
        console.error(error)
      }
    }
  }
}
</script>
<template>
  <div>
    <!-- Champ de recherche -->
    <input type="text" v-model="searchQuery" placeholder="Rechercher une brasserie" />
    <button @click="searchBreweries">Rechercher</button>
    <!-- Boutons pour afficher ou cacher les brasseries -->
    <button @click="ShowBreweries">Voir tout</button>
    <button @click="HideBreweries">Cacher tout</button>
    <button @click="getRandomBrewery">Brasserie aléatoire</button>

    <!-- Message d'erreur -->
    <h1 v-if="error">Une erreur s'est produite : {{ error.message }}</h1>

    <!-- Affichage des brasseries (US 05 : MediaList + MediaCard) -->
    <MediaList
      v-if="showBreweries && !error && !details"
      :items="breweries"
      :has-searched="hasSearched"
      @details="getBreweryDetails"
    />

    <!-- Détails de la brasserie -->
    <div v-if="details">
      <h1>{{ brewery.name }} - {{ brewery.brewery_type }}</h1>
      <h2>Adresse</h2>
      <p>
        {{ brewery.address_1 }}
        <br v-if="brewery.address_2">
        {{ brewery.address_2 }}
        <br v-if="brewery.address_3">
        {{ brewery.address_3 }}
        <br>
        {{ brewery.postal_code }} {{ brewery.city }}
        <br>
        {{ brewery.state_province }}, {{ brewery.country }}
      </p>
      <h2 v-if="brewery.phone">Contact</h2>
      <p v-if="brewery.phone">{{ brewery.phone }}</p>
      <h2 v-if="brewery.website_url">Site web</h2>
      <!-- Pour l'instant le lien ne fonctionne pas -->
      <a href={{ brewery.website_url }} target="_blank" v-if="brewery.website_url">
        {{ brewery.website_url }}
      </a>
    </div>

  </div>
</template>

<script>
import axios from 'axios'
import MediaList from './MediaList.vue'

export default {
  components: { MediaList },

  data() {
    return {
      breweries: [],
      showBreweries: true,
      searchQuery: '',
      error: null,
      details: false,
      hasSearched: false // US 05 : pour afficher « 404 - Not found » si la recherche ne trouve rien
    }
  },

  methods: {

    // Récupérer toutes les brasseries
    async ShowBreweries() {
      try {
        this.error = null
        this.details = false
        const response = await axios.get(
          // en ajoutant ?per_page=x permet d'afficher x brasseries au lieu de 20 par défaut
          'https://api.openbrewerydb.org/v1/breweries'
        )

        this.breweries = response.data
        this.showBreweries = true
      } catch (error) {
        this.error = error
        console.error(error)
      }
    },

    // Cache le résultat des brasseries
    HideBreweries() {
      this.error = null
      this.showBreweries = false
      this.details = false
    },

    // Chercher les brasseries en fonction de la requête de recherche (ex tester avec : Brouwhuys)
    async searchBreweries() {
      try {
        this.error = null
        this.details = false
        const response = await axios.get(
          `https://api.openbrewerydb.org/v1/breweries/search?query=${this.searchQuery}`
        )

        this.breweries = response.data
        this.showBreweries = true
        this.hasSearched = true
      } catch (error) {
        this.error = error
        console.error(error)
      }
    },

    // Prend une brewerie aléatoire
    async getRandomBrewery() {
      try {
        this.error = null
        this.details = false
        const response = await axios.get(
          'https://api.openbrewerydb.org/v1/breweries/random'
        )

        this.breweries = response.data
        this.showBreweries = true
      } catch (error) {
        this.error = error
        console.error(error)
      }
    },

    // Récupérer les détails d'une brasserie spécifique
    async getBreweryDetails(breweryId) {
      try {
        this.breweries = []
        this.error = null
        const response = await axios.get(
          `https://api.openbrewerydb.org/v1/breweries/${breweryId}`
        )

        this.brewery = response.data
        this.details = true
      } catch (error) {
        this.error = error
        console.error(error)
      }
    }
  }
}
</script>
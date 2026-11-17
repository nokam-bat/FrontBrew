<template>
  <div>
    <!-- Champ de recherche -->
    <input type="text" v-model="searchQuery" placeholder="Rechercher une brasserie" />
    <button :disabled="isLoading" @click="searchBreweries">Rechercher</button> <!-- US 06 : ajouter disabled aux boutons-->
    <!-- Boutons pour afficher ou cacher les brasseries -->
    <button :disabled="isLoading" @click="ShowBreweries">Voir tout</button>
    <button :disabled="isLoading" @click="HideBreweries">Cacher tout</button>
    <button :disabled="isLoading" @click="getRandomBrewery">Brasserie aléatoire</button>


    <!-- US 06 : ce bloc existe seulement pendant la requête. -->
     <div v-if="isLoading" role="status" data-test="loader">
      <span class="spinner" aria-hidden="true"></span>
      Chargement des brasseries...
     </div>


    <!-- US 06 : expliquer l'échec avec un message d'erreur et un code. -->
    <div v-if="error && !isLoading" role="alert" data-test="error">
      <p> {{  error.message }}</p>
      <p>Code : {{  error.code }}</p>
    </div>
    
    <!-- Affichage des brasseries (US 05 : MediaList + MediaCard) -->
    <!-- US 06 : masquer les anciennes cartes pendant le chargement. -->
    <MediaList
      v-if="showBreweries && !error && !details && !isLoading"
      :items="breweries"
      :has-searched="hasSearched"
      @details="getBreweryDetails"
    />

    <!-- Détails de la brasserie -->
     <!-- US 06 : masquer les anciens détails pendant l'attente ou une erreur. -->
    <div v-if="details && !isLoading && !error">
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
      isLoading: false, // US 06 : vrai uniquement pendant une requête HTTP.
      details: false,
      hasSearched: false // US 05 : pour afficher « 404 - Not found » si la recherche ne trouve rien
    }
  },

  methods: {

    // Récupérer toutes les brasseries
    async ShowBreweries() {
      // US 06 : empêcher une deuxième requête pendant le chargement.
      if (this.isLoading) return 
      // US 06 :  afficher le loader avant de lancer la requête
      this.isLoading = true
      
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
        // US 06 : transromer l'erreur technique en message
        this.error = {
          // une erreur réseau n'a pas de statut HTTP : on lui donne un code.
          code: error.response?.status || error.code || 'UNKOWN_ERROR',
          message: error.response
          ? 'Le serveur ne peut pas traiter la demande. Réessaie plus tard.': error.request || error.code === 'ERR_NETWORK'
          ? 'Impossible de joindre le serveur. Vérifie ta connexion et réessaie.' : 'Une erreur inattendue est survenue.',
        }
        console.error(error) // Ligne existante pour le diagnostic.    
        } finally {
          // US 06 : masquer le loader après un succès ou un échec.
          this.isLoading = false
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
      if (this.isLoading) return
      this.isLoading = true
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
        this.error = {
          code: error.response?.status || error.code || 'UNKOWN_ERROR',
          message: error.response
          ? 'Le serveur ne peut pas traiter la demande. Réessaie plus tard.': error.request || error.code === 'ERR_NETWORK'
          ? 'Impossible de joindre le serveur. Vérifie ta connexion et réessaie.' : 'Une erreur inattendue est survenue.',
        }
        console.error(error)
      } finally {
        this.isLoading = false
      }
    },

    // Prend une brewerie aléatoire
    async getRandomBrewery() {
      if (this.isLoading) return
      this.isLoading = true
      try {
        this.error = null
        this.details = false
        const response = await axios.get(
          'https://api.openbrewerydb.org/v1/breweries/random'
        )

        this.breweries = response.data
        this.showBreweries = true
      } catch (error) {
        this.error = {
          code: error.response?.status || error.code || 'UNKOWN_ERROR',
          message: error.response
          ? 'Le serveur ne peut pas traiter la demande. Réessaie plus tard.': error.request || error.code === 'ERR_NETWORK'
          ? 'Impossible de joindre le serveur. Vérifie ta connexion et réessaie.' : 'Une erreur inattendue est survenue.',
        }
        console.error(error)
      } finally {
        this.isLoading = false
      }
    },

    // Récupérer les détails d'une brasserie spécifique
    async getBreweryDetails(breweryId) {
      if (this.isLoading) return
      this.isLoading = true
      try {
        this.breweries = []
        this.error = null
        const response = await axios.get(
          `https://api.openbrewerydb.org/v1/breweries/${breweryId}`
        )

        this.brewery = response.data
        this.details = true
      } catch (error) {
        this.error = {
          code: error.response?.status || error.code || 'UNKOWN_ERROR',
          message: error.response
          ? 'Le serveur ne peut pas traiter la demande. Réessaie plus tard.': error.request || error.code === 'ERR_NETWORK'
          ? 'Impossible de joindre le serveur. Vérifie ta connexion et réessaie.' : 'Une erreur inattendue est survenue.',
        }
        console.error(error)
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>

<!-- US 06 : dessin du spinner-->
<style scoped>
/* US 06 : cercle visible pendant le chargement. */
.spinner {
  display: inline-block;
  width: 1.25rem;
  height: 1.25rem;
  margin-right: .5rem;
  border: 3px solid #ddd;
  border-top-color: #71451c;
  border-radius: 50%;
  animation: spin .8s linear infinite;
}

/* US 06 : faire tourner le cercle. */
@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Respecter les préférences de réduction des animations.
   Le texte de chargement reste visible. */
@media (prefers-reduced-motion: reduce) {
  .spinner { animation: none; }
}
</style>
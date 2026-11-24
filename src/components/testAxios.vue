<template>
  <div>
    <!-- US 04 : la nouvelle barre de recherche transmet le texte à SearchBreweries. -->
    <SearchBar :disabled="isLoading" @search="searchBreweries" /> <!-- @search écoute le text envoyé par SearchBar et disabled bloque la barre pendant le chargement -->
    
    <!-- Boutons pour afficher ou cacher les brasseries -->
    <button :disabled="isLoading" @click="ShowBreweries">Voir tout</button>
    <button :disabled="isLoading" @click="HideBreweries">Cacher tout</button>
    <button :disabled="isLoading" @click="getRandomBrewery">Brasserie aléatoire</button>

    <!-- US 09 : filtres de l'API (partie du nom, ville, pays, type) -->
    <BreweryFilters :disabled="isLoading" @filter="filterBreweries" />


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

    <!-- US 09 : fiche de la brasserie (champs absents gérés dans BreweryDetail) -->
    <!-- US 06 : masquer l'ancienne fiche pendant l'attente ou une erreur. -->
    <BreweryDetail
      v-if="details && brewery && !isLoading && !error"
      :brewery="brewery"
      @back="backToList"
    />

  </div>
</template>

<script>
import axios from 'axios'
import MediaList from './MediaList.vue'
import SearchBar from './SearchBar.vue' // US 04 : importer le composant de barre de recherche
import { searchBreweries as searchBreweriesApi} from '../services/breweries.js' // US 04 : importation de la fonction qui apelle l'API
import { getBreweryById, filterBreweries as filterBreweriesApi, toUserError } from '../services/breweries.js' // US 09
import BreweryDetail from './BreweryDetail.vue' // US 09 : fiche de la brasserie
import BreweryFilters from './BreweryFilters.vue' // US 09 : filtres

export default {
  components: { MediaList, SearchBar, BreweryDetail, BreweryFilters },

  data() {
    return {
      breweries: [],
      showBreweries: true,
      error: null,
      isLoading: false, // US 06 : vrai uniquement pendant une requête HTTP.
      details: false,
      brewery: null, // US 09 : la brasserie affichée dans la fiche
      hasSearched: false // US 05 : pour afficher « 404 - Not found » si la recherche ne trouve rien
    }
  },

  methods: {

    // Récupérer toutes les brasseries
    async ShowBreweries() {
      // US 06 : empêcher une deuxième requête pendant le chargement.
      if (this.isLoading) return  // return dit de sortir, éventuellement en retournant le résultat de la fonction
      // US 06 :  afficher le loader avant de lancer la requête
      this.isLoading = true //else implicite
      
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
    async searchBreweries(term) {
      // US 04 : ne rien envoyer si le texte est vide.
      if (typeof term!== 'string' || !term.trim()) return
      if (this.isLoading) return
      this.isLoading = true
      try {
        this.error = null
        this.details = false
        // US 04 : le service renvoie directement le tableau.
        this.breweries = await searchBreweriesApi(term)
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

    // US 09 : récupérer la fiche d'une brasserie grâce à son identifiant
    async getBreweryDetails(breweryId) {
      if (this.isLoading) return
      this.isLoading = true
      try {
        // On garde la liste en mémoire pour pouvoir y revenir avec « Retour ».
        this.error = null
        this.brewery = await getBreweryById(breweryId)
        this.details = true
      } catch (error) {
        this.error = toUserError(error) // US 06 : même message et même code
        console.error(error)
      } finally {
        this.isLoading = false
      }
    },

    // US 09 : revenir à la liste depuis la fiche
    backToList() {
      this.details = false
      this.brewery = null
      this.showBreweries = true
    },

    // US 09 : chercher avec les filtres de l'API (by_name accepte une partie du nom)
    async filterBreweries(filters) {
      if (this.isLoading) return
      this.isLoading = true
      try {
        this.error = null
        this.details = false
        this.breweries = await filterBreweriesApi(filters)
        this.showBreweries = true
        this.hasSearched = true
      } catch (error) {
        this.error = toUserError(error)
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
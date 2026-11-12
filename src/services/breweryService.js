// Service d'appel à l'API Open Brewery DB.
import axios from 'axios'

export const api = axios.create({
  baseURL: 'https://api.openbrewerydb.org/v1',
  timeout: 10000,
})

export const PER_PAGE = 20

/**
 * Recherche des brasseries par mot-clé.
 * @param {string} query mot-clé déjà nettoyé
 * @param {number} perPage nombre de résultats (max 200 côté API)
 * @returns {Promise<Array>} liste des brasseries
 */
export async function searchBreweries(query, perPage = PER_PAGE) {
  const response = await api.get('/breweries/search', {
    params: { query, per_page: perPage },
  })
  return Array.isArray(response.data) ? response.data : []
}

/**
 * Liste paginée de toutes les brasseries (bouton « Tout voir »).
 * @param {number} page numéro de page (commence à 1)
 * @returns {Promise<Array>}
 */
export async function getBreweries(page = 1, perPage = PER_PAGE) {
  const response = await api.get('/breweries', {
    params: { page, per_page: perPage, sort: 'name:asc' },
  })
  return Array.isArray(response.data) ? response.data : []
}

/**
 * Nombre total de brasseries (pour calculer le nombre de pages).
 * @returns {Promise<number|null>}
 */
export async function getBreweriesTotal() {
  const response = await api.get('/breweries/meta')
  const total = Number(response.data?.total)
  return Number.isFinite(total) ? total : null
}

/**
 * Détail d'une brasserie.
 * @param {string} id identifiant Open Brewery DB
 * @returns {Promise<Object>}
 */
export async function getBreweryById(id) {
  const response = await api.get(`/breweries/${encodeURIComponent(id)}`)
  return response.data
}

/**
 * Brasseries tirées au hasard (endpoint /breweries/random).
 * @param {number} size nombre de brasseries (1 à 50)
 * @returns {Promise<Array>}
 */
export async function getRandomBreweries(size = 1) {
  const response = await api.get('/breweries/random', { params: { size } })
  return Array.isArray(response.data) ? response.data : []
}

/**
 * Transforme une erreur Axios en message compréhensible pour l'utilisateur.
 * @param {unknown} error
 * @returns {string}
 */
export function getErrorMessage(error) {
  if (error?.code === 'ECONNABORTED') {
    return 'Le serveur met trop de temps à répondre. Réessayez plus tard.'
  }
  if (error?.response) {
    const status = error.response.status
    if (status === 404) return "Cette brasserie n'existe pas ou n'est plus référencée."
    if (status === 429) return 'Trop de requêtes. Patientez un instant avant de réessayer.'
    if (status >= 500) return 'Le service de brasseries est momentanément indisponible.'
    return `La requête a échoué (erreur ${status}).`
  }
  if (error?.request) {
    return 'Impossible de contacter le serveur. Vérifiez votre connexion Internet.'
  }
  return 'Une erreur inattendue est survenue.'
}

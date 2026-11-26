// US 04 : isoler la recherche dans le service API
import axios from 'axios'

const SEARCH_URL = 'https://api.openbrewerydb.org/v1/breweries/search'

export async function searchBreweries(rawQuery) {
  const term = rawQuery.trim()
  // Protection si le service est appelé ailleurs que depuis SearchBar.
  if (!term) return []

  const url = new URL(SEARCH_URL)
  url.searchParams.set('query', term)
  // URLSearchParams encode notamment &, +, les accents et les espaces.
  const response = await axios.get(url.toString())
  return response.data // Le tableau, pas l'objet réponse Axios complet.
}
// US 09 : fiche d'une brasserie et filtres

const BASE_URL = 'https://api.openbrewerydb.org/v1/breweries'

// Types acceptés par le paramètre by_type (documentation Open Brewery DB).
export const BREWERY_TYPES = [
  'micro',
  'nano',
  'regional',
  'brewpub',
  'large',
  'planning',
  'bar',
  'contract',
  'proprietor',
  'closed',
]

// US 09 : relier la fiche à l'API grâce à l'identifiant de la brasserie.
export async function getBreweryById(id) {
  if (typeof id !== 'string' || !id.trim()) {
    throw new Error('Identifiant de brasserie manquant')
  }
  // encodeURIComponent protège l'URL si l'id contient un caractère spécial.
  const response = await axios.get(`${BASE_URL}/${encodeURIComponent(id.trim())}`)
  return response.data // L'objet brasserie, pas la réponse Axios complète.
}

// US 09 : filtres de la documentation (by_name, by_city, by_country, by_type).
// by_name accepte une partie du nom : « alp » trouve « Alpine Beer Company ».
export async function filterBreweries(filters = {}, perPage = 50) {
  const url = new URL(BASE_URL)
  const textFilters = { by_name: filters.name, by_city: filters.city, by_country: filters.country }

  for (const [param, value] of Object.entries(textFilters)) {
    const term = typeof value === 'string' ? value.trim() : ''
    // La doc conseille des underscores à la place des espaces.
    if (term) url.searchParams.set(param, term.replace(/\s+/g, '_'))
  }
  if (BREWERY_TYPES.includes(filters.type)) url.searchParams.set('by_type', filters.type)

  // Aucun filtre rempli : on n'appelle pas l'API.
  if (![...url.searchParams.keys()].length) return []

  url.searchParams.set('per_page', String(perPage))
  const response = await axios.get(url.toString())
  return response.data
}

// US 09 : même message et même code que les erreurs du sprint 1 (US 06).
export function toUserError(error) {
  return {
    code: error?.response?.status || error?.code || 'UNKOWN_ERROR',
    message: error?.response
      ? 'Le serveur ne peut pas traiter la demande. Réessaie plus tard.'
      : error?.request || error?.code === 'ERR_NETWORK'
        ? 'Impossible de joindre le serveur. Vérifie ta connexion et réessaie.'
        : 'Une erreur inattendue est survenue.',
  }
}

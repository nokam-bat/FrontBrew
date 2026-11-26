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

export async function getBreweryById(id){
  const url = 'https://api.openbrewerydb.org/v1/breweries/'
  const { data } = await axios.get(url + encodeURIComponent(id))
  return data
}
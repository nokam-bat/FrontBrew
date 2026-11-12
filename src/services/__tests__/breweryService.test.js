// US 04 – Test d'intégration API (requête HTTP simulée)
import { describe, it, expect, vi, afterEach } from 'vitest'
import { api, searchBreweries, getErrorMessage } from '../breweryService'

afterEach(() => vi.restoreAllMocks())

describe('breweryService', () => {
  it('appelle /breweries/search avec le mot-clé', async () => {
    const spy = vi.spyOn(api, 'get').mockResolvedValue({ data: [{ id: '1', name: 'Dog Brew' }] })
    const data = await searchBreweries('dog')
    expect(spy).toHaveBeenCalledWith('/breweries/search', { params: { query: 'dog', per_page: 20 } })
    expect(data).toEqual([{ id: '1', name: 'Dog Brew' }])
  })

  it('renvoie un tableau vide si la réponse est inattendue', async () => {
    vi.spyOn(api, 'get').mockResolvedValue({ data: null })
    expect(await searchBreweries('dog')).toEqual([])
  })

  it('traduit les erreurs en messages lisibles', () => {
    expect(getErrorMessage({ response: { status: 500 } })).toMatch(/indisponible/)
    expect(getErrorMessage({ response: { status: 429 } })).toMatch(/Trop de requêtes/)
    expect(getErrorMessage({ request: {} })).toMatch(/connexion/)
    expect(getErrorMessage({ code: 'ECONNABORTED' })).toMatch(/trop de temps/)
  })
})

describe('breweryService – liste et détail', () => {
  it('getBreweries demande la bonne page', async () => {
    const spy = vi.spyOn(api, 'get').mockResolvedValue({ data: [] })
    const { getBreweries } = await import('../breweryService')
    await getBreweries(3)
    expect(spy).toHaveBeenCalledWith('/breweries', { params: { page: 3, per_page: 20, sort: 'name:asc' } })
  })

  it('getBreweryById appelle /breweries/:id', async () => {
    const spy = vi.spyOn(api, 'get').mockResolvedValue({ data: { id: 'x' } })
    const { getBreweryById } = await import('../breweryService')
    expect(await getBreweryById('x')).toEqual({ id: 'x' })
    expect(spy).toHaveBeenCalledWith('/breweries/x')
  })

  it('getBreweriesTotal lit le total', async () => {
    vi.spyOn(api, 'get').mockResolvedValue({ data: { total: '8000' } })
    const { getBreweriesTotal } = await import('../breweryService')
    expect(await getBreweriesTotal()).toBe(8000)
  })
})

describe('breweryService – hasard', () => {
  it('getRandomBreweries appelle /breweries/random avec size', async () => {
    const spy = vi.spyOn(api, 'get').mockResolvedValue({ data: [{ id: 'r' }] })
    const { getRandomBreweries } = await import('../breweryService')
    expect(await getRandomBreweries(3)).toEqual([{ id: 'r' }])
    expect(spy).toHaveBeenCalledWith('/breweries/random', { params: { size: 3 } })
  })
})

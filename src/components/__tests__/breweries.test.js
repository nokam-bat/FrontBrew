// US 04 : tester l'url transmise à Axios
import { beforeEach, describe, expect, it, vi } from 'vitest'
import axios from 'axios'
import { searchBreweries } from '../../services/breweries.js'

vi.mock('axios', () => ({ default: { get: vi.fn() } }))
beforeEach(() => axios.get.mockReset())

describe('US 04 — service de recherche', () => {
  it('construit l’URL attendue et renvoie les données', async () => {
    const items = [{ id: '1', name: 'Alpine Beer Company' }]
    axios.get.mockResolvedValueOnce({ data: items })

    const result = await searchBreweries('  Alpine  ')

    expect(axios.get).toHaveBeenCalledTimes(1)
    expect(axios.get).toHaveBeenCalledWith(
      'https://api.openbrewerydb.org/v1/breweries/search?query=Alpine'
    )
    expect(result).toEqual(items)
  })

  it('encode accents, espaces, & et + sans créer de paramètre parasite', async () => {
    axios.get.mockResolvedValueOnce({ data: [] })
    await searchBreweries('  Brasserie du Léman & Fils+  ')

    expect(axios.get).toHaveBeenCalledTimes(1)
    const url = new URL(axios.get.mock.calls[0][0])
    expect(url.origin).toBe('https://api.openbrewerydb.org')
    expect(url.pathname).toBe('/v1/breweries/search')
    expect([...url.searchParams.entries()]).toEqual([
      ['query', 'Brasserie du Léman & Fils+'],
    ])
    expect(url.toString()).toContain('%26')
    expect(url.toString()).toContain('%2B')
  })

  it.each(['', '   '])('ne contacte pas Axios pour %j', async (value) => {
    expect(await searchBreweries(value)).toEqual([])
    expect(axios.get).not.toHaveBeenCalled()
  })

  it('transmet les erreurs au parent', async () => {
    const failure = new Error('Réseau indisponible')
    axios.get.mockRejectedValueOnce(failure)
    await expect(searchBreweries('Alpine')).rejects.toThrow('Réseau indisponible')
  })
})
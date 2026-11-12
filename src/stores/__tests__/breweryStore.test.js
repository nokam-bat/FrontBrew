// US 06 – Test de l'état réactif : chargement, succès, échec
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useBreweryStore } from '../breweryStore'
import { searchBreweries, getRandomBreweries } from '../../services/breweryService'

vi.mock('../../services/breweryService', async (importOriginal) => ({
  ...(await importOriginal()),
  searchBreweries: vi.fn(),
  getRandomBreweries: vi.fn(),
}))

beforeEach(() => {
  setActivePinia(createPinia())
  vi.mocked(searchBreweries).mockReset()
})

describe('breweryStore', () => {
  it('passe isLoading à true pendant la requête', async () => {
    let resolve
    vi.mocked(searchBreweries).mockReturnValue(new Promise((r) => (resolve = r)))
    const store = useBreweryStore()
    const pending = store.search('dog')
    expect(store.isLoading).toBe(true)
    resolve([])
    await pending
    expect(store.isLoading).toBe(false)
  })

  it('succès : enregistre les résultats sans erreur', async () => {
    vi.mocked(searchBreweries).mockResolvedValue([{ id: '1', name: 'A' }])
    const store = useBreweryStore()
    await store.search('dog')
    expect(store.results).toHaveLength(1)
    expect(store.error).toBe('')
    expect(store.hasSearched).toBe(true)
  })

  it('échec : vide les résultats et renseigne le message d’erreur', async () => {
    vi.mocked(searchBreweries).mockRejectedValue({ response: { status: 500 } })
    const store = useBreweryStore()
    await store.search('dog')
    expect(store.results).toEqual([])
    expect(store.error).toMatch(/indisponible/)
    expect(store.isLoading).toBe(false)
  })

  it('ignore la réponse d’une recherche plus ancienne', async () => {
    let resolveOld
    vi.mocked(searchBreweries)
      .mockReturnValueOnce(new Promise((r) => (resolveOld = r)))
      .mockResolvedValueOnce([{ id: 'new', name: 'Nouveau' }])
    const store = useBreweryStore()
    const oldSearch = store.search('old')
    await store.search('new')
    resolveOld([{ id: 'old', name: 'Ancien' }])
    await oldSearch
    expect(store.results[0].id).toBe('new')
  })

  it('mémorise les brasseries tirées au hasard pour la fiche', async () => {
    vi.mocked(getRandomBreweries).mockResolvedValue([{ id: 'x', name: 'Surprise' }])
    const store = useBreweryStore()
    await store.fetchRandom(1)
    expect(store.findById('x').name).toBe('Surprise')
  })

  it('reset revient à l’état initial', async () => {
    vi.mocked(searchBreweries).mockResolvedValue([{ id: '1' }])
    const store = useBreweryStore()
    await store.search('dog')
    store.reset()
    expect(store.results).toEqual([])
    expect(store.hasSearched).toBe(false)
  })
})

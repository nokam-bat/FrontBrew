// US 09 : filtres créés à partir de la documentation de l'API
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import axios from 'axios'
import BreweryFilters from '../BreweryFilters.vue'
import TestAxios from '../testAxios.vue'
import { filterBreweries, getBreweryById, toUserError } from '../../services/breweries.js'

vi.mock('axios', () => ({ default: { get: vi.fn() } }))
beforeEach(() => axios.get.mockReset())

describe('US 09 — service', () => {
  it('cherche avec une partie du nom (by_name)', async () => {
    axios.get.mockResolvedValueOnce({ data: [{ id: '1', name: 'Alpine Beer Company' }] })
    const result = await filterBreweries({ name: '  alp  ' })

    const url = new URL(axios.get.mock.calls[0][0])
    expect(url.pathname).toBe('/v1/breweries')
    expect(url.searchParams.get('by_name')).toBe('alp')
    expect(result).toEqual([{ id: '1', name: 'Alpine Beer Company' }])
  })

  it('combine les filtres et remplace les espaces par des underscores', async () => {
    axios.get.mockResolvedValueOnce({ data: [] })
    await filterBreweries({ name: 'stone', city: 'San Diego', country: 'United States', type: 'micro' })

    const url = new URL(axios.get.mock.calls[0][0])
    expect(url.searchParams.get('by_name')).toBe('stone')
    expect(url.searchParams.get('by_city')).toBe('San_Diego')
    expect(url.searchParams.get('by_country')).toBe('United_States')
    expect(url.searchParams.get('by_type')).toBe('micro')
    expect(url.searchParams.get('per_page')).toBe('50')
  })

  it('ignore un type qui n’existe pas dans la doc', async () => {
    axios.get.mockResolvedValueOnce({ data: [] })
    await filterBreweries({ name: 'alp', type: 'inconnu' })
    const url = new URL(axios.get.mock.calls[0][0])
    expect(url.searchParams.has('by_type')).toBe(false)
  })

  it('n’appelle pas l’API sans filtre', async () => {
    expect(await filterBreweries({ name: '   ' })).toEqual([])
    expect(axios.get).not.toHaveBeenCalled()
  })

  it('getBreweryById encode l’identifiant', async () => {
    axios.get.mockResolvedValueOnce({ data: { id: 'a b' } })
    await getBreweryById('a b')
    expect(axios.get).toHaveBeenCalledWith('https://api.openbrewerydb.org/v1/breweries/a%20b')
  })

  it('getBreweryById refuse un identifiant vide', async () => {
    await expect(getBreweryById('')).rejects.toThrow('Identifiant de brasserie manquant')
    expect(axios.get).not.toHaveBeenCalled()
  })

  it('toUserError donne les mêmes messages que l’US 06', () => {
    expect(toUserError({ response: { status: 500 } })).toEqual({
      code: 500,
      message: 'Le serveur ne peut pas traiter la demande. Réessaie plus tard.',
    })
    expect(toUserError({ request: {}, code: 'ERR_NETWORK' }).message).toBe(
      'Impossible de joindre le serveur. Vérifie ta connexion et réessaie.',
    )
  })
})

describe('US 09 — BreweryFilters.vue', () => {
  it('émet les filtres remplis, sans espaces inutiles', async () => {
    const wrapper = mount(BreweryFilters)
    await wrapper.get('[data-test="filter-name"]').setValue('  alp ')
    await wrapper.get('[data-test="filter-type"]').setValue('micro')
    await wrapper.get('form').trigger('submit')
    expect(wrapper.emitted('filter')).toEqual([[{ name: 'alp', type: 'micro' }]])
  })

  it('affiche un message si aucun filtre n’est rempli', async () => {
    const wrapper = mount(BreweryFilters)
    await wrapper.get('[data-test="filter-city"]').setValue('   ')
    await wrapper.get('form').trigger('submit')
    expect(wrapper.emitted('filter')).toBeUndefined()
    expect(wrapper.get('[data-test="filter-message"]').text()).toBe('Remplis au moins un filtre.')
  })

  it('propose les types de la documentation', () => {
    const wrapper = mount(BreweryFilters)
    const values = wrapper.findAll('option').map((o) => o.attributes('value'))
    expect(values).toEqual(expect.arrayContaining(['micro', 'brewpub', 'regional', 'closed']))
  })

  it('bloque le bouton pendant un chargement', () => {
    const wrapper = mount(BreweryFilters, { props: { disabled: true } })
    expect(wrapper.get('[data-test="filter-submit"]').attributes('disabled')).toBeDefined()
  })
})

describe('US 09 — filtres dans testAxios.vue', () => {
  let wrapper
  beforeEach(() => {
    wrapper = mount(TestAxios, { attachTo: document.body })
  })
  afterEach(() => {
    wrapper.unmount()
    document.body.innerHTML = ''
  })

  it('affiche le loader puis les cartes trouvées par partie de nom', async () => {
    let resolve
    axios.get.mockReturnValueOnce(new Promise((r) => (resolve = r)))
    await wrapper.get('[data-test="filter-name"]').setValue('alp')
    await wrapper.get('[data-test="filter-submit"]').trigger('click')

    expect(wrapper.find('[data-test="loader"]').exists()).toBe(true)
    resolve({ data: [{ id: '1', name: 'Alpine Beer Company' }] })
    await flushPromises()

    expect(wrapper.find('[data-test="loader"]').exists()).toBe(false)
    expect(wrapper.findAll('[data-test="media-card"]')).toHaveLength(1)
    expect(wrapper.text()).toContain('Alpine Beer Company')
  })

  it('affiche « 404 - Not found » si aucun résultat', async () => {
    axios.get.mockResolvedValueOnce({ data: [] })
    await wrapper.get('[data-test="filter-name"]').setValue('zzzz')
    await wrapper.get('[data-test="filter-submit"]').trigger('click')
    await flushPromises()
    expect(wrapper.get('[data-test="empty"]').text()).toContain('404 - Not found')
  })
})

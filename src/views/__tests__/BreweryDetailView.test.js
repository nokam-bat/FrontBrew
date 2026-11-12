// Fiche détaillée d'une brasserie
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import BreweryDetailView from '../BreweryDetailView.vue'
import { routes } from '../../router'
import { getBreweryById } from '../../services/breweryService'

vi.mock('../../services/breweryService', async (importOriginal) => ({
  ...(await importOriginal()),
  getBreweryById: vi.fn(),
}))

const brewery = {
  id: 'broyarde',
  name: 'Brasserie artisanale Broyarde',
  brewery_type: 'micro',
  address_1: 'Rue de la Broye 1',
  postal_code: '1530',
  city: 'Payerne',
  country: 'Switzerland',
  phone: '0795389001',
  website_url: 'https://www.brassarti.ch/',
  latitude: '46.82',
  longitude: '6.94',
}

let pinia
let router
beforeEach(() => {
  pinia = createPinia()
  setActivePinia(pinia)
  router = createRouter({ history: createMemoryHistory(), routes })
  vi.mocked(getBreweryById).mockReset()
})

async function mountDetail(id = 'broyarde') {
  router.push({ name: 'brewery', params: { id } })
  await router.isReady()
  const wrapper = mount(BreweryDetailView, {
    props: { id },
    global: { plugins: [pinia, router] },
  })
  await flushPromises()
  return wrapper
}

describe('BreweryDetailView.vue', () => {
  it('affiche toutes les informations de la brasserie', async () => {
    vi.mocked(getBreweryById).mockResolvedValue(brewery)
    const wrapper = await mountDetail()
    expect(getBreweryById).toHaveBeenCalledWith('broyarde')
    expect(wrapper.text()).toContain('Brasserie artisanale Broyarde - Microbrasserie')
    expect(wrapper.get('[data-test="address"]').text()).toContain('1530 Payerne')
    expect(wrapper.get('[data-test="address"]').text()).toContain('Suisse')
    expect(wrapper.get('[data-test="phone"] a').attributes('href')).toBe('tel:0795389001')
    expect(wrapper.get('[data-test="phone"]').text()).toBe('079 538 90 01')
    expect(wrapper.get('[data-test="website"] a').text()).toBe('brassarti.ch')
    expect(wrapper.find('[data-test="map"] iframe').attributes('src')).toContain('marker=46.82,6.94')
  })

  it('indique les champs manquants et l’absence de carte', async () => {
    vi.mocked(getBreweryById).mockResolvedValue({ id: 'x', name: 'Mini' })
    const wrapper = await mountDetail('x')
    expect(wrapper.get('[data-test="phone"]').text()).toBe('Non renseigné')
    expect(wrapper.find('[data-test="map-empty"]').exists()).toBe(true)
  })

  it("affiche une erreur si la brasserie n'existe pas", async () => {
    vi.mocked(getBreweryById).mockRejectedValue({ response: { status: 404 } })
    const wrapper = await mountDetail('inconnue')
    expect(wrapper.get('[data-test="error-alert"]').text()).toMatch(/n'existe pas/)
  })
})

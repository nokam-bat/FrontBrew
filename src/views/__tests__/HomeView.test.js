// US 06 – Test v-if="isLoading" et alerte ; intégration avec Vue Router
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import HomeView from '../HomeView.vue'
import { routes } from '../../router'
import { useBreweryStore } from '../../stores/breweryStore'
import { searchBreweries, getRandomBreweries } from '../../services/breweryService'

vi.mock('../../services/breweryService', async (importOriginal) => ({
  ...(await importOriginal()),
  searchBreweries: vi.fn(),
  getRandomBreweries: vi.fn(),
}))

const randomList = [
  { id: 'r1', name: 'Hasard 1' },
  { id: 'r2', name: 'Hasard 2' },
  { id: 'r3', name: 'Hasard 3' },
]

let pinia
let router

beforeEach(async () => {
  pinia = createPinia()
  setActivePinia(pinia)
  router = createRouter({ history: createMemoryHistory(), routes })
  vi.mocked(searchBreweries).mockReset().mockResolvedValue([{ id: '1', name: 'Dog Brew' }])
  vi.mocked(getRandomBreweries)
    .mockReset()
    .mockImplementation(async (size) => randomList.slice(0, size))
})

async function mountAt(path) {
  router.push(path)
  await router.isReady()
  const wrapper = mount(HomeView, { global: { plugins: [pinia, router] } })
  await flushPromises()
  return wrapper
}

describe('HomeView.vue', () => {
  it('affiche le loader quand isLoading est vrai', async () => {
    const wrapper = await mountAt('/')
    const store = useBreweryStore()
    expect(wrapper.find('[data-test="loader"]').exists()).toBe(false)
    store.isLoading = true
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[data-test="loader"]').exists()).toBe(true)
  })

  it("affiche l'alerte en cas d'erreur et la ferme", async () => {
    const wrapper = await mountAt('/')
    const store = useBreweryStore()
    store.error = 'Oups'
    await wrapper.vm.$nextTick()
    expect(wrapper.get('[data-test="error-alert"]').text()).toContain('Oups')
    await wrapper.get('[data-test="close"]').trigger('click')
    expect(wrapper.find('[data-test="error-alert"]').exists()).toBe(false)
  })

  it("lance la recherche depuis l'URL (?q=)", async () => {
    const wrapper = await mountAt('/?q=dog')
    expect(searchBreweries).toHaveBeenCalledWith('dog')
    expect(wrapper.get('[data-test="search-input"]').element.value).toBe('dog')
    expect(wrapper.text()).toContain('Dog Brew')
  })

  it("met le mot-clé dans l'URL après une recherche", async () => {
    const wrapper = await mountAt('/')
    await wrapper.get('[data-test="search-input"]').setValue('ale')
    await wrapper.get('form').trigger('submit')
    await flushPromises()
    expect(router.currentRoute.value.query.q).toBe('ale')
  })

  it('redirige les URL inconnues vers la page 404', async () => {
    await router.push('/nimporte-quoi')
    expect(router.currentRoute.value.name).toBe('not-found')
  })

  it('affiche 3 « pépites » tirées au hasard sur l’accueil', async () => {
    const wrapper = await mountAt('/')
    expect(getRandomBreweries).toHaveBeenCalledWith(3)
    expect(wrapper.findAll('[data-test="brewery-tile"]')).toHaveLength(3)
  })

  it('« Surprenez-moi » ouvre la fiche d’une brasserie au hasard', async () => {
    const wrapper = await mountAt('/')
    await wrapper.get('[data-test="random-hero"]').trigger('click')
    await flushPromises()
    expect(getRandomBreweries).toHaveBeenLastCalledWith(1)
    // la fiche est chargée à la demande (lazy loading) : on attend la navigation
    await vi.waitFor(() => expect(router.currentRoute.value.name).toBe('brewery'))
    expect(router.currentRoute.value.params.id).toBe('r1')
  })

  it('les suggestions lancent une recherche', async () => {
    const wrapper = await mountAt('/')
    const chip = wrapper.findAll('.suggestion').find((b) => b.text() === 'Dublin')
    await chip.trigger('click')
    await flushPromises()
    expect(searchBreweries).toHaveBeenCalledWith('Dublin')
    expect(router.currentRoute.value.query.q).toBe('Dublin')
  })
})

// Page « Tout voir »
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import AllBreweriesView from '../AllBreweriesView.vue'
import { routes } from '../../router'
import { getBreweries, getBreweriesTotal } from '../../services/breweryService'

vi.mock('../../services/breweryService', async (importOriginal) => ({
  ...(await importOriginal()),
  getBreweries: vi.fn(),
  getBreweriesTotal: vi.fn(),
}))

const page = (n) => Array.from({ length: 20 }, (_, i) => ({ id: `${n}-${i}`, name: `B${i}` }))

let router
beforeEach(() => {
  setActivePinia(createPinia())
  router = createRouter({ history: createMemoryHistory(), routes })
  vi.mocked(getBreweries).mockReset().mockImplementation(async (n) => page(n))
  vi.mocked(getBreweriesTotal).mockReset().mockResolvedValue(45)
})

async function mountAt(path) {
  router.push(path)
  await router.isReady()
  const wrapper = mount(AllBreweriesView, { global: { plugins: [router] } })
  await flushPromises()
  return wrapper
}

describe('AllBreweriesView.vue', () => {
  it('affiche la première page et le nombre de pages', async () => {
    const wrapper = await mountAt('/tout')
    expect(getBreweries).toHaveBeenCalledWith(1)
    expect(wrapper.findAll('[data-test="media-card"]')).toHaveLength(20)
    expect(wrapper.get('[data-test="page-info"]').text()).toBe('Page 1 / 3')
    expect(wrapper.get('[data-test="prev"]').attributes('disabled')).toBeDefined()
  })

  it('passe à la page suivante via l’URL', async () => {
    const wrapper = await mountAt('/tout')
    await wrapper.get('[data-test="next"]').trigger('click')
    await flushPromises()
    expect(router.currentRoute.value.query.page).toBe('2')
    expect(getBreweries).toHaveBeenLastCalledWith(2)
  })

  it('désactive « Suivante » sur la dernière page', async () => {
    const wrapper = await mountAt('/tout?page=3')
    expect(wrapper.get('[data-test="next"]').attributes('disabled')).toBeDefined()
  })

  it("affiche une alerte en cas d'erreur", async () => {
    vi.mocked(getBreweries).mockRejectedValue({ request: {} })
    const wrapper = await mountAt('/tout')
    expect(wrapper.get('[data-test="error-alert"]').text()).toMatch(/connexion/)
  })
})

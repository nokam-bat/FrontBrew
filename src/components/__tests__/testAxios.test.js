// US 06 : Test Axios
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import axios from 'axios'
import TestAxios from '../testAxios.vue'
import MediaList from '../MediaList.vue'

// Aucun appel au vrai serveur pendant ces tests.
vi.mock('axios', () => ({ default: { get: vi.fn() } }))

// On décide quand la requête se termine, pour tester l'attente.
function deferred() {
  let resolve
  let reject
  const promise = new Promise((res, rej) => {
    resolve = res
    reject = rej
  })
  return { promise, resolve, reject }
}

describe('US 06 — chargement et erreurs', () => {
  let wrapper
  beforeEach(() => {
    axios.get.mockReset()
    wrapper = mount(TestAxios, { attachTo: document.body})
  })
  afterEach(() => {
    wrapper.unmount()
    document.body.innerHTML = ''
})

  async function search() {
    await wrapper.get('input').setValue('Lac')
    const button = wrapper.findAll('button')
      .find(b => b.text() === 'Rechercher')
    await button.trigger('click')
  }

  it('affiche le loader et masque la liste pendant l’attente', async () => {
    const request = deferred()
    axios.get.mockReturnValueOnce(request.promise)
    await search()

    expect(axios.get).toHaveBeenCalledTimes(1)
    expect(wrapper.find('[data-test="loader"]').exists()).toBe(true)
    expect(wrapper.findComponent(MediaList).exists()).toBe(false)
    expect(wrapper.find('[data-test="error"]').exists()).toBe(false)

    request.resolve({ data: [] })
    await flushPromises()
  })

  it('affiche les cartes après un succès', async () => {
    const request = deferred()
    axios.get.mockReturnValueOnce(request.promise)
    await search()
    expect(wrapper.find('[data-test="loader"]').exists()).toBe(true)

    request.resolve({ data: [
      { id: '1', name: 'Brasserie du Lac' },
      { id: '2', name: 'Brasserie des Alpes' },
    ] })
    await flushPromises()

    expect(wrapper.find('[data-test="loader"]').exists()).toBe(false)
    expect(wrapper.find('[data-test="error"]').exists()).toBe(false)
    expect(wrapper.findAll('[data-test="media-card"]')).toHaveLength(2)
    expect(wrapper.text()).toContain('Brasserie du Lac')
  })

  it.each([
    ['500', { response: { status: 500 } },
      'Le serveur ne peut pas traiter la demande. Réessaie plus tard.'],
    ['ERR_NETWORK', { request: {}, code: 'ERR_NETWORK' },
      'Impossible de joindre le serveur. Vérifie ta connexion et réessaie.'],
  ])('affiche le message et le code %s après un échec', async (code, failure, message) => {
    const request = deferred()
    axios.get.mockReturnValueOnce(request.promise)
    await search()
    expect(wrapper.find('[data-test="loader"]').exists()).toBe(true)

    request.reject(failure)
    await flushPromises()

    expect(wrapper.find('[data-test="loader"]').exists()).toBe(false)
    expect(wrapper.findComponent(MediaList).exists()).toBe(false)
    const alert = wrapper.get('[data-test="error"]')
    expect(alert.attributes('role')).toBe('alert')
    expect(alert.text()).toContain(message)
    expect(alert.text()).toContain('Code : ' + code)
  })

  it('laisse MediaList afficher son message après un succès vide', async () => {
    axios.get.mockResolvedValueOnce({ data: [] })
    await search()
    await flushPromises()

    expect(wrapper.find('[data-test="loader"]').exists()).toBe(false)
    expect(wrapper.find('[data-test="error"]').exists()).toBe(false)
    expect(wrapper.get('[data-test="empty"]').exists()).toBe(true)
  })

  it.each([
    ['Voir tout', 'ShowBreweries', []],
    ['Aléatoire', 'getRandomBrewery', []],
    ['Détails', 'getBreweryDetails', ['1']],
  ])('gère aussi le cycle de %s', async (label, method, args) => {
    const request = deferred()
    axios.get.mockReturnValueOnce(request.promise)

    const pending = wrapper.vm[method](...args)
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[data-test="loader"]').exists()).toBe(true)
    expect(wrapper.findComponent(MediaList).exists()).toBe(false)

    request.resolve({ data: method === 'getBreweryDetails'
      ? { id: '1', name: 'Résultat de test' }
      : [{ id: '1', name: 'Résultat de test' }] })
    await pending
    await flushPromises()

    expect(wrapper.find('[data-test="loader"]').exists()).toBe(false)
    expect(wrapper.text()).toContain('Résultat de test')
  })
})

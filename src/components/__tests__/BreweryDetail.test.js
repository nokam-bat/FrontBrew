// US 09 : tests de la fiche avec des réponses API simulées
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import axios from 'axios'
import BreweryDetail from '../BreweryDetail.vue'
import TestAxios from '../testAxios.vue'

// Aucun appel au vrai serveur pendant ces tests.
vi.mock('axios', () => ({ default: { get: vi.fn() } }))

// Réponse simulée de GET /breweries/{id}
const fullBrewery = {
  id: 'b54b16e1-ac3b-4bff-a11f-f7ae9ddc27e0',
  name: 'Brasserie artisanale Broyarde',
  brewery_type: 'micro',
  address_1: 'Rue de la Broye 1',
  address_2: null,
  address_3: null,
  postal_code: '1530',
  city: 'Payerne',
  state_province: 'Vaud',
  country: 'Switzerland',
  phone: '0795389001',
  website_url: 'https://www.brassarti.ch/',
}

describe('US 09 — BreweryDetail.vue', () => {
  it('affiche l’adresse, le téléphone et le site web', () => {
    const wrapper = mount(BreweryDetail, { props: { brewery: fullBrewery } })
    expect(wrapper.get('h1').text()).toBe('Brasserie artisanale Broyarde - micro')

    const address = wrapper.get('[data-test="address"]').text()
    expect(address).toContain('Rue de la Broye 1')
    expect(address).toContain('1530 Payerne')
    expect(address).toContain('Vaud, Switzerland')
    expect(address).not.toContain('null')

    expect(wrapper.get('[data-test="phone"] a').attributes('href')).toBe('tel:0795389001')

    const link = wrapper.get('[data-test="website"] a')
    expect(link.attributes('href')).toBe('https://www.brassarti.ch/')
    expect(link.attributes('target')).toBe('_blank')
    expect(link.text()).toBe('www.brassarti.ch')
  })

  it('gère les champs absents', () => {
    const wrapper = mount(BreweryDetail, {
      props: { brewery: { id: 'x', name: 'Mini', phone: null, website_url: null } },
    })
    expect(wrapper.get('[data-test="address"]').text()).toBe('Non renseignée')
    expect(wrapper.get('[data-test="phone"]').text()).toBe('Non renseigné')
    expect(wrapper.get('[data-test="website"]').text()).toBe('Non renseigné')
    expect(wrapper.find('a').exists()).toBe(false)
  })

  it('refuse un lien de site web qui n’est pas en http(s)', () => {
    const wrapper = mount(BreweryDetail, {
      props: { brewery: { id: 'x', name: 'Mini', website_url: 'javascript:alert(1)' } },
    })
    expect(wrapper.get('[data-test="website"]').text()).toBe('Non renseigné')
  })

  it('émet "back" au clic sur « Retour à la liste »', async () => {
    const wrapper = mount(BreweryDetail, { props: { brewery: fullBrewery } })
    await wrapper.get('[data-test="back"]').trigger('click')
    expect(wrapper.emitted('back')).toHaveLength(1)
  })
})

describe('US 09 — fiche reliée à l’API dans testAxios.vue', () => {
  let wrapper
  beforeEach(() => {
    axios.get.mockReset()
    wrapper = mount(TestAxios, { attachTo: document.body })
  })
  afterEach(() => {
    wrapper.unmount()
    document.body.innerHTML = ''
  })

  // Affiche une liste, prépare la réponse de la fiche, puis clique sur « Voir les détails ».
  async function openFirstDetail(mockDetailResponse) {
    axios.get.mockResolvedValueOnce({ data: [fullBrewery] })
    await wrapper.vm.ShowBreweries()
    await flushPromises()
    mockDetailResponse()
    await wrapper.get('[data-test="details"]').trigger('click')
  }

  it('appelle l’API avec l’identifiant de la fiche', async () => {
    await openFirstDetail(() => axios.get.mockResolvedValueOnce({ data: fullBrewery }))
    await flushPromises()

    expect(axios.get).toHaveBeenLastCalledWith(
      'https://api.openbrewerydb.org/v1/breweries/b54b16e1-ac3b-4bff-a11f-f7ae9ddc27e0',
    )
    expect(wrapper.get('[data-test="detail"]').text()).toContain('Brasserie artisanale Broyarde')
  })

  it('réutilise le loader du sprint 1 pendant le chargement de la fiche', async () => {
    let resolve
    await openFirstDetail(() => axios.get.mockReturnValueOnce(new Promise((r) => (resolve = r))))

    expect(wrapper.find('[data-test="loader"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="detail"]').exists()).toBe(false)

    resolve({ data: fullBrewery })
    await flushPromises()
    expect(wrapper.find('[data-test="loader"]').exists()).toBe(false)
    expect(wrapper.find('[data-test="detail"]').exists()).toBe(true)
  })

  it('réutilise le message d’erreur du sprint 1 si la fiche ne charge pas', async () => {
    await openFirstDetail(() => axios.get.mockRejectedValueOnce({ response: { status: 404 } }))
    await flushPromises()

    const alert = wrapper.get('[data-test="error"]')
    expect(alert.text()).toContain('Le serveur ne peut pas traiter la demande.')
    expect(alert.text()).toContain('Code : 404')
    expect(wrapper.find('[data-test="detail"]').exists()).toBe(false)
  })

  it('revient à la liste avec « Retour à la liste »', async () => {
    await openFirstDetail(() => axios.get.mockResolvedValueOnce({ data: fullBrewery }))
    await flushPromises()

    await wrapper.get('[data-test="back"]').trigger('click')
    expect(wrapper.find('[data-test="detail"]').exists()).toBe(false)
    expect(wrapper.findAll('[data-test="media-card"]')).toHaveLength(1)
  })
})

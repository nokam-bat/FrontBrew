// US 05 – Test MediaCard.vue
import { describe, it, expect } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'
import MediaCard from '../MediaCard.vue'

const brewery = {
  id: 'abc-123',
  name: 'Ballast Point',
  brewery_type: 'large',
  city: 'San Diego',
  state_province: 'California',
  country: 'United States',
  website_url: 'https://ballastpoint.com',
}

const mountCard = (b) =>
  mount(MediaCard, { props: { brewery: b }, global: { stubs: { RouterLink: RouterLinkStub } } })

describe('MediaCard.vue', () => {
  it('affiche les informations de la brasserie (en français)', () => {
    const wrapper = mountCard(brewery)
    expect(wrapper.text()).toContain('Ballast Point')
    expect(wrapper.get('[data-test="type"]').text()).toBe('Grande brasserie')
    expect(wrapper.get('[data-test="location"]').text()).toBe('San Diego, États-Unis')
  })

  it('renvoie vers la fiche détaillée de la brasserie', () => {
    const wrapper = mountCard(brewery)
    expect(wrapper.getComponent(RouterLinkStub).props('to')).toEqual({
      name: 'brewery',
      params: { id: 'abc-123' },
    })
  })

  it('masque les champs absents', () => {
    const wrapper = mountCard({ id: '2', name: 'Sans infos' })
    expect(wrapper.find('[data-test="location"]').exists()).toBe(false)
    expect(wrapper.find('[data-test="type"]').exists()).toBe(false)
  })
})

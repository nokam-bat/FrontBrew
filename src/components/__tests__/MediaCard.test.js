// US 05 – Test MediaCard.vue
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MediaCard from '../MediaCard.vue'

const brewery = {
  id: 'abc-123',
  name: 'Ballast Point',
  brewery_type: 'large',
  city: 'San Diego',
  state_province: 'California',
  country: 'United States',
}

describe('MediaCard.vue', () => {
  it('affiche le nom, le type et le lieu de la brasserie', () => {
    const wrapper = mount(MediaCard, { props: { brewery } })
    expect(wrapper.text()).toContain('Ballast Point')
    expect(wrapper.get('[data-test="type"]').text()).toBe('large')
    expect(wrapper.get('[data-test="location"]').text()).toBe(
      'San Diego, California, United States',
    )
  })

  it('émet "details" avec l’id quand on clique sur « Voir les détails »', async () => {
    const wrapper = mount(MediaCard, { props: { brewery } })
    await wrapper.get('[data-test="details"]').trigger('click')
    expect(wrapper.emitted('details')).toEqual([['abc-123']])
  })

  it('masque les informations absentes', () => {
    const wrapper = mount(MediaCard, { props: { brewery: { id: '2', name: 'Sans infos' } } })
    expect(wrapper.find('[data-test="type"]').exists()).toBe(false)
    expect(wrapper.find('[data-test="location"]').exists()).toBe(false)
  })
})

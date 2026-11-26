// US 05 et US 07 – Tests de MediaCard.vue
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MediaCard from '../MediaCard.vue'
import router from '../../router'

const brewery = {
  id: 'abc-123',
  name: 'Ballast Point',
  brewery_type: 'large',
  city: 'San Diego',
  state_province: 'California',
  country: 'United States',
}

function monterCarte(brasserie) {
  return mount(MediaCard, {
    props: { brewery: brasserie },
    global: { plugins: [router] },
  })
}

describe('MediaCard.vue', () => {
  it('affiche le nom, le type et le lieu de la brasserie', () => {
    const wrapper = monterCarte(brewery)
    expect(wrapper.text()).toContain('Ballast Point')
    expect(wrapper.get('[data-test="type"]').text()).toBe('large')
    expect(wrapper.get('[data-test="location"]').text()).toBe(
      'San Diego, California, United States',
    )
  })

  it('affiche un lien vers la fiche de la brasserie', () => {
    const wrapper = monterCarte(brewery)
    expect(wrapper.get('a').attributes('href')).toBe('/detail/abc-123')
  })

  it('masque les informations absentes', () => {
    const wrapper = monterCarte({ id: '2', name: 'Sans infos' })
    expect(wrapper.find('[data-test="type"]').exists()).toBe(false)
    expect(wrapper.find('[data-test="location"]').exists()).toBe(false)
  })
})
// US 05 et US 07 – Tests de MediaList.vue
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MediaList from '../MediaList.vue'
import MediaCard from '../MediaCard.vue'
import router from '../../router'

const items = [
  { id: '1', name: 'A' },
  { id: '2', name: 'B' },
  { id: '3', name: 'C' },
]

function monterListe(props) {
  return mount(MediaList, {
    props,
    global: { plugins: [router] },
  })
}

describe('MediaList.vue', () => {
  it('affiche une MediaCard par brasserie', () => {
    const wrapper = monterListe({ items })
    expect(wrapper.findAllComponents(MediaCard)).toHaveLength(3)
    expect(wrapper.get('[data-test="count"]').text()).toBe('3 résultats')
  })

  it('met la liste à jour quand les données changent', async () => {
    const wrapper = monterListe({ items })
    await wrapper.setProps({ items: [items[0]] })
    expect(wrapper.findAllComponents(MediaCard)).toHaveLength(1)
    expect(wrapper.get('[data-test="count"]').text()).toBe('1 résultat')
  })

  it('affiche un lien vers la bonne fiche pour chacune des deux cartes', () => {
    const wrapper = monterListe({ items: [items[0], items[1]] })
    const cartes = wrapper.findAllComponents(MediaCard)

    expect(cartes).toHaveLength(2)
    expect(cartes[0].get('a').attributes('href')).toBe('/detail/1')
    expect(cartes[1].get('a').attributes('href')).toBe('/detail/2')
  })

  it('affiche « 404 - Not found » quand une recherche ne donne rien', () => {
    const wrapper = monterListe({ items: [], hasSearched: true })
    expect(wrapper.get('[data-test="empty"]').text()).toContain('404 - Not found')
  })

  it("n'affiche rien avant la première recherche", () => {
    const wrapper = monterListe({ items: [] })
    expect(wrapper.find('[data-test="empty"]').exists()).toBe(false)
    expect(wrapper.find('[data-test="count"]').exists()).toBe(false)
  })
})
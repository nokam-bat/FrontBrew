// US 05 – Test MediaList.vue (boucle v-for)
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MediaList from '../MediaList.vue'
import MediaCard from '../MediaCard.vue'

const items = [
  { id: '1', name: 'A' },
  { id: '2', name: 'B' },
  { id: '3', name: 'C' },
]

describe('MediaList.vue', () => {
  it('affiche une MediaCard par brasserie', () => {
    const wrapper = mount(MediaList, { props: { items } })
    expect(wrapper.findAllComponents(MediaCard)).toHaveLength(3)
    expect(wrapper.get('[data-test="count"]').text()).toBe('3 résultats')
  })

  it('met la liste à jour quand les données changent', async () => {
    const wrapper = mount(MediaList, { props: { items } })
    await wrapper.setProps({ items: [items[0]] })
    expect(wrapper.findAllComponents(MediaCard)).toHaveLength(1)
    expect(wrapper.get('[data-test="count"]').text()).toBe('1 résultat')
  })

  it('fait remonter le clic « Voir les détails » au parent', async () => {
    const wrapper = mount(MediaList, { props: { items } })
    await wrapper.findAll('[data-test="details"]')[1].trigger('click')
    expect(wrapper.emitted('details')).toEqual([['2']])
  })

  it('affiche « 404 - Not found » quand une recherche ne donne rien', () => {
    const wrapper = mount(MediaList, { props: { items: [], hasSearched: true } })
    expect(wrapper.get('[data-test="empty"]').text()).toContain('404 - Not found')
  })

  it("n'affiche rien avant la première recherche", () => {
    const wrapper = mount(MediaList, { props: { items: [] } })
    expect(wrapper.find('[data-test="empty"]').exists()).toBe(false)
    expect(wrapper.find('[data-test="count"]').exists()).toBe(false)
  })
})

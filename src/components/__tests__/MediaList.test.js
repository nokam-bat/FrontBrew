// US 05 – Test MediaList.vue (boucle v-for)
import { describe, it, expect } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'
import MediaList from '../MediaList.vue'
import MediaCard from '../MediaCard.vue'

const items = [
  { id: '1', name: 'A' },
  { id: '2', name: 'B' },
  { id: '3', name: 'C' },
]

const mountList = (props) =>
  mount(MediaList, { props, global: { stubs: { RouterLink: RouterLinkStub } } })

describe('MediaList.vue', () => {
  it('affiche une MediaCard par résultat', () => {
    const wrapper = mountList({ items, hasSearched: true })
    expect(wrapper.findAllComponents(MediaCard)).toHaveLength(3)
    expect(wrapper.get('[data-test="count"]').text()).toBe('3 résultats')
  })

  it('met la liste à jour quand les données changent', async () => {
    const wrapper = mountList({ items, hasSearched: true })
    await wrapper.setProps({ items: [items[0]] })
    expect(wrapper.findAllComponents(MediaCard)).toHaveLength(1)
    expect(wrapper.get('[data-test="count"]').text()).toBe('1 résultat')
  })

  it('peut masquer le compteur', () => {
    const wrapper = mountList({ items, hasSearched: true, showCount: false })
    expect(wrapper.find('[data-test="count"]').exists()).toBe(false)
  })

  it('affiche le message « 404 » si aucun résultat après une recherche', () => {
    const wrapper = mountList({ items: [], hasSearched: true })
    expect(wrapper.get('[data-test="empty"]').text()).toContain('404')
  })

  it("n'affiche rien avant la première recherche", () => {
    const wrapper = mountList({ items: [], hasSearched: false })
    expect(wrapper.find('[data-test="empty"]').exists()).toBe(false)
  })
})

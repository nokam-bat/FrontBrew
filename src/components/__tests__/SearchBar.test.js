// US 04 – Test SearchBar.vue
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SearchBar from '../SearchBar.vue'

describe('SearchBar.vue', () => {
  it('lie la saisie au v-model', async () => {
    const wrapper = mount(SearchBar)
    const input = wrapper.get('[data-test="search-input"]')
    await input.setValue('dog')
    expect(input.element.value).toBe('dog')
  })

  it('émet "search" avec la chaîne nettoyée', async () => {
    const wrapper = mount(SearchBar)
    await wrapper.get('[data-test="search-input"]').setValue('  san   diego ')
    await wrapper.get('form').trigger('submit')
    expect(wrapper.emitted('search')).toEqual([['san diego']])
  })

  it("n'émet rien et affiche un message si la saisie est invalide", async () => {
    const wrapper = mount(SearchBar)
    await wrapper.get('[data-test="search-input"]').setValue(' ')
    await wrapper.get('form').trigger('submit')
    expect(wrapper.emitted('search')).toBeUndefined()
    expect(wrapper.get('[data-test="validation-message"]').text()).toMatch(/mot-clé/)
  })

  it('désactive le bouton pendant le chargement', () => {
    const wrapper = mount(SearchBar, { props: { disabled: true } })
    expect(wrapper.get('[data-test="search-button"]').attributes('disabled')).toBeDefined()
  })
})

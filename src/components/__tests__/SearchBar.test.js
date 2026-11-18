// US 04 : tests unitaires de la barre de recherche
import { afterEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import SearchBar from '../SearchBar.vue'

let wrapper
function render(props = {}) {
  // L'attachement permet la soumission native au clic dans jsdom.
  wrapper = mount(SearchBar, { attachTo: document.body, props })
  return wrapper
}
afterEach(() => {
  wrapper?.unmount()
  document.body.innerHTML = ''
})

describe('US 04 — SearchBar', () => {
  it('affiche le champ et le bouton', () => {
    const w = render()
    expect(w.get('input').attributes('type')).toBe('search')
    expect(w.get('button').text()).toBe('Rechercher')
  })

  it('synchronise la saisie sans lancer de recherche', async () => {
    const w = render()
    await w.get('input').setValue('Alpine')
    expect(w.get('input').element.value).toBe('Alpine')
    expect(w.emitted('search')).toBeUndefined()
    // La soumission vérifie que la donnée lue via v-model a changé.
    await w.get('form').trigger('submit')
    expect(w.emitted('search')).toEqual([['Alpine']])
  })

  it('émet une fois le texte nettoyé au clic', async () => {
    const w = render()
    await w.get('input').setValue('  Alpine  ')
    await w.get('button').trigger('click')
    expect(w.emitted('search')).toEqual([['Alpine']])
  })

  it('émet une fois le texte nettoyé avec Entrée', async () => {
    const w = render()
    await w.get('input').setValue('  La Brasserie  ')
    await w.get('input').trigger('keydown', { key: 'Enter' })
    expect(w.emitted('search')).toEqual([['La Brasserie']])
  })

  it.each(['', '   '])('ne cherche pas avec %j', async (value) => {
    const w = render()
    await w.get('input').setValue(value)
    await w.get('button').trigger('click')
    await w.get('input').trigger('keydown', { key: 'Enter' })
    await w.get('form').trigger('submit')
    expect(w.emitted('search')).toBeUndefined()
  })

  it('bloque la recherche lorsque disabled est vrai', async () => {
    const w = render({ disabled: true })
    expect(w.get('input').element.disabled).toBe(true)
    expect(w.get('button').element.disabled).toBe(true)
    await w.get('form').trigger('submit')
    expect(w.emitted('search')).toBeUndefined()
  })
})
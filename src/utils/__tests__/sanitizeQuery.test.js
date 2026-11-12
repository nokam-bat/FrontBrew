import { describe, it, expect } from 'vitest'
import { sanitizeQuery, MAX_QUERY_LENGTH } from '../sanitizeQuery'

describe('sanitizeQuery', () => {
  it('supprime les espaces inutiles', () => {
    expect(sanitizeQuery('   san    diego  ')).toEqual({ valid: true, query: 'san diego', message: '' })
  })

  it('retire les caractères dangereux', () => {
    expect(sanitizeQuery('<script>dog</script>').query).toBe('scriptdog/script')
  })

  it('refuse une saisie vide', () => {
    const result = sanitizeQuery('    ')
    expect(result.valid).toBe(false)
    expect(result.message).toMatch(/saisir/)
  })

  it('refuse une saisie trop courte', () => {
    expect(sanitizeQuery('a').valid).toBe(false)
  })

  it('limite la longueur', () => {
    expect(sanitizeQuery('a'.repeat(300)).query).toHaveLength(MAX_QUERY_LENGTH)
  })
})

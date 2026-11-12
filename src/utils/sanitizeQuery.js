// US 04 – Valider et nettoyer la chaîne de recherche avant l'envoi à l'API.

export const MIN_QUERY_LENGTH = 2
export const MAX_QUERY_LENGTH = 100

/**
 * Nettoie la saisie de l'utilisateur et indique si elle peut être envoyée.
 * - supprime les espaces au début et à la fin
 * - remplace les espaces multiples par un seul
 * - retire les caractères inutiles ou dangereux (< > " ' ` { } ; \)
 * - limite la longueur
 *
 * @param {string} raw saisie brute
 * @returns {{ valid: boolean, query: string, message: string }}
 */
export function sanitizeQuery(raw) {
  const query = String(raw ?? '')
    .replace(/[<>"'`{};\\]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, MAX_QUERY_LENGTH)

  if (query.length === 0) {
    return { valid: false, query, message: 'Veuillez saisir un mot-clé.' }
  }
  if (query.length < MIN_QUERY_LENGTH) {
    return {
      valid: false,
      query,
      message: `Le mot-clé doit contenir au moins ${MIN_QUERY_LENGTH} caractères.`,
    }
  }
  return { valid: true, query, message: '' }
}

// Mise en forme des données de l'API pour l'affichage (en français).

const TYPE_LABELS = {
  micro: 'Microbrasserie',
  nano: 'Nanobrasserie',
  regional: 'Brasserie régionale',
  brewpub: 'Brasserie-restaurant',
  large: 'Grande brasserie',
  planning: 'En projet',
  bar: 'Bar',
  contract: 'Brasserie sous contrat',
  proprietor: 'Brasserie propriétaire',
  taproom: 'Taproom',
  cidery: 'Cidrerie',
  location: 'Site de brassage',
  closed: 'Fermée',
}

const COUNTRY_LABELS = {
  'United States': 'États-Unis',
  Switzerland: 'Suisse',
  Germany: 'Allemagne',
  France: 'France',
  Austria: 'Autriche',
  Ireland: 'Irlande',
  England: 'Angleterre',
  Scotland: 'Écosse',
  Poland: 'Pologne',
  Portugal: 'Portugal',
  'South Korea': 'Corée du Sud',
  'Isle of Man': 'Île de Man',
  Singapore: 'Singapour',
}

/** « micro » → « Microbrasserie » */
export function formatType(type) {
  if (!type) return ''
  return TYPE_LABELS[type] ?? type.charAt(0).toUpperCase() + type.slice(1)
}

/** « United States » → « États-Unis » */
export function formatCountry(country) {
  if (!country) return ''
  return COUNTRY_LABELS[country] ?? country
}

/**
 * Met en forme le téléphone selon le pays :
 * - États-Unis : « 5551234567 » → « (555) 123-4567 »
 * - Suisse     : « 0795389001 » → « 079 538 90 01 »
 * Les autres formats restent tels quels.
 */
export function formatPhone(phone, country) {
  if (!phone) return ''
  const digits = String(phone).replace(/\D/g, '')
  if (country === 'United States' && digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
  }
  if (country === 'Switzerland' && digits.length === 10 && digits.startsWith('0')) {
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 8)} ${digits.slice(8)}`
  }
  return String(phone)
}

/** Ville + pays, ex. « Payerne, Suisse » */
export function formatLocation(brewery) {
  return [brewery?.city, formatCountry(brewery?.country)].filter(Boolean).join(', ')
}

/** Lignes d'adresse prêtes à afficher. */
export function formatAddressLines(brewery) {
  if (!brewery) return []
  const street = [brewery.address_1 ?? brewery.street, brewery.address_2, brewery.address_3]
    .filter(Boolean)
    .join(', ')
  const cityLine = [brewery.postal_code, brewery.city].filter(Boolean).join(' ')
  return [street, cityLine, brewery.state_province, formatCountry(brewery.country)].filter(
    Boolean,
  )
}

/** Coordonnées GPS valides ou null. */
export function getCoordinates(brewery) {
  const lat = Number.parseFloat(brewery?.latitude)
  const lon = Number.parseFloat(brewery?.longitude)
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null
  if (Math.abs(lat) > 90 || Math.abs(lon) > 180) return null
  return { lat, lon }
}

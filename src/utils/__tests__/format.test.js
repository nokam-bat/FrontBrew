import { describe, it, expect } from 'vitest'
import {
  formatType,
  formatCountry,
  formatPhone,
  formatLocation,
  formatAddressLines,
  getCoordinates,
} from '../format'

describe('format', () => {
  it('traduit le type de brasserie', () => {
    expect(formatType('micro')).toBe('Microbrasserie')
    expect(formatType('inconnu')).toBe('Inconnu')
    expect(formatType(null)).toBe('')
  })

  it('traduit le pays', () => {
    expect(formatCountry('Switzerland')).toBe('Suisse')
    expect(formatCountry('Narnia')).toBe('Narnia')
  })

  it('met en forme le téléphone selon le pays', () => {
    expect(formatPhone('5551234567', 'United States')).toBe('(555) 123-4567')
    expect(formatPhone('0795389001', 'Switzerland')).toBe('079 538 90 01')
    expect(formatPhone('+41 26 660 00 00', 'Switzerland')).toBe('+41 26 660 00 00')
    expect(formatPhone('0123456789', 'France')).toBe('0123456789')
    expect(formatPhone(null)).toBe('')
  })

  it("construit la ville et l'adresse", () => {
    const b = {
      address_1: 'Rue de la Broye 1',
      postal_code: '1530',
      city: 'Payerne',
      country: 'Switzerland',
    }
    expect(formatLocation(b)).toBe('Payerne, Suisse')
    expect(formatAddressLines(b)).toEqual(['Rue de la Broye 1', '1530 Payerne', 'Suisse'])
  })

  it('valide les coordonnées GPS', () => {
    expect(getCoordinates({ latitude: '46.82', longitude: '6.94' })).toEqual({ lat: 46.82, lon: 6.94 })
    expect(getCoordinates({ latitude: null, longitude: '6.94' })).toBeNull()
    expect(getCoordinates({ latitude: '200', longitude: '6.94' })).toBeNull()
  })
})

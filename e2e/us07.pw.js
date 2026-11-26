import { test, expect } from '@playwright/test'

const api = 'https://api.openbrewerydb.org/v1/breweries'

const lac = {
  id: 'lac-1',
  name: 'Brasserie du Lac',
  brewery_type: 'micro',
  address_1: '12 rue du Port',
  postal_code: '1000',
  city: 'Lausanne',
  country: 'Suisse',
  phone: '0215550101',
  website_url: 'https://lac.example',
}

const rive = {
  id: 'rive-2',
  name: 'Brasserie Rive du Lac',
  brewery_type: 'brewpub',
  city: 'Genève',
  country: 'Suisse',
}

// Playwright fournit les réponses de l’API pendant les tests.
test.beforeEach(async ({ page }) => {
  await page.route(`${api}/search?query=Lac`, route =>
    route.fulfill({ json: [lac, rive] })
  )

  for (const brasserie of [lac, rive]) {
    await page.route(`${api}/${brasserie.id}`, route =>
      route.fulfill({ json: brasserie })
    )
  }
})

async function rechercherLac(page) {
  await page.goto('/recherche')
  await page.getByRole('searchbox').fill('Lac')
  await page.getByRole('button', { name: 'Rechercher' }).click()
  await expect(page.locator('[data-test="media-card"]')).toHaveCount(2)
}

async function ouvrirPremiereFiche(page) {
  await rechercherLac(page)
  await page.getByRole('link', { name: 'Voir les détails' }).first().click()
  await expect(page.getByRole('heading', { level: 1 })).toContainText(lac.name)
}

async function verifierRechercheConservee(page) {
  await expect(page).toHaveURL(/\/recherche$/)
  await expect(page.getByRole('searchbox')).toHaveValue('Lac')

  const cartes = page.locator('[data-test="media-card"]')
  await expect(cartes).toHaveCount(2)
  await expect(cartes.nth(0)).toContainText(lac.name)
  await expect(cartes.nth(1)).toContainText(rive.name)
}

test('1. Ouvrir l’accueil affiche la page de recherche', async ({ page }) => {
  await page.goto('/')

  await expect(page).toHaveURL(/\/recherche$/)
  await expect(page.getByRole('button', { name: 'Voir tout' })).toBeVisible()
})

test('2. Cliquer sur la deuxième carte ouvre la bonne fiche', async ({ page }) => {
  await rechercherLac(page)

  const carte = page.locator('[data-test="media-card"]').filter({
    hasText: rive.name,
  })
  const lien = carte.getByRole('link', { name: 'Voir les détails' })

  await expect(lien).toHaveAttribute('href', '/detail/rive-2')
  await lien.click()

  await expect(page).toHaveURL(/\/detail\/rive-2$/)
  await expect(page.getByRole('heading', { level: 1 })).toContainText(rive.name)
})

test('3. Ouvrir directement une fiche affiche ses informations', async ({ page }) => {
  await page.goto('/detail/lac-1')

  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Brasserie du Lac - micro'
  )
  const fiche = page.getByRole('article')
  await expect(fiche).toContainText(lac.address_1)
  await expect(fiche).toContainText(lac.city)
  await expect(fiche).toContainText(lac.phone)
  await expect(fiche.getByRole('link', { name: lac.website_url })).toHaveAttribute(
    'href',
    lac.website_url
  )
})

test('4. Le lien Retour aux résultats conserve la recherche', async ({ page }) => {
  await ouvrirPremiereFiche(page)

  await page.getByRole('link', { name: 'Retour aux résultats' }).click()

  await verifierRechercheConservee(page)
})

test('5. Le bouton Précédent du navigateur conserve la recherche', async ({ page }) => {
  await ouvrirPremiereFiche(page)

  await page.goBack()

  await verifierRechercheConservee(page)
})

test('6. Une fiche introuvable affiche une erreur et permet de revenir', async ({ page }) => {
  await page.route(`${api}/inconnue`, route =>
    route.fulfill({ status: 404, json: { message: 'Not found' } })
  )

  await page.goto('/detail/inconnue')
  await expect(page.getByRole('alert')).toContainText('Fiche indisponible (404)')

  await page.getByRole('link', { name: 'Retour aux résultats' }).click()
  await expect(page).toHaveURL(/\/recherche$/)
  await expect(page.getByRole('searchbox')).toBeVisible()
})
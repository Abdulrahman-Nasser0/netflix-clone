/* global describe, it, cy, beforeEach, Cypress */

describe('My List', () => {
  beforeEach(() => {
    cy.seedAuth()
    cy.mockBackend({
      getFavorites: { method: 'GET', url: `${Cypress.env('backendUrl')}/retrieve`, response: { favorites: [] } },
    })
    cy.mockTmdb()
  })

  it('adds and removes items from My List', () => {
    cy.visit('/')
    cy.contains('Trending').should('exist')
    // Open a modal then click Add
    cy.get('img').first().click({ force: true })
    cy.contains('Add to List').click({ force: true })
    cy.wait('@addFavorite')

    cy.visit('/my-list')
    cy.wait('@getFavorites')

    // Remove via modal or row
    cy.get('img').first().click({ force: true })
    cy.contains('Remove from List').click({ force: true })
    cy.wait('@deleteFavorite')
  })
})

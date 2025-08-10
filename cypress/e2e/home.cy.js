/* global describe, it, cy, beforeEach */

describe('Home page and carousels', () => {
  beforeEach(() => {
    cy.clearAuth()
    cy.mockBackend()
    cy.mockTmdb()
  })

  it('loads home and shows hero + a row', () => {
    cy.visit('/')
    cy.contains('Unlimited movies').should('exist')
    cy.get('[data-row-container], [data-scroll-container]').its('length').should('be.gte', 1)
  })

  it('opens MovieModal when clicking a card', () => {
    cy.visit('/')
    cy.contains('Trending').should('exist')
    cy.get('img[alt="Artwork"], img').first().click({ force: true })
    cy.contains('Overview').should('exist')
  })
})

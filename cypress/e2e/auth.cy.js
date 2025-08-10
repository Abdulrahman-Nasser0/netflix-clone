/* global describe, it, cy, beforeEach, Cypress */

describe('Auth flows', () => {
  beforeEach(() => {
    cy.clearAuth()
    cy.mockBackend()
  })

  it('logs in successfully and redirects to home', () => {
    cy.visit('/login')
    cy.get('input[name="email"]').type('user@example.com')
    cy.get('input[name="password"]').type('password{enter}')
    cy.wait('@login')
    cy.url().should('eq', `${Cypress.config('baseUrl')}/`)
    cy.contains('Sign In').should('not.exist')
  })

  it('registers a new user', () => {
    cy.visit('/register')
    cy.get('input[name="name"]').type('New User')
    cy.get('input[name="email"]').type('new@example.com')
    cy.get('input[name="password"]').type('password')
    cy.get('input[name="confirmPassword"]').type('password')
    cy.contains('button', 'Sign Up').click()
    cy.wait('@register')
  })

  it('logs out from header dropdown', () => {
    cy.seedAuth()
    cy.mockBackend()
    cy.visit('/')
    cy.contains('Manage Profile').should('exist')
    cy.contains('Account').should('exist')
    cy.contains('Sign out of Netflix').click()
    cy.wait('@logout')
    cy.contains('Sign In').should('exist')
  })
})

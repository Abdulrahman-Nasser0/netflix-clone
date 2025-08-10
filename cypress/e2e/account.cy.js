/* global describe, it, cy, beforeEach */

describe('Account profile updates', () => {
  beforeEach(() => {
    cy.seedAuth()
    cy.mockBackend()
  })

  it('updates name, bio and phone', () => {
    cy.visit('/account')
    cy.get('input[name="name"]').clear().type('Updated User')
    cy.get('textarea[name="bio"]').clear().type('New bio')
    cy.get('input[name="phone"]').clear().type('+1234567890')
    cy.contains('button', 'Save Changes').click()
    cy.wait('@updateUser')
    cy.contains('Profile updated').should('exist')
  })
})

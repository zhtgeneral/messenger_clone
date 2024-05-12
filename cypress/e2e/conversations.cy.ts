// leave until middleware is created
describe('conversations route security', () => {
  //todo
  it.skip('is protected for unauthenticated users', () => {
    cy.visit('/conversations').then(() => {
      cy.url().should('eq', `${Cypress.env('NEXT_PUBLIC_DOMAIN')}/?callbackUrl=%2Fconversations`)
    })
  })
})

describe('conversations page functionality', () => {
  beforeEach(() => {
    cy.gotoConversations('mobile');
  });
  
  it('allows users to return to users page', () => {
    cy.get('.bottom-0 > [href="/users"]').click()
    cy.url().should('eq', `${Cypress.env('NEXT_PUBLIC_DOMAIN')}/users`)
  })
  
})
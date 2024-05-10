describe('users route security', () => {
  it('is protected for unauthenticated users', () => {
    cy.visit('/users').then(() => {
      cy.url().should('eq', `${Cypress.env('NEXT_PUBLIC_DOMAIN')}/?callbackUrl=%2Fusers`)
    })
  })
  it('allows authenticated users', () => {
    cy.login(Cypress.env('EMAIL'), Cypress.env('PASSWORD'))
    cy.url().should('eq', `${Cypress.env('NEXT_PUBLIC_DOMAIN')}/users`)
  })
})

describe('users page functionality', () => {
  beforeEach(() => {
    cy.login(Cypress.env('EMAIL'), Cypress.env('PASSWORD'));
    cy.url().should('eq', `${Cypress.env('NEXT_PUBLIC_DOMAIN')}/users`);
  });
  it('redirects users to main page after logout', () => {
    cy.get('.bottom-0 > [href="/#"]').click()
    cy.url().should('eq', `${Cypress.env('NEXT_PUBLIC_DOMAIN')}/`)
  })
  it('allows users to navigate to conversations', () => {
    cy.get('.bottom-0 > [href="/conversations"]').click()
    cy.url().should('eq', `${Cypress.env('NEXT_PUBLIC_DOMAIN')}/conversations`)
  })

  it('allows users to create conversations and redirects user', () => {
    cy.intercept('POST', `${Cypress.env('NEXT_PUBLIC_DOMAIN')}/api/conversations`).as('CreateConversations')

    cy.get('.px-5 > :nth-child(2)').click()
    cy.wait('@CreateConversations').then((intercept) => {
      expect(intercept.response?.statusCode).to.equal(200);
      const conversationId = intercept.response.body.id
      cy.url().should('eq', `${Cypress.env('NEXT_PUBLIC_DOMAIN')}/conversations/${conversationId}`)
    })
  })
})
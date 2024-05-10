// leave until middleware is created
describe('conversations route security', () => {
  //todo
  it('is protected for unauthenticated users', () => {
    cy.visit('/conversations').then(() => {
      cy.url().should('eq', `${Cypress.env('NEXT_PUBLIC_DOMAIN')}/?callbackUrl=%2Fconversations`)
    })
  })
  it('allows authenticated users', () => {
    cy.login(Cypress.env('EMAIL'), Cypress.env('PASSWORD'))
    cy.url().should('eq', `${Cypress.env('NEXT_PUBLIC_DOMAIN')}/users` as string)
  })
})

describe('conversations page functionality', () => {
  beforeEach(() => {
    cy.login(Cypress.env('EMAIL'), Cypress.env('PASSWORD'));
    cy.get('.bottom-0 > [href="/conversations"]').click()
    cy.url().should('eq', `${Cypress.env('NEXT_PUBLIC_DOMAIN')}/conversations`)
  });
  //todo
  it.only('allows users to return to users page', () => {
    cy.get('.bottom-0 > [href="/users"]').click()
    cy.url().should('eq', `${Cypress.env('NEXT_PUBLIC_DOMAIN')}/users`)
  })
})
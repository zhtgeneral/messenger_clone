describe('users route', () => {
  it('is protected for unauthenticated users', () => {
    cy.visit('/users').then(() => {
      cy.url().should('eq', `${Cypress.env('NEXT_PUBLIC_DOMAIN')}/?callbackUrl=%2Fusers`)
    })
  })
  it.only('allows authenticated users', () => {
    cy.login(Cypress.env('EMAIL'), Cypress.env('PASSWORD'))
    cy.url().should('eq', `${Cypress.env('NEXT_PUBLIC_DOMAIN')}/users` as string)
  })
})
describe('mobile sidebar', () => {
  const testEmail    = Cypress.env('TEST_EMAIL')
  const testPassword = Cypress.env('TEST_PASSWORD')
  
  beforeEach(() => {
    cy.login(testEmail, testPassword);
  })

  it('sidebar UX', () => {
    cy.get('a#mobileItem[href="/conversations"]').click()
    cy.location('pathname').should('eq', '/conversations');

    cy.get('a#mobileItem[href="/users"]').click()
    cy.location('pathname').should('eq', '/users');

    cy.get('a#mobileItem[href="/conversations"]').click()
    cy.location('pathname').should('eq', '/conversations');

    cy.get('a#mobileItem[href="/#"]').click()
    cy.location('pathname').should('eq', '/');
  })
})
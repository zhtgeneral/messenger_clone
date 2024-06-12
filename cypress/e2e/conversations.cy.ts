describe('route security', () => {  
  it('page security', () => {
    cy.visit('/conversations')
    cy.location('pathname').should('eq', '/');
  })
})

describe('page functions', () => {
  const testEmail       = Cypress.env('TEST_EMAIL')
  const testPassword    = Cypress.env('TEST_PASSWORD')

  beforeEach(() => {
    cy.login(testEmail, testPassword);
    cy.get(`a#mobileItem[href="/conversations"]`).click(); 
  });
  
  it('page UX', () => {
    cy.get('a#mobileItem[href="/users"]').click()
    cy.location('pathname').should('eq', '/users');

    cy.get('a#mobileItem[href="/#"]').click()
    cy.location('pathname').should('eq', '/');
  })
})
describe('login functions', () => {
  const testEmail     = Cypress.env('TEST_EMAIL')
  const testPassword  = Cypress.env('TEST_PASSWORD')
  const wrongPassword = testPassword?.toUpperCase();
  const loginAPI = 'api/auth/callback/credentials';

  it('fails with wrong password', () => {
    cy.intercept('POST', loginAPI).as('login');
    cy.login(testEmail, wrongPassword);
    cy.wait('@login').then((intercept) => {
      expect(intercept.response?.statusCode).to.equal(401);
    })
    cy.get('div[role="status"]').should('contain.text', 'Invalid Credentials');
  })

  it('login UX', () => {
    cy.intercept('POST', loginAPI).as('login');
    cy.login(testEmail, testPassword);
    cy.wait('@login').then((intercept) => {
      expect(intercept.response?.statusCode).to.equal(200);
    })
    cy.get('div[role="status"]').should('contain.text', 'Logged in');
    cy.location('pathname').should('eq', '/users');
  })
  // skip mocks for third party logins cuz its a pain
})
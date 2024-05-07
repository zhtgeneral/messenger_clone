const         email = Cypress.env('EMAIL');
const      password = Cypress.env('PASSWORD');
const wrongPassword = password?.toUpperCase();
const loginUrl = 'api/auth/callback/credentials';

describe('handles login', () => {
  it('fails with wrong password', () => {
    cy.intercept('POST', loginUrl).as('login');

    cy.login(email, wrongPassword);

    cy.wait('@login').then((intercept) => {
      expect(intercept.response?.statusCode).to.equal(401);
    })

    cy.get('div[role="status"]').should('contain.text', 'Invalid Credentials');
  })
  it('logins with correct credentials', () => {
    cy.intercept('POST', loginUrl).as('login');

    cy.login(email, password);
    
    cy.wait('@login').then((intercept) => {
      expect(intercept.response?.statusCode).to.equal(200);
    })
  })

  // skip mocks for third party logins cuz its a pain
})
describe('login functions', () => {
  const loginAPI = 'api/auth/callback/credentials';

  const testEmail = 'NotCreated@gmail.com'
  const wrongPassword  = 'NotCreatedPassword'

  beforeEach(() => {
    cy.visit('/', { timeout: 30000 });
  })

  /**
   * @requires database needs to be empty
   */
  describe("Wrong login", () => {
    it('keeps the user on page and renders toaster with error', () => {
      cy.get("input#email").click().type(testEmail);
      cy.get("input#password").click().type(wrongPassword);
  
      cy.intercept('POST', loginAPI).as('login');
      cy.get("button[type='submit']").click();
      cy.wait('@login').then((intercept) => {
        expect(intercept.response?.statusCode).to.equal(401);
      })
      cy.get('div[role="status"]').as("toaster").should('contain.text', 'Invalid Credentials');
      cy.location('pathname').should('eq', '/');
    })
  })

  describe("Correct login", () => {
    const existingEmail = "test@gmail.com";
    const existingName = "test_name";
    const existingPassword = existingName;
    before(() => {
      cy.createTestAccount(existingName, existingEmail, existingPassword);
    })
    after(() => {
      cy.loginTestUser(existingEmail, existingPassword);
      cy.deleteTestAccount(existingEmail);
    })
    it('redirects user to /users after login', () => {
      cy.get("input#email").click().type(existingEmail);
      cy.get("input#password").click().type(existingPassword);
  
      cy.intercept('POST', loginAPI).as('login');
      cy.get("button[type='submit']").click();
      cy.wait('@login').then((intercept) => {
        expect(intercept.response?.statusCode).to.equal(200);
      })
      cy.get('div[role="status"]').as("toaster").should('contain.text', 'Logged in');
      cy.location('pathname').should('eq', '/users');
    })
  })
  /**
   * TODO Social logins @link https://docs.cypress.io/guides/end-to-end-testing/social-authentication#What-youll-learn
   */
})
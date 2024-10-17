import { testNames, testEmails, testPasswords } from "../support/generate_names";

describe('register functions', () => {
  const registerAPI = '/api/register';

  const { testName } = testNames;
  const { testEmail } = testEmails;
  const { testPassword } = testPasswords;

  describe("Wrong register", () => {
    it('fails when any entry is blank and alerts user', () => {
      const missingFields = ['name', 'email', 'password'];
  
      cy.intercept('POST', registerAPI).as('register');
      for (const missingField of missingFields) {
        cy.signupEmpty(testName, testEmail, testPassword, missingField);
        cy.wait('@register').then((intercept) => {
          expect(intercept.response?.statusCode).to.equal(400);
        });
        cy.get('div[role="status"]').as("toaster").should('contain.text', 'Something went wrong');
      }
    })
  })

  describe('Correct register', () => {
    after(() => {
      cy.deleteTestAccount(testEmail);
    })
    it('redirects the user to /users after creating account', () => {
      cy.intercept('POST', registerAPI).as('register');
      cy.signup(testName, testEmail, testPassword);
      cy.wait('@register').then((intercept) => {
        expect(intercept.response?.statusCode).to.equal(200);
      });
      cy.location('pathname').should('eq', '/users');
    })
  })

  describe("Duplicate Account", () => {
    before(() => {
      cy.createTestAccount(testName, testEmail, testPassword);
    })
    after(() => {
      cy.loginTestUser(testEmail, testPassword);
      cy.deleteTestAccount(testEmail);
    })
    it('blocks duplicate users and alerts user', () => {
      cy.intercept('POST', registerAPI).as('register_duplicate');
      cy.signup(testName, testEmail, testPassword);
      cy.wait('@register_duplicate').then((intercept) => {
        expect(intercept.response?.statusCode).to.equal(500);      
      });
      cy.get('div[role="status"]').as("toaster").should('contain.text', 'Something went wrong');
    })
  })
  
})
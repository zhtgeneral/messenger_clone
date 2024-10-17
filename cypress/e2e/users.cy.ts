import { testEmails, testNames, testPasswords } from "../support/generate_names";

describe('page security', () => {
  it('prevents unauthenticated users from accessing /users', () => {
    cy.visit('/users');
    cy.location('pathname').should('eq', '/');
  })
})

describe('page functions', () => {
  const conversationAPI = 'api/conversations'

  const { testName, observerName } = testNames;
  const { testEmail, observerEmail } = testEmails;
  const { testPassword, observerPassword } = testPasswords;  

  before(() => {
    cy.createTestAccount(testName, testEmail, testPassword);
    cy.createTestAccount(observerName, observerEmail, observerPassword);
  })

  beforeEach(() => {
    cy.loginTestUser(testEmail, testPassword);
    cy.visit('/users', { timeout: 30000 });
  });

  after(() => {
    cy.visit('/', { timeout: 30000 });
    cy.loginTestUser(testEmail, testPassword);
    cy.deleteTestAccount(testEmail);
    cy.loginTestUser(observerEmail, observerPassword);
    cy.deleteTestAccount(observerEmail);
  })

  it('allows users to create conversations by clicking on other users profiles', () => {
    cy.intercept('POST', conversationAPI).as('create_conversation');
    cy.get('div#userBox').first().click();
    cy.wait('@create_conversation').then((intercept) => {
      expect(intercept.response?.statusCode).to.equal(200);
      const conversationId = intercept.response.body.id;
      cy.location('pathname').should('eq', `/conversations/${conversationId}`);
    })
  })
})
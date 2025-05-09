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

  before('create test accounts', () => {
    cy.createTestAccount(testName, testEmail, testPassword);
    cy.createTestAccount(observerName, observerEmail, observerPassword);
  })
  beforeEach('login', () => {
    cy.loginTestUser(testEmail, testPassword);
    cy.visit('/users', { timeout: 30000 });
  });
  after('delete test accounts', () => {
    cy.deleteTestAccount(testEmail, testPassword);
    cy.deleteTestAccount(observerEmail, observerPassword);
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
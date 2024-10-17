import { testEmails, testNames, testPasswords } from "../support/generate_names";

describe('settings functions', () => {
  const settingsAPI = 'api/settings'

  const { testName } = testNames;
  const { testEmail } = testEmails;
  const { testPassword } = testPasswords;

  before(() => {
    cy.createTestAccount(testName, testEmail, testPassword);
  })

  beforeEach(() => {
    cy.loginTestUser(testEmail, testPassword), 
    cy.visit('/', { timeout: 30000});
    cy.get('div#settingsButton').last().click();
  })

  after(() => {
    cy.deleteTestAccount(testEmail);
  })

  describe("modal interactions", () => {
    it('lets the user close the modal by clicking the cancel button', () => {
      cy.get('button').contains('Cancel').click();
      cy.get('div#settingsButton').last().click();
    })
    it('lets the user close the modal by clicking the x button', () => {
      cy.get('button#closeButton').click();
      cy.get('div#settingsButton').last().click();
    })
  })

  describe('updating user info', () => {
    it('allows user to update name', () => {
      const newName = testName + '8888';
      cy.get('input#name').click().type('8888');

  
      cy.intercept('POST', settingsAPI).as('update_name')
      cy.get('button').contains('Save').click();
      cy.wait('@update_name');
  
      cy.get('div#settingsButton').last().click();
      cy.get('input#name').should('have.value', newName);
    })

    // Handle updating user profile picture manually
  })
})

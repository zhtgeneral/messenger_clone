import { testEmails, testNames, testPasswords } from "../support/generate_names";

describe('Sidebar', () => {

  const { testName } = testNames;
  const { testEmail } = testEmails;
  const { testPassword } = testPasswords;
  
  before(() => {
    cy.createTestAccount(testName, testEmail, testPassword);
  }) 
  beforeEach(() => {
    cy.loginTestUser(testEmail, testPassword);
    cy.visit('/', { timeout: 30000 });
  })
  after(() => {
    cy.loginTestUser(testEmail, testPassword);
    cy.deleteTestAccount(testEmail);
  })
  describe('Tablet sidebar', () => {
    beforeEach(() => {
      cy.setTabletView();
    });
    describe("Sidebar interactions", () => {
      it('allows the user to switch between routes from the sidebar', () => {
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
  })

  describe('Desktop sidebar', () => {
    beforeEach(() => {
      cy.setDesktopView();
    });
    describe("Sidebar interactions", () => {
      it('allows the user to switch between routes from the sidebar', () => {
        cy.get('a#desktopItem[href="/conversations"]').click()
        cy.location('pathname').should('eq', '/conversations');
    
        cy.get('a#desktopItem[href="/users"]').click()
        cy.location('pathname').should('eq', '/users');
    
        cy.get('a#desktopItem[href="/conversations"]').click()
        cy.location('pathname').should('eq', '/conversations');
    
        cy.get('a#desktopItem[href="/#"]').click()
        cy.location('pathname').should('eq', '/');
      })
    })
  })
})


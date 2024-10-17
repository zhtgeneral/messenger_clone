import { 
  testEmails, 
  testNames, 
  testPasswords,
  randomConversationName,
  randomMessage
} from "../support/generate_names";

describe('Page security', () => {
  it('prevents unauthenticated users from accessing /conversations/*', () => {
    const randomId = 'asdabslj4h5k34jasd';
    cy.visit(`/conversations/${randomId}`);
    cy.location('pathname').should('eq', '/');
  })
})  

describe('Page functions', () => {
  const { testName, observerName, observerName2} = testNames;
  const { testEmail, observerEmail, observerEmail2} = testEmails;
  const { testPassword, observerPassword, observerPassword2} = testPasswords;

  before(() => {
    cy.createTestAccount(testName, testEmail, testPassword);
    cy.createTestAccount(observerName, observerEmail, observerPassword);
    cy.createTestAccount(observerName2, observerEmail2, observerPassword2);
  })
  beforeEach(() => {
    cy.loginTestUser(testEmail, testPassword);
    cy.visit("/users", { timeout: 30000 });

    cy.intercept('POST', '/api/conversations').as('visit_conversation');
    cy.get('div#userBox').contains(observerName).click();
    cy.wait('@visit_conversation');
  })
  after(() => {
    // TODO first delete conversations before deleting users
    cy.loginTestUser(testEmail, testPassword);
    cy.deleteTestAccount(testEmail);
    cy.loginTestUser(observerEmail, observerPassword);
    cy.deleteTestAccount(observerEmail);
    cy.loginTestUser(observerEmail2, observerPassword2);
    cy.deleteTestAccount(observerEmail2);
  })
  
  describe("Leaving conversation", () => {
    it("allows the user to return to all conversations on tablet view", () => {
      cy.setTabletView();
      cy.get('a#returnButton').click();
      cy.location('pathname').should('eq', '/conversations');
    })
    it("allows the user to return to all conversations on desktop view", () => {
      cy.setDesktopView();
      cy.get('a#desktopItem[href="/conversations"]').click();
      cy.location('pathname').should('eq', '/conversations');
    })
  })

  describe("Chat area", () => {
    const message = 'a';

    it('prevents empty text messages from being sent', () => {
      cy.get('input#message').click().type(`${message}{backspace}`);
      cy.get('button[type="submit"]').click();
      cy.get('div#conversationArea').should('not.contain.text', message);
    })

    it('renders submitted text messages', () => {
      cy.get('input#message').click().type(message);

      cy.intercept('POST', '/api/messages').as('create_message_text');
      cy.get('button[type="submit"]').click();
      cy.wait('@create_message_text');

      cy.get('div#userMessage').last().contains(message);
    })
    // Handle image upload tests manually
  })
  
  describe('Sidebar drawer', () => {
    describe("Sidebar close operations", () => {
      it('allows user to close sidebar with close button', () => {
        cy.get('svg[id="sidebarDrawer"]').click();
        cy.get('button[id="closeSidebar"]').click(); 
      });
      it('allows user to close sidebar by clicking out of sidebar', () => {  
        cy.get('svg[id="sidebarDrawer"]').click();
        cy.get('body').click(60, 500);
      });
      it('allows user to close sidebar with ESC key', () => {  
        cy.get('svg[id="sidebarDrawer"]').click();
        cy.get('body').trigger('keydown', { key: 'Escape' });
      });
    })
    
    describe("Delete conversation modal", () => {
      describe("Close operations", () => {
        it('allows user to close delete modal with close button', () => {
          cy.get('svg[id="sidebarDrawer"]').click();
          cy.get('div[id="deleteButton"]').click();
          cy.get('div[id="confirmModal"]').should('contain.text', 'Delete conversation');
          cy.get('svg[id="closeButton"]').click();
          cy.get('body').should('not.contain.text', 'Delete conversation');
        });
        it("allows user to close modal with cancel button", () => {
          cy.get('svg[id="sidebarDrawer"]').click()  
          cy.get('div[id="deleteButton"]').click()
          cy.get('button').contains('Cancel').click()
          cy.get('body').should('not.contain.text', 'Delete conversation')
        })
      });

      /**
       * @requires conversation has to be created
       */
      // it('allows user to delete conversations', () => {
      //   cy.get('div#conversationBox').contains(randomConversationName).click();
      //   cy.get('svg#sidebarDrawer').click();
      //   cy.get('div#deleteButton').click();
      //   cy.get('button').contains('Delete').click();
      //   cy.get('div#conversations').should('not.contain.text', randomConversationName);
      // })
    })
  })
})
describe("/conversation/[id]", () => {
  describe('Page security', () => {
    it('prevents unintended users from accessing other conversations', () => {
      const randomId = 'asdabslj4h5k34jasd';
      cy.visit(`/conversations/${randomId}`);
      cy.location('pathname').should('eq', '/');
    })
  })

  describe('Page functions', () => {
    // TODO create & delete test accounts for each test
    // Needs a backend endpoint to delete account after running tests
    // TODO create a util file to store names rather than ENV file
    const watcherName     = Cypress.env('WATCHER_NAME');
    const watcherEmail    = Cypress.env('WATCHER_EMAIL');
    const watcherPassword = Cypress.env('WATCHER_PASSWORD');
    const testName        = Cypress.env('TEST_NAME');
    const testEmail       = Cypress.env('TEST_EMAIL');
    const testPassword    = Cypress.env('TEST_PASSWORD');
    const message = (new Date()).toDateString();
  
    beforeEach(() => {
      cy.login(testEmail, testPassword);
      cy.intercept('POST', '/api/conversations').as('createConversation');
      cy.get('div#userBox').contains(watcherName).click();
      cy.wait('@createConversation');
    });
    
    describe("Route handling", () => {
      it('allows users to exit a conversation in mobile mode', () => {
        cy.get('a#returnButton').click();
        cy.location('pathname').should('eq', '/conversations');
    
        cy.get('div#conversationBox').contains(watcherName).click();
        // TODO check that the conversation is loaded
      })
    })

    describe("Chat area", () => {
      it('prevents empty messages from being sent', () => {
        cy.get('input#message').click().type('a{backspace}');
        cy.intercept('POST', '/api/messages').as('createMessageEmpty');
        cy.get('button[type="submit"]').click();
        // only way to check this is using integration test
      })
    
      it('renders submitted text messages', () => {
        cy.get('input#message').click().type(message);
        cy.intercept('POST', '/api/messages').as('createMessageText');
        cy.get('button[type="submit"]').click();
        cy.wait('@createMessageText');
        cy.get('div[id="userMessage"]').last().contains(message);
      })
    
      it("marks message as seen from other accounts", () => {
        cy.get('input#message').click().type(message);
        cy.get('button[type="submit"]').click();
        cy.get('a[id="returnButton"]').click();
        cy.get(`a#mobileItem[href="/#"]`).click();
    
        cy.login(watcherEmail, watcherPassword);
        cy.get(`a#mobileItem[href="/conversations"]`).click();
        cy.get("div#conversationBox").contains(testName).click();
        cy.get('a[id="returnButton"]').click();
        cy.get('.bottom-0 > [href="/#"]').click();
    
        cy.login(testEmail, testPassword);
        cy.get(`a#mobileItem[href="/conversations"]`).click(); 
        cy.get("div#conversationBox").contains(watcherName).click();
        cy.get('div[id="userLine"]').last().should("contain.text", `Seen by ${watcherName}`);
      });
    })  
  
    // handle image upload tests manually
    // handle image modal tests manually
  })
  
  describe('Sidebar drawer', () => {
    const watcherName     = Cypress.env('WATCHER_NAME');
    const testEmail       = Cypress.env('TEST_EMAIL');
    const testPassword    = Cypress.env('TEST_PASSWORD');
  
    beforeEach(() => {
      cy.login(testEmail, testPassword);
      cy.intercept('POST', '/api/conversations').as('createConversation');
      cy.get('div#userBox').contains(watcherName).click();
      cy.wait('@createConversation');
    });
  
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
      describe("Delete conversation modal close operations", () => {
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

      it("allows user to delete conversation", () => {
        cy.get('svg[id="sidebarDrawer"]').click();  
        cy.get('div[id="deleteButton"]').click();
        cy.get('button').contains('Delete').click(); cy.wait(5000);
    
        cy.get('div#conversationBox').not('contain.text', watcherName);
      })
    })
  })
})


 
 
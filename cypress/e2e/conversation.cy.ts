 describe('page security', () => {
  it('page security', () => {
    const randomId = 'asdabslj4h5k34jasd'
    cy.visit(`/conversations/${randomId}`)
    cy.location('pathname').should('eq', '/');
  })
 })
 
 describe('page functions', () => {
  const watcherName     = Cypress.env('WATCHER_NAME')
  const watcherEmail    = Cypress.env('WATCHER_EMAIL')
  const watcherPassword = Cypress.env('WATCHER_PASSWORD')
  const testName        = Cypress.env('TEST_NAME')
  const testEmail       = Cypress.env('TEST_EMAIL')
  const testPassword    = Cypress.env('TEST_PASSWORD')
  const message = 'a';

  beforeEach(() => {
    cy.login(testEmail, testPassword);
    cy.intercept('POST', '/api/conversations').as('createConversation')
    cy.get('div#userBox').contains(watcherName).click()  
    cy.wait('@createConversation')
  });
  
  it('page UX', () => {
    cy.get('a#returnButton').click()
    cy.location('pathname').should('eq', '/conversations');

    cy.get('div#conversationBox').contains(watcherName).click()    
  })

  it('skips empty messages', () => {
    cy.get('input#message').click().type('a{backspace}')
    cy.intercept('POST', '/api/messages').as('createMessageEmpty')
    cy.get('button[type="submit"]').click()
    // only way to check this is using integration test
  })

  it('renders submitted text messages', () => {
    cy.get('input#message').click().type(message)
    cy.intercept('POST', '/api/messages').as('createMessageText')
    cy.get('button[type="submit"]').click()
    cy.wait('@createMessageText')
    cy.get('div[id="userMessage"]').last().contains(message)
  })

  it("marks message as seen", () => {
    cy.get('input#message').click().type(message)
    cy.get('button[type="submit"]').click()
    cy.get('a[id="returnButton"]').click()
    cy.get(`a#mobileItem[href="/#"]`).click();

    cy.login(watcherEmail, watcherPassword);
    cy.get(`a#mobileItem[href="/conversations"]`).click();
    cy.get("div#conversationBox").contains(testName).click();
    cy.get('a[id="returnButton"]').click();
    cy.get('.bottom-0 > [href="/#"]').click();

    cy.login(testEmail, testPassword);
    cy.get(`a#mobileItem[href="/conversations"]`).click(); cy.wait(500);
    cy.get("div#conversationBox").contains(watcherName).click();
    cy.get('div[id="userLine"]').last().should("contain.text", `Seen by ${watcherName}`);
  });

  // handle image upload tests manually
  // handle image modal tests manually
})

describe('sidebar drawer', () => {
  const watcherName     = Cypress.env('WATCHER_NAME')
  const testEmail       = Cypress.env('TEST_EMAIL')
  const testPassword    = Cypress.env('TEST_PASSWORD')

  beforeEach(() => {
    cy.login(testEmail, testPassword);
    cy.intercept('POST', '/api/conversations').as('createConversation')
    cy.get('div#userBox').contains(watcherName).click()  
    cy.wait('@createConversation')
  });

  it('sidebar UX', () => {
    cy.get('svg[id="sidebarDrawer"]').click() 
    cy.get('button[id="closeSidebar"]').click(); 

    cy.get('svg[id="sidebarDrawer"]').click()
    cy.get('body').click(60, 500) 

    cy.get('svg[id="sidebarDrawer"]').click()
    cy.get('body').trigger('keydown', { key: 'Escape' }) 
  })

  it('delete conversation modal UX', () => {
    cy.get('svg[id="sidebarDrawer"]').click()  
    cy.get('div[id="deleteButton"]').click()
    cy.get('div[id="confirmModal"]').should('contain.text', 'Delete conversation')
    cy.get('svg[id="closeButton"]').click()
    cy.get('body').should('not.contain.text', 'Delete conversation')

    cy.get('svg[id="sidebarDrawer"]').click()  
    cy.get('div[id="deleteButton"]').click()
    cy.get('button').contains('Cancel').click()
    cy.get('body').should('not.contain.text', 'Delete conversation')
  })

  it('deletes conversation', () => {
    cy.get('svg[id="sidebarDrawer"]').click()  
    cy.get('div[id="deleteButton"]').click()
    cy.get('button').contains('Delete').click(); cy.wait(5000);

    cy.get('div#conversationBox').not('contain.text', watcherName)
  })
})
import { v4 } from "uuid";

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
    cy.get(`a#mobileItem[href="/conversations"]`).click(); 
    cy.get('div#conversationBox').contains('watcher').click()    
  });
  
  it('page UX', () => {
    cy.get('a#returnButton').click()
    cy.location('pathname').should('eq', '/conversations');

    cy.get('a#mobileItem[href="/#"]').click()
    cy.location('pathname').should('eq', '/');
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
    cy.reload()
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

describe('sidebar', () => {
  const watcherName     = Cypress.env('WATCHER_NAME')
  const testEmail       = Cypress.env('TEST_EMAIL')
  const testPassword    = Cypress.env('TEST_PASSWORD')

  beforeEach(() => {
    cy.login(testEmail, testPassword);
    cy.get(`a#mobileItem[href="/conversations"]`).click();
    cy.get('div#conversationBox').contains(watcherName).click()  
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
    cy.get('button').contains('Delete').click(); cy.wait(2000);
    cy.visit('/conversations')
    cy.get('div#conversationBox').not('contain.text', watcherName)
  })
})

describe('group chat functions', () => {
  const randomId      = v4()
  const randomName    = `chat${randomId}`;  
  const randomMessage = `message${randomId}`;
  const testEmail       = Cypress.env('TEST_EMAIL')
  const testPassword    = Cypress.env('TEST_PASSWORD')

  it('group chat modal UX', () => {
    cy.login(testEmail, testPassword);
    cy.get(`a#mobileItem[href="/conversations"]`).click();
    cy.get('div#groupChat').click();
    cy.get('form#groupChatModal').should('contain.text', 'Create a group chat')
    cy.get('svg#closeButton').click()
    cy.get('body').should('not.contain.text', 'Group chat')

    cy.get('svg#closeButton').click()
    cy.get('div#groupChat').click();
    cy.get('form#groupChatModal').should('contain.text', 'Create a group chat')
    cy.get('button').contains('Cancel').click()
    cy.get('body').should('not.contain.text', 'Group chat')
  })

  it('stops 2 person groups', () => {
    const watcherName = Cypress.env('WATCHER_NAME')    
    cy.login(testEmail, testPassword);
    cy.get(`a#mobileItem[href="/conversations"]`).click();
    cy.get('div#groupChat').click();
    cy.get('input#name').click().type(randomName)
    cy.get('div#select').click();
    cy.get('div').contains(watcherName).click();
    cy.intercept('POST', '/api/conversations').as('createGroupChat');
    cy.get('button').contains('Create').click();
    cy.wait('@createGroupChat').then((intercept) => {
      expect(intercept.response?.statusCode).to.equal(400);
      cy.get('body').should('contain.text', 'Something went wrong')
    })
  })

  it.only('allows 3+ person groups', () => {
    const watcherName2 = Cypress.env('WATCHER_NAME_2')
    const watcherName3 = Cypress.env('WATCHER_NAME_3')
    cy.login(testEmail, testPassword);
    cy.get(`a#mobileItem[href="/conversations"]`).click();
    cy.get('div#groupChat').click();
    cy.get('input#name').click().type(randomName)
    cy.get('div#select').click();
    cy.get('div').contains(watcherName2).click();
    cy.get('div#select').click();
    cy.get('div').contains(watcherName3).click();
    cy.intercept('POST', '/api/conversations').as('createGroupChat');
    cy.get('button').contains('Create').click();
    cy.wait('@createGroupChat').then((intercept) => {
      expect(intercept.response?.statusCode).to.equal(200);
      cy.location('pathname').should('eq', '/conversations');
      cy.reload();
      cy.get('div#conversationBox').first().should('contain.text', randomName)
    })
  })

  it.only('marks group messages as seen', () => {
    const watcherName2     = Cypress.env('WATCHER_NAME_2')
    const watcherName3     = Cypress.env('WATCHER_NAME_3')
    const watcherEmail2    = Cypress.env('WATCHER_EMAIL_2')
    const watcherEmail3    = Cypress.env('WATCHER_EMAIL_3')
    const watcherPassword2 = Cypress.env('WATCHER_PASSWORD_2')
    const watcherPassword3 = Cypress.env('WATCHER_PASSWORD_3')

    cy.login(testEmail, testPassword);
    cy.get(`a#mobileItem[href="/conversations"]`).click();
    cy.get('div#conversationBox').contains(randomName).click();
    cy.get('input#message').click().type(randomMessage)
    cy.get('button[type="submit"]').click()
    cy.get('a[id="returnButton"]').click()
    cy.get(`a#mobileItem[href="/#"]`).click();

    cy.login(watcherEmail2, watcherPassword2);
    cy.get(`a#mobileItem[href="/conversations"]`).click();
    cy.get('div#conversationBox').contains(randomName).click();
    cy.get('a[id="returnButton"]').click()
    cy.get(`a#mobileItem[href="/#"]`).click();

    cy.login(watcherEmail3, watcherPassword3);
    cy.get(`a#mobileItem[href="/conversations"]`).click();
    cy.get('div#conversationBox').contains(randomName).click();
    cy.get('a[id="returnButton"]').click()
    cy.get(`a#mobileItem[href="/#"]`).click();

    cy.login(testEmail, testPassword);
    cy.get(`a#mobileItem[href="/conversations"]`).click();
    cy.get('div#conversationBox').contains(randomName).click();
    cy.get('div[id="userLine"]').last().should("contain.text", `Seen by ${watcherName2}, ${watcherName3}`);
  })
})
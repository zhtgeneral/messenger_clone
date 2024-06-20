import { v4 } from "uuid";

describe('route security', () => {  
  it('page security', () => {
    cy.visit('/conversations')
    cy.location('pathname').should('eq', '/');
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

  it('allows 3+ person groups', () => {
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
      cy.get('div#conversationBox').first().should('contain.text', randomName)
    })
  })

  it('marks group messages as seen', () => {
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

  it('updates conversations upon deletion', () => {
    cy.login(testEmail, testPassword);
    cy.get(`a#mobileItem[href="/conversations"]`).click();
    cy.get('div#conversationBox').contains(randomName).click();
    cy.get('svg#sidebarDrawer').click()
    cy.get('div#deleteButton').click()
    cy.get('button').contains('Delete').click()
    cy.get('div#conversationBox').should('not.contain.text', randomName)
  })
})
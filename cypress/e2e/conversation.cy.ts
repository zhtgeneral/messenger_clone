import { v4 } from 'uuid';
const randomMessage = v4();  

describe('single user functionality', () => {
  beforeEach(() => {
    cy.gotoConversations('mobile');
    cy.get('div#conversationBox').contains('watcher').click()    
  });
  it('can return to conversations page', () => {
    cy.get('a#returnButton').click()
    cy.url().should('eq', `${Cypress.env('NEXT_PUBLIC_DOMAIN')}/conversations`)
  })
  it('handle submitting empty message', () => {
    cy.get('input#message').click().type('a{backspace}')

    cy.intercept('POST', '/api/messages').as('createMessageEmpty')
    cy.get('button[type="submit"]').click()
    // check that no request was made, but there is no way to check it
  })
  it('returns user to home page after logout', () => {
    cy.get('.bottom-0 > [href="/#"]').click()
    cy.url().should('eq', `${Cypress.env('NEXT_PUBLIC_DOMAIN')}/`)
  })
  it('handles submitting text messages', () => {
    cy.get('input#message').click().type('a')

    cy.intercept('POST', '/api/messages').as('createMessageText')
    cy.get('button[type="submit"]').click()

    cy.wait('@createMessageText').then((intercept) => {
      expect(intercept.request?.body).to.have.property('message')
      expect(intercept.request?.body).to.have.property('conversationId')

      expect(intercept.response?.statusCode).to.equal(200);
      expect(intercept.response?.body).to.have.property('id')
      expect(intercept.response?.body).to.have.property('body')
      expect(intercept.response?.body).to.have.property('image')
      expect(intercept.response?.body).to.have.property('createdAt')
      expect(intercept.response?.body).to.have.property('seenIds')
      expect(intercept.response?.body).to.have.property('conversationId')
      expect(intercept.response?.body).to.have.property('senderId')
      expect(intercept.response?.body).to.have.property('seen')
      expect(intercept.response?.body).to.have.property('sender')
    });    
  })
  it('displays text messages', () => {
    cy.get('input#message').click().type(randomMessage)
    cy.intercept('POST', '/api/messages').as('createMessageText')
    cy.get('button[type="submit"]').click()

    cy.wait('@createMessageText').then((intercept) => {
      cy.reload()
      cy.get('div[id="userMessage"]').last().contains(randomMessage)
    })
  })

  it.only('handles sidebar', () => {
    cy.get('svg[id="sidebarDrawer"]').click()
    cy.get('dl[id="conversationInfo"]').should('be.visible') 
    cy.get('button[id="closeSidebar"]').click(); // close via button

    cy.get('svg[id="sidebarDrawer"]').click()
    cy.get('body').click(60, 500) // close via clicking

    cy.get('svg[id="sidebarDrawer"]').click()
    cy.get('body').trigger('keydown', { key: 'Escape' }) // close via esc button
    //todo test delete conversation opens modal and deletes
  })
})
// only works when 'a new message was sent' was first run
describe('multiple user functionality', () => {
  it('marks message as seen', () => {
    const watcherName     = Cypress.env('WATCHER_NAME')
    const watcherEmail    = Cypress.env('WATCHER_EMAIL')
    const watcherPassword = Cypress.env('WATCHER_PASSWORD')
    const testEmail       = Cypress.env('TEST_EMAIL')
    const testPassword    = Cypress.env('TEST_PASSWORD')

    cy.login(watcherEmail, watcherPassword);
    cy.get(`a#mobileItem[href="/conversations"]`).click()

    cy.intercept('POST', '/api/conversations/666368a91f8eef7b115f924f/seen').as('markMessageSeen')

    cy.get('div#conversationBox').contains('test').click()

    cy.wait('@markMessageSeen').then((intercept) => {
      expect(intercept.response?.statusCode).to.equal(200);
    });
    cy.get('a[id="returnButton"]').click()
    cy.get('.bottom-0 > [href="/#"]').click()

    cy.login(testEmail, testPassword);

    cy.get(`a#mobileItem[href="/conversations"]`).click()
    cy.get('div#conversationBox').contains(watcherName).click()
    cy.get('div[id="userLine"]').last().should('contain.text',`Seen by ${watcherName}`)
  })

  // skip automatically testing image uploads (from now on manual test it)
})
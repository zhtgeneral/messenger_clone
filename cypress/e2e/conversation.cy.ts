describe('single conversation page functionality', () => {
  beforeEach(() => {
    cy.gotoConversations('mobile');

    cy.get('div#conversationBox').first().click()

    cy.url().should('contain', `${Cypress.env('NEXT_PUBLIC_DOMAIN')}/conversations/`)
  });
  it('can return to conversations page', () => {
    cy.get('a#returnButton').click()
    cy.url().should('eq', `${Cypress.env('NEXT_PUBLIC_DOMAIN')}/conversations`)
  })
  it.only('handle submitting empty message', () => {
    cy.get('input#message').click().type('a{backspace}')

    cy.intercept('POST', '/api/messages').as('createMessageEmpty')
    cy.get('button[type="submit"]').click()
    // check that no request was made, but there is no way to check it
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
})
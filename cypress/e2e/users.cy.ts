describe('page security', () => {
  it('page security', () => {
    cy.visit('/users')
    cy.location('pathname').should('eq', '/');
  })
})

describe('page functions', () => {
  const testEmail       = Cypress.env('TEST_EMAIL')
  const testPassword    = Cypress.env('TEST_PASSWORD')

  beforeEach(() => {
    cy.login(testEmail, testPassword);
  });

  it('users page UX', () => {
    cy.get('a#mobileItem[href="/conversations"]').click()
    cy.location('pathname').should('eq', '/conversations');

    cy.get('a#mobileItem[href="/#"]').click()
    cy.location('pathname').should('eq', '/');
  })

  it('create conversation', () => {
    const conversationAPI = 'api/conversations'
    cy.intercept('POST', conversationAPI).as('CreateConversations')
    cy.get('div#userBox').first().click()
    cy.wait('@CreateConversations').then((intercept) => {
      expect(intercept.response?.statusCode).to.equal(200);
      const conversationId = intercept.response.body.id
      cy.location('pathname').should('eq', `/conversations/${conversationId}`);
    })
  })

  it.only('update user', () => {
    const settingsAPI = 'api/settings'
    cy.intercept('POST', settingsAPI).as('UpdateUser')
    cy.get('a#mobileItem[href="/settings"]').click()
    cy.wait('@UpdateUser').then((intercept) => {
      expect(intercept.response?.statusCode).to.equal(200);
      // todo update user info not on mobile
    })
  })
})
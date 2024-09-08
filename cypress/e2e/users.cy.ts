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

  it('create conversation', () => {
    const conversationAPI = 'api/conversations'
    cy.intercept('POST', conversationAPI).as('CreateConversations')
    cy.get('div#userBox').first().click()
    cy.wait('@CreateConversations').then((intercept) => {
      expect(intercept).to.exist
      expect(intercept.response).to.exist

      // TypeScript type assertion
      const intercept_t = intercept as { 
        response: { 
          statusCode: number;
           body: { 
            id: string 
          }
        } 
      }

      expect(intercept_t.response.statusCode).to.equal(200)
      expect(intercept_t.response.body).to.exist
      expect(intercept_t.response.body.id).to.exist

      const conversationId = intercept_t.response.body.id
      cy.location('pathname').should('eq', `/conversations/${conversationId}`);
    })
  })
})
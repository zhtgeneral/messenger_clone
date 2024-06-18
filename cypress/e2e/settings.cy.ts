describe('settings functions', () => {
  const testName     = Cypress.env('TEST_NAME')
  const testEmail    = Cypress.env('TEST_EMAIL')
  const testPassword = Cypress.env('TEST_PASSWORD')

  beforeEach(() => {
    cy.login(testEmail, testPassword);
    cy.get('div#settingsButton').last().click()
  })

  it('modal UX', () => {
    cy.get('button').contains('Cancel').click();
    cy.get('div#settingsButton').last().click()

    cy.get('button#closeButton').click();
    cy.get('div#settingsButton').last().click()
  })

  it('update name', () => {
    const newName = testName+'1';
    const testDeleteQuery = '{backspace}'.repeat(testName.length)
    const newDeleteQuery  = '{backspace}'.repeat(newName.length)
    cy.get('input#name').click()
    .type(testDeleteQuery)
    .type(newName)

    const settingsAPI = 'api/settings'
    cy.intercept('POST', settingsAPI).as('UpdateName')

    cy.get('button').contains('Save').click()
    cy.wait('@UpdateName')

    cy.get('div#settingsButton').last().click()
    cy.get('input#name').should('have.value', newName)

    cy.get('input#name').click()
    .type(newDeleteQuery)
    .type(testName)

    cy.get('button').contains('Save').click()
    cy.wait('@UpdateName')

    cy.get('div#settingsButton').last().click()
    cy.get('input#name').should('have.value', testName)
  })

  // handle updating image manually
})

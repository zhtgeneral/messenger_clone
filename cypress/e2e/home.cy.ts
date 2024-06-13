describe('page functions', () => {
  it('displays brand', () => {
    cy.visit('/')
    cy.get('h2').should('have.text', 'Messenger clone')
  })

  it('renders sign in page', () => {
    cy.visit('/')
    cy.get('button[type="submit"]').should('have.text', 'Sign in')
    cy.get('input').then($inputs => {
      expect($inputs).to.have.length(2);
      cy.get('body').should('contain.text', 'Email')
      cy.get('body').should('contain.text', 'Password')
    });
  })

  it('renders register page', () => {
    cy.visit('/')
    cy.contains('Create an account').click()
    cy.get('button[type="submit"]').should('have.text', 'Register')
    cy.get('input').then($inputs => {
      expect($inputs).to.have.length(3);
      cy.get('body').should('contain.text', 'Name')
      cy.get('body').should('contain.text', 'Email')
      cy.get('body').should('contain.text', 'Password')
    });
  })
})
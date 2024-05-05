describe('loads login page', () => {
  it('loads brand', () => {
    cy.visit('/')
    cy.get('h2').should('have.text', 'Messenger clone')
  })

  it('loads sign in page', () => {
    cy.visit('/')
    cy.get('button[type="submit"]').should('have.text', 'Sign in')
    cy.get('input').then($inputs => {
      expect($inputs).to.have.length(2);
    });
  })

  it('loads register page', () => {
    cy.visit('/')
    cy.contains('Create an account').click().then(() => {
      cy.get('button[type="submit"]').should('have.text', 'Register')
      cy.get('input').then($inputs => {
        expect($inputs).to.have.length(3);
      });
    })
  })
})
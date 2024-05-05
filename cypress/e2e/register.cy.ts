import { v4 } from 'uuid';
const randomId = v4();  
describe('handles register', () => {
  it('registers unique user', () => {
    const registerUrl = '/api/register';
    cy.intercept('POST', registerUrl).as('register');

    const name = 'test' + randomId;
    cy.visit('/');
    cy.contains('Create an account').click();
    cy.get('input[id="name"]'    ).type(name);
    cy.get('input[id="email"]'   ).type(name + '@gmail.com');
    cy.get('input[id="password"]').type(name); 
    cy.get('button[type="submit"]').click();

    cy.wait('@register').then((intercept) => {
      expect(intercept.response?.statusCode).to.equal(200);
      expect(intercept.request?.body).to.have.property('name')
      expect(intercept.request?.body).to.have.property('email')
      expect(intercept.request?.body).to.have.property('password')
    });
  })
  it('fails to register duplicate user', () => {
    const registerUrl = '/api/register';
    cy.intercept('POST', registerUrl).as('register');

    const name = 'test' + randomId;
    cy.visit('/');
    cy.contains('Create an account').click();
    cy.get('input[id="name"]'    ).type(name);
    cy.get('input[id="email"]'   ).type(name + '@gmail.com');
    cy.get('input[id="password"]').type(name); 
    cy.get('button[type="submit"]').click();

    cy.wait('@register').then((intercept) => {
      expect(intercept.response?.statusCode).to.equal(500);      
    });

    cy.get('div[role="status"]').should('contain.text', 'Something went wrong');
  })
})
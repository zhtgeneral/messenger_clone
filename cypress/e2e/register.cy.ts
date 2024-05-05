import { v4 } from 'uuid';
const randomId = v4();  

const registerUrl = '/api/register';
const name     = 'test' + randomId;
const email    = `${name}@gmail.com`; 
const password = name;

describe('handles register', () => {
  it.only('fails when any entry is blank', () => {
    cy.intercept('POST', registerUrl).as('register');

    const testData = ['name', 'email', 'password'];
  
    testData.forEach(empty => {
      cy.signupEmpty(name, email, password, empty);
      cy.wait('@register').then((intercept) => {
        expect(intercept.response?.statusCode).to.equal(400);
      });
      cy.get('div[role="status"]').should('contain.text', 'Something went wrong');
    });
  })
  it('registers unique user', () => {
    cy.intercept('POST', registerUrl).as('register');

    cy.signup(name, email, password);

    cy.wait('@register').then((intercept) => {
      expect(intercept.response?.statusCode).to.equal(200);
      expect(intercept.request?.body).to.have.property('name')
      expect(intercept.request?.body).to.have.property('email')
      expect(intercept.request?.body).to.have.property('password')
    });
  })
  it('fails to register duplicate user', () => {
    cy.intercept('POST', registerUrl).as('register');

    cy.signup(name, email, password);

    cy.wait('@register').then((intercept) => {
      expect(intercept.response?.statusCode).to.equal(500);      
    });

    cy.get('div[role="status"]').should('contain.text', 'Something went wrong');
  })
})
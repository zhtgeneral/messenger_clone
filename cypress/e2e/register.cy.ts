import { v4 } from 'uuid';
const randomId = v4();  

const registerUrl = '/api/register';
const randomName     = 'test' + randomId;
const randomEmail    = `${randomName}@gmail.com`; 
const ramdomPassword = randomName;

describe('handles register', () => {
  it('fails when any entry is blank', () => {
    cy.intercept('POST', registerUrl).as('register');

    const testData = ['name', 'email', 'password'];
  
    testData.forEach(empty => {
      cy.signupEmpty(randomName, randomEmail, ramdomPassword, empty);
      cy.wait('@register').then((intercept) => {
        expect(intercept.response?.statusCode).to.equal(400);
      });
      cy.get('div[role="status"]').should('contain.text', 'Something went wrong');
    });
  })
  it('registers unique user and redirects to /users', () => {
    cy.intercept('POST', registerUrl).as('register');

    cy.signup(randomName, randomEmail, ramdomPassword);

    cy.wait('@register').then((intercept) => {
      expect(intercept.response?.statusCode).to.equal(200);
      expect(intercept.request?.body).to.have.property('name')
      expect(intercept.request?.body).to.have.property('email')
      expect(intercept.request?.body).to.have.property('password')
    });

    cy.url().should('eq', `${Cypress.env('NEXT_PUBLIC_DOMAIN')}/users`)
  })
  it('fails to register duplicate user', () => {
    cy.intercept('POST', registerUrl).as('register');

    cy.signup(randomName, randomEmail, ramdomPassword);

    cy.wait('@register').then((intercept) => {
      expect(intercept.response?.statusCode).to.equal(500);      
    });

    cy.get('div[role="status"]').should('contain.text', 'Something went wrong');
  })
})
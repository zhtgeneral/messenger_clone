import { v4 } from 'uuid';

describe('register functions', () => {
  const randomId = v4();  

  const registerAPI    = '/api/register';
  const randomName     = 'test' + randomId;
  const randomEmail    = `${randomName}@gmail.com`; 
  const randomPassword = randomName;


  it('fails when any entry is blank', () => {
    const missingFields = ['name', 'email', 'password'];

    cy.intercept('POST', registerAPI).as('register');
    missingFields.forEach(missingField => {
      cy.signupEmpty(randomName, randomEmail, randomPassword, missingField);
      cy.wait('@register').then((intercept) => {
        expect(intercept.response?.statusCode).to.equal(400);
      });
      cy.get('div[role="status"]').should('contain.text', 'Something went wrong');
    });
  })

  it('register UX', () => {
    cy.intercept('POST', registerAPI).as('register');
    cy.signup(randomName, randomEmail, randomPassword);
    cy.wait('@register').then((intercept) => {
      expect(intercept.response?.statusCode).to.equal(200);
    });
    cy.location('pathname').should('eq', '/users');
  })
  it('blocks duplicate users', () => {
    const sameName     = randomName;
    const sameEmail    = randomEmail;
    const samePassword = randomPassword;
    cy.intercept('POST', registerAPI).as('register');
    cy.signup(sameName, sameEmail, samePassword);
    cy.wait('@register').then((intercept) => {
      expect(intercept.response?.statusCode).to.equal(500);      
    });
    cy.get('div[role="status"]').should('contain.text', 'Something went wrong');
  })
})
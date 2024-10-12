/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable<Subject = any> {
      /**
       * Registers a new user from user's view at `/`
       * @requires app needs to be built 
       * @requires email needs to be an email not seen in the database
       *
       * @param name The name of the person
       * @param email The email of the person
       * @param password The password of the person
       */
      signup(name: string, email: string, password: string): Chainable<any>;
      /**
       * Registers a new user from user's view at `/` but leaves a field blank
       * @requires app needs to be built
       *
       * @param name The name of the person
       * @param email The email of the person
       * @param password The password of the person
       * @param empty The field to leave blank
       */
      signupEmpty(name: string, email: string, password: string, empty: string): Chainable<any>;
    }
  }
}

Cypress.Commands.addAll({
  signup(name: string, email: string, password: string) {
    cy.visit('/');
    cy.contains('Create an account').click();
    cy.get('input[id="name"]').type(name);
    cy.get('input[id="email"]').type(email);
    cy.get('input[id="password"]').type(password);
    cy.get('button[type="submit"]').click();
  },
  signupEmpty(name: string,  email: string, _password: string, empty: string) {
    cy.visit('/');
    cy.contains('Create an account').click();
    cy.get('input[id="name"]').type((empty == 'name')? 'a{backspace}': name); 
    cy.get('input[id="email"]').type((empty == 'email')? 'a{backspace}': email); 
    cy.get('input[id="password"]').type((empty == 'password')? 'a{backspace}': name); 
    cy.get('button[type="submit"]').click();
  },
})
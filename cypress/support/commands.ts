/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }
declare namespace Cypress {
  interface cy {}
  interface Chainable {
    /**
     * Registers a new user from user's view at `/`
     * @requires app needs to be built 
     * @requires email needs to be an email not seen in the database
     *
     * @param name The name of the person
     * @param email The email of the person
     * @param password The password of the person
     */
    signup(name: string, email: string, password: string): void;
    /**
     * Registers a new user from user's view at `/` but leaves a field blank
     * @requires app needs to be built
     *
     * @param name The name of the person
     * @param email The email of the person
     * @param password The password of the person
     * @param empty The field to leave blank
     */
    signupEmpty(name: string, email: string, password: string, empty: string): void;
    /**
     * Logs the test user in at `/`
     * @requires app needs to be built
     * @requires user needs to have valid account in database.
     *
     * @param email The email of the user
     * @param password The password of the user
     */
    login(email: string, password: string): void;
    /** 
     * Navigates to `/conversations` by first logging in with test account
     * @requires app needs to have route `/conversations`
     */ 
    gotoConversations(viewPort: string): void;
  }
}

Cypress.Commands.add('signup', (
  name: string, 
  email: string, 
  password: string
): void => {
  cy.visit('/');
  cy.contains('Create an account').click();
  cy.get('input[id="name"]').type(name);
  cy.get('input[id="email"]').type(email);
  cy.get('input[id="password"]').type(password);
  cy.get('button[type="submit"]').click();
})

Cypress.Commands.add('signupEmpty', (
  name: string, 
  email: string, 
  _password: string, 
  empty: string
): void => {
  cy.visit('/');
  cy.contains('Create an account').click();
  cy.get('input[id="name"]').type((empty == 'name')? 'a{backspace}': name); 
  cy.get('input[id="email"]').type((empty == 'email')? 'a{backspace}': email); 
  cy.get('input[id="password"]').type((empty == 'password')? 'a{backspace}': name); 
  cy.get('button[type="submit"]').click();
})

Cypress.Commands.add('login', (
  email: string,
  password: string
): void => {
  cy.intercept('GET', `${Cypress.env('NEXT_PUBLIC_DOMAIN')}/api/auth/session`).as('auth')
  cy.visit('/')
  cy.get('input[id="email"]').click().type(email);
  cy.get('input[id="password"]').click().type(password);
  cy.get('button[type="submit"]').click(); 
  cy.wait('@auth');
})

Cypress.Commands.add('gotoConversations', (
  viewPort: string
): void => {
  const testEmail = Cypress.env('TEST_EMAIL');
  const testPassword = Cypress.env('TEST_PASSWORD');
  cy.login(testEmail, testPassword);
  cy.get(`a#${viewPort}Item[href="/conversations"]`).click();
})

/// <reference types="cypress" />

import { signIn, signOut } from "next-auth/react";

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
      /**
       * This helper function creates a mock test account
       * 
       * @param name randomized name
       * @param email randomized password
       * @param password randomized password
       */
      createTestAccount(name: string, email: string, password: string);
      /**
       * This helper function deletes an account from the database
       * @param email email of the user to delete
       */
      deleteTestAccount(email: string);
      /**
       * This helper function logs a user in using authentication
       * @param email email of user
       * @param password password of user
       */
      loginTestUser(email: string, password: string);
      /**
       * This helper function sets the viewport used for testing to 768x1024px
       */
      setTabletView();
      /**
       * This helper function sets the viewport used for testing to 360x800 px
       */
      setPhoneView();
      /**
       * This helper function sets the viewport used for testing to 1920x1080px
       */
      setDesktopView();
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
  createTestAccount(name: string, email: string, password: string) {
    cy.request('POST', '/api/register', {
      name,
      email,
      password
    });
  },
  deleteTestAccount(email: string) {
    cy.request('DELETE', '/api/register', {
      email
    });
  },
  loginTestUser(email: string, password: string) {
    cy.wrap(null).then(() => signIn('credentials', { email, password, redirect: false}));
  },
  setTabletView() {
    cy.viewport(768, 1024);
  },
  setPhoneView() {
    cy.viewport(300, 800);
  },
  setDesktopView() {
    cy.viewport(1920, 1080);
  },
})
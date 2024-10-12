import { v4 } from "uuid";
import axios from "axios";
import { signIn } from "next-auth/react";

async function createTestAccount(name: string, email: string, password: string) {
  const request: any = {
    name,
    email,
    password
  }
  await axios.post('/api/register', request);
}

async function deleteTestAccount(name: string, email: string, password: string) {
  const request: any = {
    name,
    email,
    password
  }
  await axios.delete('/api/register', request); 
}

async function loginTestUser(email: string, password: string) {
  await signIn('credentials', { email, password, redirect: false});
}

const domain = Cypress.env('NEXT_PUBLIC_DOMAIN');

const randomId = v4();
const randomConversationName = `chat${randomId}`;  
const randomMessage = `message${randomId}`;

const testName = `test-${randomId}-account`; 
const observerName = `observer-${randomId}-account`; 
const observerName2 = `observer-2-${randomId}-account`; 

const testEmail = `test-${randomId}@gmail.com`; 
const observerEmail = `observer-${randomId}@gmail.com`; 
const observerEmail2 = `observer-2-${randomId}@gmail.com`; 

const testPassword = testName;
const observerPassword = observerName;
const observerPassword2 = observerName2;    

describe('route security', () => {  
  it('page security', () => {
    cy.visit('/conversations')
    cy.location('pathname').should('eq', '/');
  })
})

// TODO clear data from DB so tests can run.
describe.only('group chat functions', () => {
  before(async () => {
    const accountPromises = [
      createTestAccount(testName, testEmail, testPassword),
      createTestAccount(observerName, observerEmail, observerPassword),
      createTestAccount(observerName2, observerEmail2, observerPassword2)
    ];
    await Promise.all(accountPromises);
  })

  beforeEach(async () => {
    await loginTestUser(testEmail, testPassword);
  })

  after(async () => {
    await loginTestUser(testEmail, testPassword);
    await deleteTestAccount(testName, testEmail, testPassword);
    await loginTestUser(observerEmail, observerPassword);
    await deleteTestAccount(observerName, observerEmail, observerPassword);
    await loginTestUser(observerEmail2, observerPassword2);
    await deleteTestAccount(observerName2, observerEmail2, observerPassword2);
  })

  describe('group chat modal', () => {
    it("closes when x button clicked", () => {
      cy.visit("/conversations");
      cy.get('div#groupChat').click();
      cy.get('form#groupChatModal').should('contain.text', 'Create a group chat')
      cy.get('svg#closeButton').click();
      cy.get('body').should('not.contain.text', 'Group chat')
    })
    it("closes when cancel button clicked", () => {
      cy.visit("/conversations");
      cy.get('svg#closeButton').click()
      cy.get('div#groupChat').click();
      cy.get('form#groupChatModal').should('contain.text', 'Create a group chat')
      cy.get('button').contains('Cancel').click()
      cy.get('body').should('not.contain.text', 'Group chat')
    })
  })

  it('stops 2 person groups', () => {
    cy.visit("/conversations");
    cy.get('div#groupChat').click();
    cy.get('input#name').click().type(randomConversationName);

    cy.get('div#select').click();
    cy.get('div').contains(randomConversationName).click();

    cy.intercept('POST', '/api/conversations').as('createGroupChat');
    cy.get('button').contains('Create').click();
    cy.wait('@createGroupChat').then((intercept) => {
      expect(intercept.response?.statusCode).to.equal(400);
      cy.get('body').should('contain.text', 'Something went wrong');
    })
  })

  it('allows 3+ person groups', async () => {
    cy.visit("/conversations");
    cy.get('div#groupChat').click();
    cy.get('input#name').click().type(randomConversationName);

    cy.get('div#select').click();
    cy.get('div').contains(observerName).click();

    cy.get('div#select').click();
    cy.get('div').contains(observerName2).click();

    cy.intercept('POST', '/api/conversations').as('createGroupChat');
    cy.get('button').contains('Create').click();
    cy.wait('@createGroupChat').then((intercept) => {
      expect(intercept.response?.statusCode).to.equal(200);
      cy.location('pathname').should('eq', '/conversations');
      cy.get('div#conversationBox').first().should('contain.text', randomConversationName);
    })
  })

  it('marks group messages as seen', async () => {
    cy.visit("/conversations");
    cy.get('div#conversationBox').contains(randomConversationName).click();
    cy.get('input#message').click().type(randomMessage);

    cy.intercept('POST', `${domain}/conversations`).as('createConversation');
    cy.get('button[type="submit"]').click();
    cy.wait('@createConversation');

    const conversationId = cy.location('href').toString().split('/').pop();

    await loginTestUser(observerEmail, observerPassword);
    cy.visit("/conversations");
    cy.intercept('POST', `${domain}/conversations`).as('create_conversation');
    cy.get('div#conversationBox').contains(randomConversationName).click();
    cy.wait('@create_conversation');

    await loginTestUser(observerEmail2, observerPassword2);
    cy.visit("/conversations");
    cy.intercept('POST', `${domain}/conversations/seen/${conversationId}`).as('mark_seen_1');
    cy.get('div#conversationBox').contains(randomConversationName).click();    
    cy.wait('@mark_seen_1');

    await loginTestUser(testEmail, testPassword);
    cy.visit("/conversations");
    cy.intercept('POST', `${domain}/conversations/seen/${conversationId}`).as('mark_seen_2');
    cy.get('div#conversationBox').contains(randomConversationName).click();
    cy.wait('@mark_seen_2');

    cy.get('div[id="userLine"]').last().should("contain.text", `Seen by ${observerName}, ${observerName2}`);
  })

  it('updates conversations upon deletion', () => {
    cy.visit("/conversations");
    cy.get('div#conversationBox').contains(randomConversationName).click();
    cy.get('svg#sidebarDrawer').click()
    cy.get('div#deleteButton').click()
    cy.get('button').contains('Delete').click()
    cy.get('div#conversationBox').should('not.contain.text', randomConversationName);
  })
})
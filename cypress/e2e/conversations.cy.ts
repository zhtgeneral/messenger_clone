import { 
  testNames, 
  testEmails, 
  testPasswords, 
  randomConversationName, 
  randomMessage 
} from '../support/generate_names'


const domain = Cypress.env('NEXT_PUBLIC_DOMAIN');
const { testName, observerName, observerName2} = testNames;
const { testEmail, observerEmail, observerEmail2} = testEmails;
const { testPassword, observerPassword, observerPassword2} = testPasswords;


describe('route security', () => {  
  it('page security', () => {
    cy.visit('/conversations')
    cy.location('pathname').should('eq', '/');
  })
})

describe('group chat functions', () => {
  before(() => {
    cy.createTestAccount(testName, testEmail, testPassword);
    cy.createTestAccount(observerName, observerEmail, observerPassword);
    cy.createTestAccount(observerName2, observerEmail2, observerPassword2);
  })

  beforeEach(() => {
    cy.loginTestUser(testEmail, testPassword);
  })

  after(() => {
    cy.loginTestUser(testEmail, testPassword);
    cy.deleteTestAccount(testEmail);
    cy.loginTestUser(observerEmail, observerPassword);
    cy.deleteTestAccount(observerEmail);
    cy.loginTestUser(observerEmail2, observerPassword2);
    cy.deleteTestAccount(observerEmail2);
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
    cy.get('div').contains(observerName).click();

    cy.intercept('POST', '/api/conversations').as('createGroupChat');
    cy.get('button').contains('Create').click();
    cy.wait('@createGroupChat').then((intercept) => {
      expect(intercept.response?.statusCode).to.equal(400);
      cy.get('div[role="status"]').should('contain.text', 'Something went wrong')
    })
  })

  it('allows 3+ person groups', () => {
    cy.visit("/conversations");
    cy.get('div#groupChat').as("groupChatModal").click();
    cy.get("@groupChatModal").get('input#name').click().type(randomConversationName);

    cy.get('div#select').click();
    cy.get('div').contains(observerName).click();

    cy.get('div#select').click();
    cy.get('div').contains(observerName2).click();

    cy.intercept('POST', '/api/conversations').as('createGroupChat');
    cy.get('button').contains('Create').click();
    cy.wait('@createGroupChat').then((intercept) => {
      expect(intercept.response?.statusCode).to.equal(200);
      cy.get('div#conversationBox').first().should('contain.text', randomConversationName);
    })
  })

  /**
   * @requires conversation needs ot be previously created
   */
  it('marks group messages as seen', () => {
    cy.visit("/conversations");
    cy.get('div#conversationBox').contains(randomConversationName).click();
    cy.get('input#message').click().type(randomMessage);

    cy.intercept('POST', `${domain}/api/messages`).as('create_message');
    cy.get('button[type="submit"]').click();
    cy.wait('@create_message');


    const conversationId = cy.url().then((url) => {
      return url.split('/').pop()
    })
    console.log('conversation id' + conversationId)
    cy.log(`CONVERSATION ID: ${conversationId}`)

    cy.loginTestUser(testEmail, testPassword);
    cy.visit("/conversations");

    cy.intercept('POST', `${domain}/api/conversations/*/seen`).as('seen_message_1');
    cy.get('div#conversationBox').contains(randomConversationName).click();
    cy.wait('@seen_message_1', { timeout: 10000 });


    cy.loginTestUser(observerEmail2, observerPassword2);
    cy.visit("/conversations");

    cy.intercept('POST', `${domain}/api/conversations/*/seen`).as('seen_message_2');
    cy.get('div#conversationBox').contains(randomConversationName).click();    
    cy.wait('@seen_message_2', { timeout: 10000 });

    cy.loginTestUser(testEmail, testPassword)
    cy.visit("/conversations");
    cy.get('div#conversationBox').contains(randomConversationName).click();

    cy.get('div#seen_by').should("contain.text", `Seen by ${observerName}, ${observerName2}`);
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
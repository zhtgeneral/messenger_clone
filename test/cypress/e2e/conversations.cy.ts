import { 
  testNames, 
  testEmails, 
  testPasswords, 
  randomConversationName, 
  randomMessage 
} from '../support/generate_names';

describe('page security', () => {  
  it('prevents unauthenticated users from accessing /conversations', () => {
    cy.visit('/conversations')
    cy.location('pathname').should('eq', '/');
  })
})

describe('group chat functions', () => {
  const { testName, observerName, observerName2} = testNames;
  const { testEmail, observerEmail, observerEmail2} = testEmails;
  const { testPassword, observerPassword, observerPassword2} = testPasswords;

  before('init accounts', () => {
    cy.createTestAccount(testName, testEmail, testPassword);
    cy.createTestAccount(observerName, observerEmail, observerPassword);
    cy.createTestAccount(observerName2, observerEmail2, observerPassword2);
  })
  beforeEach('navigate to /conversations', () => {
    cy.loginTestUser(testEmail, testPassword);
    cy.visit("/conversations", { timeout: 30000 });
  })
  afterEach('remove relationships', () => cy.cleanup(
    [testEmail, observerEmail, observerEmail2], 
    [testPassword, observerPassword, observerPassword2]
  ))
  after('remove test accounts', () => {
    cy.cleanup(
      [testEmail, observerEmail, observerEmail2], 
      [testPassword, observerPassword, observerPassword2]
    );
    cy.deleteTestAccount(testEmail, testPassword);
    cy.deleteTestAccount(observerEmail, observerPassword);
    cy.deleteTestAccount(observerEmail2, observerPassword2);
  })

  describe('group chat creation', () => {
    it('stops 2 person group chats', () => {
      cy.get('div#groupChat').click();
      cy.get('input#name').click().type(randomConversationName, { delay: 0 });
  
      cy.get('div#select').click();
      cy.get('div').contains(observerName).click();
  
      cy.intercept('POST', '/api/conversations').as('createGroupChat');
      cy.get('button').contains('Create').click();
      cy.wait('@createGroupChat').then((intercept) => {
        expect(intercept.response?.statusCode).to.equal(400);
        cy.get('div[role="status"]').should('contain.text', 'Something went wrong')
      })
    })
    it('allows 3+ person group chats', () => {
      cy.get('div#groupChat').as("groupChatModal").click();
      cy.get("@groupChatModal").get('input#name').click().type(randomConversationName, { delay: 0 });
  
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
  })

  describe('group chat interaction', () => {
    before('create group chat', () => {
      cy.loginTestUser(testEmail, testPassword);
      cy.visit("/conversations", { timeout: 30000 });
      cy.get('div#groupChat').as("groupChatModal").click();
      cy.get("@groupChatModal").get('input#name').click().type(randomConversationName, { delay: 0 });
  
      cy.get('div#select').click();
      cy.get('div').contains(observerName).click();
  
      cy.get('div#select').click();
      cy.get('div').contains(observerName2).click();
  
      cy.intercept('POST', '/api/conversations').as('createGroupChat');
      cy.get('button').contains('Create').click();
      cy.wait('@createGroupChat').then((intercept) => expect(intercept.response?.statusCode).to.equal(200));
    })
    it('marks group messages as seen', () => {
      cy.get('div#conversationBox').contains(randomConversationName).click();
      cy.get('input#message').click().type(randomMessage, { delay: 0 });

      cy.intercept('POST', `/api/messages`).as('create_message');
      cy.get('button[type="submit"]').click();
      cy.wait('@create_message');


      cy.loginTestUser(observerEmail, observerPassword);
      cy.visit("/conversations");

      cy.intercept('POST', `/api/conversations/*/seen`).as('seen_message_1');
      cy.get('div#conversationBox').contains(randomConversationName).click();
      cy.wait('@seen_message_1', { timeout: 10000 });


      cy.loginTestUser(observerEmail2, observerPassword2);
      cy.visit("/conversations");

      cy.intercept('POST', `/api/conversations/*/seen`).as('seen_message_2');
      cy.get('div#conversationBox').contains(randomConversationName).click();    
      cy.wait('@seen_message_2', { timeout: 10000 });


      cy.loginTestUser(testEmail, testPassword);
      cy.visit("/conversations");
      cy.get('div#conversationBox').contains(randomConversationName).click();

      cy.get('div#seen_by').should("contain.text", `Seen by ${observerName}, ${observerName2}`);
    })
    it('updates conversations tab upon deletion', () => {
      cy.get('div#conversationBox').contains(randomConversationName).click();
      cy.get('svg#sidebarDrawer').click();
      cy.get('div#deleteButton').click();
      cy.intercept('DELETE', '/api/conversations/*').as('delete_conversation');
      cy.get('button').contains('Delete').click();
      cy.wait('@delete_conversation');
      cy.location('pathname').should('eq', '/conversations');
      cy.get('div#conversations').should('not.contain.text', randomConversationName);
    })
    // describe('group chat read reciepts', () => {

    // })
    // describe('group chat deletion', () => {
    //   it('updates conversations tab upon deletion', () => {
    //     cy.get('div#conversationBox').contains(randomConversationName).click();
    //     cy.get('svg#sidebarDrawer').click();
    //     cy.get('div#deleteButton').click();
    //     cy.get('button').contains('Delete').click();
    //     cy.visit("/conversations", { timeout: 30000 });
    //     cy.get('div#conversations').should('not.contain.text', randomConversationName);
    //   })
    // })
  })

  // TODO move to component test instead of e2e
  // describe('group chat modal', () => {
  //   it("closes when x buttonis clicked", () => {
  //     cy.visit("/conversations");
  //     cy.get('div#groupChat').click();
  //     cy.get('form#groupChatModal').should('contain.text', 'Create a group chat')
  //     cy.get('svg#closeButton').click();
  //     cy.get('body').should('not.contain.text', 'Group chat')
  //   })
  //   it("closes when cancel button is clicked", () => {
  //     cy.visit("/conversations");
  //     cy.get('div#groupChat').click();
  //     cy.get('form#groupChatModal').should('contain.text', 'Create a group chat')
  //     cy.get('button').contains('Cancel').click()
  //     cy.get('body').should('not.contain.text', 'Group chat')
  //   })
  // })
})
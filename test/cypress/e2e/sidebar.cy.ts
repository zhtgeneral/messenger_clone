// TODO move to component test instead of e2e

// import { 
//   testEmails, 
//   testNames, 
//   testPasswords 
// } from "../support/generate_names";

// describe('Sidebar', () => {

//   const { testName } = testNames;
//   const { testEmail } = testEmails;
//   const { testPassword } = testPasswords;
  
//   before(() => {
//     cy.createTestAccount(testName, testEmail, testPassword);
//   }) 
//   beforeEach('login', () => {
//     cy.loginTestUser(testEmail, testPassword);
//     cy.visit('/', { timeout: 30000 });
//   })
//   after('delete test account', () => {
//     cy.deleteTestAccount(testEmail, testPassword);
//   })
//   describe('Tablet sidebar', () => {
//     beforeEach('set tablet view', () => {
//       cy.setTabletView();
//     });
//     describe("Sidebar interactions", () => {
//       it('allows the user to switch between routes from the sidebar', () => {
//         cy.get('a#mobileItem[href="/conversations"]').click()
//         cy.location('pathname').should('eq', '/conversations');
    
//         cy.get('a#mobileItem[href="/users"]').click()
//         cy.location('pathname').should('eq', '/users');
    
//         cy.get('a#mobileItem[href="/conversations"]').click()
//         cy.location('pathname').should('eq', '/conversations');
    
//         cy.get('a#mobileItem[href="/#"]').click()
//         cy.location('pathname').should('eq', '/');
//       })
//     })
//   })

//   describe('Desktop sidebar', () => {
//     beforeEach('set desktop view', () => {
//       cy.setDesktopView();
//     });
//     describe("Sidebar interactions", () => {
//       it('allows the user to switch between routes from the sidebar', () => {
//         cy.get('a#desktopItem[href="/conversations"]').click()
//         cy.location('pathname').should('eq', '/conversations');
    
//         cy.get('a#desktopItem[href="/users"]').click()
//         cy.location('pathname').should('eq', '/users');
    
//         cy.get('a#desktopItem[href="/conversations"]').click()
//         cy.location('pathname').should('eq', '/conversations');
    
//         cy.get('a#desktopItem[href="/#"]').click()
//         cy.location('pathname').should('eq', '/');
//       })
//     })
//   })
// })


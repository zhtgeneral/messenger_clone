import { v4 } from "uuid";

const randomId = v4();
 
const testName = `test-${randomId}-account`; 
const observerName = `observer-${randomId}-account`; 
const observerName2 = `observer-2-${randomId}-account`; 

const testEmail = `test-${randomId}@gmail.com`; 
const observerEmail = `observer-${randomId}@gmail.com`; 
const observerEmail2 = `observer-2-${randomId}@gmail.com`; 

const testPassword = testName;
const observerPassword = observerName;
const observerPassword2 = observerName2;   


export const randomConversationName = `chat${randomId}`; 
export const randomMessage = `message${randomId}`;
export const testNames = {
  testName,
  observerName,
  observerName2
}
export const testEmails = {
  testEmail,
  observerEmail,
  observerEmail2
} 
export const testPasswords = {
  testPassword,
  observerPassword,
  observerPassword2
} 
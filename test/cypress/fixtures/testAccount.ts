import { v4 } from "uuid";

const randomId = v4();

export const testName = `test-${randomId}-account`; 
export const observerName = `observer-${randomId}-account`; 
export const observerName2 = `observer-2-${randomId}-account`; 
export const testEmail = `test-${randomId}@gmail.com`; 
export const observerEmail = `observer-${randomId}@gmail.com`; 
export const observerEmail2 = `observer-2-${randomId}@gmail.com`; 
export const testPassword = testName;
export const observerPassword = observerName;
export const observerPassword2 = observerName2;    


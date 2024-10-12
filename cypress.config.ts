import { defineConfig } from "cypress";
require('dotenv').config();

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    // baseUrl: process.env.NEXT_PUBLIC_DOMAIN
    baseUrl: 'http://localhost:3000'
  },
  env: {
    ...process.env
  },
  defaultCommandTimeout: 20000,
  pageLoadTimeout: 100000
});

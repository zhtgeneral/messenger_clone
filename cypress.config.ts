import { defineConfig } from "cypress";

require("dotenv").config();

export default defineConfig({
  e2e: {
    specPattern: 'test/cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'test/cypress/support/e2e.{js,jsx,ts,tsx}',
    setupNodeEvents(on, config) {
      
    },
    baseUrl: process.env.NEXT_PUBLIC_DOMAIN
  },
  env: {
    ...process.env,
  },
  defaultCommandTimeout: 20000,
  pageLoadTimeout: 100000,
  responseTimeout: 10000,
  requestTimeout: 10000,
  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
  },
});

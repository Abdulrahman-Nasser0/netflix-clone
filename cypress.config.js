import { defineConfig } from 'cypress'

export default defineConfig({
  video: false,
  retries: { runMode: 2, openMode: 0 },
  e2e: {
    baseUrl: 'http://localhost:5173',
    setupNodeEvents(/* on, config */) {
      // implement node event listeners here
    },
    supportFile: 'cypress/support/e2e.js',
  },
  env: {
    backendUrl: 'http://localhost:3000/api',
    tmdbOrigin: 'https://api.themoviedb.org',
  },
})

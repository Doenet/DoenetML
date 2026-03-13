import { defineConfig } from "cypress";

export default defineConfig({
    e2e: {
        specPattern: "test/cypress/**/*.cy.js",
        supportFile: false,
    },
    video: false,
});

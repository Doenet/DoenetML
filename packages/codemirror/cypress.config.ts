import { defineConfig } from "cypress";
import vitePreprocessor from "cypress-vite";

export default defineConfig({
    component: {
        devServer: {
            framework: "react",
            bundler: "vite",
        },
        specPattern: "test/cypress/component/**/*.cy.{js,jsx,ts,tsx}",
        supportFile: "test/cypress/support/component.ts",
        indexHtmlFile: "test/cypress/support/component-index.html",
        setupNodeEvents(on) {
            on("file:preprocessor", vitePreprocessor());
        },
    },
});

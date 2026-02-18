import { defineConfig } from "cypress";
import vitePreprocessor from "cypress-vite";

export default defineConfig({
    component: {
        devServer: {
            framework: "react",
            bundler: "vite",
        },
        specPattern: "cypress/component/**/*.cy.{js,jsx,ts,tsx}",
        supportFile: "cypress/support/component.ts",
        indexHtmlFile: "cypress/support/component-index.html",
        setupNodeEvents(on) {
            on("file:preprocessor", vitePreprocessor());
        },
    },
});

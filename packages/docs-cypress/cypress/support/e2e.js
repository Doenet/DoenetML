import "cypress-axe";

/**
 * Override `injectAxe` to read axe-core directly from node_modules so the
 * test works regardless of how the documentation site handles static assets.
 */
Cypress.Commands.overwrite("injectAxe", () => {
    return cy
        .readFile("../../node_modules/axe-core/axe.min.js")
        .then((source) => {
            cy.window({ log: false }).then((win) => {
                win.eval(source);
            });
        });
});

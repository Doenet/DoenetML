// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import "cypress-wait-until";
import { clear as idb_clear } from "idb-keyval";

Cypress.Commands.add("clearIndexedDB", () => {
    return idb_clear();
});

/**
 * Sets the viewer/editor theme in the Cypress harness by posting a `darkMode`
 * message (handled in `CypressTest.tsx`). Use `"dark"` / `"light"`. This lets
 * accessibility specs re-run the same DoenetML under dark mode and assert it
 * stays WCAG AA compliant.
 */
Cypress.Commands.add("setDarkMode", (mode) => {
    cy.window().then((win) => {
        win.postMessage({ darkMode: mode }, "*");
    });
    // The theme is applied via a `data-theme` attribute on the viewer wrapper.
    cy.get(`[data-theme="${mode}"]`, { timeout: 10000 }).should("exist");
});

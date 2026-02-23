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
 * Get the body element of an iframe, optionally waiting for a specific child element.
 * @param {string} iframeSelector - CSS selector to find the iframe
 * @param {string} [waitSelector=null] - Optional CSS selector for an element that must exist in the iframe before returning
 * @returns The iframe body element wrapped for Cypress chaining
 */
Cypress.Commands.add("getIframeBody", (iframeSelector, waitSelector = null) => {
    return cy
        .get(iframeSelector, { log: false })
        .should(($iframe) => {
            const $body = $iframe.contents().find("body");

            if ($body.length === 0) {
                throw new Error("Iframe body is empty or not yet loaded");
            }

            if (waitSelector && $body.find(waitSelector).length === 0) {
                throw new Error(
                    `Element "${waitSelector}" not yet found in iframe`,
                );
            }
        })
        .its("0.contentDocument.body", { log: false })
        .then(cy.wrap);
});

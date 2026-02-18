import { CodeMirror } from "../../src/CodeMirror";

/**
 * Tests for the LSP autocomplete plugin (snippets and completions)
 *
 * These tests verify that the CodeMirror editor with LSP plugin is properly
 * set up to provide autocomplete suggestions when typing trigger characters
 * and that snippets are correctly applied with proper indentation.
 */
describe("CodeMirror LSP Autocomplete Plugin", () => {
    // Note: this openAutocomplete function repeatedly tries
    // because sometime for the first test of a spec we need to wait on the language server.
    const openAutocomplete = (timeoutMs = 8000): Cypress.Chainable<void> => {
        const start = Date.now();

        const attempt = (): Cypress.Chainable<void> => {
            return cy.get("body").then(($body) => {
                if ($body.find(".cm-tooltip-autocomplete").length > 0) {
                    return cy.wrap(undefined) as Cypress.Chainable<void>;
                }

                if (Date.now() - start > timeoutMs) {
                    throw new Error(
                        "Timed out waiting for autocomplete tooltip",
                    );
                }

                cy.get(".cm-content").type("{ctrl} ", { force: true });
                return cy
                    .wait(250)
                    .then(() => undefined)
                    .then(attempt) as Cypress.Chainable<void>;
            }) as Cypress.Chainable<void>;
        };

        return cy.then(attempt).then(() => {
            cy.get(".cm-tooltip-autocomplete").should("be.visible");
        });
    };

    it("completes element names in a blank document", () => {
        cy.mount(
            <div style={{ height: "400px", width: "600px" }}>
                <CodeMirror value="" />
            </div>,
        );

        cy.get(".cm-content").click().type("<", { force: true });
        openAutocomplete();
        cy.get(".cm-tooltip-autocomplete .cm-completionLabel")
            .first()
            .invoke("text")
            .then((label) => {
                const trimmed = label.trim();
                expect(trimmed).to.not.equal("");
                cy.get(".cm-tooltip-autocomplete .cm-completionLabel")
                    .first()
                    .click();
                cy.get(".cm-line").should("contain.text", `<${trimmed}`);
            });
    });

    it("completes element names inside parent", () => {
        cy.mount(
            <div style={{ height: "400px", width: "600px" }}>
                <CodeMirror
                    value={`
<matrix>
  
</matrix>`}
                />
            </div>,
        );

        // It works even without openAutocomplete().
        cy.get(".cm-content").click().type("{upArrow}<", { force: true });
        cy.get(".cm-tooltip-autocomplete .cm-completionLabel").first().click();
        cy.get(".cm-line").should("contain.text", `<column`);
    });

    it("completes closing tag", () => {
        cy.mount(
            <div style={{ height: "400px", width: "600px" }}>
                <CodeMirror value={`<matrix>`} />
            </div>,
        );

        cy.get(".cm-content").click().type("<", { force: true });
        cy.get(".cm-tooltip-autocomplete .cm-completionLabel").first().click();
        cy.get(".cm-line").should("have.text", `<matrix></matrix>`);
    });

    it("inserts element snippets", () => {
        cy.mount(
            <div style={{ height: "400px", width: "600px" }}>
                <CodeMirror value="" />
            </div>,
        );

        cy.get(".cm-content").click().type("<mul", { force: true });
        cy.get(".cm-tooltip-autocomplete .cm-completionLabel")
            .contains("multiple-choice-answer")
            .click();
        cy.get(".cm-content").invoke("text").should("contain", "<answer");
        cy.get(".cm-content").invoke("text").should("contain", "<choice");
    });

    it("completes attribute names", () => {
        cy.mount(
            <div style={{ height: "400px", width: "600px" }}>
                <CodeMirror value="" />
            </div>,
        );

        cy.get(".cm-content").click().type("<title ", { force: true });
        openAutocomplete();
        cy.get(".cm-tooltip-autocomplete .cm-completionLabel")
            .contains("hide")
            .click();
        cy.get(".cm-line").should("contain.text", "hide");
    });

    it("completes attribute values", () => {
        cy.mount(
            <div style={{ height: "400px", width: "600px" }}>
                <CodeMirror value="" />
            </div>,
        );

        cy.get(".cm-content").click().type('<title hide="', { force: true });
        openAutocomplete();
        cy.get(".cm-tooltip-autocomplete .cm-completionLabel")
            .contains("true")
            .click();
        cy.get(".cm-line").should("contain.text", 'hide="true"');
    });
});

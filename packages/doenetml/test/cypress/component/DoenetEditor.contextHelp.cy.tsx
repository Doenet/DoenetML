import React from "react";
import { DoenetEditor } from "../../../src/doenetml-inline-worker";

/**
 * End-to-end coverage for the editor's context-sensitive help panel,
 * focused on the integration between CodeMirror's autocomplete state and
 * the help panel. The dispatch-level cases (which `HelpContent` kind is
 * produced for which input) are covered by `computeContextHelp.test.ts`;
 * these specs assert that the editor wires the popup-driven help through
 * the React tree and renders the expected DOM.
 */

const EDITOR_VIEWPORT = { height: "500px", width: "900px" };

/**
 * Mount the editor with the help tab pre-opened so each test can interact
 * with the panel immediately. Returns nothing — assertions are made on the
 * shared `.cm-content` / `.help-panel` selectors.
 */
function mountEditorWithHelpOpen(initialDoenetML: string) {
    cy.mount(
        <div style={EDITOR_VIEWPORT}>
            <DoenetEditor
                doenetML={initialDoenetML}
                initialOpenTab="help"
                addVirtualKeyboard={false}
            />
        </div>,
    );
}

/**
 * Wait for CodeMirror to finish mounting, then click into the editor and
 * move the cursor to the end of the document. Mirrors how a user typing
 * into a fresh editor lands at the document tail.
 */
function focusEditorAtEnd() {
    cy.get(".cm-content")
        .should("be.visible")
        .click()
        .type("{ctrl+end}", { force: true });
}

/**
 * Force-open the autocomplete popup (matches the helper used by the
 * codemirror package's autocomplete spec). Retries on the first call of
 * a spec, where the language server may still be warming up.
 */
function openAutocomplete(timeoutMs = 8000) {
    const start = Date.now();
    const attempt = (): Cypress.Chainable<unknown> =>
        cy.get("body").then(($body) => {
            if ($body.find(".cm-tooltip-autocomplete").length > 0) return;
            if (Date.now() - start > timeoutMs) {
                throw new Error("Timed out waiting for autocomplete tooltip");
            }
            cy.get(".cm-content").type("{ctrl} ", { force: true });
            return cy.wait(200).then(attempt);
        });
    cy.then(attempt);
    cy.get(".cm-tooltip-autocomplete").should("be.visible");
}

describe("DoenetEditor context-sensitive help", () => {
    describe("cursor-driven", () => {
        it("keeps the simplify attribute help visible after typing `=`", () => {
            mountEditorWithHelpOpen("");
            focusEditorAtEnd();
            cy.get(".cm-content").type("<math simplify", { force: true });
            // Cursor sits on the attribute name — help should show
            // `simplify` on `<math>`.
            cy.get(".help-element-name").should("have.text", "<math>");
            cy.get(".help-attribute-name").should("have.text", "simplify");

            // Crossing the `=` boundary used to blank the panel; it must
            // continue to show simplify help now.
            cy.get(".cm-content").type("=", { force: true });
            cy.get(".help-element-name").should("have.text", "<math>");
            cy.get(".help-attribute-name").should("have.text", "simplify");
        });

        it("falls back to element help on an unknown attribute (`<math bad`)", () => {
            mountEditorWithHelpOpen("");
            focusEditorAtEnd();
            cy.get(".cm-content").type("<math bad", { force: true });
            // Close any autocomplete popup that may have surfaced so the
            // help panel reflects cursor-driven dispatch, not the
            // completion-driven path.
            cy.get(".cm-content").type("{esc}", { force: true });
            cy.get(".help-panel").should("exist");
            cy.get(".help-element-name").should("have.text", "<math>");
            // Element help has no attribute-name pill.
            cy.get(".help-attribute-name").should("not.exist");
        });
    });

    describe("autocomplete-driven", () => {
        it("shows help for the highlighted element completion and follows arrow-key navigation", () => {
            mountEditorWithHelpOpen("");
            focusEditorAtEnd();
            cy.get(".cm-content").type("<a", { force: true });
            openAutocomplete();

            // Whatever option the popup defaults to, the help panel should
            // be in sync with it. Read the highlighted row's label and
            // assert the help-panel header matches.
            cy.get(".cm-tooltip-autocomplete li[aria-selected='true']")
                .invoke("text")
                .then((firstLabel) => {
                    const name = firstLabel.trim();
                    cy.get(".help-element-name").should(
                        "have.text",
                        `<${name}>`,
                    );

                    // ArrowDown — the highlighted label changes; the help
                    // panel must move with it.
                    cy.get(".cm-content").type("{downArrow}", {
                        force: true,
                    });
                    cy.get(".cm-tooltip-autocomplete li[aria-selected='true']")
                        .invoke("text")
                        .then((secondLabel) => {
                            const next = secondLabel.trim();
                            expect(next).to.not.equal(name);
                            cy.get(".help-element-name").should(
                                "have.text",
                                `<${next}>`,
                            );
                        });
                });
        });

        it("renders snippet description and template preview when a snippet row is highlighted", () => {
            mountEditorWithHelpOpen("");
            focusEditorAtEnd();
            // `<mul` brings up the `multiple-choice-answer` snippet
            // alongside any matching elements.
            cy.get(".cm-content").type("<mul", { force: true });
            openAutocomplete();

            // Highlight the snippet row explicitly so the assertion isn't
            // sensitive to which option CodeMirror defaults to.
            cy.get(".cm-tooltip-autocomplete .cm-completionLabel")
                .contains("multiple-choice-answer")
                .trigger("mouseover");

            cy.get(".help-snippet-name").should(
                "have.text",
                "multiple-choice-answer",
            );
            cy.get(".help-snippet-preview")
                .invoke("text")
                .should("contain", "<answer");
            cy.get(".help-snippet-preview")
                .invoke("text")
                .should("contain", "<choice");
        });

        it("reverts to cursor-driven help when the autocomplete popup closes", () => {
            mountEditorWithHelpOpen("");
            focusEditorAtEnd();
            cy.get(".cm-content").type("<math simplify", { force: true });
            // Force the attribute-value popup open.
            cy.get(".cm-content").type('="', { force: true });
            openAutocomplete();
            // Some completion is highlighted now; close the popup.
            cy.get(".cm-content").type("{esc}", { force: true });
            cy.get(".cm-tooltip-autocomplete").should("not.exist");

            // Cursor still sits inside the simplify attribute value, so
            // the help panel should be back on cursor-driven simplify help.
            cy.get(".help-element-name").should("have.text", "<math>");
            cy.get(".help-attribute-name").should("have.text", "simplify");
        });
    });
});

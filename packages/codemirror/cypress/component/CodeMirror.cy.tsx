import React from "react";
import { CodeMirror } from "../../src/CodeMirror";

/**
 * Component tests for the CodeMirror editor.
 */
describe("CodeMirror Component", () => {
    it("shows initial content", () => {
        const initialValue = "<section><title>Test</title></section>";
        cy.mount(
            <div style={{ height: "400px", width: "600px" }}>
                <CodeMirror value={initialValue} />
            </div>,
        );

        cy.get(".cm-line").should("contain.text", "section");
        cy.get(".cm-line").should("contain.text", "title");
        cy.get(".cm-line").should("contain.text", "Test");
    });

    it("read-only mode prevents editing", () => {
        cy.mount(
            <div style={{ height: "400px", width: "600px" }}>
                <CodeMirror value="<document></document>" readOnly={true} />
            </div>,
        );

        cy.get(".cm-editor").should("exist");
        cy.get(".cm-line").should("contain.text", "document");
        cy.get(".cm-content")
            .invoke("text")
            .then((before) => {
                cy.get(".cm-content")
                    .click()
                    .type("SHOULD_NOT_APPEAR", { force: true });
                cy.get(".cm-content").invoke("text").should("eq", before);
            });
    });

    it("allows editing when read-only is not set", () => {
        cy.mount(
            <div style={{ height: "400px", width: "600px" }}>
                <CodeMirror value="<document></document>" />
            </div>,
        );

        cy.get(".cm-content")
            .invoke("text")
            .then((before) => {
                cy.get(".cm-content")
                    .click()
                    .type("APPENDED_TEXT", { force: true });
                cy.get(".cm-content")
                    .invoke("text")
                    .should((after) => {
                        expect(after).to.not.equal(before);
                    });
            });

        cy.get(".cm-line").should("contain.text", "APPENDED_TEXT");
    });
});

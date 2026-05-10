import React, { useRef } from "react";
import {
    DoenetEditor,
    type DoenetEditorHandle,
} from "../../../src/doenetml-inline-worker";

const SAMPLE_DOENETML = "<p>hello</p>";

function Harness() {
    const editorRef = useRef<DoenetEditorHandle>(null);
    return (
        <div style={{ height: "500px", width: "900px" }}>
            <button
                data-cy="open-accessibility"
                onClick={() =>
                    editorRef.current?.openDiagnosticsTab("accessibility")
                }
            >
                Open accessibility
            </button>
            <button
                data-cy="open-warnings"
                onClick={() =>
                    editorRef.current?.openDiagnosticsTab("warnings")
                }
            >
                Open warnings
            </button>
            <button
                data-cy="close"
                onClick={() => editorRef.current?.closeDiagnosticsPanel()}
            >
                Close
            </button>
            <DoenetEditor
                ref={editorRef}
                doenetML={SAMPLE_DOENETML}
                addVirtualKeyboard={false}
            />
        </div>
    );
}

describe("DoenetEditor imperative ref handle", () => {
    it("opens a tab via openDiagnosticsTab", () => {
        cy.mount(<Harness />);

        cy.get(".diagnostics-response-tabs-container").should(
            "not.have.class",
            "is-open",
        );

        cy.get('[data-cy="open-accessibility"]').click();
        cy.get(".diagnostics-response-tabs-container").should(
            "have.class",
            "is-open",
        );
        cy.get('[id="accessibility"][role="tab"]').should(
            "have.attr",
            "aria-selected",
            "true",
        );
    });

    it("closes the panel via closeDiagnosticsPanel", () => {
        cy.mount(<Harness />);

        cy.get('[data-cy="open-accessibility"]').click();
        cy.get(".diagnostics-response-tabs-container").should(
            "have.class",
            "is-open",
        );

        cy.get('[data-cy="close"]').click();
        cy.get(".diagnostics-response-tabs-container").should(
            "not.have.class",
            "is-open",
        );
    });

    it("re-opens after the user closes the panel", () => {
        cy.mount(<Harness />);

        // open via ref
        cy.get('[data-cy="open-accessibility"]').click();
        cy.get(".diagnostics-response-tabs-container").should(
            "have.class",
            "is-open",
        );

        // user clicks the panel's internal close button
        cy.get(".close-button").click();
        cy.get(".diagnostics-response-tabs-container").should(
            "not.have.class",
            "is-open",
        );

        // ref handle reopens the same tab
        cy.get('[data-cy="open-accessibility"]').click();
        cy.get(".diagnostics-response-tabs-container").should(
            "have.class",
            "is-open",
        );
        cy.get('[id="accessibility"][role="tab"]').should(
            "have.attr",
            "aria-selected",
            "true",
        );
    });

    it("switches between tabs", () => {
        cy.mount(<Harness />);

        cy.get('[data-cy="open-accessibility"]').click();
        cy.get('[id="accessibility"][role="tab"]').should(
            "have.attr",
            "aria-selected",
            "true",
        );

        cy.get('[data-cy="open-warnings"]').click();
        cy.get('[id="warnings"][role="tab"]').should(
            "have.attr",
            "aria-selected",
            "true",
        );
    });
});

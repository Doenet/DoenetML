import React, { useRef, useState } from "react";
import {
    DoenetEditor,
    type DoenetEditorHandle,
} from "../../../src/doenetml-inline-worker";

const SAMPLE_DOENETML = "<p>hello</p>";

type DiagnosticsCall = {
    summary: {
        warningsCount: number;
        errorsCount: number;
        infosCount: number;
        accessibilityLevel1Count: number;
        accessibilityLevel2Count: number;
    };
    doenetML: string;
};

function Harness({ showViewer = true }: { showViewer?: boolean }) {
    const editorRef = useRef<DoenetEditorHandle>(null);
    const [calls, setCalls] = useState<DiagnosticsCall[]>([]);

    return (
        <div style={{ height: "500px", width: "900px" }}>
            <button
                data-test="trigger-update"
                onClick={() => editorRef.current?.updateRenderedView()}
            >
                Trigger update
            </button>
            <div data-test="call-count">{calls.length}</div>
            <div data-test="last-source">
                {calls.length > 0 ? calls[calls.length - 1].doenetML : ""}
            </div>
            <DoenetEditor
                ref={editorRef}
                doenetML={SAMPLE_DOENETML}
                addVirtualKeyboard={false}
                showViewer={showViewer}
                diagnosticsSummaryCallback={(summary, doenetML) => {
                    setCalls((prev) => [...prev, { summary, doenetML }]);
                }}
            />
        </div>
    );
}

describe("DoenetEditor updateRenderedView ref method", () => {
    it("flushes pending edits and fires diagnosticsSummaryCallback with the new source", () => {
        cy.mount(<Harness />);

        // Wait for the initial diagnostics callback (from the first viewer render).
        cy.get('[data-test="call-count"]').should("not.have.text", "0");
        cy.get('[data-test="last-source"]').should(
            "have.text",
            SAMPLE_DOENETML,
        );

        // Capture the call count after initial settle so we can assert that
        // typing alone (debounced) does NOT trigger a new viewer render.
        cy.get('[data-test="call-count"]')
            .invoke("text")
            .then((initialCountText) => {
                const initialCount = Number(initialCountText);

                // Type into CodeMirror — this changes the editor buffer but,
                // because there's a 3s debounce, does NOT immediately update
                // the viewer or fire the diagnostics callback. Append plain
                // text (no `<` or `=`) so we don't trigger DoenetML
                // autocomplete and end up with a buffer different from what
                // we typed.
                // Two `.type()` calls so the Ctrl modifier is released after
                // jumping to the end — otherwise ` EXTRA` gets typed as
                // Ctrl-chord characters (e.g. Ctrl+A selects all).
                cy.get(".cm-content")
                    .click()
                    .type("{ctrl}{end}", { force: true })
                    .type(" EXTRA", { force: true });

                // Programmatically click "Update".
                cy.get('[data-test="trigger-update"]').click();

                // Callback should fire with the new source.
                cy.get('[data-test="last-source"]').should("contain", "EXTRA");
                cy.get('[data-test="call-count"]')
                    .invoke("text")
                    .then((finalCountText) => {
                        expect(Number(finalCountText)).to.be.greaterThan(
                            initialCount,
                        );
                    });
            });
    });

    it("is a no-op when nothing has changed", () => {
        cy.mount(<Harness />);

        // Wait for initial settle.
        cy.get('[data-test="last-source"]').should(
            "have.text",
            SAMPLE_DOENETML,
        );

        cy.get('[data-test="call-count"]')
            .invoke("text")
            .then((countAfterInitialText) => {
                const countAfterInitial = Number(countAfterInitialText);

                // Click trigger without any edits or interaction.
                cy.get('[data-test="trigger-update"]').click();

                // Give React a couple of ticks; the call count must NOT grow.
                // Using `.should` with a duration check by re-asserting after wait.
                cy.wait(500);
                cy.get('[data-test="call-count"]')
                    .invoke("text")
                    .should((text) => {
                        expect(Number(text)).to.equal(countAfterInitial);
                    });
            });
    });

    it("warns and does not throw when showViewer is false", () => {
        const warnSpy = cy.stub().as("consoleWarn");
        cy.window().then((win) => {
            cy.stub(win.console, "warn").callsFake(warnSpy);
        });

        cy.mount(<Harness showViewer={false} />);

        // No viewer to update — clicking should warn and be a no-op.
        cy.get('[data-test="trigger-update"]').click();
        cy.get("@consoleWarn").should(
            "have.been.calledWithMatch",
            /showViewer/,
        );
    });
});

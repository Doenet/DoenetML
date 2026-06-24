import React, { useState } from "react";
import { DoenetEditor } from "../../../src/doenetml-inline-worker";

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

function Harness() {
    const [calls, setCalls] = useState<DiagnosticsCall[]>([]);

    return (
        <div style={{ height: "500px", width: "900px" }}>
            <div data-test="call-count">{calls.length}</div>
            <div data-test="last-source">
                {calls.length > 0 ? calls[calls.length - 1].doenetML : ""}
            </div>
            <DoenetEditor
                doenetML={SAMPLE_DOENETML}
                addVirtualKeyboard={false}
                showViewer={true}
                diagnosticsSummaryCallback={(summary, doenetML) => {
                    setCalls((prev) => [...prev, { summary, doenetML }]);
                }}
            />
        </div>
    );
}

/**
 * Dispatch a keydown on `el` and return whether the browser default (the
 * "save page" dialog) was prevented. `ctrlKey` and `metaKey` are both set so
 * the shortcut fires regardless of which platform the test runs on (the helper
 * checks Cmd on macOS and Ctrl elsewhere).
 */
function dispatchKeydown(
    el: Element,
    {
        code,
        withModifier,
        withShift = false,
    }: { code: string; withModifier: boolean; withShift?: boolean },
) {
    const event = new KeyboardEvent("keydown", {
        code,
        key: code === "KeyS" ? "s" : code,
        ctrlKey: withModifier,
        metaKey: withModifier,
        altKey: false,
        shiftKey: withShift,
        bubbles: true,
        cancelable: true,
    });
    el.dispatchEvent(event);
    return event.defaultPrevented;
}

describe("DoenetEditor Ctrl/Cmd+S refresh shortcut", () => {
    it("refreshes the viewer (like Update) when fired from the rendered document and prevents the browser save dialog", () => {
        cy.mount(<Harness />);

        // Wait for the initial diagnostics callback (from the first render).
        cy.get('[data-test="call-count"]').should("not.have.text", "0");
        cy.get('[data-test="last-source"]').should(
            "have.text",
            SAMPLE_DOENETML,
        );

        cy.get('[data-test="call-count"]')
            .invoke("text")
            .then((initialCountText) => {
                const initialCount = Number(initialCountText);

                // Edit the buffer. The 3s debounce means this alone does NOT
                // refresh the viewer. Append plain text (no `<`/`=`) to avoid
                // triggering autocomplete. Two `.type()` calls so the Ctrl
                // modifier is released after jumping to the end.
                cy.get(".cm-content")
                    .click()
                    .type("{ctrl}{end}", { force: true })
                    .type(" EXTRA", { force: true });

                // Fire Ctrl/Cmd+S on the rendered viewer container (focus in
                // the rendered document, not the code editor panel).
                cy.get(".viewer").then(($viewer) => {
                    const prevented = dispatchKeydown($viewer[0], {
                        code: "KeyS",
                        withModifier: true,
                    });
                    // Browser "save page" dialog must be suppressed.
                    expect(prevented).to.equal(true);
                });

                // The shortcut should have flushed the edit and refreshed the
                // viewer, exactly like clicking Update.
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

    it("does not refresh or prevent default for a plain 'S' keydown without the modifier", () => {
        cy.mount(<Harness />);

        cy.get('[data-test="last-source"]').should(
            "have.text",
            SAMPLE_DOENETML,
        );

        cy.get('[data-test="call-count"]')
            .invoke("text")
            .then((countAfterInitialText) => {
                const countAfterInitial = Number(countAfterInitialText);

                // Edit the buffer so a refresh would be observable if it fired.
                cy.get(".cm-content")
                    .click()
                    .type("{ctrl}{end}", { force: true })
                    .type(" EXTRA", { force: true });

                cy.get(".viewer").then(($viewer) => {
                    const prevented = dispatchKeydown($viewer[0], {
                        code: "KeyS",
                        withModifier: false,
                    });
                    expect(prevented).to.equal(false);
                });

                // No refresh: the diagnostics callback count must not grow.
                cy.wait(500);
                cy.get('[data-test="call-count"]')
                    .invoke("text")
                    .should((text) => {
                        expect(Number(text)).to.equal(countAfterInitial);
                    });
            });
    });

    it("does not refresh or prevent default for Ctrl/Cmd+Shift+S (Save As)", () => {
        cy.mount(<Harness />);

        cy.get('[data-test="last-source"]').should(
            "have.text",
            SAMPLE_DOENETML,
        );

        cy.get('[data-test="call-count"]')
            .invoke("text")
            .then((countAfterInitialText) => {
                const countAfterInitial = Number(countAfterInitialText);

                // Edit the buffer so a refresh would be observable if it fired.
                cy.get(".cm-content")
                    .click()
                    .type("{ctrl}{end}", { force: true })
                    .type(" EXTRA", { force: true });

                cy.get(".viewer").then(($viewer) => {
                    const prevented = dispatchKeydown($viewer[0], {
                        code: "KeyS",
                        withModifier: true,
                        withShift: true,
                    });
                    // "Save As" must not be hijacked.
                    expect(prevented).to.equal(false);
                });

                // No refresh: the diagnostics callback count must not grow.
                cy.wait(500);
                cy.get('[data-test="call-count"]')
                    .invoke("text")
                    .should((text) => {
                        expect(Number(text)).to.equal(countAfterInitial);
                    });
            });
    });
});

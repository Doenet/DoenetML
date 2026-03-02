import React, { useRef } from "react";
import { CodeMirror } from "../../../src/CodeMirror";
import type { Diagnostic } from "vscode-languageserver-protocol/browser";

type LspInstance =
    typeof import("../../../src/extensions/lsp/plugin").uniqueLanguageServerInstance;

type LspRef = {
    lsp: LspInstance;
    documentUri: string;
};

type WindowWithLspRef = Window & {
    __getLspRef?: () => LspRef | null;
};

/**
 * Tests for the LSP diagnostics plugin
 *
 * These tests verify that the CodeMirror editor properly receives and displays
 * diagnostics in the DOM. They test the full integration from sending additional
 * diagnostics through the LSP ref, to the server merging them with base diagnostics,
 * to the CodeMirror plugin rendering the merged diagnostics in the editor UI.
 */

/**
 * Test harness component that exposes languageServerRef for test control
 */
const DiagnosticsTestHarness = ({ initialValue }: { initialValue: string }) => {
    const lspRef = useRef<LspRef | null>(null);

    React.useEffect(() => {
        // Expose a live getter for test access.
        // This avoids races where lspRef.current is still null when effect first runs,
        // and avoids stale refs across tests.
        (window as WindowWithLspRef).__getLspRef = () => lspRef.current;

        return () => {
            delete (window as WindowWithLspRef).__getLspRef;
        };
    }, []);

    return (
        <div style={{ height: "400px", width: "600px" }}>
            <CodeMirror value={initialValue} languageServerRef={lspRef} />
        </div>
    );
};

describe("CodeMirror LSP Diagnostics DOM Rendering", () => {
    const mountEditor = (initialValue: string) => {
        cy.mount(<DiagnosticsTestHarness initialValue={initialValue} />);
        cy.get(".cm-line").should("exist");
    };

    /**
     * Helper to wait for the language server ref to be initialized
     */
    const waitForLspRef = (): Cypress.Chainable<LspRef> => {
        return cy.window().then((win) => {
            const startTime = Date.now();
            const attempt = (): Promise<LspRef> => {
                const getter = (win as WindowWithLspRef).__getLspRef;
                const ref = typeof getter === "function" ? getter() : null;
                if (ref && ref.lsp) {
                    return Promise.resolve(ref);
                }
                if (Date.now() - startTime > 5000) {
                    throw new Error("Timeout waiting for LSP ref");
                }
                return new Promise((resolve) =>
                    setTimeout(() => resolve(attempt()), 100),
                );
            };
            return attempt();
        });
    };

    /**
     * Wait until the mounted document has been opened on the LSP side.
     * This avoids racing sendAdditionalDiagnostics before the server tracks the URI.
     */
    const waitForDocumentOpenedOnLsp = (): Cypress.Chainable<LspRef> => {
        return waitForLspRef().then((ref) => {
            const startTime = Date.now();

            const attempt = (): Cypress.Chainable<LspRef> => {
                const version = ref.lsp.versionCounter?.[ref.documentUri];
                if (typeof version === "number" && version >= 1) {
                    return cy.wrap(ref);
                }

                if (Date.now() - startTime > 6000) {
                    throw new Error(
                        `Timeout waiting for LSP to open document ${ref.documentUri}`,
                    );
                }

                return cy.wait(100).then(() => attempt());
            };

            return attempt();
        });
    };

    /**
     * Helper to wait for diagnostic DOM elements to appear
     * CodeMirror renders diagnostics as <span> elements with the class .cm-lintRange
     * and either .cm-lintRange-error or .cm-lintRange-warning depending on severity
     */
    const waitForDiagnosticDom = (
        timeoutMs = 5000,
    ): Cypress.Chainable<JQuery<HTMLElement>> =>
        cy.get(".cm-lintRange", { timeout: timeoutMs }).should("exist");

    const sendAdditionalDiagnostics = (additionalDiagnostics: Diagnostic[]) => {
        return waitForDocumentOpenedOnLsp().then((ref) => {
            expect(ref.documentUri).to.match(/\.doenet$/);
            return ref.lsp.sendAdditionalDiagnostics(
                ref.documentUri,
                additionalDiagnostics,
            );
        });
    };

    /**
     * Simulate a robust hover over a CodeMirror lint range marker
     * by triggering a mouse move event with coordinates,
     * which is more reliable for CodeMirror tooltip handlers than mouseenter.
     */
    const hoverLintRange = (
        selector: string,
    ): Cypress.Chainable<JQuery<HTMLElement>> => {
        return cy
            .get(selector)
            .first()
            .then(($el) => {
                const rect = $el[0].getBoundingClientRect();
                const clientX = rect.left + Math.max(1, rect.width / 2);
                const clientY = rect.top + Math.max(1, rect.height / 2);

                return cy
                    .wrap($el)
                    .trigger("mousemove", {
                        bubbles: true,
                        force: true,
                        clientX,
                        clientY,
                    })
                    .then(() => {
                        return cy.wait(250).then(() => $el);
                    });
            });
    };

    const expectTooltipForLintRange = (
        selector: string,
        tooltipText: string,
    ) => {
        hoverLintRange(selector);
        cy.get(".cm-tooltip").should("contain.text", tooltipText);
    };

    it("displays base diagnostics in the DOM", () => {
        // Use invalid markup to generate a base diagnostic
        mountEditor("<graph invalid-attr='x' /> <math>");

        // Wait for base diagnostic to be rendered in the DOM
        waitForDiagnosticDom();

        cy.get(".cm-lintRange-warning").should("have.text", "invalid-attr='x'");
        cy.get(".cm-lintRange-error").should("have.text", "<math>");

        expectTooltipForLintRange(
            ".cm-lintRange-warning",
            "Element <graph> doesn't have an attribute called invalid-attr",
        );
        expectTooltipForLintRange(
            ".cm-lintRange-error",
            "The tag <math> has no closing tag",
        );
    });

    it("displays additional diagnostics sent via sendAdditionalDiagnostics", () => {
        // Start with valid markup
        mountEditor("<matrix></matrix>");
        cy.get(".cm-line").should("contain.text", "matrix");
        cy.get(".cm-lintRange").should("not.exist");

        sendAdditionalDiagnostics([
            {
                range: {
                    start: { line: 0, character: 0 },
                    end: { line: 0, character: 8 },
                },
                message: "Test error message from external source",
                severity: 1,
            },
        ]);

        // Wait for diagnostic marker to appear in the DOM
        waitForDiagnosticDom();
        cy.get(".cm-lintRange-error").should("contain.text", "<matrix>");

        expectTooltipForLintRange(
            ".cm-lintRange-error",
            "Test error message from external source",
        );
    });

    it("merges additional diagnostics with base diagnostics, showing both in DOM", () => {
        // Use markup with invalid attribute (generates base diagnostic)
        mountEditor("<graph wrong-attr='123' />");

        // Wait for initial base diagnostic to appear
        waitForDiagnosticDom();

        // Verify we have at least one lint range marker (base diagnostic)
        cy.get(".cm-lintRange").should("have.length", 1);
        cy.get(".cm-lintRange-warning").should("have.text", "wrong-attr='123'");

        sendAdditionalDiagnostics([
            {
                range: {
                    start: { line: 0, character: 0 },
                    end: { line: 0, character: 6 },
                },
                message: "External validation error",
                severity: 1,
            },
        ]);

        // Wait for merged diagnostics (both should be in the same publish)
        waitForDiagnosticDom();

        cy.get(".cm-lintRange").should("have.length", 2);

        cy.get(".cm-lintRange-error").should("have.text", "<graph");
        cy.get(".cm-lintRange-warning").should("have.text", "wrong-attr='123'");

        expectTooltipForLintRange(
            ".cm-lintRange-error",
            "External validation error",
        );
        expectTooltipForLintRange(".cm-lintRange-warning", "wrong-attr");
    });

    it("clearing additional diagnostics preserves existing base diagnostics", () => {
        // Start with invalid markup so we have a base warning diagnostic.
        mountEditor("<graph wrong='x' />");

        // Wait for the initial/base diagnostic and verify it is present.
        waitForDiagnosticDom();
        cy.get(".cm-lintRange-warning").should("have.text", "wrong='x'");
        cy.get(".cm-lintRange").should("have.length", 1);

        // Add one external diagnostic.
        sendAdditionalDiagnostics([
            {
                range: {
                    start: { line: 0, character: 0 },
                    end: { line: 0, character: 6 },
                },
                message: "External diagnostic to clear",
                severity: 1,
            },
        ]);

        // Verify merged state: base warning + external error.
        waitForDiagnosticDom();
        cy.get(".cm-lintRange").should("have.length", 2);
        cy.get(".cm-lintRange-warning").should("have.text", "wrong='x'");
        cy.get(".cm-lintRange-error").should("have.text", "<graph");

        expectTooltipForLintRange(
            ".cm-lintRange-error",
            "External diagnostic to clear",
        );

        // Clear only additional diagnostics.
        sendAdditionalDiagnostics([]);

        // Verify base diagnostic remains while external diagnostic is removed.
        cy.get(".cm-lintRange").should("have.length", 1);
        cy.get(".cm-lintRange-warning").should("have.text", "wrong='x'");
        cy.get(".cm-lintRange-error").should("not.exist");

        expectTooltipForLintRange(".cm-lintRange-warning", "wrong");
    });
});

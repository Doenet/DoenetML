import React from "react";
import { DoenetEditor } from "../../../src/doenetml-inline-worker";

const SAMPLE_DOENETML = "<p>hello</p>";

describe("DoenetEditor initialOpenTab", () => {
    it("opens the diagnostics panel on the requested tab when initialOpenTab is set", () => {
        cy.mount(
            <div style={{ height: "500px", width: "900px" }}>
                <DoenetEditor
                    doenetML={SAMPLE_DOENETML}
                    initialOpenTab="accessibility"
                    addVirtualKeyboard={false}
                />
            </div>,
        );

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

    it("opens on errors when initialOpenTab='errors'", () => {
        cy.mount(
            <div style={{ height: "500px", width: "900px" }}>
                <DoenetEditor
                    doenetML={SAMPLE_DOENETML}
                    initialOpenTab="errors"
                    addVirtualKeyboard={false}
                />
            </div>,
        );

        cy.get(".diagnostics-response-tabs-container").should(
            "have.class",
            "is-open",
        );
        cy.get('[id="errors"][role="tab"]').should(
            "have.attr",
            "aria-selected",
            "true",
        );
    });

    it("falls back to default and warns when initialOpenTab refers to a disabled tab", () => {
        const warnSpy = cy.stub().as("consoleWarn");
        cy.window().then((win) => {
            cy.stub(win.console, "warn").callsFake(warnSpy);
        });

        cy.mount(
            <div style={{ height: "500px", width: "900px" }}>
                <DoenetEditor
                    doenetML={SAMPLE_DOENETML}
                    initialOpenTab="accessibility"
                    showDiagnostics={false}
                    addVirtualKeyboard={false}
                />
            </div>,
        );

        // With showHelp defaulting to true, the fallback default tab is
        // "help" — the panel opens there and the warning still fires.
        cy.get(".diagnostics-response-tabs-container").should(
            "have.class",
            "is-open",
        );
        cy.get('[id="help"][role="tab"]').should(
            "have.attr",
            "aria-selected",
            "true",
        );
        cy.get("@consoleWarn").should("have.been.called");
    });

    it("falls back to default and warns when initialOpenTab='responses' but showResponses={false}", () => {
        const warnSpy = cy.stub().as("consoleWarn");
        cy.window().then((win) => {
            cy.stub(win.console, "warn").callsFake(warnSpy);
        });

        cy.mount(
            <div style={{ height: "500px", width: "900px" }}>
                <DoenetEditor
                    doenetML={SAMPLE_DOENETML}
                    initialOpenTab="responses"
                    showResponses={false}
                    addVirtualKeyboard={false}
                />
            </div>,
        );

        // Fallback default tab is "help" (showHelp defaults to true).
        cy.get(".diagnostics-response-tabs-container").should(
            "have.class",
            "is-open",
        );
        cy.get('[id="help"][role="tab"]').should(
            "have.attr",
            "aria-selected",
            "true",
        );
        cy.get("@consoleWarn").should("have.been.called");
    });

    it("opens on errors when showHelp={false} and initialOpenTab is omitted", () => {
        cy.mount(
            <div style={{ height: "500px", width: "900px" }}>
                <DoenetEditor
                    doenetML={SAMPLE_DOENETML}
                    showHelp={false}
                    addVirtualKeyboard={false}
                />
            </div>,
        );

        // Fallback chain when help is disabled: errors (first remaining tab).
        cy.get(".diagnostics-response-tabs-container").should(
            "have.class",
            "is-open",
        );
        cy.get('[id="errors"][role="tab"]').should(
            "have.attr",
            "aria-selected",
            "true",
        );
    });

    it("does not render the help tab when showHelp={false}", () => {
        cy.mount(
            <div style={{ height: "500px", width: "900px" }}>
                <DoenetEditor
                    doenetML={SAMPLE_DOENETML}
                    showHelp={false}
                    addVirtualKeyboard={false}
                />
            </div>,
        );

        cy.get('[data-test="footer-tab-help"]').should("not.exist");
    });

    it("falls back to default and warns when initialOpenTab='help' but showHelp={false}", () => {
        const warnSpy = cy.stub().as("consoleWarn");
        cy.window().then((win) => {
            cy.stub(win.console, "warn").callsFake(warnSpy);
        });

        cy.mount(
            <div style={{ height: "500px", width: "900px" }}>
                <DoenetEditor
                    doenetML={SAMPLE_DOENETML}
                    initialOpenTab="help"
                    showHelp={false}
                    addVirtualKeyboard={false}
                />
            </div>,
        );

        // Fallback chain when help is disabled: errors (first remaining tab).
        cy.get(".diagnostics-response-tabs-container").should(
            "have.class",
            "is-open",
        );
        cy.get('[id="errors"][role="tab"]').should(
            "have.attr",
            "aria-selected",
            "true",
        );
        cy.get("@consoleWarn").should("have.been.called");
    });

    it("stays closed at mount when initialOpenTab={null}", () => {
        cy.mount(
            <div style={{ height: "500px", width: "900px" }}>
                <DoenetEditor
                    doenetML={SAMPLE_DOENETML}
                    initialOpenTab={null}
                    addVirtualKeyboard={false}
                />
            </div>,
        );

        cy.get(".diagnostics-response-tabs-container").should(
            "not.have.class",
            "is-open",
        );
    });
});

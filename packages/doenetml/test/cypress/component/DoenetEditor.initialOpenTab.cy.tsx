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

        // panel should NOT auto-open (no diagnostics tabs available, falls back)
        cy.get(".diagnostics-response-tabs-container").should(
            "not.have.class",
            "is-open",
        );
        cy.get("@consoleWarn").should("have.been.called");
    });
});

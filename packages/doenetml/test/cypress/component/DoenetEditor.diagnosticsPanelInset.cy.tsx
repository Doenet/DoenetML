import React from "react";
import { DoenetEditor } from "../../../src/doenetml-inline-worker";

const SAMPLE_DOENETML = "<p>hello</p>";

/**
 * The scrolling element of the diagnostics/help panel
 * (`.diagnostics-response-tabs-panels`) must span the full width of its
 * container so that its scrollbar sits flush against the editor's trailing
 * edge. The inline inset of the panel text comes from `.diagnostic-panel`
 * inside the scrolling element instead of from the container around it.
 */
describe("DoenetEditor diagnostics panel inset", () => {
    beforeEach(() => {
        cy.mount(
            <div style={{ height: "500px", width: "900px" }}>
                <DoenetEditor
                    doenetML={SAMPLE_DOENETML}
                    initialOpenTab="help"
                    addVirtualKeyboard={false}
                />
            </div>,
        );

        cy.get(".diagnostics-response-tabs-container").should(
            "have.class",
            "is-open",
        );
    });

    it("scrolling element spans its container edge to edge", () => {
        cy.get(".diagnostics-response-tabs-container").then(($container) => {
            const container = $container[0].getBoundingClientRect();

            cy.get(".diagnostics-response-tabs-panels").then(($panels) => {
                const panels = $panels[0].getBoundingClientRect();

                expect(panels.left).to.be.closeTo(container.left, 0.5);
                expect(panels.right).to.be.closeTo(container.right, 0.5);
            });
        });
    });

    it("insets the panel text without insetting the scrolling element", () => {
        cy.get(".diagnostics-response-tabs-panels").then(($panels) => {
            const style = window.getComputedStyle($panels[0]);

            // Inline padding here would push the scrollbar off the edge.
            expect(parseFloat(style.paddingLeft)).to.equal(0);
            expect(parseFloat(style.paddingRight)).to.equal(0);
        });

        cy.get(".diagnostic-panel:visible").then(($panel) => {
            const style = window.getComputedStyle($panel[0]);

            // The inset the container padding used to provide now lives here.
            expect(parseFloat(style.paddingLeft)).to.be.greaterThan(0);
            expect(parseFloat(style.paddingRight)).to.be.greaterThan(0);
        });
    });
});

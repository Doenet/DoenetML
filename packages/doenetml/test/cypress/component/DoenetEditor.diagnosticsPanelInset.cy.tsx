import React from "react";
import { DoenetEditor } from "../../../src/doenetml-inline-worker";

const SAMPLE_DOENETML = "<p>hello</p>";

function Harness() {
    return (
        <div style={{ height: "500px", width: "900px" }}>
            <DoenetEditor
                doenetML={SAMPLE_DOENETML}
                addVirtualKeyboard={false}
                initialOpenTab="accessibility"
            />
        </div>
    );
}

/**
 * The scrolling element of the diagnostics/help panel must span the full width
 * of its container so that its scrollbar sits flush against the editor's
 * trailing edge; the inline inset of the panel text comes from the panels
 * themselves.
 */
describe("Diagnostics panel inset", () => {
    it("scrolling element spans the container while the panel text is inset", () => {
        cy.mount(<Harness />);

        cy.get(".diagnostics-response-tabs-container").should(
            "have.class",
            "is-open",
        );

        cy.get(".diagnostics-response-tabs-container").then(($container) => {
            const container = $container[0].getBoundingClientRect();

            cy.get(".diagnostics-response-tabs-panels").then(($panels) => {
                const panels = $panels[0].getBoundingClientRect();

                // No inline padding on the non-scrolling wrapper.
                expect(panels.left).to.be.closeTo(container.left, 0.5);
                expect(panels.right).to.be.closeTo(container.right, 0.5);
            });

            cy.get(".diagnostic-panel:visible").then(($panel) => {
                const panel = $panel[0];
                const style = window.getComputedStyle(panel);

                // The panel content still carries the inline inset.
                expect(parseFloat(style.paddingLeft)).to.be.greaterThan(0);
                expect(parseFloat(style.paddingRight)).to.be.greaterThan(0);
            });
        });
    });
});

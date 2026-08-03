/**
 * Regression coverage for graph visual hierarchy styling.
 *
 * These tests verify that graph elements are assigned the intended design
 * tokens in both light and dark themes:
 *
 *   - Grid lines use --graphGrid (lowest visual emphasis)
 *   - Axes and tick labels use --graphAxes (medium emphasis)
 *   - Navigation controls use --canvasText (highest emphasis)
 *
 * The primary goal is to ensure that JSXGraph-generated DOM elements receive
 * the correct CSS-variable-based styling and that future selector changes do
 * not silently break the hierarchy. In particular, this protects against
 * regressions where tick labels fail to receive the graphAxes styling
 * (for example, due to selectors no longer matching the generated tick-label
 * elements).
 *
 * The tests intentionally verify token usage rather than specific color values
 * so that theme palettes may evolve without requiring test updates, while still
 * enforcing the intended visual hierarchy:
 *
 *   graphGrid -> graphAxes -> canvasText
 *
 * Coverage is exercised in both light and dark mode because the hierarchy is
 * theme-dependent and all graph affordances must remain visually distinct in
 * each theme.
 */
describe("Graph visual hierarchy", { tags: ["@group5"] }, () => {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    function postGraph({ darkMode = false } = {}) {
        cy.window().then((win) => {
            win.postMessage(
                {
                    doenetML: `
<graph name="g" grid="medium">
    <point>(1,2)</point>
</graph>
`,
                    ...(darkMode ? { darkMode: "dark" } : {}),
                },
                "*",
            );
        });
    }

    function expectedHierarchyApplied() {
        cy.get(".jxgbox").should("exist");

        // Axes use graphAxes
        cy.get('.jxgbox line[stroke="var(--graphAxes)"]').should(
            "have.length.at.least",
            1,
        );

        // Tick labels use graphAxes
        cy.get('.jxgbox text[fill="var(--graphAxes)"]').should(
            "have.length.at.least",
            5,
        );

        // Grid uses graphGrid
        cy.get('.jxgbox path[stroke="var(--graphGrid)"]').should(
            "have.length.at.least",
            1,
        );
    }

    function expectNavigationUsesCanvasText() {
        cy.get(".JXG_navigation").should("exist");

        cy.get(".JXG_navigation_button").each(($button) => {
            expect($button.attr("style")).to.contain(
                "color: var(--canvasText)",
            );
        });
    }

    it("applies graph hierarchy styling in light mode", () => {
        postGraph();

        expectedHierarchyApplied();
        expectNavigationUsesCanvasText();
    });

    it("applies graph hierarchy styling in dark mode", () => {
        postGraph({ darkMode: true });

        cy.get('[data-theme="dark"]').should("exist");

        expectedHierarchyApplied();
        expectNavigationUsesCanvasText();
    });
});

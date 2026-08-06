/**
 * Shared assertion for axe's `color-contrast` rule.
 *
 * Contrast specs differ only in what they scan: the viewer, the editor panel,
 * or a portaled panel that neither contains. The rule set, the impact filter,
 * and the failure message (which lists the offending elements' HTML so a
 * failure names the element rather than just a count) are the same everywhere,
 * so they live here.
 *
 * @param {string|string[]} selectors Root(s) to scan.
 */
export function expectNoColorContrastViolations(selectors) {
    cy.checkA11y(
        Array.isArray(selectors) ? selectors : [selectors],
        {
            runOnly: { type: "rule", values: ["color-contrast"] },
            includedImpacts: ["critical", "serious", "moderate", "minor"],
        },
        (violations) => {
            expect(
                violations,
                JSON.stringify(
                    violations.map((v) => ({
                        id: v.id,
                        nodes: v.nodes.map((n) => n.html),
                    })),
                    null,
                    2,
                ),
            ).to.have.length(0);
        },
        true,
    );
}

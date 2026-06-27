/**
 * Accessibility checks for the DoenetML documentation site.
 *
 * Each test visits a representative page, optionally switches to dark mode,
 * and runs axe's colour-contrast (and broader WCAG) rules against the page
 * content.  The suite covers both light and dark mode because the reported
 * issue (#1368) was specifically a dark-mode contrast failure on attribute
 * reference pages.
 *
 * Running these tests requires the built docs site to be served at the
 * baseUrl configured in cypress.config.js (default http://localhost:3000).
 * The recommended workflow is `npm run build:docs` followed by
 * `npm exec serve -- --no-port-switching -l 3000 packages/docs-nextra/out/`.
 */

/**
 * Enable Nextra's dark mode by injecting the class that the theme reads.
 * Nextra stores the preference in localStorage and adds `class="dark"` to
 * `<html>`.  Setting localStorage before page load is the most reliable way
 * to get the initial render in dark mode.
 */
function enableDarkMode() {
    cy.window().then((win) => {
        win.localStorage.setItem("theme", "dark");
    });
    cy.reload();
    cy.get("html.dark").should("exist");
}

/**
 * Run the full set of axe rules (all WCAG 2.x levels) against the main page
 * content and report any violations with helpful context.
 */
function checkPageAccessibility() {
    cy.injectAxe();
    cy.checkA11y(
        "main",
        {
            runOnly: {
                type: "tag",
                values: ["wcag2a", "wcag2aa", "wcag21aa", "best-practice"],
            },
            // Skip rules that are legitimately inapplicable to docs pages or
            // are already handled at the Nextra-theme level.
            rules: {
                // The docs iframe embeds (DoenetML live examples) are sandboxed
                // — their internals are tested by the main test-cypress suite.
                "frame-title": { enabled: false },
            },
        },
        (violations) => {
            const summary = violations.map((v) => ({
                id: v.id,
                impact: v.impact,
                description: v.description,
                nodes: v.nodes.map((n) => n.html),
            }));
            expect(
                violations,
                `axe violations:\n${JSON.stringify(summary, null, 2)}`,
            ).to.have.length(0);
        },
        // false → fail the test (not just log a warning) on violations
        false,
    );
}

// ---------------------------------------------------------------------------
// Light-mode suite
// ---------------------------------------------------------------------------

describe("Documentation accessibility — light mode", () => {
    beforeEach(() => {
        // Ensure light mode is active.
        cy.clearCookies();
        cy.clearLocalStorage();
    });

    it("home page passes axe in light mode", () => {
        cy.visit("/");
        cy.get("main").should("exist");
        checkPageAccessibility();
    });

    it("quick-start tutorial passes axe in light mode", () => {
        cy.visit("/tutorials/quickStart");
        cy.get("main").should("exist");
        checkPageAccessibility();
    });

    it("reference page with attribute/prop table (document) passes axe in light mode", () => {
        cy.visit("/reference/document");
        // Wait for the AttrPropDisplay component to finish rendering.
        cy.get(".attr-list, .attr-name-box").should("exist");
        checkPageAccessibility();
    });

    it("concepts/essentialConcepts passes axe in light mode", () => {
        cy.visit("/concepts/essentialConcepts");
        cy.get("main").should("exist");
        checkPageAccessibility();
    });
});

// ---------------------------------------------------------------------------
// Dark-mode suite  (this is where issue #1368 was reported)
// ---------------------------------------------------------------------------

describe("Documentation accessibility — dark mode", () => {
    beforeEach(() => {
        cy.clearCookies();
        cy.clearLocalStorage();
    });

    it("home page passes axe in dark mode", () => {
        cy.visit("/");
        enableDarkMode();
        cy.get("main").should("exist");
        checkPageAccessibility();
    });

    it("quick-start tutorial passes axe in dark mode", () => {
        cy.visit("/tutorials/quickStart");
        enableDarkMode();
        cy.get("main").should("exist");
        checkPageAccessibility();
    });

    /**
     * This is the specific page and mode reported in issue #1368.
     * The attribute name pills (.attr-name-box / .attr-name) previously
     * rendered blue text (rgb(0,122,255)) on a gray-700 background
     * (rgb(55,65,81)), giving only ~2.6:1 contrast — well below the
     * WCAG AA threshold of 4.5:1.
     */
    it("reference page attribute pills pass colour-contrast in dark mode (issue #1368)", () => {
        cy.visit("/reference/document");
        enableDarkMode();
        cy.get(".attr-name-box").should("exist");
        cy.injectAxe();
        cy.checkA11y(
            "main",
            {
                runOnly: { type: "rule", values: ["color-contrast"] },
                includedImpacts: ["critical", "serious", "moderate", "minor"],
            },
            (violations) => {
                const summary = violations.map((v) => ({
                    id: v.id,
                    nodes: v.nodes.map((n) => n.html),
                }));
                expect(
                    violations,
                    `colour-contrast violations:\n${JSON.stringify(summary, null, 2)}`,
                ).to.have.length(0);
            },
            false,
        );
    });

    it("reference page with attribute/prop table (document) passes full axe in dark mode", () => {
        cy.visit("/reference/document");
        enableDarkMode();
        cy.get(".attr-list, .attr-name-box").should("exist");
        checkPageAccessibility();
    });

    it("concepts/essentialConcepts passes axe in dark mode", () => {
        cy.visit("/concepts/essentialConcepts");
        enableDarkMode();
        cy.get("main").should("exist");
        checkPageAccessibility();
    });
});

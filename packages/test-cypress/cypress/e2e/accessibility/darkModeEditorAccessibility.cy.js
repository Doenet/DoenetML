/**
 * Dark-mode accessibility coverage for the editor authoring UI.
 *
 * Each case opens the DoenetML editor, switches the harness into dark mode,
 * and runs axe's `color-contrast` rule against representative editor surfaces.
 * This complements `darkModeRendererAccessibility.cy.js`, which covers the
 * viewer pane.
 *
 * Surfaces exercised:
 *  - CodeMirror code area (syntax highlighting, gutters, active line)
 *  - Diagnostics / responses / help panel (footer tabs, diagnostic entries,
 *    accessibility report card, help-panel shell)
 *  - Viewer controls bar (Update button, accessibility status chip, variant popover)
 */
describe("Dark-mode editor accessibility checks", { tags: ["@group5"] }, () => {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
        cy.injectAxe();
        // Open the editor pane in the test harness.
        cy.get("#testRunner_toggleControls").click();
        cy.get("#testRunner_showEditor").click();
        cy.get("#testRunner_toggleControls").click();
    });

    /**
     * Load `doenetML` in the editor, switch to dark mode, wait for the
     * theme attribute and optionally for `settleSelector` to appear.
     */
    function loadEditorInDarkMode(doenetML, settleSelector) {
        cy.window().then((win) => {
            win.postMessage({ doenetML, darkMode: "dark" }, "*");
        });
        cy.get('[data-theme="dark"]').should("exist");
        if (settleSelector) {
            cy.get(settleSelector).should("exist");
        }
        // Allow MathJax / JSXGraph to settle.
        cy.wait(200);
    }

    /**
     * Assert no color-contrast axe violations inside `selectors`.
     * Defaults to the editor panel; pass viewer-control selectors when a test
     * opens UI that is portaled outside the panel itself.
     */
    function expectNoColorContrastViolations(selectors = ".editor-panel") {
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

    it("dark mode: CodeMirror editor area (editable)", () => {
        loadEditorInDarkMode(`<p name="p">Hello <em>world</em>.</p>`, "#p");
        // The editor content area (.cm-editor) must be visible.
        cy.get(".cm-editor").should("exist");
        expectNoColorContrastViolations(".editor-panel");
    });

    it("dark mode: CodeMirror editor area (read-only)", () => {
        // Switch to read-only mode by toggling the control.
        cy.get("#testRunner_toggleControls").click();
        cy.get("#testRunner_readOnly").click();
        cy.get("#testRunner_toggleControls").click();

        loadEditorInDarkMode(`<p name="p">Read-only content.</p>`, "#p");
        cy.get(".cm-editor").should("exist");
        expectNoColorContrastViolations(".editor-panel");
    });

    it("dark mode: diagnostics panel with warnings and errors", () => {
        // Load markup that triggers both a warning and an error diagnostic.
        loadEditorInDarkMode(
            `<p name="p">Valid paragraph.</p>
<unknownTag name="bad">This tag does not exist.</unknownTag>`,
            "#p",
        );
        // Open the diagnostics/errors tab if not already open.
        cy.get('[data-test="footer-tab-errors"]').click();
        cy.get(".diagnostic-list").should("exist");
        expectNoColorContrastViolations(".editor-panel");
    });

    it("dark mode: context-help panel (element help)", () => {
        loadEditorInDarkMode(`<p name="p">Some text.</p>`, "#p");
        // The help tab opens by default; wait for it to render.
        cy.get(".help-panel").should("exist");
        expectNoColorContrastViolations(".editor-panel");
    });

    it("dark mode: accessibility report in viewer controls", () => {
        // Load markup that generates an accessibility diagnostic so the
        // accessibility status button and report chip appear.
        loadEditorInDarkMode(
            `<graph name="g"><point>(1,2)</point></graph>`,
            "#g",
        );
        cy.get(".accessibility-status-button").click();
        cy.get(".accessibility-report").should("exist");
        expectNoColorContrastViolations([
            ".viewer-panel .viewer-controls",
            ".accessibility-report",
        ]);
    });

    it("dark mode: viewer controls bar (Update button, variant select)", () => {
        loadEditorInDarkMode(
            `<selectFromSequence name="s" from="1" to="3" />`,
            "#s",
        );
        cy.get(".variant-select").should("exist");
        cy.get(".select-button").click();
        cy.get(".popover").should("exist");
        expectNoColorContrastViolations([
            ".viewer-panel .viewer-controls",
            ".popover",
        ]);
    });

    it("dark mode: footer tab bar (diagnostics summary counts)", () => {
        loadEditorInDarkMode(
            `<p name="p">Text with <c>inline code</c>.</p>`,
            "#p",
        );
        // Footer tab bar lives inside .editor-panel.
        cy.get(".editor-footer").should("exist");
        expectNoColorContrastViolations(".editor-footer");
    });
});

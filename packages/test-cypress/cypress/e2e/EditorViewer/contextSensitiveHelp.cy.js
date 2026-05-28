// End-to-end smoke tests for the context-sensitive help panel.
//
// Unit tests in packages/doenetml/src/EditorViewer/contextHelp/
// computeContextHelp.test.ts cover the cursor-position branching exhaustively.
// These tests exercise the rest of the pipeline: schema bundling, the
// `onCursorChange` debounce in EditorViewer, the Help tab rendering in
// DiagnosticsResponseTabs, and the docsURL prop default.

describe("Context-sensitive help panel", { tags: ["@group5"] }, function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
        cy.get("#testRunner_toggleControls").click();
        cy.get("#testRunner_showEditor").click();
        cy.wait(100);
        cy.get("#testRunner_toggleControls").click();
    });

    /**
     * Place the cursor at `offset` characters into the source by dispatching
     * a selection update directly to the CodeMirror EditorView. Avoids the
     * per-character keyboard walk that scales poorly and makes offsets
     * sensitive to autocomplete popups, line wrapping, etc.
     *
     * The editor must already have rendered the source (assert on `.cm-content`
     * before calling).
     */
    function moveCursorToOffset(offset) {
        cy.get(".cm-content").then(($content) => {
            // CodeMirror 6 attaches its DocView to the contentDOM via the
            // `cmView` property. Walking `rootView.view` gets us back to the
            // public EditorView — this mirrors `EditorView.findFromDOM`.
            const view = $content[0].cmView?.rootView?.view;
            if (!view) {
                throw new Error(
                    "Could not locate CodeMirror EditorView from .cm-content",
                );
            }
            view.focus();
            view.dispatch({ selection: { anchor: offset } });
        });
    }

    function openHelpTab() {
        // The footer redesign mounts the panel open on the help tab by
        // default and made tabs self-toggling — clicking the active tab now
        // closes the panel. Only click when help isn't already selected with
        // the panel open, otherwise this helper would close it.
        cy.get("body").then(($body) => {
            const helpSelected =
                $body
                    .find('[title="Context-sensitive help"]')
                    .attr("aria-selected") === "true";
            const panelOpen =
                $body.find(".diagnostics-response-tabs-container.is-open")
                    .length > 0;
            if (!(helpSelected && panelOpen)) {
                cy.get('[title="Context-sensitive help"]').click();
            }
        });
    }

    it("shows component help with reference link for cursor on tag name", () => {
        const doenetML = `<math>x</math>`;
        cy.window().then((win) => {
            win.postMessage({ doenetML }, "*");
        });
        // Wait for the editor (not the viewer) to receive the source.
        // The viewer renders math text via Unicode italics so plain "x"
        // would not appear there.
        cy.get(".cm-content", { timeout: 10000 }).should(
            "contain.text",
            "math",
        );

        openHelpTab();
        // Position cursor mid-tag-name (between 'a' and 't' of "math").
        moveCursorToOffset(3);

        cy.get(".help-panel", { timeout: 5000 }).within(() => {
            cy.get(".help-element-name").should("contain.text", "math");
            // Element summary now rides on the title line after the linked
            // name (em-dash separated), not in a separate description row.
            cy.get(".help-element-title")
                .invoke("text")
                .should("match", /<math>\s+\S/);
            cy.get(".help-docs-link")
                .should("have.attr", "href")
                .and("include", "/reference/math");
        });
    });

    it("shows attribute help with description and default value", () => {
        const doenetML = `<point draggable="true"/>`;
        cy.window().then((win) => {
            win.postMessage({ doenetML }, "*");
        });
        cy.get(".cm-content", { timeout: 10000 }).should(
            "contain.text",
            "draggable",
        );

        openHelpTab();
        // Cursor inside the "draggable" attribute name (offset 10 = mid-word).
        moveCursorToOffset(10);

        cy.get(".help-panel", { timeout: 5000 }).within(() => {
            cy.get(".help-attribute-name").should("contain.text", "draggable");
            cy.get(".help-description").should("not.be.empty");
            // Default + chip value for boolean default `true`.
            cy.contains(".help-detail-label", "Default:").should("exist");
            cy.get(".help-value-item").should("contain.text", "true");
            // Reference link points back to the owning component's docs page.
            cy.get(".help-docs-link")
                .should("have.attr", "href")
                .and("include", "/reference/point");
        });
    });

    it("redirects <row> inside <matrix> to matrixRow help via childAliases", () => {
        const doenetML = `<matrix>\n<row>1 2 3</row>\n</matrix>`;
        cy.window().then((win) => {
            win.postMessage({ doenetML }, "*");
        });
        cy.get(".cm-content", { timeout: 10000 }).should(
            "contain.text",
            "matrix",
        );

        openHelpTab();
        // Cursor inside the opening tag of the inner <row> (offset 11 = mid
        // tag-name of "row" within "<row>1 2 3</row>" at line 2, column 2).
        // Source: `<matrix>\n<row>1 2 3</row>\n</matrix>`
        // Offsets: <matrix> = 0..7, \n = 8, <row> = 9..13. Offset 11 = 'o'.
        moveCursorToOffset(11);

        cy.get(".help-panel", { timeout: 5000 }).within(() => {
            // Display name stays as the user-authored "row".
            cy.get(".help-element-name").should("contain.text", "row");
            // Summary should mention matrix (matrixRow's docs string) — now
            // on the title line after the linked name.
            cy.get(".help-element-title")
                .invoke("text")
                .should("match", /matrix/i);
            // Link points to row_matrix, NOT to row (which would 404) or
            // row_table (the tabular row docs).
            cy.get(".help-docs-link")
                .should("have.attr", "href")
                .and("include", "/reference/row_matrix");
        });
    });

    it("uses tabular row docs when <row> is NOT inside <matrix>", () => {
        const doenetML = `<tabular>\n<row>cell</row>\n</tabular>`;
        cy.window().then((win) => {
            win.postMessage({ doenetML }, "*");
        });
        cy.get(".cm-content", { timeout: 10000 }).should(
            "contain.text",
            "tabular",
        );

        openHelpTab();
        // Cursor inside the opening tag of <row>.
        // Source: `<tabular>\n<row>cell</row>\n</tabular>`
        // <tabular> = 0..8, \n = 9, <row> = 10..14. Offset 12 = 'o' of "row".
        moveCursorToOffset(12);

        cy.get(".help-panel", { timeout: 5000 }).within(() => {
            cy.get(".help-docs-link")
                .should("have.attr", "href")
                .and("include", "/reference/row_table");
        });
    });

    it("shows refName sentence and references link for cursor on a bare $name", () => {
        const doenetML = `<math name="m">x</math>\n$m`;
        cy.window().then((win) => {
            win.postMessage({ doenetML }, "*");
        });
        cy.get(".cm-content", { timeout: 10000 }).should("contain.text", "$m");

        openHelpTab();
        // Cursor at the very end (after the 'm' of `$m`).
        moveCursorToOffset(doenetML.length);

        cy.get(".help-panel", { timeout: 5000 }).within(() => {
            cy.get(".help-ref-sentence")
                .invoke("text")
                .should(
                    "match",
                    /\$m\s+is a reference to\s+<math>\s+\(line 1\)/,
                );
            // Reference help links to the references concept page, not the
            // referenced component's reference page.
            cy.get(".help-docs-link")
                .should("contain.text", "references")
                .and("have.attr", "href")
                .and("include", "/document_structure/references");
        });
    });

    it("shows refName help with full chain for $sec.bi resolving to a named child", () => {
        // The bi inside section is a named descendant; runtime ref-resolution
        // picks it over any same-named property, so the help panel surfaces
        // the booleanInput descendant rather than a section property.
        const doenetML = `<section name="sec"><booleanInput name="bi"/></section>\n$sec.bi`;
        cy.window().then((win) => {
            win.postMessage({ doenetML }, "*");
        });
        cy.get(".cm-content", { timeout: 10000 }).should(
            "contain.text",
            "$sec.bi",
        );

        openHelpTab();
        // Cursor at the very end (after the 'i' of `bi`).
        moveCursorToOffset(doenetML.length);

        cy.get(".help-panel", { timeout: 5000 }).within(() => {
            cy.get(".help-ref-sentence")
                .invoke("text")
                .should(
                    "match",
                    /\$sec\.bi\s+is a reference to\s+<booleanInput>\s+\(line 1\)/,
                );
            cy.get(".help-docs-link")
                .should("have.attr", "href")
                .and("include", "/document_structure/references");
        });
    });

    it("suggests components to try when the cursor is in an element body", () => {
        const doenetML = `<section>\n\n</section>`;
        cy.window().then((win) => {
            win.postMessage({ doenetML }, "*");
        });
        cy.get(".cm-content", { timeout: 10000 }).should(
            "contain.text",
            "section",
        );

        openHelpTab();
        // Cursor on the blank line inside the <section> body.
        moveCursorToOffset(doenetML.indexOf("\n\n") + 1);

        cy.get(".help-panel", { timeout: 5000 }).within(() => {
            cy.get(".help-suggestions-header").should(
                "contain.text",
                "section",
            );
            cy.get(".help-suggestion-item").should(
                "have.length.greaterThan",
                0,
            );
            cy.get(".help-suggestions-footer").should(
                "contain.text",
                "Ctrl+Space",
            );
        });
    });
});

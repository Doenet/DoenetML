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
     * Place the cursor at `offset` characters into the source. Assumes the
     * editor is currently empty/the source has been seeded via postMessage,
     * and the offset is 0-indexed from the start of the document.
     */
    function moveCursorToOffset(offset) {
        cy.get(".cm-content").click();
        // CodeMirror's "go to document start" binding differs by platform:
        // Cmd-Up on Mac, Ctrl-Home elsewhere.
        if (Cypress.platform === "darwin") {
            cy.get(".cm-activeLine").type("{cmd+upArrow}");
        } else {
            cy.get(".cm-activeLine").type("{ctrl+home}");
        }
        if (offset > 0) {
            cy.get(".cm-activeLine").type("{rightArrow}".repeat(offset));
        }
    }

    function openHelpTab() {
        // Clicking the Help tab also opens the (collapsed) info panel,
        // since TabList's onClick calls setIsOpen(true).
        cy.get('[title="Context-sensitive help"]').click();
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
            cy.get(".help-description").should("not.be.empty");
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
            // Summary should mention matrix (matrixRow's docs string).
            cy.get(".help-description")
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

    it("omits the reference link for an allow-listed undocumented component", () => {
        // <codeEditor> is on the undocumented allow-list, so its schema
        // docsSlug is clamped to null and the help panel must not render
        // a "Reference page" link (which would otherwise 404).
        const doenetML = `<codeEditor/>`;
        cy.window().then((win) => {
            win.postMessage({ doenetML }, "*");
        });
        cy.get(".cm-content", { timeout: 10000 }).should(
            "contain.text",
            "codeEditor",
        );

        openHelpTab();
        // Cursor mid-tag-name of "codeEditor" (offset 5 = between 'd' and 'E').
        moveCursorToOffset(5);

        cy.get(".help-panel", { timeout: 5000 }).within(() => {
            cy.get(".help-element-name").should("contain.text", "codeEditor");
            cy.get(".help-docs-link").should("not.exist");
        });
    });
});

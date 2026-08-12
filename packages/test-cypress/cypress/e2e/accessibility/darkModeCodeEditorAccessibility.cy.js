import { expectNoColorContrastViolations } from "../../support/colorContrast";

/**
 * Accessibility coverage for the `<codeEditor>` renderer — the editor embedded
 * *inside a document*, as opposed to the authoring editor covered by
 * `darkModeEditorAccessibility.cy.js`.
 *
 * The two reach the same `EditorViewer`/CodeMirror component by different
 * routes, so a theme that is correct for the authoring editor is not evidence
 * that the embedded one is: `<codeEditor>` has to pick the resolved theme up
 * from `DocContext` itself. A regression there leaves light-mode syntax colors
 * painted on the dark canvas, which is exactly what axe's `color-contrast`
 * rule catches.
 *
 * Most cases load a document containing a `<codeEditor>` whose contents
 * exercise a particular corner of the highlight palette (see
 * `packages/codemirror/src/extensions/syntax-highlighting.ts`) and scan the
 * embedded editor in dark mode. The rest cover what those cases leave out:
 * read-only mode (a palette of its own), the editor's chrome, one repeat in
 * light mode so a fix cannot trade one theme's contrast for the other's, and
 * a direct check that the dark canvas is painted at all.
 */
describe("codeEditor dark-mode accessibility", { tags: ["@group5"] }, () => {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
        cy.injectAxe();
    });

    /**
     * Load a document whose only content is a `<codeEditor>` holding
     * `content`, under `theme`, then wait for the theme attribute and for the
     * embedded CodeMirror to render.
     *
     * @param {string} content Markup to place inside the `<codeEditor>`.
     * @param {"dark"|"light"} theme Theme to render the document in.
     * @param {string} [extraAttributes] Extra attributes for the `<codeEditor>`.
     */
    function loadCodeEditor(content, theme, extraAttributes = "") {
        const doenetML = `<codeEditor showResults ${extraAttributes}>\n${content}\n</codeEditor>`;
        cy.window().then((win) => {
            win.postMessage({ doenetML, darkMode: theme }, "*");
        });
        cy.get(`[data-theme="${theme}"]`).should("exist");
        cy.get(".doenet-viewer .cm-editor").should("exist");
        // Let CodeMirror finish its first highlight pass.
        cy.wait(200);
    }

    // Exercises the whole palette at once; reused for the light-mode case.
    const mixedMarkup = `<!-- everything at once -->
<graph name="g" size="small">
  <point name="P">(3, 4)</point>
</graph>
<p>P is at $P.coords &amp; nothing else.</p>`;

    /**
     * Each case names a slice of the syntax-highlight palette and the
     * markup that provokes it. The `content` string is what goes *inside*
     * the `<codeEditor>`, i.e. the text CodeMirror highlights.
     */
    const syntaxCases = [
        {
            name: "plain text content",
            // The reported case: bare text, styled with the `content` tag.
            content: `Nice. This is invisible.`,
        },
        {
            name: "tag names and angle brackets",
            content: `<p>Hello</p>
<math />`,
        },
        {
            name: "attribute names, the `=` operator, and attribute values",
            content: `<point name="P" labelIsName styleNumber="2" />`,
        },
        {
            name: "macros",
            content: `<p>The point is at $P.x, and $$f(3) too.</p>`,
        },
        {
            name: "comments",
            content: `<!-- a block comment explaining the markup -->
<p>after the comment</p>`,
        },
        {
            name: "invalid markup (mismatched close tag)",
            content: `<p>mismatched</div>`,
        },
        {
            name: "character and entity references",
            content: `<p>less than &lt; and &#60; too</p>`,
        },
        {
            name: "mixed markup exercising the whole palette",
            content: mixedMarkup,
        },
    ];

    for (const { name, content } of syntaxCases) {
        it(`dark mode: ${name}`, () => {
            loadCodeEditor(content, "dark");
            expectNoColorContrastViolations(".doenet-viewer .editor-panel");
        });
    }

    it("light mode: mixed markup exercising the whole palette", () => {
        // Guards against a fix that trades one theme's contrast for the
        // other's.
        loadCodeEditor(mixedMarkup, "light");
        expectNoColorContrastViolations(".doenet-viewer .editor-panel");
    });

    it("dark mode: read-only codeEditor", () => {
        // Read-only mode swaps in `readOnlyColorTheme`, a separate palette
        // from the editable one.
        loadCodeEditor(`<p>read-only $x</p>`, "dark", "readOnly");
        expectNoColorContrastViolations(".doenet-viewer .editor-panel");
    });

    it("dark mode: codeEditor chrome (footer tabs and viewer controls)", () => {
        loadCodeEditor(`<p>some text</p>`, "dark");
        cy.get(".doenet-viewer .editor-footer").should("exist");
        expectNoColorContrastViolations([
            ".doenet-viewer .editor-footer",
            ".doenet-viewer .viewer-controls",
        ]);
    });

    it("dark mode: the embedded editor uses the dark canvas", () => {
        // A direct check on the mechanism the axe scans depend on: if the
        // renderer stops inheriting the document theme, the canvas stays
        // white and every case above fails at once with a less obvious
        // message than this one.
        loadCodeEditor(`<p>text</p>`, "dark");
        // CodeMirror's generated class names carry no theme information, so
        // check the canvas color the dark theme actually paints. That is
        // `canvasBackground()` in the codemirror package, `var(--canvas,
        // #121212)`, and `--canvas` is `#121212` under `[data-theme="dark"]`
        // in `packages/doenetml/src/DoenetML.css`.
        cy.get(".doenet-viewer .cm-editor").should(
            "have.css",
            "background-color",
            "rgb(18, 18, 18)",
        );
    });
});

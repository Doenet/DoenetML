import {
    contrastAgainstCanvas,
    expectLegible,
    measureSelectedTextOn,
    renderedBackground,
    type ThemeMode,
} from "../support/color-contrast";
import { mountEditor, setSelection } from "../support/mount-editor";

/**
 * Accessibility coverage for *selected* (highlighted) text in the editor.
 *
 * A selection has to satisfy two things that pull against each other: it must
 * be obvious enough to see, and the text on top of it must stay readable. The
 * editor buys both by recoloring the selected text to a single high-contrast
 * value — the way a native selection in any other input on the page does — so
 * the fill is no longer capped by the dimmest color in the syntax palette. Both
 * halves are measured here; drop either and the other is trivial to satisfy.
 *
 * Why not `cy.checkA11y`?  axe-core's `color-contrast` rule cannot see the
 * selection: CodeMirror paints it in a separate, negative-z-index layer
 * (`.cm-selectionLayer > .cm-selectionBackground`), and the native fallback is a
 * `::selection` pseudo-element — neither is a DOM background axe can resolve.
 * Pointed at highlighted code, axe compares each token to a *phantom white*
 * background and reports nonsense. So this spec measures the real thing
 * directly: it reads the rendered selection color and the rendered text color
 * and asserts the WCAG 2.1 contrast between them is at least AA (4.5:1).
 *
 * The editor theme reads a few colors from CSS custom properties defined in
 * `@doenet/doenetml`'s `DoenetML.css` (not in this package); `mountEditor`
 * re-declares them per mode so the component renders with the real app colors.
 */

// Exercises the token categories the editor actually paints: tag names / angle
// brackets, attribute names, attribute-value strings, text content, the
// mismatched-tag red, and the comment gray. All of them are recolored once
// selected, so the point of the variety here is to catch a token type that
// somehow escapes the recolor.
const DOENET_SOURCE = `<section name="s">
  <!-- comments must stay legible when highlighted too -->
  <title>Highlighted text should stay legible</title>
  <p>Body text with a macro $s and the number 42.</p>
  <point name="P" coords="(3, 4)" />
  <p>a mismatched <em>close</strong> tag</p>
</section>`;

/**
 * How far the selection must lift off the canvas.
 *
 * It used to sit at 1.32:1 dark and 1.28:1 light, which authors reported as no
 * highlight at all — and as indistinguishable from the fainter hints painted
 * for matching words and for the tag pair under the cursor. Recoloring the
 * selected text is what lifted the ceiling that held it there, so the floor is
 * set high enough that removing the recolor cannot pass: on the dark canvas it
 * is above WCAG's 3:1 for non-text contrast. Light mode has less headroom
 * before a "light blue selection" stops looking like one, and gets a lower
 * floor.
 */
const MIN_SELECTION_VISIBILITY: Record<ThemeMode, number> = {
    dark: 3.0,
    light: 1.8,
};

function mountAndSelectAll(mode: ThemeMode) {
    mountEditor(mode, DOENET_SOURCE);
    // Select the whole document so the selection layer is painted behind every
    // token.
    cy.get(".cm-content").type("{selectall}");
    cy.get(".cm-selectionBackground").should("exist");
    cy.get(".cm-selectedText").should("exist");
}

/**
 * Assert the selected text is legible on the rendered selection background, and
 * that it really was recolored — a single color across every token type. If the
 * recolor silently stopped applying, the spans would come back in their palette
 * colors and this catches it before the contrast assertion does.
 */
function expectHighlightedTextIsLegible(mode: ThemeMode) {
    cy.window().then((win) => {
        const { css, color } = renderedBackground(
            win,
            ".cm-selectionBackground",
            mode,
        );
        const measured = measureSelectedTextOn(win, color);
        expect(
            new Set(measured.map((entry) => entry.color)),
            "selected text is one color, not the syntax palette",
        ).to.have.property("size", 1);
        expectLegible(measured, `selection ${css}`);
    });
}

describe("CodeMirror selection-highlight accessibility", () => {
    (["light", "dark"] as ThemeMode[]).forEach((mode) => {
        it(`${mode} mode: selected text meets contrast on the selection`, () => {
            mountAndSelectAll(mode);
            expectHighlightedTextIsLegible(mode);
        });

        // The other half of the trade-off: "legible on top" is trivially
        // satisfied by a selection nobody can see, which is the bug this floor
        // prevents.
        it(`${mode} mode: the selection is visible against the canvas`, () => {
            mountAndSelectAll(mode);
            cy.window().then((win) => {
                const { css, color } = renderedBackground(
                    win,
                    ".cm-selectionBackground",
                    mode,
                );
                expect(
                    contrastAgainstCanvas(win, color, mode),
                    `selection ${css} against the ${mode} canvas`,
                ).to.be.at.least(MIN_SELECTION_VISIBILITY[mode]);
            });
        });
    });

    // The blurred selection is colored by a separate CodeMirror base-theme rule;
    // clicking away from the editor must not revert the highlight to the
    // washed-out base color. The recolor is a decoration rather than
    // `::selection`, partly so that it survives here — the native selection is
    // gone once focus is, but the drawn one is still on screen.
    it("dark mode: highlighted text stays legible after the editor is blurred", () => {
        mountAndSelectAll("dark");
        cy.get("#outside-editor").focus();
        cy.get(".cm-editor").should("not.have.class", "cm-focused");
        expectHighlightedTextIsLegible("dark");
    });

    // The other reason the recolor is a decoration: the browser has one native
    // selection, but Ctrl+D gives the editor several. Every range has to be
    // recolored, not just the one the DOM knows about.
    it("dark mode: every Ctrl+D range is recolored, not just the main one", () => {
        const source = `<p>alpha beta alpha gamma alpha</p>`;
        const viewRef = mountEditor("dark", source);
        setSelection(viewRef, source.indexOf("alpha"));
        cy.get(".cm-content").type("{ctrl}d").type("{ctrl}d");
        cy.get(".cm-selectedText").should("have.length", 2);
        expectHighlightedTextIsLegible("dark");
    });
});

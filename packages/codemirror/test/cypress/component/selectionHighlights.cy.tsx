import {
    canvasColor,
    contrastAgainstCanvas,
    expectTokensLegibleOn,
    flatten,
    parseColor,
    renderedBackground,
    type ThemeMode,
} from "../support/color-contrast";
import {
    mountEditor,
    setSelection,
    type ViewRef,
} from "../support/mount-editor";

/**
 * The editor paints three things around text, and an author has to be able to
 * tell them apart at a glance: the selection, the other occurrences of the
 * selected text, and the tag pair under the cursor. Off the shelf all three
 * were fills of nearly the same strength on the dark canvas — the selection at
 * 1.32:1, the tag pair at 1.51:1, the occurrences at 4.51:1 — so the loudest of
 * them was the one that mattered least. This spec pins the order back:
 *
 *  - the selection is a fill and by far the strongest;
 *  - the occurrence tint is a fill and stays a hint;
 *  - the tag pair is an outline, a channel neither fill can be mistaken for.
 *
 * It also pins the behavior that went with the tint: it used to vanish the
 * moment Ctrl+D took a second occurrence, exactly when it was guiding a
 * multi-cursor edit.
 *
 * See `src/extensions/selection-highlight.ts`. The contrast of text *on* these
 * backgrounds is `selectionAccessibility.cy.tsx`.
 */

// "alpha" several times over, including two on one line — enough copies to tell
// "some marks" from "all marks" as Ctrl+D consumes them. The rest of the
// document paints one token of every color the editor has, so the contrast
// check below measures the tint against the whole palette rather than a corner
// of it — the comment gray and the mismatched-tag red among them, the two
// dimmest in the dark palette.
const DOENET_SOURCE = `<section name="alpha">
  <!-- a comment about alpha -->
  <p>alpha beta alpha</p>
  <p>gamma alpha delta $epsilon</p>
  <p>a mismatched <em>close</strong> tag</p>
</section>`;

const ALPHA_OCCURRENCES = DOENET_SOURCE.split("alpha").length - 1;

/** Where the first `alpha` inside the first `<p>` starts. */
const FIRST_BODY_ALPHA = DOENET_SOURCE.indexOf("<p>alpha") + "<p>".length;

/**
 * Ceiling on how far the match tint may lift off the canvas. The stock green
 * sat at 4.5:1 on the dark canvas — brighter than the selection itself, which
 * is what made it distracting. A hint should stay a hint.
 */
const MAX_MATCH_VISIBILITY = 1.6;

/**
 * How much louder the selection has to be than the hint. Merely asserting the
 * selection is the greater of the two would be satisfied by a pair that reads
 * as one thing at a glance, which is the complaint; the size of the gap is what
 * makes the order legible, so the gap is what is asserted.
 */
const MIN_SELECTION_OVER_MATCH = 1.5;

/**
 * WCAG 1.4.11 for non-text contrast. The tag-pair outline carries the whole
 * signal now that it has no fill, so it has to clear the bar a UI boundary is
 * held to.
 */
const NON_TEXT_CONTRAST = 3.0;

function mount(mode: ThemeMode) {
    return mountEditor(mode, DOENET_SOURCE);
}

function selectFirstAlpha(viewRef: ViewRef) {
    setSelection(viewRef, FIRST_BODY_ALPHA, FIRST_BODY_ALPHA + "alpha".length);
}

describe("CodeMirror highlight channels", () => {
    it("marks the other occurrences of the selected text, but not the selection itself", () => {
        const viewRef = mount("light");
        selectFirstAlpha(viewRef);

        cy.get(".cm-selectionMatch").should(
            "have.length",
            ALPHA_OCCURRENCES - 1,
        );
        cy.get(".cm-selectionMatch").each(($el) => {
            expect($el.text()).to.equal("alpha");
        });
    });

    // The reported regression: `highlightSelectionMatches` returns no
    // decorations at all once the selection holds more than one range, so the
    // marks blinked out on the first Ctrl+D.
    it("keeps marking the remaining occurrences as Ctrl+D collects them", () => {
        const viewRef = mount("light");
        setSelection(viewRef, FIRST_BODY_ALPHA);

        // The first Ctrl+D selects the word under the cursor; each one after
        // that takes the next occurrence. Every press should move one copy from
        // the marks to the selection, never blank the marks out.
        for (let taken = 1; taken <= ALPHA_OCCURRENCES; taken++) {
            cy.get(".cm-content").type("{ctrl}d");
            cy.then(() => {
                expect(
                    viewRef.current!.state.selection.ranges,
                    `selection ranges after ${taken} press(es)`,
                ).to.have.length(taken);
            });
            cy.get(".cm-selectionMatch").should(
                "have.length",
                ALPHA_OCCURRENCES - taken,
            );
        }
    });

    it("ignores selections too small or too blank to be worth echoing", () => {
        const viewRef = mount("light");

        // A single character matches half the document.
        setSelection(viewRef, FIRST_BODY_ALPHA, FIRST_BODY_ALPHA + 1);
        cy.get(".cm-selectionMatch").should("not.exist");

        // A run of whitespace would light up every line's indentation.
        const gap = DOENET_SOURCE.indexOf("\n  <p>alpha");
        setSelection(viewRef, gap, gap + 3);
        cy.get(".cm-selectionMatch").should("not.exist");

        // Sanity check that the same document does mark a real word, so the
        // two assertions above aren't passing for an unrelated reason.
        selectFirstAlpha(viewRef);
        cy.get(".cm-selectionMatch").should("exist");
    });

    (["light", "dark"] as ThemeMode[]).forEach((mode) => {
        it(`${mode} mode: the match tint is subtler than the selection and keeps text legible`, () => {
            const viewRef = mount(mode);
            selectFirstAlpha(viewRef);
            cy.get(".cm-selectionMatch").should("exist");
            cy.get(".cm-selectionBackground").should("exist");

            cy.window().then((win) => {
                const match = renderedBackground(
                    win,
                    ".cm-selectionMatch",
                    mode,
                );
                const selection = renderedBackground(
                    win,
                    ".cm-selectionBackground",
                    mode,
                );

                const matchVisibility = contrastAgainstCanvas(
                    win,
                    match.color,
                    mode,
                );
                const selectionVisibility = contrastAgainstCanvas(
                    win,
                    selection.color,
                    mode,
                );

                expect(
                    matchVisibility,
                    `match ${match.css} against the ${mode} canvas`,
                ).to.be.lessThan(MAX_MATCH_VISIBILITY);
                expect(
                    selectionVisibility / matchVisibility,
                    `selection ${selection.css} (${selectionVisibility.toFixed(2)}:1) over match ${match.css} (${matchVisibility.toFixed(2)}:1)`,
                ).to.be.at.least(MIN_SELECTION_OVER_MATCH);

                expectTokensLegibleOn(
                    win,
                    match.color,
                    `selection match ${match.css}`,
                );
            });
        });

        // The tag pair the cursor sits in. CodeMirror's `bracketMatching`
        // paints it with a translucent fill; ours outlines it instead, so it
        // reads as a different kind of thing from either fill rather than as a
        // third one competing with them.
        it(`${mode} mode: the tag pair is outlined, not filled`, () => {
            const viewRef = mount(mode);
            // Inside the opening tag's name, which is where an author lands
            // when they click on a tag.
            setSelection(viewRef, DOENET_SOURCE.indexOf("<section") + 2);

            // Both halves of the pair, not just the one under the cursor.
            cy.get(".cm-matchingBracket").should("have.length", 2);
            cy.window().then((win) => {
                const el = win.document.querySelector(".cm-matchingBracket")!;
                const style = win.getComputedStyle(el);

                expect(
                    parseColor(style.backgroundColor).a,
                    `tag pair background ${style.backgroundColor} must be unpainted`,
                ).to.equal(0);
                expect(
                    parseFloat(style.outlineWidth),
                    "tag pair outline width",
                ).to.be.greaterThan(0);
                expect(style.outlineStyle, "tag pair outline style").to.equal(
                    "solid",
                );
                expect(
                    contrastAgainstCanvas(
                        win,
                        flatten(
                            parseColor(style.outlineColor),
                            canvasColor(win, mode),
                        ),
                        mode,
                    ),
                    `tag pair outline ${style.outlineColor} against the ${mode} canvas`,
                ).to.be.at.least(NON_TEXT_CONTRAST);
            });
        });
    });
});

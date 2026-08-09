import type { EditorSelection } from "@codemirror/state";
import {
    Decoration,
    type DecorationSet,
    EditorView,
    ViewPlugin,
    type ViewUpdate,
} from "@codemirror/view";
import { SearchCursor } from "@codemirror/search";

/**
 * The selected text itself. Carrying a class lets the theme recolor it, which
 * is what allows the selection background to be strong enough to see — see the
 * note on `getHighlightColors` in `theme.ts`.
 */
const selectedTextDecoration = Decoration.mark({ class: "cm-selectedText" });

/**
 * Marks an occurrence of the selected text that the author has not selected.
 * Carries the same class CodeMirror's own `highlightSelectionMatches` uses, so
 * `.cm-selectionMatch` CSS written against the standard extension still lands.
 * The tint itself comes from the editor theme.
 */
const matchDecoration = Decoration.mark({ class: "cm-selectionMatch" });

/**
 * Shortest selection worth echoing. One character matches so much of a
 * document — every `<`, every `p` — that the marks read as noise rather than
 * as a hint about what is selected.
 */
const MIN_QUERY_LENGTH = 2;

/** Longest selection searched for; beyond this a repeat is vanishingly rare. */
const MAX_QUERY_LENGTH = 200;

/**
 * Give up past this many matches on screen. Text that common tells the author
 * nothing about where its copies are, and marking all of it just tints the
 * document.
 */
const MAX_MATCHES = 100;

/**
 * Whether `[from, to)` is already painted by the selection layer.
 *
 * Every range counts, not just the main one: after Ctrl+D the occurrences
 * already taken are selections in their own right, and tinting them as matches
 * as well would stack a second background on the one that matters.
 */
function overlapsSelection(
    selection: EditorSelection,
    from: number,
    to: number,
) {
    return selection.ranges.some((range) => from < range.to && to > range.from);
}

/**
 * Every occurrence of the selected text on screen that the author has not
 * selected. Empty when the selection is too short, too long, blank, or so
 * common that marking it would tint the document rather than point at
 * anything.
 */
function findMatches(view: EditorView) {
    const { state } = view;
    const { selection } = state;
    const main = selection.main;
    if (main.empty) {
        return [];
    }
    const length = main.to - main.from;
    if (length < MIN_QUERY_LENGTH || length > MAX_QUERY_LENGTH) {
        return [];
    }
    const query = state.sliceDoc(main.from, main.to);
    // Dragging across a run of spaces or a line break would otherwise light up
    // the indentation of every line on screen.
    if (query.trim() === "") {
        return [];
    }

    const matches = [];
    // Only what is on screen: the marks are a reading aid, and off-screen ones
    // would cost a full-document scan on every cursor move to draw nothing.
    for (const part of view.visibleRanges) {
        const cursor = new SearchCursor(state.doc, query, part.from, part.to);
        while (!cursor.next().done) {
            const { from, to } = cursor.value;
            if (overlapsSelection(selection, from, to)) {
                continue;
            }
            matches.push(matchDecoration.range(from, to));
            if (matches.length > MAX_MATCHES) {
                return [];
            }
        }
    }
    return matches;
}

function getDecorations(view: EditorView): DecorationSet {
    const selected = view.state.selection.ranges
        .filter((range) => !range.empty)
        .map((range) => selectedTextDecoration.range(range.from, range.to));

    // Sorted on the way in: the two kinds interleave through the document.
    return Decoration.set(selected.concat(findMatches(view)), true);
}

/**
 * Recolors the selected text and tints the other occurrences of it.
 *
 * Both halves answer the same reported problem — that the selection was the
 * quietest thing on screen — from opposite directions.
 *
 * Recoloring is what lets the selection background be seen at all. The
 * background is painted behind syntax-colored text that has to stay readable
 * on top of it, and on either canvas that caps how far the background can move
 * before the dimmest token falls below WCAG AA. Handing the selected text a
 * single high-contrast color of its own lifts the cap, the way a native text
 * selection does in any other input on the page.
 *
 * The match marks stand in for `@codemirror/search`'s
 * `highlightSelectionMatches`, which drops every one of them as soon as the
 * selection holds more than one range. That put the guidance out exactly when
 * it was needed most: Ctrl+D (`selectNextOccurrence`) adds a range per press,
 * so the author lost sight of the remaining copies the instant they started
 * collecting them. Here the marks stay — the occurrences already taken are
 * drawn by the selection layer, and the ones still ahead keep their tint.
 */
export const selectionHighlighter = ViewPlugin.fromClass(
    class {
        decorations: DecorationSet;

        constructor(view: EditorView) {
            this.decorations = getDecorations(view);
        }

        update(update: ViewUpdate) {
            if (
                update.selectionSet ||
                update.docChanged ||
                update.viewportChanged
            ) {
                this.decorations = getDecorations(update.view);
            }
        }
    },
    { decorations: (plugin) => plugin.decorations },
);

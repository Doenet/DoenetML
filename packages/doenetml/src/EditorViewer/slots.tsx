/**
 * Sentences that have marked-up fragments inside them.
 *
 * Some of what the editor says is not a label but a sentence with something
 * rendered in the middle of it — a linked standard name in the accessibility
 * heading, an element name in `<code>` in the context-help panel. Splitting
 * such a sentence at the markup would hand a translator two or three fragments
 * and no sentence, and would fix English's word order in the JSX. So the whole
 * sentence is one message and each fragment is an argument; what the argument
 * carries is a marker, and the marker is swapped for the React node after
 * Fluent has formatted the sentence (#1580).
 *
 * The marker is a NUL-delimited index rather than the fragment's own text, so a
 * fragment can repeat, can be reordered by a translation, and can be a
 * substring of the surrounding prose without being found by accident. NUL
 * cannot appear in an FTL source or in anything the editor formats.
 *
 * A translation that drops a placeable renders without that fragment rather
 * than losing the sentence, and one that leaves a marker unmatched — which only
 * a hand-edited catalog could do — renders nothing in its place.
 *
 * @module
 */
import React from "react";

/** The delimiter around a marker's index. */
const SLOT = "\u0000";

/** Matches one marker, capturing the index inside it. */
const SLOT_PATTERN = new RegExp(`${SLOT}(\\d+)${SLOT}`);

/** The value to pass as the argument standing in for node `index`. */
export function slot(index: number): string {
    return `${SLOT}${index}${SLOT}`;
}

/**
 * A formatted message with its {@link slot} markers replaced by `nodes`.
 *
 * @param text What the translator returned, with markers still in it.
 * @param nodes The fragments, indexed as they were passed to {@link slot}.
 */
export function fillSlots(
    text: string,
    nodes: readonly React.ReactNode[],
): React.ReactNode {
    // A capturing split alternates literal text and captured indices, so the
    // odd positions are the markers.
    return text
        .split(SLOT_PATTERN)
        .map((piece, ind) => (
            <React.Fragment key={ind}>
                {ind % 2 === 0 ? piece : nodes[Number(piece)]}
            </React.Fragment>
        ));
}

import type { Position } from "@doenet/utils";

/**
 * Find the nearest available source position/sourceDoc for a component,
 * walking up `parentIdx` ancestors when the component itself has no
 * position. Used by diagnostics and other surfaces that need to attribute
 * a problem to a location in the source DoenetML.
 *
 * Pulled out of `DiagnosticsManager` because it is not diagnostic-specific
 * — diagnostics happens to be its primary caller.
 */
export function getSourceLocationForComponent(
    component: any,
    components: any[],
): { position: any; sourceDoc: number | undefined } {
    let position = component.position;
    let sourceDoc = component.sourceDoc;
    let comp = component;

    while (position === undefined) {
        if (!(comp.parentIdx > 0)) {
            break;
        }
        comp = components[comp.parentIdx];
        position = comp.position;
        sourceDoc = comp.sourceDoc;
    }

    return { position, sourceDoc };
}

/**
 * One part of a resolved reference path, as the resolver hands it back: the
 * `p` and the `styleDescription[1]` of `$p.styleDescription[1]`, each carrying
 * the span of source it was read from.
 */
type ReferencePathPart = {
    position?: Position;
    sourceDoc?: number;
};

/**
 * The DoenetML an author wrote for a reference, read back out of the source.
 *
 * Given the `originalPath` of a ref resolution, returns the span it covers —
 * `p.styleDescription[1]` for `$p.styleDescription[1]`, *without* the leading
 * `$`, which every caller adds when it composes its message.
 *
 * Reconstructing the text is the only way to name a reference back to the
 * author. By the time anything goes wrong the reference is a component index
 * and a state-variable name, and neither of those is anything the author
 * typed; the source they typed is the one description they can act on.
 *
 * Returns `""` when the offsets aren't there. A path part built by a composite
 * rather than parsed from a document (a `<repeat>` remapping its body, say)
 * has no position, and a message naming an empty reference is worse than no
 * message — so a caller that gets `""` back should say nothing rather than
 * quote nothing.
 */
export function doenetMLStringForReference(
    originalPath: ReferencePathPart[] | undefined | null,
    allDoenetMLs: readonly string[] | undefined,
): string {
    if (!originalPath || originalPath.length === 0) {
        return "";
    }
    const startOffset = originalPath[0].position?.start.offset;
    const endOffset =
        originalPath[originalPath.length - 1].position?.end.offset;
    const sourceDoc = originalPath[0].sourceDoc ?? 0;

    if (startOffset == undefined || endOffset == undefined) {
        return "";
    }
    return allDoenetMLs?.[sourceDoc]?.substring(startOffset, endOffset) ?? "";
}

/**
 * Matches the run of XML tag-name characters immediately after `<`.
 * Per XML 1.0 a name may contain a wider set of characters, but DoenetML
 * tag names only ever use these — keeping the class tight avoids accidentally
 * consuming non-name characters such as `/` (self-closing slash) or `>`.
 */
const TAG_NAME_REGEX = /^[A-Za-z0-9_:-]+/;

/**
 * Shrink a position covering an entire element span down to just the opening
 * tag (`<tagname`). Used so accessibility diagnostics underline / target the
 * tag name rather than the whole multi-line component — a smaller target
 * keeps the lint hover from popping up whenever the cursor hovers over the
 * element's interior.
 *
 * Returns the position unchanged when:
 *   - inputs are missing
 *   - `start.offset` is missing (we need a character offset to read the source)
 *   - the character at `start.offset` is not `<` (e.g. attribute-value
 *     positions emitted by the style-contrast checker)
 *   - no tag-name characters follow the `<`
 */
export function narrowPositionToOpeningTag(
    position: Position | undefined,
    source: string | undefined,
): Position | undefined {
    if (!position || !source) {
        return position;
    }
    const startOffset = position.start.offset;
    if (typeof startOffset !== "number" || source[startOffset] !== "<") {
        return position;
    }

    // Cap the search at the element's existing end offset so we never widen
    // the range. Falling back to `source.length` is safe — the regex match
    // is then the only limit.
    const endOffsetLimit =
        typeof position.end.offset === "number"
            ? position.end.offset
            : source.length;
    const searchWindow = source.slice(startOffset + 1, endOffsetLimit);

    const match = TAG_NAME_REGEX.exec(searchWindow);
    if (!match) {
        return position;
    }

    const tagNameLength = 1 + match[0].length;
    return {
        start: position.start,
        end: {
            line: position.start.line,
            column: position.start.column + tagNameLength,
            offset: startOffset + tagNameLength,
        },
    };
}

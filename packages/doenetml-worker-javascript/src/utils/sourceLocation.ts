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
 *   - `start.offset` is missing (we need byte offsets to read the source)
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

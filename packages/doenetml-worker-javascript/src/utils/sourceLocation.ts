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
 * Shrink a position covering an entire element span down to just the opening
 * tag (`<tagname`). Used so accessibility diagnostics underline / target the
 * tag name rather than the whole multi-line component — a smaller target
 * keeps the lint hover from popping up whenever the cursor hovers over the
 * element's interior.
 *
 * Returns the position unchanged when:
 *   - inputs are missing
 *   - the character at `start.offset` is not `<` (e.g. attribute-value
 *     positions emitted by the style-contrast checker)
 *   - no tag-name characters follow the `<`
 */
export function narrowPositionToOpeningTag(
    position: any,
    source: string | undefined,
): any {
    if (!position || !source) {
        return position;
    }
    const startOffset = position.start?.offset;
    if (typeof startOffset !== "number" || source[startOffset] !== "<") {
        return position;
    }

    const endOffsetLimit =
        typeof position.end?.offset === "number"
            ? position.end.offset
            : source.length;

    let tagEnd = startOffset + 1;
    while (tagEnd < source.length && tagEnd < endOffsetLimit) {
        const ch = source[tagEnd];
        const isNameChar =
            (ch >= "a" && ch <= "z") ||
            (ch >= "A" && ch <= "Z") ||
            (ch >= "0" && ch <= "9") ||
            ch === "_" ||
            ch === "-" ||
            ch === ":";
        if (!isNameChar) {
            break;
        }
        tagEnd++;
    }

    if (tagEnd === startOffset + 1) {
        return position;
    }

    const tagNameLength = tagEnd - startOffset;
    return {
        start: position.start,
        end: {
            line: position.start.line,
            column: position.start.column + tagNameLength,
            offset: tagEnd,
        },
    };
}

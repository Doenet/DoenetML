import { DastAttribute } from "@doenet/parser";

/**
 * Char class for an unquoted attribute value or attribute identifier.
 * Mirrors what the lezer grammar accepts as a bare-value run / attribute
 * name. Exported so consumers don't redefine it.
 */
export const ATTR_VALUE_CHAR = /[A-Za-z0-9_-]/;

/**
 * Walk back from `from` (exclusive) first over value chars, then over
 * whitespace. Returns the offset of the value-run start and, if `=`
 * immediately precedes the whitespace, its offset.
 *
 * Shared by:
 * - `DoenetSourceObject.attributeAtOffset`'s bare-value-after-`=` fallback
 *   (when no attribute's range contains the cursor).
 * - `AutoCompleter.getCompletionItems`' bare-value-after-`=` detection
 *   (`isBareValueAfterEquals`).
 */
export function scanBareValueRun(
    source: string,
    from: number,
): {
    /** Offset where the value-char run starts (== `from` when there is no run). */
    valueStartOffset: number;
    /** Offset of the `=` immediately preceding the run, or `null` if none. */
    equalsOffset: number | null;
} {
    let valueStartOffset = from;
    while (
        valueStartOffset > 0 &&
        ATTR_VALUE_CHAR.test(source.charAt(valueStartOffset - 1))
    ) {
        valueStartOffset--;
    }
    let scan = valueStartOffset;
    while (scan > 0 && /\s/.test(source.charAt(scan - 1))) {
        scan--;
    }
    const equalsOffset =
        scan > 0 && source.charAt(scan - 1) === "=" ? scan - 1 : null;
    return { valueStartOffset, equalsOffset };
}

/**
 * Convenience wrapper: just the `=` offset, or `null` if not present.
 */
export function findPrecedingEqualsForBareValue(
    source: string,
    from: number,
): number | null {
    return scanBareValueRun(source, from).equalsOffset;
}

/**
 * Synthesize a virtual `DastAttribute` from an identifier token in the
 * source, used when `lezer-to-dast` stripped a bare-value pair
 * (`<math simplify=full>` — #1197) and `node.attributes` no longer carries
 * the attribute the cursor is conceptually on.
 *
 * `tokenStart` (inclusive) and `tokenEnd` (exclusive) bound the identifier
 * in `source`; `offsetToRowCol` converts those offsets into the 1-indexed
 * line/column positions DAST uses everywhere else, so a consumer that
 * reads `.position.start.line` from this synthesized attribute gets the
 * same shape it would from a real one.
 *
 * The returned attribute carries `children: []` (the value half was
 * stripped along with the assign half, and we never reconstructed it).
 * Consumers that need the typed value should slice the source around
 * the synthesized `position` themselves — `toXml(attr.children)` will
 * just yield `""`.
 */
export function synthesizeStrippedAttribute(
    source: string,
    tokenStart: number,
    tokenEnd: number,
    offsetToRowCol: (offset: number) => { line: number; column: number },
): DastAttribute | null {
    if (tokenEnd <= tokenStart) {
        return null;
    }
    const start = offsetToRowCol(tokenStart);
    const end = offsetToRowCol(tokenEnd);
    return {
        type: "attribute",
        name: source.slice(tokenStart, tokenEnd),
        children: [],
        position: {
            start: {
                line: start.line,
                column: start.column,
                offset: tokenStart,
            },
            end: { line: end.line, column: end.column, offset: tokenEnd },
        },
    };
}

/**
 * Walk back from `from` over attribute-name chars; return the start of
 * the identifier run (== `from` when there is no run).  Mirrors
 * `scanIdentifierForward` in the other direction.
 */
function scanIdentifierBackward(source: string, from: number): number {
    let offset = from;
    while (offset > 0 && ATTR_VALUE_CHAR.test(source.charAt(offset - 1))) {
        offset--;
    }
    return offset;
}

/**
 * Walk forward from `from` over attribute-name chars; return the end of
 * the identifier run (== `from` when there is no run).
 */
function scanIdentifierForward(source: string, from: number): number {
    let offset = from;
    while (
        offset < source.length &&
        ATTR_VALUE_CHAR.test(source.charAt(offset))
    ) {
        offset++;
    }
    return offset;
}

/**
 * Return the bounds of the identifier token straddling `offset`, or null
 * if `offset` is not adjacent to any identifier char.  Combines the
 * backward and forward scans so a cursor mid-token still recovers the
 * full identifier.
 *
 * Rejects a run that begins immediately after `<` so the helper never
 * synthesizes a tag name (e.g. `math` in `<math …>`) as an attribute.
 * Callers in `attributeAtOffset` are already gated by `cursorPosition`,
 * but error-state parser output can mislabel `openTag`/`unknown` here,
 * and a stale tag-name identifier would otherwise leak into the panel.
 */
export function identifierAtOffset(
    source: string,
    offset: number,
): { start: number; end: number } | null {
    const start = scanIdentifierBackward(source, offset);
    const end = scanIdentifierForward(source, offset);
    if (start === end) return null;
    if (start > 0 && source.charAt(start - 1) === "<") return null;
    return { start, end };
}

/**
 * Return the bounds of the identifier token ending at (or to the left of)
 * `offset`, skipping any whitespace between the identifier and `offset`.
 * Returns null if no identifier is found.
 *
 * Used by the stripped-pair fallback in `attributeAtOffset` to recover
 * the assign-half identifier from the `=` offset even when whitespace
 * separates the two — `<math simplify = full>` is the motivating shape;
 * the lezer parser still strips both halves into a bare-value pair, but
 * `identifierAtOffset(source, equalsOffset)` would see whitespace at
 * `source[equalsOffset - 1]` and fail to walk to `simplify`.
 *
 * Rejects a run that begins immediately after `<` for the same reason
 * `identifierAtOffset` does — never synthesize a tag name as an attribute.
 */
export function identifierPrecedingOffset(
    source: string,
    offset: number,
): { start: number; end: number } | null {
    let scan = offset;
    while (scan > 0 && /\s/.test(source.charAt(scan - 1))) {
        scan--;
    }
    const start = scanIdentifierBackward(source, scan);
    if (start === scan) return null;
    if (start > 0 && source.charAt(start - 1) === "<") return null;
    return { start, end: scan };
}

/**
 * Find the attribute whose source range contains `offset`. Used in three
 * places: the primary cursor-inside-attribute lookup, the unquoted-value
 * spillover heuristic (which excludes the bogus attribute and uses
 * exclusive end), and the bare-value-after-`=` fallback (same exclusive
 * end semantics — the `=` lives strictly inside the owning attribute's
 * range, not at its endpoint).
 */
export function findAttributeContainingOffset(
    attributes: DastAttribute[],
    offset: number,
    opts?: { endInclusive?: boolean; exclude?: DastAttribute },
): DastAttribute | null {
    const endInclusive = opts?.endInclusive ?? true;
    const exclude = opts?.exclude;
    const match = attributes.find((a) => {
        if (a === exclude) return false;
        const start = a.position?.start.offset;
        const end = a.position?.end.offset;
        if (start == null || end == null) return false;
        return start <= offset && (endInclusive ? end >= offset : end > offset);
    });
    return match ?? null;
}

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

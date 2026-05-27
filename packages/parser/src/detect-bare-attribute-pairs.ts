import { DastAttribute } from "./types";

/**
 * The runtime and LSP both emit a single diagnostic for unquoted attribute
 * values; this helper pins the wording so they stay textually identical.
 * Use as ``unquotedAttributeValueMessage("name", "foo")``.
 */
export function unquotedAttributeValueMessage(
    assignName: string,
    valueName: string,
): string {
    return `Attribute values must be enclosed in quotes: \`${assignName}="${valueName}"\``;
}

/**
 * Identify `<element name=foo>`-style unquoted attribute values.
 *
 * The lezer grammar splits an unquoted assignment into two parsed
 * `DastAttribute`s side-by-side: an "assignment" half whose source ends
 * with `=` (after optional whitespace) and a value-less "bare value" half
 * carrying the unquoted token as its `name`.  Returns each such pair so
 * `lezer-to-dast` can strip both halves from the element's attribute list
 * and emit a single unified `DastError` on the bare-value token (#1197) —
 * which in turn suppresses the four redundant downstream diagnostics this
 * shape used to surface.
 *
 * Takes a `DastAttribute[]` (the raw per-Attribute list `lezer-to-dast`
 * builds before deduping into `node.attributes`) rather than the element
 * itself: `node.attributes` is keyed by attribute name and would silently
 * collapse two attrs that share a name, which is exactly the shape we
 * need to inspect here.
 *
 * Cases the parser does NOT split this way never reach the pair loop —
 * they're handled at lower layers and we have nothing to add:
 *   - `<a x=$y>` — the `$y` gets absorbed as an element child, so `x`
 *     ends up as a lone assignment half with no sibling to pair with.
 *   - `<a x=23>` — numeric-leading tokens can't form an attribute name,
 *     so no bare-value half materializes.
 *   - `<a x=foo y=bar>` — the parser greedily reads through the second
 *     `=` and reports a quote-mismatch over the whole run.
 */
export function findBareAttributeValuePairs(
    attrs: DastAttribute[],
    source: string,
): { assignAttr: DastAttribute; valueAttr: DastAttribute }[] {
    // Pair detection needs at least two attributes; skip the sort
    // allocation in the (overwhelmingly common) zero-or-one case.
    // This runs once per element on every keystroke-driven validation,
    // so the early-out matters more than the constant factor suggests.
    if (attrs.length < 2) {
        return [];
    }
    const sorted = attrs
        .filter(
            (a) =>
                a.position?.start.offset != null &&
                a.position?.end.offset != null,
        )
        .sort(
            (a, b) =>
                (a.position?.start.offset ?? 0) -
                (b.position?.start.offset ?? 0),
        );
    const pairs: { assignAttr: DastAttribute; valueAttr: DastAttribute }[] = [];
    for (let i = 1; i < sorted.length; i++) {
        const prev = sorted[i - 1];
        const curr = sorted[i];
        // Both halves must be value-less.  `curr.children.length === 0`
        // rules out `<a x= y="bar" />`, where `x`'s source ends in `= `
        // (matching the regex below) but `y` is a real attribute with
        // its own quoted value — flagging `y` there would emit a
        // misleading `x="y"` suggestion.  Two adjacent assignment halves
        // never materialize at this layer: the lezer parser swallows a
        // trailing `=` into the previous attribute's value (so
        // `<a x= y= />` parses as a single attribute `x` with source
        // `x= y= />`), and macro-valued unquoted assignments
        // (`<a x=$y z=foo />`) drop `$y`/`z`/`foo` out of the attribute
        // list entirely, leaving only `x` behind.
        if (prev.children.length !== 0 || curr.children.length !== 0) {
            continue;
        }
        // Filter above guarantees both offsets are present; the `?? 0`
        // is for the type checker.
        const prevSrc = source.slice(
            prev.position?.start.offset ?? 0,
            prev.position?.end.offset ?? 0,
        );
        // `=` as the last non-whitespace character marks `prev` as an
        // assignment half (`x=` or `x = `), distinguishing `<a x=foo>`
        // from the unrelated boolean-attribute pair `<a x foo>`.
        if (!/=\s*$/.test(prevSrc)) {
            continue;
        }
        pairs.push({ assignAttr: prev, valueAttr: curr });
    }
    return pairs;
}

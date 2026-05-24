/**
 * Strict-rule predicate for the "implicit single index" shorthand on the
 * select family.  Issue #1181.
 *
 * The runtime renders a `<select numToSelect="1">` (or one of its siblings)
 * as a single replacement, so `$s.t` and `$s[1].t` resolve to the same
 * referent at runtime.  This module exposes a textual DAST check that the
 * autocomplete and context-help layers consult so both layers agree, by
 * construction, on which authored sources qualify for the shorthand.
 *
 * The rule is intentionally textual and strict.  Dynamic `numToSelect`
 * (e.g. `numToSelect="$n"`) and non-canonical literals (`"01"`, `"1.0"`)
 * deliberately do NOT qualify, even when they'd evaluate to 1 at runtime —
 * dropping that case keeps the predicate single-source between layers and
 * avoids the "autocomplete promises a member the runtime can't resolve"
 * class of bug that issue #1179 closed.
 */

import { toXml } from "@doenet/parser";
import type { DastElement } from "@doenet/parser";

/**
 * Maps a select-family element name to the attribute that controls how many
 * options/samples it produces.  Both attributes default to 1, so an absent
 * attribute counts as "single" for the purposes of this rule.
 *
 * The attribute names are taken from the JS-worker component definitions
 * (Select.js, SamplePrimeNumbers.js, …) — the issue text in #1181 lists
 * `numToSample`, but the runtime actually uses `numToSelect` for the four
 * `select*` tags and `numSamples` for the two `sample*` tags.
 */
export const SELECT_FAMILY_COUNT_ATTRIBUTE: Readonly<Record<string, string>> = {
    select: "numToSelect",
    selectFromSequence: "numToSelect",
    selectRandomNumbers: "numToSelect",
    selectPrimeNumbers: "numToSelect",
    samplePrimeNumbers: "numSamples",
    sampleRandomNumbers: "numSamples",
};

/**
 * Returns the trimmed source text of `element.attributes[attributeName]`,
 * or `undefined` if the attribute is absent or has empty content.  Mirrors
 * `getElementAttributeValue` in `methods/get-completion-items.ts`.
 */
export function getElementAttributeRawValue(
    element: DastElement,
    attributeName: string,
): string | undefined {
    const attr = element.attributes[attributeName];
    if (!attr) return undefined;
    const value = toXml(attr.children).trim();
    return value.length > 0 ? value : undefined;
}

/**
 * Strict-rule predicate from issue #1181: a select-family container has an
 * implicit single index iff the count attribute is either absent OR its
 * source text, trimmed, equals exactly `"1"`.
 *
 * Accepted: attribute absent, `numToSelect="1"`, `numToSelect=" 1 "`.
 * Rejected: `numToSelect="2"`, `"$n"`, `"01"`, `"1.0"`, `"One"`.
 *
 * The rule is a pure DAST text check; there is no state-variable lookup
 * and no reactivity.  Same predicate runs in the autocomplete layer and
 * the context-help layer so they cannot diverge on a given source.
 */
export function hasImplicitSingleIndex(element: DastElement): boolean {
    const attrName = SELECT_FAMILY_COUNT_ATTRIBUTE[element.name];
    if (attrName === undefined) return false;
    const raw = getElementAttributeRawValue(element, attrName);
    return raw === undefined || raw === "1";
}

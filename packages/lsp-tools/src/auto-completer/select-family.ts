/**
 * Strict-rule predicate for the "implicit single index" shorthand on the
 * select family.  Issue #1181.
 *
 * The runtime renders a `<select numToSelect="1">` (or one of its siblings)
 * as a single replacement, so `$s.t` reaches the `t` in its pick. (An index
 * after it reaches into what the pick holds, D72, so `$s[1].t` is not that
 * `t`.)  This module exposes a textual DAST check that the
 * autocomplete and context-help layers consult — through the shared
 * resolver-adapter — so both layers agree, by construction, on which
 * authored sources qualify for the shorthand.
 *
 * The rule is intentionally textual and strict.  Dynamic `numToSelect`
 * (e.g. `numToSelect="$n"`) and non-canonical literals (`"01"`, `"1.0"`)
 * deliberately do NOT qualify, even when they'd evaluate to 1 at runtime —
 * dropping that case keeps the predicate single-source and avoids the
 * "autocomplete promises a member the runtime can't resolve" class of bug
 * that issue #1179 closed.
 *
 * Element names are matched exactly (NAME-0, D51): `<SELECT>` is no component
 * (`doenet-e0002`). The count attribute is found without case, as for one
 * release the parser still applies one written in another case under the
 * component's spelling (`<select NumToSelect="2">` as `numToSelect`, with
 * `doenet-w0197`); see `findAttributeKey`.
 */

import type { DastElement } from "@doenet/parser";
import {
    findAttributeKey,
    getElementAttributeValue,
} from "./dast-attribute-utils";

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
 * Strict-rule predicate from issue #1181: a select-family container has an
 * implicit single index iff the count attribute is either absent OR its
 * source text, trimmed, equals exactly `"1"`.
 *
 * Accepted: attribute absent, `numToSelect="1"`, `numToSelect=" 1 "`,
 * `<select NumToSelect="1">` (applied as `numToSelect`, for now, with
 * `doenet-w0197`).
 * Rejected: `numToSelect="2"`, `"$n"`, `"01"`, `"1.0"`, `"One"`, and
 * present-but-empty `numToSelect=""` / `"   "` — the runtime treats those as
 * "nothing selected" (no replacement is produced), so `$s.t` won't resolve.
 * The predicate mirrors that by rejecting the shorthand: the autocomplete
 * dropdown and context-help panel surface no descendants, matching what the
 * worker will actually do.
 *
 * The rule is a pure DAST text check; there is no state-variable lookup
 * and no reactivity.  Note: the predicate distinguishes absent from
 * present-but-empty by calling `findAttributeKey` directly rather than
 * relying on `getElementAttributeValue`'s `undefined`-on-empty contract.
 */
export function hasImplicitSingleIndex(element: DastElement): boolean {
    if (
        !Object.prototype.hasOwnProperty.call(
            SELECT_FAMILY_COUNT_ATTRIBUTE,
            element.name,
        )
    ) {
        return false;
    }
    const attrName = SELECT_FAMILY_COUNT_ATTRIBUTE[element.name];
    // Absent attribute → defaults to 1 at runtime → shorthand applies.
    if (findAttributeKey(element, attrName) === undefined) return true;
    // Present attribute → only the literal "1" (with optional surrounding
    // whitespace) qualifies.  Present-but-empty rejects because the runtime
    // treats it as "nothing selected", not as if-absent.
    return getElementAttributeValue(element, attrName) === "1";
}

/**
 * Whether a name after `element` reaches its one item as after an index:
 * the select-family shorthand ({@link hasImplicitSingleIndex}), and a
 * `<conditionalContent>`, whose names (`$cc.x`) are the shown case's. Neither
 * is a collection (D72): an index after one reaches into what it shows.
 */
export function hasImplicitIndex(element: DastElement): boolean {
    return (
        element.name === "conditionalContent" || hasImplicitSingleIndex(element)
    );
}

import type { DastElement } from "@doenet/parser";

/**
 * Element names that introduce a repeat-style iteration scope: each one
 * declares `valueName` / `indexName` attributes that name the iteration's
 * current value and index, and each one is `takesIndex` on the resolver
 * side so member access requires an explicit bracket index
 * (`$rep[1].member`).
 *
 * Centralised here so a new repeat-shaped composite added later only needs
 * one edit to flow into every help/completion code path — both the rust
 * resolver adapter's descendant augmentation
 * (`getDerivedRepeatNamesFromElement`) and the AST-only help fallback
 * (`AutoCompleter.resolveDerivedRepeatNameOnElement`) read through this.
 *
 * Narrower than `takesIndex` deliberately: takesIndex includes composites
 * like `<select>` that don't have `valueName`/`indexName` bindings.
 */
export const REPEAT_LIKE_ELEMENT_NAMES: ReadonlySet<string> = new Set([
    "repeat",
    "repeatForSequence",
]);

/** True when `name` is the tag of a repeat-style iteration element. */
export function isRepeatLikeElementName(name: string): boolean {
    return REPEAT_LIKE_ELEMENT_NAMES.has(name);
}

/** Convenience: same check, accepting a DAST element. */
export function isRepeatLikeElement(el: DastElement): boolean {
    return isRepeatLikeElementName(el.name);
}

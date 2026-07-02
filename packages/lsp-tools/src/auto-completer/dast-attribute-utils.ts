/**
 * Shared DAST-attribute helpers for the autocomplete and context-help layers.
 *
 * DoenetML attribute names are case-insensitive in the runtime worker, but the
 * parser preserves the author's typed case in `element.attributes` (only the
 * deprecation pass does its own case-insensitive matching).  Any LSP-side
 * lookup that drives a soundness-critical decision must mirror the runtime's
 * case-insensitive semantics, otherwise sources like `<select NumToSelect="2">`
 * would be silently treated as "attribute absent" and surface descendants the
 * runtime can't resolve — the bug class issue #1179 closed.
 */

import { toXml } from "@doenet/parser";
import type { DastElement } from "@doenet/parser";

/**
 * Find the actual attribute key on `element` whose name equals `attributeName`
 * case-insensitively, or `undefined` if no such attribute exists.  Use this
 * (rather than `Object.keys(element.attributes).includes(attributeName)`)
 * whenever a lookup needs to match the runtime's case-insensitive semantics.
 */
export function findAttributeKey(
    element: DastElement,
    attributeName: string,
): string | undefined {
    const target = attributeName.toLowerCase();
    return Object.keys(element.attributes).find(
        (k) => k.toLowerCase() === target,
    );
}

/**
 * Returns the trimmed source text of the attribute on `element` whose name
 * matches `attributeName` case-insensitively, or `undefined` if the attribute
 * is absent or has empty content.
 */
export function getElementAttributeValue(
    element: DastElement,
    attributeName: string,
): string | undefined {
    const key = findAttributeKey(element, attributeName);
    if (key === undefined) return undefined;
    const attr = element.attributes[key];
    if (!attr) return undefined;
    const value = toXml(attr.children).trim();
    return value.length > 0 ? value : undefined;
}

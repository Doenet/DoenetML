/**
 * Shared DAST-attribute helpers for the autocomplete and context-help layers.
 *
 * Attribute names are matched exactly (NAME-0, D51), but for one release the
 * parser still applies an attribute written in another case under the
 * component's spelling, with a warning (`doenet-w0197`,
 * `dast-normalize/attribute-name-case.ts`), before the resolver or the core
 * read it. The DAST the LSP reads is not normalized, so a lookup that drives
 * what the LSP infers about the running document (`<select
 * NumToSelect="2">` selects two, issue #1179) finds an attribute written in
 * another case too, as the parser would apply it — unless the component's
 * spelling is written as well, which the parser keeps instead. The schema
 * check reports the other spelling (`doenet-w0197`).
 */

import { toXml } from "@doenet/parser";
import type { DastElement } from "@doenet/parser";

/**
 * Find the attribute key on `element` that the parser applies as
 * `attributeName`: `attributeName` itself when written, or else the one
 * written in another case (for now, with `doenet-w0197`), or `undefined` if
 * there is none. Use this (rather than
 * `Object.keys(element.attributes).includes(attributeName)`) whenever a lookup
 * needs to infer what the running document does.
 */
export function findAttributeKey(
    element: DastElement,
    attributeName: string,
): string | undefined {
    if (
        Object.prototype.hasOwnProperty.call(element.attributes, attributeName)
    ) {
        return attributeName;
    }
    const target = attributeName.toLowerCase();
    return Object.keys(element.attributes).find(
        (k) => k.toLowerCase() === target,
    );
}

/**
 * Returns the trimmed source text of the attribute on `element` that the
 * parser applies as `attributeName` (`findAttributeKey`), or `undefined` if the
 * attribute is absent or has empty content.
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

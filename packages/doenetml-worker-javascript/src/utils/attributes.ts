import type { DiagnosticRecord } from "@doenet/utils";

import type { AttributeDefinition } from "./dast/types";
import { codedDiagnostic } from "./diagnostics";

export type AttributesObject = Record<string, AttributeDefinition<unknown>>;

/**
 * Preprocess an attributes object created by componentClass.createAttributesObject().
 *
 * When `toLowerCase` is `true`, `defaultValue`, each `validValues[].value`,
 * `valueForTrue`, and `valueForFalse` are lower-cased. Descriptions are
 * left untouched.
 *
 * @param attributesObject - The result of componentClass.createAttributesObject()
 * @returns The preprocessed attributes object
 */
export function preprocessAttributesObject<T extends AttributesObject>(
    attributesObject: T,
): T {
    for (const attrName in attributesObject) {
        const attrSpec = attributesObject[attrName];

        // Belt-and-suspenders for plain-JS component declarations that
        // bypass the TS contract: `validateAttributeValue` reads `.value`
        // directly and would silently reject every authored value if a
        // `validValues` entry slipped through as a bare string.
        // `suggestedValues` has no runtime reader to break — what keeps a
        // malformed one out of the author's autocomplete is the stricter
        // build-time check in `static-assets/scripts/get-schema.ts`, which
        // also demands a non-empty description — but it is the same kind of
        // list, so it is held to the same shape here rather than being the
        // one value list nothing checks.
        for (const field of ["validValues", "suggestedValues"] as const) {
            const entries = attrSpec[field];
            if (!Array.isArray(entries)) {
                continue;
            }
            for (const entry of entries) {
                if (
                    typeof entry !== "object" ||
                    entry === null ||
                    typeof (entry as { value?: unknown }).value !== "string"
                ) {
                    throw new Error(
                        `Invalid ${field} entry for attribute \`${attrName}\`: every entry must be a {value, description} object. Got: ${JSON.stringify(entry)}`,
                    );
                }
            }
        }

        if (attrSpec.toLowerCase === true) {
            if (
                attrSpec.defaultValue !== undefined &&
                attrSpec.defaultValue !== null
            ) {
                // A list-valued attribute (e.g. `createComponentOfType:
                // "textList"`) has an array default, and `validValues`
                // constrains each item, so lower-case item-wise. Stringifying
                // the array instead would replace the default with a comma-
                // joined string, which every consumer expecting a list would
                // then have to cope with.
                attrSpec.defaultValue = Array.isArray(attrSpec.defaultValue)
                    ? attrSpec.defaultValue.map((entry) =>
                          typeof entry === "string"
                              ? entry.toLowerCase()
                              : entry,
                      )
                    : String(attrSpec.defaultValue).toLowerCase();
            }

            if (Array.isArray(attrSpec.validValues)) {
                attrSpec.validValues = attrSpec.validValues.map((entry) => ({
                    ...entry,
                    value: entry.value.toLowerCase(),
                }));
            }

            if (
                attrSpec.valueForTrue !== undefined &&
                attrSpec.valueForTrue !== null
            ) {
                attrSpec.valueForTrue = String(
                    attrSpec.valueForTrue,
                ).toLowerCase();
            }

            if (
                attrSpec.valueForFalse !== undefined &&
                attrSpec.valueForFalse !== null
            ) {
                attrSpec.valueForFalse = String(
                    attrSpec.valueForFalse,
                ).toLowerCase();
            }
        }
    }

    return attributesObject;
}

/**
 * Validate the items of a list-valued attribute against its `validValues`.
 *
 * On a list-valued attribute (e.g. `createComponentOfType: "textList"`),
 * `validValues` constrains *each item* of the list rather than the whole
 * value. Each item is normalized (lower-cased when `toLowerCase` is set, then
 * trimmed) and dropped if it isn't one of the allowed values; dropped items
 * are reported together in a single info diagnostic. Returns the surviving
 * items in order alongside any diagnostics produced.
 *
 * The diagnostic deliberately does not enumerate the allowed values: when
 * `toLowerCase` is set, `validValues` has already been lower-cased, so listing
 * it here would show the wrong case to the author. The canonical-cased
 * enumeration is surfaced by the schema-driven editor help, autocomplete, and
 * docs instead.
 */
export function validateListItemsAgainstValidValues({
    items,
    validValues,
    toLowerCase,
    attribute,
}: {
    items: unknown[];
    validValues: { value: string }[];
    toLowerCase?: boolean;
    attribute: string;
}): { value: string[]; diagnostics: DiagnosticRecord[] } {
    const allowed = validValues.map((v) => v.value);
    // Membership is checked once per item; a `Set` keeps that O(1).
    const allowedSet = new Set(allowed);
    const validItems: string[] = [];
    const invalidItems: unknown[] = [];
    for (const item of items) {
        // Non-string items can never match a string allow-list, so treat them
        // (alongside unrecognized strings) as invalid. The original `item` is
        // recorded for diagnostics so the message echoes what was authored.
        const normalized =
            typeof item === "string"
                ? (toLowerCase ? item.toLowerCase() : item).trim()
                : item;
        if (typeof normalized === "string" && allowedSet.has(normalized)) {
            validItems.push(normalized);
        } else {
            invalidItems.push(item);
        }
    }

    const diagnostics: DiagnosticRecord[] = [];
    if (invalidItems.length > 0) {
        diagnostics.push(
            codedDiagnostic({
                type: "info",
                code: "doenet-i0021",
                args: {
                    // Each value keeps the backticks it was rendered with; the
                    // join is `unit` so the list reads "`a`, `b`" rather than
                    // gaining an "and" the original never had.
                    values: {
                        list: invalidItems.map((v) => `\`${v}\``),
                        type: "unit",
                    },
                    attribute,
                },
            }),
        );
    }

    return { value: validItems, diagnostics };
}

import type { AttributeDefinition } from "./dast/types";

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
        // directly and would silently reject every authored value if an
        // entry slipped through as a bare string. Mirrors the build-time
        // check in `static-assets/scripts/get-schema.ts`.
        if (Array.isArray(attrSpec.validValues)) {
            for (const entry of attrSpec.validValues) {
                if (
                    typeof entry !== "object" ||
                    entry === null ||
                    typeof (entry as { value?: unknown }).value !== "string"
                ) {
                    throw new Error(
                        `Invalid validValues entry for attribute \`${attrName}\`: every entry must be a {value, description} object. Got: ${JSON.stringify(entry)}`,
                    );
                }
            }
        }

        if (attrSpec.toLowerCase === true) {
            if (
                attrSpec.defaultValue !== undefined &&
                attrSpec.defaultValue !== null
            ) {
                attrSpec.defaultValue = String(
                    attrSpec.defaultValue,
                ).toLowerCase();
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

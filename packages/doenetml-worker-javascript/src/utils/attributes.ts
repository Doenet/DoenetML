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

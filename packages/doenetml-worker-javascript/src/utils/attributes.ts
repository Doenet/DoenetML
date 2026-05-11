import type { AttributeDefinition } from "./dast/types";
import { normalizeValidValues } from "./validValues";

export type AttributesObject = Record<string, AttributeDefinition<unknown>>;

/**
 * Preprocess an attributes object created by componentClass.createAttributesObject().
 *
 * Two passes run unconditionally on every spec:
 *  1. `validValues` is normalized to `{value, description?}` objects so
 *     runtime consumers (e.g. `validateAttributeValue`) can read `.value`
 *     directly without re-normalizing on each access.
 *  2. If `toLowerCase` is `true`, `defaultValue`, each `validValues[].value`,
 *     `valueForTrue`, and `valueForFalse` are lower-cased. Descriptions are
 *     left untouched.
 *
 * @param attributesObject - The result of componentClass.createAttributesObject()
 * @returns The preprocessed attributes object
 */
export function preprocessAttributesObject<T extends AttributesObject>(
    attributesObject: T,
): T {
    for (const attrName in attributesObject) {
        const attrSpec = attributesObject[attrName];

        if (
            Array.isArray(attrSpec.validValues) &&
            attrSpec.validValues.length > 0
        ) {
            attrSpec.validValues = normalizeValidValues(attrSpec.validValues);
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
                // After the normalize pass above, every entry is an object.
                attrSpec.validValues = (
                    attrSpec.validValues as Array<{
                        value: string;
                        description?: string;
                    }>
                ).map((entry) => ({
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

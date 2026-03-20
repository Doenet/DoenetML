import type { AttributeDefinition } from "./dast/types";

export type AttributesObject = Record<string, AttributeDefinition<unknown>>;

/**
 * Preprocess an attributes object created by componentClass.createAttributesObject().
 *
 * This function modifies the attributes object if the property `toLowerCase` is true.
 * In that case:
 * 1. If the defaultValue property is specified, convert it to lower case
 * 2. If the validValues property is specified, convert each entry of the array to lower case
 * 3. If the valueForTrue or valueForFalse properties are specified, convert the values to lower case
 *
 * @param attributesObject - The result of componentClass.createAttributesObject()
 * @returns The preprocessed attributes object
 */
export function preprocessAttributesObject<T extends AttributesObject>(
    attributesObject: T,
): T {
    for (const attrName in attributesObject) {
        const attrSpec = attributesObject[attrName];

        // Check if toLowerCase flag is set
        if (attrSpec.toLowerCase === true) {
            // Convert defaultValue to lower case if specified
            if (
                attrSpec.defaultValue !== undefined &&
                attrSpec.defaultValue !== null
            ) {
                attrSpec.defaultValue = String(
                    attrSpec.defaultValue,
                ).toLowerCase();
            }

            // Convert each entry in validValues array to lower case if specified
            if (
                Array.isArray(attrSpec.validValues) &&
                attrSpec.validValues.length > 0
            ) {
                attrSpec.validValues = attrSpec.validValues.map((value) =>
                    String(value).toLowerCase(),
                );
            }

            // Convert valueForTrue to lower case if specified
            if (
                attrSpec.valueForTrue !== undefined &&
                attrSpec.valueForTrue !== null
            ) {
                attrSpec.valueForTrue = String(
                    attrSpec.valueForTrue,
                ).toLowerCase();
            }

            // Convert valueForFalse to lower case if specified
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

import { createComponentInfoObjects } from "../componentInfoObjects";

const componentInfoObjects = createComponentInfoObjects();

/**
 * Attempt to determine the component type of `propName` from `componentType`.
 *
 * If successful, returns the component type. Throws an error if it fails.
 *
 * Function will fail if `propName` is not a public state variable of `componentType`.
 *
 * Function will also fail for the edge case where `propName` has variable component type
 */
export function determinePropType(
    componentType: string,
    propName: string,
    indices?: number[],
) {
    // TODO: implement `indices`
    const publicStateVariableInfo =
        componentInfoObjects.publicStateVariableInfo[componentType];

    console.log({ publicStateVariableInfo });

    if (!publicStateVariableInfo) {
        throw Error(`"${componentType}" is not a valid component type`);
    }

    let varName = propName;

    // If `varName` is an alias, replace with its target
    if (varName in publicStateVariableInfo.aliases) {
        varName = publicStateVariableInfo.aliases[varName];
    }

    const stateVarInfo =
        publicStateVariableInfo.stateVariableDescriptions[varName];

    if (!stateVarInfo) {
        // if `varName` did not match a state variable, check to see if it is an array entry, i.e., begins with an array entry prefix
        let arrayEntryPrefixesLongestToShortest = Object.keys(
            publicStateVariableInfo.arrayEntryPrefixes,
        ).sort((a, b) => b.length - a.length);

        for (const arrayEntryPrefix of arrayEntryPrefixesLongestToShortest) {
            if (
                varName.substring(0, arrayEntryPrefix.length) ===
                arrayEntryPrefix
            ) {
                // `varName` is an array entry

                const prefixInfo =
                    publicStateVariableInfo.arrayEntryPrefixes[
                        arrayEntryPrefix
                    ];

                // if the array entry is wrapped with a different component type, return that component type
                const wrapResult = componentTypeFromWrapping(
                    prefixInfo.wrappingComponents,
                );
                if (wrapResult.foundComponentType) {
                    return wrapResult.componentType;
                }

                // otherwise, use the component type of the array itself
                return publicStateVariableInfo.stateVariableDescriptions[
                    prefixInfo.arrayVariableName
                ].createComponentOfType;
            }
        }

        throw Error(
            `"${propName}" is not a valid prop name of a component of type ${componentType}`,
        );
    }

    if (stateVarInfo.isArray && stateVarInfo.wrappingComponents) {
        const wrapResult = componentTypeFromWrapping(
            stateVarInfo.wrappingComponents,
        );
        if (wrapResult.foundComponentType) {
            return wrapResult.componentType;
        }
    }

    if (!stateVarInfo.createComponentOfType) {
        // Note: there are some prop that have variable component type.
        // This script will fail in those cases
        throw Error(
            `Case not implemented for prop "${propName}" a component of type ${componentType} because it has a variable component type!`,
        );
    }

    return stateVarInfo.createComponentOfType;
}

/**
 * Attempt to return the component type determined by the wrapping components.
 *
 * If the wrapping components are empty or do not correctly determine a component type, then
 * return:
 * - foundComponentType: `false`
 *
 * Otherwise return:
 * - foundComponentType: `true`
 * - componentType: the component type determined by the wrapping
 */
function componentTypeFromWrapping(
    wrappingComponents: (
        | string
        | { componentType: string; isAttributeNamed: string }
    )[][],
) {
    console.log({ wrappingComponents });
    if (wrappingComponents.length > 0) {
        const lastWrapping = wrappingComponents[wrappingComponents.length - 1];
        console.log({ firstWrapping: lastWrapping });
        if (lastWrapping?.length > 0) {
            const innerWrapping = lastWrapping[0];
            console.log({ innerWrapping });
            if (typeof innerWrapping === "string") {
                return {
                    foundComponentType: true as const,
                    componentType: innerWrapping,
                };
            }
        }
    }

    return { foundComponentType: false as const };
}

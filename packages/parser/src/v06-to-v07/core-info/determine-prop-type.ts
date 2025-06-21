import { createComponentInfoObjects } from "@doenet/doenetml-worker-javascript";

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
    /**
     * The number of indices accessed in the prop. For example `$foo.bar[1][1]` has 2 indices.
     */
    nIndices = 0,
) {
    const publicStateVariableInfo =
        componentInfoObjects.publicStateVariableInfo[componentType];

    if (!publicStateVariableInfo) {
        throw Error(`"${componentType}" is not a valid component type`);
    }

    // If `propName` is an alias, replace with its target
    const varName = publicStateVariableInfo.aliases[propName] ?? propName;

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
                    prefixInfo.numDimensions,
                    nIndices,
                );
                if (wrapResult.foundComponentType) {
                    return wrapResult.componentType;
                }

                if (nIndices <= prefixInfo.numDimensions) {
                    // otherwise, use the component type of the array itself
                    return publicStateVariableInfo.stateVariableDescriptions[
                        prefixInfo.arrayVariableName
                    ].createComponentOfType;
                } else {
                    throw Error(
                        `"${propName}" with ${nIndices} indices is not a valid prop for a component of type ${componentType} as ${propName} has fewer than ${nIndices} dimensions`,
                    );
                }
            }
        }

        throw Error(
            `"${propName}" is not a valid prop name of a component of type ${componentType}`,
        );
    }

    if (stateVarInfo.isArray) {
        if (stateVarInfo.wrappingComponents) {
            const wrapResult = componentTypeFromWrapping(
                stateVarInfo.wrappingComponents,
                stateVarInfo.numDimensions ?? 1,
                nIndices,
            );
            if (wrapResult.foundComponentType) {
                return wrapResult.componentType;
            }
        }

        if (nIndices > (stateVarInfo.numDimensions ?? 1)) {
            throw Error(
                `"${propName}" with ${nIndices} indices is not a valid prop for a component of type ${componentType} as ${propName} has fewer than ${nIndices} dimensions`,
            );
        }
    } else if (nIndices > 0) {
        throw Error(
            `"${propName}" with ${nIndices} indices is not a valid prop for a component of type ${componentType} as ${propName} is not an array`,
        );
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
    nDimensions: number,
    nIndices: number,
) {
    if (wrappingComponents.length > 0) {
        const lastWrapping =
            wrappingComponents[
                Math.min(
                    nDimensions - 1 - nIndices,
                    wrappingComponents.length - 1,
                )
            ];
        if (lastWrapping?.length > 0) {
            const innerWrapping = lastWrapping[0];
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

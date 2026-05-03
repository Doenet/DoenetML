// Pure string utilities for resolving state variable names: case-insensitive
// matching, public-only filtering, alias substitution, and array entry detection.
//
// Core wraps these so existing callers like
// `core.publicCaseInsensitiveAliasSubstitutions(args)` and the by-reference
// passes used in composite sugar functions keep working.

export function findCaseInsensitiveMatches({
    stateVariables,
    componentClass,
    componentInfoObjects,
}: {
    stateVariables: string[];
    componentClass: any;
    componentInfoObjects: any;
}): string[] {
    let stateVarInfo =
        componentInfoObjects.stateVariableInfo[componentClass.componentType];

    let newVariables: string[] = [];

    for (let stateVariable of stateVariables) {
        let foundMatch = false;

        let lowerCaseVarName = stateVariable.toLowerCase();

        for (let varName in stateVarInfo.stateVariableDescriptions) {
            if (lowerCaseVarName === varName.toLowerCase()) {
                foundMatch = true;
                newVariables.push(varName);
                break;
            }
        }

        if (foundMatch) {
            continue;
        }

        let isArraySize = false;
        let lowerCaseNameMinusSize = lowerCaseVarName;
        if (lowerCaseVarName.substring(0, 13) === "__array_size_") {
            isArraySize = true;
            lowerCaseNameMinusSize = lowerCaseVarName.substring(13);
        }

        for (let aliasName in stateVarInfo.aliases) {
            if (lowerCaseNameMinusSize === aliasName.toLowerCase()) {
                // don't substitute alias here, just fix case
                if (isArraySize) {
                    aliasName = "__array_size_" + aliasName;
                }
                newVariables.push(aliasName);
                foundMatch = true;
                break;
            }
        }
        if (foundMatch) {
            continue;
        }

        let arrayEntryPrefixesLongestToShortest = Object.keys(
            stateVarInfo.arrayEntryPrefixes,
        ).sort((a, b) => b.length - a.length);
        for (let prefix of arrayEntryPrefixesLongestToShortest) {
            if (
                lowerCaseVarName.substring(0, prefix.length) ===
                prefix.toLowerCase()
            ) {
                // TODO: the varEnding is still a case-sensitive match
                // Should we require that getArrayKeysFromVarName have
                // a case-insensitive mode?
                let arrayVariableName =
                    stateVarInfo.arrayEntryPrefixes[prefix].arrayVariableName;
                let arrayStateVarDescription =
                    stateVarInfo.stateVariableDescriptions[arrayVariableName];
                let arrayKeys =
                    arrayStateVarDescription.getArrayKeysFromVarName({
                        arrayEntryPrefix: prefix,
                        varEnding: stateVariable.substring(prefix.length),
                        numDimensions: arrayStateVarDescription.numDimensions,
                    });
                if (arrayKeys.length > 0) {
                    let newVarName =
                        prefix + lowerCaseVarName.substring(prefix.length);
                    foundMatch = true;
                    newVariables.push(newVarName);
                    break;
                }
            }
        }

        if (foundMatch) {
            continue;
        }

        // no match, so don't alter
        newVariables.push(stateVariable);
    }

    return newVariables;
}

export function matchPublicStateVariables({
    stateVariables,
    componentClass,
    componentInfoObjects,
}: {
    stateVariables: string[];
    componentClass: any;
    componentInfoObjects: any;
}): string[] {
    let stateVarInfo =
        componentInfoObjects.publicStateVariableInfo[
            componentClass.componentType
        ];

    let newVariables: string[] = [];

    for (let stateVariable of stateVariables) {
        if (stateVariable in stateVarInfo.stateVariableDescriptions) {
            // found public
            newVariables.push(stateVariable);
            continue;
        }

        let varName = stateVariable;

        if (varName in stateVarInfo.aliases) {
            varName = stateVarInfo.aliases[varName];

            // check again to see if alias is public
            if (varName in stateVarInfo.stateVariableDescriptions) {
                // found public
                newVariables.push(varName);
                continue;
            }
        }

        let foundMatch = false;

        let arrayEntryPrefixesLongestToShortest = Object.keys(
            stateVarInfo.arrayEntryPrefixes,
        ).sort((a, b) => b.length - a.length);
        for (let prefix of arrayEntryPrefixesLongestToShortest) {
            if (varName.substring(0, prefix.length) === prefix) {
                let arrayVariableName =
                    stateVarInfo.arrayEntryPrefixes[prefix].arrayVariableName;
                let arrayStateVarDescription =
                    stateVarInfo.stateVariableDescriptions[arrayVariableName];
                let arrayKeys =
                    arrayStateVarDescription.getArrayKeysFromVarName({
                        arrayEntryPrefix: prefix,
                        varEnding: varName.substring(prefix.length),
                        numDimensions: arrayStateVarDescription.numDimensions,
                    });
                if (arrayKeys.length > 0) {
                    foundMatch = true;
                    break;
                }
            }
        }

        if (foundMatch) {
            newVariables.push(stateVariable);
        } else {
            // no match, so make it a name that won't match
            newVariables.push("__not_public_" + stateVariable);
        }
    }

    return newVariables;
}

export function substituteAliases({
    stateVariables,
    componentClass,
    componentInfoObjects,
}: {
    stateVariables: string[];
    componentClass: any;
    componentInfoObjects: any;
}): string[] {
    let newVariables: string[] = [];

    let stateVarInfo =
        componentInfoObjects.stateVariableInfo[componentClass.componentType];

    for (let stateVariable of stateVariables) {
        let isArraySize = false;
        if (stateVariable.substring(0, 13) === "__array_size_") {
            isArraySize = true;
            stateVariable = stateVariable.substring(13);
        }
        stateVariable =
            stateVariable in stateVarInfo.aliases
                ? stateVarInfo.aliases[stateVariable]
                : stateVariable;
        if (isArraySize) {
            stateVariable = "__array_size_" + stateVariable;
        }
        newVariables.push(stateVariable);
    }

    return newVariables;
}

export function publicCaseInsensitiveAliasSubstitutions({
    stateVariables,
    componentClass,
    componentInfoObjects,
}: {
    stateVariables: string[];
    componentClass: any;
    componentInfoObjects: any;
}): string[] {
    let mappedVarNames = findCaseInsensitiveMatches({
        stateVariables,
        componentClass,
        componentInfoObjects,
    });

    mappedVarNames = matchPublicStateVariables({
        stateVariables: mappedVarNames,
        componentClass,
        componentInfoObjects,
    });

    mappedVarNames = substituteAliases({
        stateVariables: mappedVarNames,
        componentClass,
        componentInfoObjects,
    });

    return mappedVarNames;
}

export function checkIfArrayEntry({
    stateVariable,
    component,
}: {
    stateVariable: string;
    component: any;
}):
    | {
          isArrayEntry: true;
          arrayVariableName: string;
          arrayEntryPrefix: string;
      }
    | { isArrayEntry: false } {
    // check if stateVariable begins when an arrayEntry
    for (let arrayEntryPrefix in component.arrayEntryPrefixes) {
        if (
            stateVariable.substring(0, arrayEntryPrefix.length) ===
            arrayEntryPrefix
        ) {
            let arrayVariableName =
                component.arrayEntryPrefixes[arrayEntryPrefix];
            let arrayStateVarObj = component.state[arrayVariableName];
            let arrayKeys = arrayStateVarObj.getArrayKeysFromVarName({
                arrayEntryPrefix,
                varEnding: stateVariable.substring(arrayEntryPrefix.length),
                numDimensions: arrayStateVarObj.numDimensions,
            });
            if (arrayKeys.length > 0) {
                return {
                    isArrayEntry: true,
                    arrayVariableName,
                    arrayEntryPrefix,
                };
            }
        }
    }

    return { isArrayEntry: false };
}

// Pure string utilities for resolving state variable names: public-only
// filtering, alias substitution, and array entry detection. A property name
// is matched exactly, as written (NAME-0, D51): `$P.X` of a point names
// nothing.
//
// Core wraps these so existing callers like
// `core.publicAliasSubstitutions(args)` and the by-reference
// passes used in composite sugar functions keep working.

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
            varName = stateVarInfo.aliases[varName].target;

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
                ? stateVarInfo.aliases[stateVariable].target
                : stateVariable;
        if (isArraySize) {
            stateVariable = "__array_size_" + stateVariable;
        }
        newVariables.push(stateVariable);
    }

    return newVariables;
}

export function publicAliasSubstitutions({
    stateVariables,
    componentClass,
    componentInfoObjects,
}: {
    stateVariables: string[];
    componentClass: any;
    componentInfoObjects: any;
}): string[] {
    let mappedVarNames = matchPublicStateVariables({
        stateVariables,
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
    // check if stateVariable begins with an array entry
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

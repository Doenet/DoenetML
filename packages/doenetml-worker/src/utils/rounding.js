export function returnRoundingStateVariableDefinitions({
    childGroupsIfSingleMatch = [],
    childGroupsToStopSingleMatch = [],
    additionalAttributeComponent = null,
    displayDigitsDefault = 3,
    displaySmallAsZeroDefault = 1e-14,
} = {}) {
    let stateVariableDefinitions = {};

    stateVariableDefinitions.displayDigits = {
        public: true,
        shadowingInstructions: {
            createComponentOfType: "integer",
        },
        hasEssential: true,
        defaultValue: displayDigitsDefault,
        returnDependencies: roundingDependencies({
            stateVariable: "displayDigits",
            childGroupsIfSingleMatch,
            childGroupsToStopSingleMatch,
            ignoreShadowsIfHaveAttribute: "displayDecimals",
            additionalAttributeComponent,
        }),
        definition: roundingDefinition({
            stateVariable: "displayDigits",
            valueIfIgnore: 0,
        }),
    };

    stateVariableDefinitions.displayDecimals = {
        public: true,
        shadowingInstructions: {
            createComponentOfType: "integer",
        },
        hasEssential: true,
        defaultValue: 2,
        returnDependencies: roundingDependencies({
            stateVariable: "displayDecimals",
            childGroupsIfSingleMatch,
            childGroupsToStopSingleMatch,
            ignoreShadowsIfHaveAttribute: "displayDigits",
            additionalAttributeComponent,
        }),
        definition: roundingDefinition({
            stateVariable: "displayDecimals",
            valueIfIgnore: -Infinity,
        }),
    };

    stateVariableDefinitions.displaySmallAsZero = {
        public: true,
        shadowingInstructions: {
            createComponentOfType: "number",
        },
        hasEssential: true,
        defaultValue: displaySmallAsZeroDefault,
        returnDependencies: roundingDependencies({
            stateVariable: "displaySmallAsZero",
            childGroupsIfSingleMatch,
            childGroupsToStopSingleMatch,
            additionalAttributeComponent,
        }),
        definition: roundingDefinition({
            stateVariable: "displaySmallAsZero",
        }),
    };

    stateVariableDefinitions.padZeros = {
        public: true,
        shadowingInstructions: {
            createComponentOfType: "boolean",
        },
        hasEssential: true,
        defaultValue: false,
        returnDependencies: roundingDependencies({
            stateVariable: "padZeros",
            childGroupsIfSingleMatch,
            childGroupsToStopSingleMatch,
            additionalAttributeComponent,
        }),
        definition: roundingDefinition({
            stateVariable: "padZeros",
        }),
    };

    return stateVariableDefinitions;
}

function roundingDependencies({
    stateVariable,
    childGroupsIfSingleMatch,
    childGroupsToStopSingleMatch,
    ignoreShadowsIfHaveAttribute = null,
    additionalAttributeComponent = null,
}) {
    return function () {
        let dependencies = {
            attribute: {
                dependencyType: "attributeComponent",
                attributeName: stateVariable,
                variableNames: ["value"],
            },
            singleMatchChildren: {
                dependencyType: "child",
                childGroups: childGroupsIfSingleMatch,
                variableNames: [stateVariable],
                variablesOptional: true,
            },
            stopSingleMatchChildren: {
                dependencyType: "child",
                childGroups: childGroupsToStopSingleMatch,
            },
        };

        if (ignoreShadowsIfHaveAttribute) {
            dependencies.attributePromptingIgnore = {
                dependencyType: "attributeComponent",
                attributeName: ignoreShadowsIfHaveAttribute,
                variableNames: ["value"],
                dontRecurseToShadowsIfHaveAttribute: stateVariable,
            };

            dependencies.attribute.dontRecurseToShadowsIfHaveAttribute =
                ignoreShadowsIfHaveAttribute;
        }

        if (additionalAttributeComponent) {
            dependencies.additionalAttribute = {
                dependencyType: "attributeComponent",
                attributeName: additionalAttributeComponent,
                variableNames: [stateVariable],
            };
        }
        return dependencies;
    };
}

function roundingDefinition({ stateVariable, valueIfIgnore = null }) {
    return function ({ dependencyValues, usedDefault }) {
        let foundDefaultValue = false;
        let theDefaultValueFound;

        if (dependencyValues.attribute) {
            if (usedDefault.attribute?.value) {
                foundDefaultValue = true;
                theDefaultValueFound =
                    dependencyValues.attribute.stateValues.value;
            } else {
                return {
                    setValue: {
                        [stateVariable]:
                            dependencyValues.attribute.stateValues.value,
                    },
                };
            }
        } else if (dependencyValues.attributePromptingIgnore) {
            if (usedDefault.attributePromptingIgnore?.value) {
                foundDefaultValue = true;
                theDefaultValueFound = valueIfIgnore;
            } else {
                return {
                    setValue: {
                        [stateVariable]: valueIfIgnore,
                    },
                };
            }
        } else if (dependencyValues.additionalAttribute) {
            if (usedDefault.additionalAttribute?.[stateVariable]) {
                foundDefaultValue = true;
                theDefaultValueFound =
                    dependencyValues.additionalAttribute.stateValues[
                        stateVariable
                    ];
            } else {
                return {
                    setValue: {
                        [stateVariable]:
                            dependencyValues.additionalAttribute.stateValues[
                                stateVariable
                            ],
                    },
                };
            }
        }

        if (
            dependencyValues.singleMatchChildren.length === 1 &&
            dependencyValues.stopSingleMatchChildren.length === 0 &&
            dependencyValues.singleMatchChildren[0].stateValues[
                stateVariable
            ] !== undefined
        ) {
            if (usedDefault.singleMatchChildren[0]?.[stateVariable]) {
                foundDefaultValue = true;
                theDefaultValueFound =
                    dependencyValues.singleMatchChildren[0].stateValues[
                        stateVariable
                    ];
            } else {
                return {
                    setValue: {
                        [stateVariable]:
                            dependencyValues.singleMatchChildren[0].stateValues[
                                stateVariable
                            ],
                    },
                };
            }
        }

        if (foundDefaultValue) {
            return {
                useEssentialOrDefaultValue: {
                    [stateVariable]: { defaultValue: theDefaultValueFound },
                },
            };
        } else {
            return { useEssentialOrDefaultValue: { [stateVariable]: true } };
        }
    };
}

export function returnRoundingAttributes() {
    return {
        displayDigits: {
            createComponentOfType: "integer",
        },
        displayDecimals: {
            createComponentOfType: "integer",
        },
        displaySmallAsZero: {
            createComponentOfType: "number",
            valueForTrue: 1e-14,
            valueForFalse: 0,
        },
        padZeros: {
            createComponentOfType: "boolean",
        },
    };
}

// since state variable values are computed using more than attributes,
// (such as children or parents)
// we need to send the actual state variables as the attributes
// when shadowing public state variables
export function returnRoundingAttributeComponentShadowing() {
    let shadowing = {};
    for (let stateVariable in returnRoundingStateVariableDefinitions()) {
        shadowing[stateVariable] = {
            stateVariableToShadow: stateVariable,
            // if used in an array state variable that has wrapping components
            // add the attribute to the outer component
            // rather than the inner components (the default)
            addToOuterIfWrappedArray: true,
        };
    }
    return shadowing;
}

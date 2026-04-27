export function returnNumberDisplayStateVariableDefinitions({
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
        returnDependencies: numberDisplayDependencies({
            stateVariable: "displayDigits",
            childGroupsIfSingleMatch,
            childGroupsToStopSingleMatch,
            ignoreShadowsIfHaveAttribute: "displayDecimals",
            additionalAttributeComponent,
        }),
        definition: numberDisplayDefinition({
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
        returnDependencies: numberDisplayDependencies({
            stateVariable: "displayDecimals",
            childGroupsIfSingleMatch,
            childGroupsToStopSingleMatch,
            ignoreShadowsIfHaveAttribute: "displayDigits",
            additionalAttributeComponent,
        }),
        definition: numberDisplayDefinition({
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
        returnDependencies: numberDisplayDependencies({
            stateVariable: "displaySmallAsZero",
            childGroupsIfSingleMatch,
            childGroupsToStopSingleMatch,
            additionalAttributeComponent,
        }),
        definition: numberDisplayDefinition({
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
        returnDependencies: numberDisplayDependencies({
            stateVariable: "padZeros",
            childGroupsIfSingleMatch,
            childGroupsToStopSingleMatch,
            additionalAttributeComponent,
        }),
        definition: numberDisplayDefinition({
            stateVariable: "padZeros",
        }),
    };

    stateVariableDefinitions.avoidScientificNotation = {
        public: true,
        shadowingInstructions: {
            createComponentOfType: "boolean",
        },
        hasEssential: true,
        defaultValue: false,
        returnDependencies: numberDisplayDependencies({
            stateVariable: "avoidScientificNotation",
            childGroupsIfSingleMatch,
            childGroupsToStopSingleMatch,
            additionalAttributeComponent,
        }),
        definition: numberDisplayDefinition({
            stateVariable: "avoidScientificNotation",
        }),
    };

    stateVariableDefinitions.displayBlanks = {
        public: true,
        shadowingInstructions: {
            createComponentOfType: "boolean",
        },
        hasEssential: true,
        defaultValue: true,
        returnDependencies: numberDisplayDependencies({
            stateVariable: "displayBlanks",
            childGroupsIfSingleMatch,
            childGroupsToStopSingleMatch,
            additionalAttributeComponent,
        }),
        definition: numberDisplayDefinition({
            stateVariable: "displayBlanks",
        }),
    };

    return stateVariableDefinitions;
}

function numberDisplayDependencies({
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

function numberDisplayDefinition({ stateVariable, valueIfIgnore = null }) {
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

export function returnNumberDisplayAttributes() {
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
        avoidScientificNotation: {
            createComponentOfType: "boolean",
        },
        displayBlanks: {
            createComponentOfType: "boolean",
        },
    };
}

// since state variable values are computed using more than attributes,
// (such as children or parents)
// we need to send the actual state variables as the attributes
// when shadowing public state variables
export function returnNumberDisplayAttributeComponentShadowing() {
    let shadowing = {};
    for (let stateVariable in returnNumberDisplayStateVariableDefinitions()) {
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

export function buildNumberDisplayParameters({
    padZeros,
    displayDigits,
    displayDecimals,
    displayBlanks,
    avoidScientificNotation,
} = {}) {
    let params = {};

    if (padZeros) {
        if (Number.isFinite(displayDecimals)) {
            params.padToDecimals = displayDecimals;
        }
        if (displayDigits >= 1) {
            params.padToDigits = displayDigits;
        }
    }

    if (displayBlanks === false) {
        params.showBlanks = false;
    }

    if (avoidScientificNotation) {
        params.avoidScientificNotation = true;
    }

    return params;
}

/**
 * Gather the raw attributes (i.e., of type `unresolved`) in `component`
 * that are rounding attribute, with the addition of `fixed` and `isResponse`.
 *
 * If `component` extends or copies a list, then recurse to that list component,
 * to add attributes that were not yet encountered.
 *
 * Returns: an array of `UnresolvedAttribute`s.
 */
export function gatherRawRoundingFixedResponseAttributes(
    component,
    components,
) {
    const rawAttrNames = [
        "fixed",
        "isResponse",
        ...Object.keys(returnNumberDisplayAttributes()),
    ];

    let componentForRawAttributes = component;
    let attributesToConvert = {};

    while (rawAttrNames.length > 0) {
        const attrsFound = [];
        for (const attr of rawAttrNames) {
            if (attr in componentForRawAttributes.attributes) {
                if (
                    componentForRawAttributes.attributes[attr].type ===
                    "unresolved"
                ) {
                    attributesToConvert[attr] =
                        componentForRawAttributes.attributes[attr];
                }
                attrsFound.push(attr);
                // displayDigits and displayDecimals are treated as a single unit,
                // so if either attribute is found, remove both when recurse
                if (attr === "displayDigits") {
                    attrsFound.push("displayDecimals");
                } else if (attr === "displayDecimals") {
                    attrsFound.push("displayDigits");
                }
            }
        }

        if (componentForRawAttributes.doenetAttributes.extendListViaComposite) {
            const composite =
                components[
                    componentForRawAttributes.doenetAttributes
                        .extendListViaComposite
                ];

            if (
                typeof composite.stateValues.extendIdx === "number" &&
                composite.stateValues.extendIdx !== -1
            ) {
                componentForRawAttributes =
                    components[composite.stateValues.extendIdx];
            } else {
                break;
            }
        } else if (
            componentForRawAttributes.doenetAttributes.copyListViaComposite
        ) {
            const composite =
                components[
                    componentForRawAttributes.doenetAttributes
                        .copyListViaComposite
                ];

            if (
                typeof composite.stateValues.extendIdx === "number" &&
                composite.stateValues.extendIdx !== -1
            ) {
                componentForRawAttributes =
                    components[composite.stateValues.extendIdx];
            } else {
                break;
            }
        } else {
            break;
        }

        for (const attr of attrsFound) {
            const idx = rawAttrNames.indexOf(attr);
            if (idx !== -1) {
                rawAttrNames.splice(idx, 1);
            }
        }
    }
    return attributesToConvert;
}

export function addShadowRoundingAttributes({
    nComponents,
    stateIdInfo,
    source,
    compositeIdx,
    attributes,
    componentInfoObjects,
}) {
    const sourceSVs =
        componentInfoObjects.publicStateVariableInfo[source.componentType]
            ?.stateVariableDescriptions;

    if (!sourceSVs) {
        return nComponents;
    }

    const roundingAttributes = returnNumberDisplayAttributes();

    const origAttrNames = Object.keys(attributes);

    for (const attrName in roundingAttributes) {
        if (origAttrNames.includes(attrName)) {
            continue;
        }
        if (
            (attrName === "displayDigits" &&
                origAttrNames.includes("displayDecimals")) ||
            (attrName === "displayDecimals" &&
                origAttrNames.includes("displayDigits"))
        ) {
            continue;
        }

        if (
            sourceSVs[attrName]?.createComponentOfType ===
            roundingAttributes[attrName].createComponentOfType
        ) {
            const shadowComponent = {
                type: "serialized",
                componentType:
                    roundingAttributes[attrName].createComponentOfType,
                componentIdx: nComponents++,
                stateId: stateIdInfo
                    ? `${stateIdInfo.prefix}${stateIdInfo.num++}`
                    : undefined,
                attributes: {},
                doenetAttributes: {},
                state: {},
                children: [],
                downstreamDependencies: {
                    [source.componentIdx]: [
                        {
                            compositeIdx,
                            dependencyType: "referenceShadow",
                            propVariable: attrName,
                        },
                    ],
                },
            };

            attributes[attrName] = {
                component: shadowComponent,
            };
        }
    }

    return nComponents;
}

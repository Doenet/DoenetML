/**
 * Returns DoenetML state variable definitions for all number-display attributes
 * (`displayDigits`, `displayDecimals`, `displaySmallAsZero`, `padZeros`,
 * `avoidScientificNotation`).
 *
 * Each state variable inherits its value through the following priority chain,
 * from highest to lowest:
 *   1. An explicit attribute on the component itself.
 *   2. The value of the corresponding state variable on the component named by
 *      `additionalAttributeComponent`, when provided.
 *   3. The matching state variable of a sole child in `childGroupsIfSingleMatch`,
 *      unless a child in `childGroupsToStopSingleMatch` is also present.
 *   4. The component's own essential value (or the configured default).
 *
 * @param {object}   [options]
 * @param {string[]} [options.childGroupsIfSingleMatch=[]]     Child groups
 *   whose sole member can donate its display settings to this component.
 * @param {string[]} [options.childGroupsToStopSingleMatch=[]] Child groups
 *   whose presence suppresses the single-child propagation above.
 * @param {string|null} [options.additionalAttributeComponent=null] Attribute
 *   name of a sibling attribute component whose number-display state variables
 *   should also be consulted (e.g. `"function"` in `<evaluate>`, so that
 *   display settings set on the referenced `<function>` are inherited by the
 *   `<evaluate>` result).
 * @param {number} [options.displayDigitsDefault=3]     Default for `displayDigits`.
 * @param {number} [options.displaySmallAsZeroDefault=1e-14] Default for
 *   `displaySmallAsZero`.
 * @returns {object} A map of state variable name → state variable definition.
 */
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

    return stateVariableDefinitions;
}

/**
 * Builds the `returnDependencies` function for a single number-display state
 * variable.
 *
 * The returned function, when called by the DoenetML state-variable system,
 * produces a dependency descriptor that wires up the component's own attribute,
 * the optional `additionalAttributeComponent`, and the optional single-child
 * propagation, with mutual-exclusion logic for `displayDigits`/`displayDecimals`.
 *
 * @param {object}      options
 * @param {string}      options.stateVariable               The state variable
 *   being defined (e.g. `"displayDigits"`).
 * @param {string[]}    options.childGroupsIfSingleMatch     See
 *   {@link returnNumberDisplayStateVariableDefinitions}.
 * @param {string[]}    options.childGroupsToStopSingleMatch See
 *   {@link returnNumberDisplayStateVariableDefinitions}.
 * @param {string|null} [options.ignoreShadowsIfHaveAttribute=null] When set,
 *   shadow-propagation of `stateVariable` is suppressed if the component has
 *   this other attribute set explicitly (used to implement the
 *   `displayDigits`/`displayDecimals` mutual-exclusion).
 * @param {string|null} [options.additionalAttributeComponent=null] See
 *   {@link returnNumberDisplayStateVariableDefinitions}.
 * @returns {function} A `returnDependencies` function suitable for a DoenetML
 *   state variable definition.
 */
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

/**
 * Builds the `definition` function for a single number-display state variable.
 *
 * Resolves the value using the dependency priority chain described in
 * {@link returnNumberDisplayStateVariableDefinitions}: explicit attribute first,
 * then `additionalAttributeComponent`, then single-match child, then the
 * essential/default value.
 *
 * @param {object}     options
 * @param {string}     options.stateVariable  The state variable being defined.
 * @param {*}          [options.valueIfIgnore=null] The value to use when the
 *   mutual-exclusion attribute (`ignoreShadowsIfHaveAttribute`) is present but
 *   carries only its default — typically `0` for `displayDigits` and `-Infinity`
 *   for `displayDecimals`.
 * @returns {function} A `definition` function suitable for a DoenetML state
 *   variable definition.
 */
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

/**
 * Returns the DoenetML attribute descriptor map for all number-display
 * attributes.  Pass the result to `Object.assign(attributes, ...)` inside a
 * component's static `returnAttributes()` to expose these attributes on that
 * component.
 *
 * Covered attributes:
 * - `displayDigits`          — significant digits to show (integer)
 * - `displayDecimals`        — decimal places to show (integer)
 * - `displaySmallAsZero`     — threshold below which a value is shown as 0
 *                              (number; `true` maps to 1e-14, `false` to 0)
 * - `padZeros`               — pad trailing zeros to match `displayDigits` /
 *                              `displayDecimals` (boolean)
 * - `avoidScientificNotation`— render large/small numbers in full decimal form
 *                              instead of scientific notation (boolean)
 *
 * @returns {object} Attribute descriptor map.
 */
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
    };
}

/**
 * Returns the attribute-component shadowing map for all number-display state
 * variables.
 *
 * Because number-display values are computed from more sources than just an
 * explicit attribute (e.g. they can be inherited from children or parents), the
 * resolved state variable — not the raw attribute — must be forwarded when
 * another component shadows this one.  Pass the result to
 * `Object.assign(shadowingInstructions.attributesToShadow, ...)` inside a
 * component's state variable definitions.
 *
 * The `addToOuterIfWrappedArray` flag ensures that when a number-display
 * attribute is used inside an array state variable with wrapping components, it
 * is attached to the outer component rather than each inner element.
 *
 * @returns {object} Shadowing descriptor map keyed by state variable name.
 */
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

/**
 * Converts the number-display state variable values held by a component into
 * a parameters object accepted by `MathExpression.toLatex()` and
 * `MathExpression.toString()`.
 *
 * This function does not perform numeric rounding itself. It only controls
 * display behavior (zero padding, blank placeholders, and scientific-notation
 * suppression), so call it where an already rounded value is being converted
 * to a string representation.
 *
 * Only the parameters that differ from those formatters' defaults are included
 * in the returned object, so callers can safely spread or pass it directly.
 *
 * @param {object}  [options]
 * @param {boolean} [options.padZeros]               When `true`, pad trailing
 *   zeros so numbers display exactly `displayDigits` significant digits or
 *   `displayDecimals` decimal places.
 * @param {number}  [options.displayDigits]           Number of significant
 *   digits (used only when `padZeros` is true).
 * @param {number}  [options.displayDecimals]         Number of decimal places
 *   (used only when `padZeros` is true).
 * @param {boolean} [options.avoidScientificNotation] When `true`, numbers that
 *   would normally render in scientific notation are written in full decimal
 *   form instead.
 * @returns {{ padToDecimals?: number, padToDigits?: number,
 *             avoidScientificNotation?: true }} Formatter
 *   parameter object.
 */
export function buildNumberDisplayParameters({
    padZeros,
    displayDigits,
    displayDecimals,
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

    if (avoidScientificNotation) {
        params.avoidScientificNotation = true;
    }

    return params;
}

/**
 * Collects the raw (i.e. `unresolved`) number-display attributes from
 * `component`, together with `fixed` and `isResponse`.
 *
 * When `component` extends or copies a list via a composite, the function
 * walks up the chain so that attributes declared on the source list are also
 * included for any not yet found on the current component.  This ensures list
 * items inherit display settings from their containing list even before the
 * component tree is fully resolved.
 *
 * @param {object} component   The serialized component whose attributes should
 *   be gathered.
 * @param {object} components  The full component map (indexed by componentIdx)
 *   used to follow extend/copy composite references.
 * @returns {object} A map of attribute name → `UnresolvedAttribute` for each
 *   number-display, `fixed`, or `isResponse` attribute found in unresolved
 *   form on `component` or its list source.
 */
export function gatherRawNumberDisplayFixedResponseAttributes(
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

/**
 * Injects shadow attribute components for any number-display attribute that the
 * `source` component exposes as a public state variable but that `attributes`
 * does not already define.
 *
 * This is used by composite components that distribute items from a list source
 * to ensure each generated item inherits the source's number-display settings
 * (e.g. so that a `<numberList displayDigits="5">` passes `displayDigits=5`
 * down to each `<number>` it creates).
 *
 * Skips an attribute when:
 * - It is already present in `attributes` (explicit override wins).
 * - `displayDigits` or `displayDecimals` is already set (they are treated as a
 *   mutually exclusive pair; setting one suppresses the shadow for the other).
 * - The source component does not expose a matching public state variable of
 *   the same component type.
 *
 * @param {object}  options
 * @param {number}  options.nComponents        Running component-index counter;
 *   incremented for each shadow component created.
 * @param {object|null} options.stateIdInfo    State-ID prefix/counter used to
 *   assign stable IDs to new shadow components, or `null` to skip ID
 *   assignment.
 * @param {object}  options.source             The source list component.
 * @param {number}  options.compositeIdx       Index of the composite that owns
 *   this expansion, used in downstream dependency descriptors.
 * @param {object}  options.attributes         The attribute map of the item
 *   component being built; mutated in place.
 * @param {object}  options.componentInfoObjects  Registry used to look up
 *   public state variable metadata for the source component type.
 * @returns {number} The updated `nComponents` counter.
 */
export function addShadowNumberDisplayAttributes({
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

    const numberDisplayAttrs = returnNumberDisplayAttributes();

    const origAttrNames = Object.keys(attributes);

    for (const attrName in numberDisplayAttrs) {
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
            numberDisplayAttrs[attrName].createComponentOfType
        ) {
            const shadowComponent = {
                type: "serialized",
                componentType:
                    numberDisplayAttrs[attrName].createComponentOfType,
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

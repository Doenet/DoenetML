import type { ComponentIdx } from "@doenet/utils";
import type Core from "./Core";
import { preprocessAttributesObject } from "./utils/attributes";

/**
 * Map from `attributeSpecification.createPrimitiveOfType` codes to the
 * component type used to shadow them. Codes that aren't listed (e.g.
 * `boolean`, `number`) shadow as themselves.
 */
const PRIMITIVE_TO_COMPONENT_TYPE: Record<string, string> = {
    string: "text",
    stringArray: "textList",
    numberArray: "numberList",
};

/**
 * Builds the synchronous state-variable *shape* (the schema-like definition
 * objects that say what each state variable depends on, how to compute it,
 * how to invert it, etc.) for a component class.
 *
 * Three sources of definitions are merged into one map:
 *   1. Attribute-derived state variables (one per `createStateVariable` attribute)
 *   2. The component class's own `returnNormalizedStateVariableDefinitions`
 *   3. Adapter or reference-shadow overrides, when a component is created as
 *      an adapter for another component or as a shadow of one
 *
 * The runtime side — wiring `getStateVariableValue` getters, resolving
 * dependencies, materializing array entries — is in `StateVariableInitializer`.
 *
 * Stateless — each function takes a back-reference to Core to read
 * `_components`, `componentInfoObjects`, and `numerics`, and to invoke
 * `checkIfArrayEntry` and `createFromArrayEntry`.
 * (`arrayVarNameFromArrayKey` is invoked on the per-variable `stateDef`,
 * not on Core.)
 */
export async function createStateVariableDefinitions({
    core,
    componentClass,
    prescribedDependencies,
    componentIdx,
}: {
    core: Core;
    componentClass: any;
    prescribedDependencies: Record<string, any[]> | undefined;
    componentIdx: ComponentIdx;
}): Promise<Record<string, any>> {
    let redefineDependencies;

    if (prescribedDependencies) {
        for (const idxStr in prescribedDependencies) {
            const idx = Number(idxStr);
            let depArray = prescribedDependencies[idx];
            for (let dep of depArray) {
                if (dep.dependencyType === "referenceShadow") {
                    if (idx === componentIdx) {
                        throw Error(
                            `Circular dependency involving ${componentIdx}.`,
                        );
                    }
                    redefineDependencies = {
                        linkSource: "referenceShadow",
                        targetIdx: idx,
                        compositeIdx: dep.compositeIdx,
                        propVariable: dep.propVariable,
                        fromImplicitProp: dep.fromImplicitProp,
                        arrayStateVariable: dep.arrayStateVariable,
                        arrayKey: dep.arrayKey,
                        ignorePrimaryStateVariable:
                            dep.ignorePrimaryStateVariable,
                        substituteForPrimaryStateVariable:
                            dep.substituteForPrimaryStateVariable,
                        firstLevelReplacement: dep.firstLevelReplacement,
                        additionalStateVariableShadowing:
                            dep.additionalStateVariableShadowing,
                    };
                } else if (dep.dependencyType === "adapter") {
                    redefineDependencies = {
                        linkSource: "adapter",
                        adapterTargetIdentity: dep.adapterTargetIdentity,
                        adapterVariable: dep.adapterVariable,
                        substituteForPrimaryStateVariable:
                            dep.substituteForPrimaryStateVariable,
                        stateVariablesToShadow: dep.stateVariablesToShadow,
                    };
                }
            }
        }
    }

    let stateVariableDefinitions = {};

    if (!redefineDependencies) {
        createAttributeStateVariableDefinitions({
            core,
            stateVariableDefinitions,
            componentClass,
        });
    }

    //  add state variable definitions from component class
    let newDefinitions =
        componentClass.returnNormalizedStateVariableDefinitions(core.numerics);

    Object.assign(stateVariableDefinitions, newDefinitions);

    if (redefineDependencies) {
        if (redefineDependencies.linkSource === "adapter") {
            createAdapterStateVariableDefinitions({
                core,
                redefineDependencies,
                stateVariableDefinitions,
                componentClass,
            });
        } else {
            await createReferenceShadowStateVariableDefinitions({
                core,
                redefineDependencies,
                stateVariableDefinitions,
                componentClass,
            });
        }
    }

    return stateVariableDefinitions;
}

/**
 * Build a state-variable definition for each attribute on `componentClass`
 * that has `createStateVariable` set. Used when the component is created
 * directly (i.e. not as an adapter or reference shadow); the resulting
 * variables read their value from the attribute component / primitive /
 * ref-resolutions, with optional fall-backs to a parent or
 * source-composite state variable.
 */
function createAttributeStateVariableDefinitions({
    core,
    componentClass,
    stateVariableDefinitions,
}: {
    core: Core;
    componentClass: any;
    stateVariableDefinitions: Record<string, any>;
}) {
    let attributes = preprocessAttributesObject(
        componentClass.createAttributesObject(),
    );

    for (let attrName in attributes) {
        let attributeSpecification = attributes[attrName];
        if (!attributeSpecification.createStateVariable) {
            continue;
        }

        let varName = attributeSpecification.createStateVariable;

        let stateVarDef = (stateVariableDefinitions[varName] = {
            isAttribute: true,
            hasEssential: true,
            provideEssentialValuesInDefinition: true,
        });

        if (attributeSpecification.public) {
            _setShadowingInstructionsFromAttribute(
                stateVarDef,
                attributeSpecification,
            );
        }

        let stateVariableForAttributeValue = _resolveAttributeValueVariable(
            core,
            attributeSpecification,
            attrName,
            componentClass,
        );

        stateVarDef.returnDependencies = function () {
            let dependencies = {};
            if (attributeSpecification.fallBackToParentStateVariable) {
                dependencies.parentValue = {
                    dependencyType: "parentStateVariable",
                    variableName:
                        attributeSpecification.fallBackToParentStateVariable,
                };
            }
            if (attributeSpecification.fallBackToSourceCompositeStateVariable) {
                dependencies.sourceCompositeValue = {
                    dependencyType: "sourceCompositeStateVariable",
                    variableName:
                        attributeSpecification.fallBackToSourceCompositeStateVariable,
                };
            }
            if (attributeSpecification.createPrimitiveOfType) {
                dependencies.attributePrimitive = {
                    dependencyType: "attributePrimitive",
                    attributeName: attrName,
                };
            } else if (attributeSpecification.createReferences) {
                dependencies.attributeRefResolutions = {
                    dependencyType: "attributeRefResolutions",
                    attributeName: attrName,
                };
            } else {
                dependencies.attributeComponent = {
                    dependencyType: "attributeComponent",
                    attributeName: attrName,
                    variableNames: [stateVariableForAttributeValue],
                };
            }

            return dependencies;
        };

        const { definition, inverseDefinition } =
            _buildAttributeDerivedDefinitions({
                varName,
                stateVariableForAttributeValue,
                attributeSpecification,
                attrName,
            });
        stateVarDef.definition = definition;
        if (!attributeSpecification.noInverse) {
            stateVarDef.inverseDefinition = inverseDefinition;
        }

        _copyPassthroughAttributes(stateVarDef, attributeSpecification, {
            includeTriggerActionOnChange: true,
        });
    }
}

/**
 * Override `stateVariableDefinitions` for a component being created as an
 * adapter for another component. Attribute-derived variables shadow the
 * adapter target's matching state variable (if it exists), and the
 * primary state variable is rewired to read from
 * `redefineDependencies.adapterVariable`. Variables in
 * `stateVariablesToShadow` are subsequently rewritten via
 * `modifyStateDefsToBeShadows`.
 */
function createAdapterStateVariableDefinitions({
    core,
    redefineDependencies,
    stateVariableDefinitions,
    componentClass,
}: {
    core: Core;
    redefineDependencies: any;
    stateVariableDefinitions: Record<string, any>;
    componentClass: any;
}) {
    // attributes depend on adapterTarget (if attribute exists in adapterTarget)
    let adapterTargetComponent =
        core._components[
            redefineDependencies.adapterTargetIdentity.componentIdx
        ];

    let attributes = preprocessAttributesObject(
        componentClass.createAttributesObject(),
    );

    for (let attrName in attributes) {
        let attributeSpecification = attributes[attrName];
        if (!attributeSpecification.createStateVariable) {
            continue;
        }

        let varName = attributeSpecification.createStateVariable;

        let stateVarDef = (stateVariableDefinitions[varName] = {
            isAttribute: true,
            hasEssential: true,
        });

        if (attributeSpecification.public) {
            _setShadowingInstructionsFromAttribute(
                stateVarDef,
                attributeSpecification,
            );
        }

        if (varName in adapterTargetComponent.state) {
            stateVarDef.returnDependencies = () => ({
                adapterTargetVariable: {
                    dependencyType: "stateVariable",
                    componentIdx:
                        redefineDependencies.adapterTargetIdentity.componentIdx,
                    variableName: varName,
                },
            });
        } else {
            stateVarDef.returnDependencies = () => ({});
        }

        stateVarDef.definition = function ({ dependencyValues, usedDefault }) {
            if (
                dependencyValues.adapterTargetVariable === undefined ||
                usedDefault.adapterTargetVariable
            ) {
                return {
                    useEssentialOrDefaultValue: {
                        [varName]: true,
                    },
                    checkForActualChange: { [varName]: true },
                };
            } else {
                return {
                    setValue: {
                        [varName]: dependencyValues.adapterTargetVariable,
                    },
                    checkForActualChange: { [varName]: true },
                };
            }
        };

        if (!attributeSpecification.noInverse) {
            stateVarDef.inverseDefinition = async function ({
                desiredStateVariableValues,
                dependencyValues,
            }) {
                if (dependencyValues.adapterTargetVariable === undefined) {
                    return {
                        success: true,
                        instructions: [
                            {
                                setEssentialValue: varName,
                                value: desiredStateVariableValues[varName],
                            },
                        ],
                    };
                } else {
                    return {
                        success: true,
                        instructions: [
                            {
                                setDependency: "adapterTargetVariable",
                                desiredValue:
                                    desiredStateVariableValues[varName],
                            },
                        ],
                    };
                }
            };
        }

        _copyPassthroughAttributes(stateVarDef, attributeSpecification);
    }

    // primaryStateVariableForDefinition is the state variable that the componentClass
    // being created has specified should be given the value when it
    // is created from an outside source like a reference to a prop or an adapter
    let primaryStateVariableForDefinition = "value";
    if (redefineDependencies.substituteForPrimaryStateVariable) {
        primaryStateVariableForDefinition =
            redefineDependencies.substituteForPrimaryStateVariable;
    } else if (componentClass.primaryStateVariableForDefinition) {
        primaryStateVariableForDefinition =
            componentClass.primaryStateVariableForDefinition;
    }
    let stateDef = stateVariableDefinitions[primaryStateVariableForDefinition];
    stateDef.isShadow = true;
    stateDef.returnDependencies = () => ({
        adapterTargetVariable: {
            dependencyType: "stateVariable",
            componentIdx:
                redefineDependencies.adapterTargetIdentity.componentIdx,
            variableName: redefineDependencies.adapterVariable,
        },
    });
    if (stateDef.set) {
        stateDef.definition = function ({ dependencyValues }) {
            return {
                setValue: {
                    [primaryStateVariableForDefinition]: stateDef.set(
                        dependencyValues.adapterTargetVariable,
                    ),
                },
            };
        };
    } else {
        stateDef.definition = function ({ dependencyValues }) {
            return {
                setValue: {
                    [primaryStateVariableForDefinition]:
                        dependencyValues.adapterTargetVariable,
                },
            };
        };
    }
    stateDef.inverseDefinition = function ({ desiredStateVariableValues }) {
        return {
            success: true,
            instructions: [
                {
                    setDependency: "adapterTargetVariable",
                    desiredValue:
                        desiredStateVariableValues[
                            primaryStateVariableForDefinition
                        ],
                },
            ],
        };
    };

    if (redefineDependencies.stateVariablesToShadow) {
        modifyStateDefsToBeShadows({
            stateVariablesToShadow: redefineDependencies.stateVariablesToShadow,
            stateVariableDefinitions,
            targetComponent: adapterTargetComponent,
        });
    }
}

/**
 * Override `stateVariableDefinitions` for a component being created as a
 * reference shadow of another component (via `<copy>` / prop reference /
 * implicit prop / etc.).
 *
 * Two sub-flows:
 *   - `propVariable` is set: the shadow points at a single prop on the
 *     target. The primary state variable becomes a thin shadow of that
 *     prop (unless `ignorePrimaryStateVariable`), other variables are
 *     left alone, and only `shadowVariable`/`isShadow` flagged variables
 *     and any explicit `additionalStateVariableShadowing` are made into
 *     shadows.
 *   - no `propVariable`: the shadow points at the whole target component.
 *     `readyToExpandWhenResolved` is augmented to also wait on the
 *     target's, and every `shadowVariable`/`isShadow` flagged variable
 *     in the target is shadowed.
 *
 * May be `await`ed because it can call into `core.createFromArrayEntry`
 * to materialize an array-entry prop on the target before shadowing it.
 */
async function createReferenceShadowStateVariableDefinitions({
    core,
    redefineDependencies,
    stateVariableDefinitions,
    componentClass,
}: {
    core: Core;
    redefineDependencies: any;
    stateVariableDefinitions: Record<string, any>;
    componentClass: any;
}) {
    let targetComponent = core._components[redefineDependencies.targetIdx];

    if (redefineDependencies.propVariable) {
        // if we have an array entry state variable that hasn't been created yet
        // create it now
        if (
            !targetComponent.state[redefineDependencies.propVariable] &&
            core.checkIfArrayEntry({
                stateVariable: redefineDependencies.propVariable,
                component: targetComponent,
            }).isArrayEntry
        ) {
            await core.createFromArrayEntry({
                stateVariable: redefineDependencies.propVariable,
                component: targetComponent,
            });
        }
    }

    // attributes depend
    // - first on attributes from component attribute components, if they exist
    // - then on targetComponent (if not copying a prop and attribute exists in targetComponent)

    let attributes = preprocessAttributesObject(
        componentClass.createAttributesObject(),
    );

    for (let attrName in attributes) {
        let attributeSpecification = attributes[attrName];
        let varName = attributeSpecification.createStateVariable;
        if (!varName) {
            continue;
        }

        let stateVarDef = (stateVariableDefinitions[varName] = {
            isAttribute: true,
            hasEssential: true,
            provideEssentialValuesInDefinition: true,
        });

        let attributeFromPrimitive =
            !attributeSpecification.createComponentOfType;

        if (attributeSpecification.public) {
            _setShadowingInstructionsFromAttribute(
                stateVarDef,
                attributeSpecification,
            );
        }

        let stateVariableForAttributeValue = _resolveAttributeValueVariable(
            core,
            attributeSpecification,
            attrName,
            componentClass,
        );

        let thisDependencies = {};

        if (attributeSpecification.createPrimitiveOfType) {
            thisDependencies.attributePrimitive = {
                dependencyType: "attributePrimitive",
                attributeName: attrName,
            };
        } else if (attributeSpecification.createReferences) {
            thisDependencies.attributeRefResolutions = {
                dependencyType: "attributeRefResolutions",
                attributeName: attrName,
            };
        } else {
            thisDependencies.attributeComponent = {
                dependencyType: "attributeComponent",
                attributeName: attrName,
                variableNames: [stateVariableForAttributeValue],
            };
        }

        if (attributeSpecification.fallBackToParentStateVariable) {
            thisDependencies.parentValue = {
                dependencyType: "parentStateVariable",
                variableName:
                    attributeSpecification.fallBackToParentStateVariable,
            };
        }
        if (attributeSpecification.fallBackToSourceCompositeStateVariable) {
            thisDependencies.sourceCompositeValue = {
                dependencyType: "sourceCompositeStateVariable",
                variableName:
                    attributeSpecification.fallBackToSourceCompositeStateVariable,
            };
        }

        stateVarDef.returnDependencies = () => thisDependencies;

        const { definition, inverseDefinition } =
            _buildAttributeDerivedDefinitions({
                varName,
                stateVariableForAttributeValue,
                attributeSpecification,
                attrName,
            });
        stateVarDef.definition = definition;
        if (!attributeSpecification.noInverse) {
            stateVarDef.inverseDefinition = inverseDefinition;
        }

        _copyPassthroughAttributes(stateVarDef, attributeSpecification);
    }

    if (redefineDependencies.propVariable) {
        if (!redefineDependencies.ignorePrimaryStateVariable) {
            // primaryStateVariableForDefinition is the state variable that the componentClass
            // being created has specified should be given the value when it
            // is created from an outside source like a reference to a prop or an adapter
            let primaryStateVariableForDefinition = "value";
            if (redefineDependencies.substituteForPrimaryStateVariable) {
                primaryStateVariableForDefinition =
                    redefineDependencies.substituteForPrimaryStateVariable;
            } else if (componentClass.primaryStateVariableForDefinition) {
                primaryStateVariableForDefinition =
                    componentClass.primaryStateVariableForDefinition;
            }
            let stateDef =
                stateVariableDefinitions[primaryStateVariableForDefinition];
            if (!stateDef) {
                if (redefineDependencies.substituteForPrimaryStateVariable) {
                    throw Error(
                        `Invalid public state variable of componentType ${componentClass.componentType}: substituteForPrimaryStateVariable ${redefineDependencies.substituteForPrimaryStateVariable} does not exist`,
                    );
                } else {
                    throw Error(
                        `Cannot have a public state variable with componentType ${componentClass.componentType} as the class doesn't have a primary state variable for definition`,
                    );
                }
            }
            stateDef.isShadow = true;
            stateDef.returnDependencies = () => ({
                targetVariable: {
                    dependencyType: "stateVariable",
                    componentIdx: targetComponent.componentIdx,
                    variableName: redefineDependencies.propVariable,
                },
            });

            let setDefault = false;
            if (
                targetComponent.state[redefineDependencies.propVariable]
                    .defaultValue !== undefined
            ) {
                stateDef.defaultValue =
                    targetComponent.state[
                        redefineDependencies.propVariable
                    ].defaultValue;
                if (stateDef.set) {
                    stateDef.defaultValue = stateDef.set(stateDef.defaultValue);
                }
                stateDef.hasEssential = true;
                setDefault = true;
            }

            let targetVariableIsArray =
                targetComponent.state[redefineDependencies.propVariable]
                    .isArray;

            if (stateDef.set) {
                stateDef.definition = function ({
                    dependencyValues,
                    usedDefault,
                }) {
                    let targetVariable = dependencyValues.targetVariable;
                    if (
                        targetVariable === undefined ||
                        (targetVariableIsArray && targetVariable.length === 0)
                    ) {
                        // allow for case where we depend on array entry that does not yet exist
                        return {
                            useEssentialOrDefaultValue: {
                                [primaryStateVariableForDefinition]: true,
                            },
                        };
                    }
                    let valueFromTarget = stateDef.set(targetVariable);
                    if (setDefault && usedDefault.targetVariable) {
                        return {
                            useEssentialOrDefaultValue: {
                                [primaryStateVariableForDefinition]: {
                                    defaultValue: valueFromTarget,
                                },
                            },
                        };
                    }
                    return {
                        setValue: {
                            [primaryStateVariableForDefinition]:
                                valueFromTarget,
                        },
                    };
                };
            } else {
                stateDef.definition = function ({
                    dependencyValues,
                    usedDefault,
                }) {
                    let targetVariable = dependencyValues.targetVariable;
                    if (
                        targetVariable === undefined ||
                        (targetVariableIsArray && targetVariable.length === 0)
                    ) {
                        // allow for case where we depend on array entry that does not yet exist
                        return {
                            useEssentialOrDefaultValue: {
                                [primaryStateVariableForDefinition]: true,
                            },
                        };
                    }
                    if (setDefault && usedDefault.targetVariable) {
                        return {
                            useEssentialOrDefaultValue: {
                                [primaryStateVariableForDefinition]: {
                                    defaultValue: targetVariable,
                                },
                            },
                        };
                    }
                    return {
                        setValue: {
                            [primaryStateVariableForDefinition]: targetVariable,
                        },
                    };
                };
            }
            stateDef.inverseDefinition = function ({
                desiredStateVariableValues,
            }) {
                return {
                    success: true,
                    instructions: [
                        {
                            setDependency: "targetVariable",
                            desiredValue:
                                desiredStateVariableValues[
                                    primaryStateVariableForDefinition
                                ],
                        },
                    ],
                };
            };
        }

        let shadowStandardVariables = false;
        let stateVariablesToShadow = [];
        if (targetComponent.constructor.implicitPropReturnsSameType) {
            if (redefineDependencies.fromImplicitProp) {
                shadowStandardVariables = true;
            }

            // shadow any variables marked as shadowVariable
            for (let varName in targetComponent.state) {
                let stateObj = targetComponent.state[varName];
                if (stateObj.shadowVariable || stateObj.isShadow) {
                    stateVariablesToShadow.push(varName);
                }
            }
        }

        if (redefineDependencies.additionalStateVariableShadowing) {
            // since using parallel arrays, start with empty array to match next indices
            let differentStateVariablesInTarget = Array(
                stateVariablesToShadow.length,
            );
            for (let varName in redefineDependencies.additionalStateVariableShadowing) {
                if (!stateVariablesToShadow.includes(varName)) {
                    stateVariablesToShadow.push(varName);
                    differentStateVariablesInTarget.push(
                        redefineDependencies.additionalStateVariableShadowing[
                            varName
                        ].stateVariableToShadow,
                    );
                }
            }

            modifyStateDefsToBeShadows({
                stateVariablesToShadow,
                stateVariableDefinitions,
                targetComponent,
                differentStateVariablesInTarget,
            });
        } else if (shadowStandardVariables) {
            modifyStateDefsToBeShadows({
                stateVariablesToShadow,
                stateVariableDefinitions,
                targetComponent,
            });
        }

        // for referencing a prop variable, don't shadow standard state variables
        // (unless except for above cases)
        // so just return now
        return;
    }

    let foundReadyToExpandWhenResolved = false;
    if ("readyToExpandWhenResolved" in stateVariableDefinitions) {
        // if shadowing a composite
        // make readyToExpandWhenResolved depend on the same variable
        // of the targetComponent also being resolved

        foundReadyToExpandWhenResolved = true;

        let stateDef = stateVariableDefinitions.readyToExpandWhenResolved;
        let originalReturnDependencies =
            stateDef.returnDependencies.bind(stateDef);
        let originalDefinition = stateDef.definition;

        stateDef.returnDependencies = function (args) {
            let dependencies = originalReturnDependencies(args);
            dependencies.targetReadyToExpandWhenResolved = {
                dependencyType: "stateVariable",
                componentIdx: targetComponent.componentIdx,
                variableName: "readyToExpandWhenResolved",
            };
            return dependencies;
        };

        // change definition so that it is false if targetComponent isn't ready to expand
        stateDef.definition = function (args) {
            let result = originalDefinition(args);

            if (result.setValue && result.setValue.readyToExpandWhenResolved) {
                if (!args.dependencyValues.targetReadyToExpandWhenResolved) {
                    result.setValue.readyToExpandWhenResolved = false;
                }
            }
            return result;
        };
    }

    let stateVariablesToShadow = [];

    // shadow any variables marked as shadowVariable
    for (let varName in targetComponent.state) {
        let stateObj = targetComponent.state[varName];
        if (stateObj.shadowVariable || stateObj.isShadow) {
            stateVariablesToShadow.push(varName);
        }
    }

    modifyStateDefsToBeShadows({
        stateVariablesToShadow,
        stateVariableDefinitions,
        foundReadyToExpandWhenResolved,
        targetComponent,
    });
}

/**
 * Rewrite each named state-variable definition in
 * `stateVariableDefinitions` so it reads from the corresponding variable
 * on `targetComponent` instead of computing its own value. Handles both
 * scalar and array variables; `differentStateVariablesInTarget[i]` (if
 * provided) overrides the target variable name for shadow `i`. When a
 * shadowed variable was used by an `additionalStateVariablesDefined`
 * group, the un-shadowed siblings get the variable scrubbed from their
 * definition output via `modifyStateDefToDeleteVariableReferences`.
 */
function modifyStateDefsToBeShadows({
    stateVariablesToShadow,
    stateVariableDefinitions,
    foundReadyToExpandWhenResolved,
    targetComponent,
    differentStateVariablesInTarget = [],
}: {
    stateVariablesToShadow: string[];
    stateVariableDefinitions: Record<string, any>;
    foundReadyToExpandWhenResolved?: boolean;
    targetComponent: any;
    differentStateVariablesInTarget?: (string | undefined)[];
}) {
    // Note: if add a markStale function to these shadow,
    // will need to modify array size state variable definition
    // (createArraySizeStateVariable)
    // to not overwrite markStale when it finds a shadow

    let deleteStateVariablesFromDefinition = {};
    for (let [varInd, varName] of stateVariablesToShadow.entries()) {
        let stateDef = stateVariableDefinitions[varName];

        if (stateDef === undefined) {
            if (varName.slice(0, 8) === "__array_") {
                // have an array variable name that is created on the fly
                // rather than being specified in original definition.
                stateDef = stateVariableDefinitions[varName] = {};
            } else {
                continue;
            }
        }

        stateDef.isShadow = true;

        if (stateDef.additionalStateVariablesDefined) {
            for (let varName2 of stateDef.additionalStateVariablesDefined) {
                if (!stateVariablesToShadow.includes(varName2)) {
                    // varName2 is not shadowed, however, it includes varName
                    // in its definition
                    if (!deleteStateVariablesFromDefinition[varName2]) {
                        deleteStateVariablesFromDefinition[varName2] = [];
                    }
                    deleteStateVariablesFromDefinition[varName2].push(varName);
                }
            }
        }
        delete stateDef.additionalStateVariablesDefined;
        if (!foundReadyToExpandWhenResolved) {
            // if didn't find a readyToExpandWhenResolved,
            // then won't use original dependencies so can delete any
            // stateVariablesDeterminingDependencies
            delete stateDef.stateVariablesDeterminingDependencies;
        }

        let copyComponentType =
            stateDef.public &&
            stateDef.shadowingInstructions.hasVariableComponentType;

        if (stateDef.isArray) {
            let overrideVarNameWith = differentStateVariablesInTarget[varInd];

            stateDef.returnArrayDependenciesByKey = function ({ arrayKeys }) {
                let dependenciesByKey = {};

                for (let key of arrayKeys) {
                    dependenciesByKey[key] = {
                        targetVariable: {
                            dependencyType: "stateVariable",
                            componentIdx: targetComponent.componentIdx,
                            variableName:
                                overrideVarNameWith ||
                                this.arrayVarNameFromArrayKey(key),
                        },
                    };
                }

                let globalDependencies = {};

                if (copyComponentType) {
                    globalDependencies.targetVariableComponentType = {
                        dependencyType: "stateVariableComponentType",
                        componentIdx: targetComponent.componentIdx,
                        variableName: varName,
                    };
                }

                if (stateDef.inverseShadowToSetEntireArray) {
                    globalDependencies.targetArray = {
                        dependencyType: "stateVariable",
                        componentIdx: targetComponent.componentIdx,
                        variableName: varName,
                    };
                }

                return { globalDependencies, dependenciesByKey };
            };

            stateDef.arrayDefinitionByKey = function ({
                globalDependencyValues,
                dependencyValuesByKey,
                arrayKeys,
            }) {
                let newEntries = {};

                for (let arrayKey of arrayKeys) {
                    if ("targetVariable" in dependencyValuesByKey[arrayKey]) {
                        newEntries[arrayKey] =
                            dependencyValuesByKey[arrayKey].targetVariable;
                    } else {
                        // put in a placeholder value until this can be rerun
                        // with the updated dependencies
                        newEntries[arrayKey] =
                            stateDef.defaultValueByArrayKey?.(arrayKey);
                    }
                }

                let result = {
                    setValue: { [varName]: newEntries },
                };

                // TODO: how do we make it do this just once?
                if ("targetVariableComponentType" in globalDependencyValues) {
                    result.setCreateComponentOfType = {
                        [varName]:
                            globalDependencyValues.targetVariableComponentType,
                    };
                }

                return result;
            };

            stateDef.inverseArrayDefinitionByKey = function ({
                desiredStateVariableValues,
                dependencyValuesByKey,
                dependencyNamesByKey,
                arraySize,
                initialChange,
            }) {
                if (stateDef.inverseShadowToSetEntireArray) {
                    return {
                        success: true,
                        instructions: [
                            {
                                setDependency: "targetArray",
                                desiredValue:
                                    desiredStateVariableValues[varName],
                                treatAsInitialChange: initialChange,
                            },
                        ],
                    };
                }

                let instructions = [];
                for (let key in desiredStateVariableValues[varName]) {
                    if (!dependencyValuesByKey[key]) {
                        continue;
                    }

                    instructions.push({
                        setDependency: dependencyNamesByKey[key].targetVariable,
                        desiredValue: desiredStateVariableValues[varName][key],
                        shadowedVariable: true,
                    });
                }
                return {
                    success: true,
                    instructions,
                };
            };
        } else {
            let returnStartingDependencies = () => ({});

            if (foundReadyToExpandWhenResolved) {
                // even though won't use original dependencies
                // if found a readyToExpandWhenResolved
                // keep original dependencies so that readyToExpandWhenResolved
                // won't be resolved until all its dependent variables are resolved
                returnStartingDependencies =
                    stateDef.returnDependencies.bind(stateDef);
            }

            let varNameInTarget = differentStateVariablesInTarget[varInd];
            if (!varNameInTarget) {
                varNameInTarget = varName;
            }

            stateDef.returnDependencies = function (args) {
                let dependencies = Object.assign(
                    {},
                    returnStartingDependencies(args),
                );

                dependencies.targetVariable = {
                    dependencyType: "stateVariable",
                    componentIdx: targetComponent.componentIdx,
                    variableName: varNameInTarget,
                };
                if (copyComponentType) {
                    dependencies.targetVariableComponentType = {
                        dependencyType: "stateVariableComponentType",
                        componentIdx: targetComponent.componentIdx,
                        variableName: varNameInTarget,
                    };
                }
                return dependencies;
            };
            stateDef.definition = function ({ dependencyValues, usedDefault }) {
                let result = {};

                // TODO: how do we make it do this just once?
                if ("targetVariableComponentType" in dependencyValues) {
                    result.setCreateComponentOfType = {
                        [varName]: dependencyValues.targetVariableComponentType,
                    };
                }

                if (
                    usedDefault.targetVariable &&
                    "defaultValue" in stateDef &&
                    stateDef.hasEssential
                ) {
                    result.useEssentialOrDefaultValue = {
                        [varName]: {
                            defaultValue: dependencyValues.targetVariable,
                        },
                    };
                } else {
                    result.setValue = {
                        [varName]: dependencyValues.targetVariable,
                    };
                }

                return result;
            };
            stateDef.excludeDependencyValuesInInverseDefinition = true;
            stateDef.inverseDefinition = function ({
                desiredStateVariableValues,
            }) {
                return {
                    success: true,
                    instructions: [
                        {
                            setDependency: "targetVariable",
                            desiredValue: desiredStateVariableValues[varName],
                            shadowedVariable: true,
                        },
                    ],
                };
            };
        }
    }
    for (let varName in deleteStateVariablesFromDefinition) {
        modifyStateDefToDeleteVariableReferences({
            varNamesToDelete: deleteStateVariablesFromDefinition[varName],
            stateDef: stateVariableDefinitions[varName],
        });
    }
}

/**
 * Strip references to `varNamesToDelete` from a `stateDef` that defined
 * those variables alongside others via `additionalStateVariablesDefined`.
 * Removes them from the sibling list and wraps the original `definition`
 * so its returned `setValue` / `useEssentialOrDefaultValue` / etc. no
 * longer mention the now-shadowed variables.
 */
function modifyStateDefToDeleteVariableReferences({
    varNamesToDelete,
    stateDef,
}: {
    varNamesToDelete: string[];
    stateDef: any;
}) {
    // delete variables from additionalStateVariablesDefined
    for (let varName2 of varNamesToDelete) {
        let ind = stateDef.additionalStateVariablesDefined.indexOf(varName2);
        stateDef.additionalStateVariablesDefined.splice(ind, 1);
    }

    // remove variables from definition
    let originalDefinition = stateDef.definition;
    stateDef.definition = function (args) {
        let results = originalDefinition(args);
        for (let key in results) {
            if (Array.isArray(results[key])) {
                for (let varName2 of varNamesToDelete) {
                    let ind = results[key].indexOf(varName2);
                    if (ind !== -1) {
                        results[key].splice(ind, 1);
                    }
                }
            } else {
                for (let varName2 of varNamesToDelete) {
                    delete results[key][varName2];
                }
            }
        }
        return results;
    };
}

/**
 * Mark `stateVarDef` as public and populate
 * `shadowingInstructions.createComponentOfType` from
 * `attributeSpecification`. Maps `createPrimitiveOfType` codes
 * (`string`/`stringArray`/`numberArray`) to their component-shaped
 * equivalents (`text`/`textList`/`numberList`); falls back to
 * `attributeSpecification.createComponentOfType` if no primitive type.
 * Throws when `createReferences` is set, since references can't shadow
 * publicly.
 */
function _setShadowingInstructionsFromAttribute(
    stateVarDef: any,
    attributeSpecification: any,
) {
    stateVarDef.public = true;
    stateVarDef.shadowingInstructions = {};
    if (attributeSpecification.createPrimitiveOfType) {
        const primitive = attributeSpecification.createPrimitiveOfType;
        stateVarDef.shadowingInstructions.createComponentOfType =
            PRIMITIVE_TO_COMPONENT_TYPE[primitive] ?? primitive;
    } else if (attributeSpecification.createReferences) {
        throw Error(
            "Cannot make a public state variable from an attribute with createReferences",
        );
    } else {
        stateVarDef.shadowingInstructions.createComponentOfType =
            attributeSpecification.createComponentOfType;
    }
}

/**
 * Decide which state-variable name to read from the attribute's
 * component to populate the dependency value: prefer the explicit
 * `componentStateVariableForAttributeValue`, fall back to the attribute
 * class's `stateVariableToBeShadowed`, then default to `"value"`.
 * Returns `undefined` when no `createComponentOfType` is specified
 * (the dependency will use a different shape, e.g. `attributePrimitive`).
 * Throws if the attribute class doesn't exist.
 */
function _resolveAttributeValueVariable(
    core: Core,
    attributeSpecification: any,
    attrName: string,
    componentClass: any,
): string | undefined {
    if (!attributeSpecification.createComponentOfType) {
        return undefined;
    }
    const attributeClass =
        core.componentInfoObjects.allComponentClasses[
            attributeSpecification.createComponentOfType
        ];
    if (!attributeClass) {
        throw Error(
            `Component type ${attributeSpecification.createComponentOfType} does not exist so cannot create state variable for attribute ${attrName} of componentType ${componentClass.componentType}.`,
        );
    }
    let stateVariableForAttributeValue =
        attributeSpecification.componentStateVariableForAttributeValue;
    if (stateVariableForAttributeValue === undefined) {
        stateVariableForAttributeValue =
            attributeClass.stateVariableToBeShadowed;
        if (stateVariableForAttributeValue === undefined) {
            stateVariableForAttributeValue = "value";
        }
    }
    return stateVariableForAttributeValue;
}

/**
 * Copy the canonical pass-through fields from `attributeSpecification`
 * onto `stateVarDef`. Only fields that are explicitly present on the
 * spec are copied (so that defaults stay defaults). The
 * `triggerActionOnChange` field is opt-in via
 * `includeTriggerActionOnChange` because only the
 * `createAttributeStateVariableDefinitions` site forwards it; the
 * adapter-shadow and reference-shadow paths intentionally don't.
 */
function _copyPassthroughAttributes(
    stateVarDef: any,
    attributeSpecification: any,
    { includeTriggerActionOnChange = false } = {},
) {
    const attributesToCopy = [
        "forRenderer",
        "defaultValue",
        "propagateToProps",
        ...(includeTriggerActionOnChange ? ["triggerActionOnChange"] : []),
        "ignoreFixed",
        "isLocation",
        "essentialVarName",
    ];
    for (const attrName2 of attributesToCopy) {
        if (attrName2 in attributeSpecification) {
            stateVarDef[attrName2] = attributeSpecification[attrName2];
        }
    }
}

/**
 * Build the `definition` / `inverseDefinition` callback pair for an
 * attribute-derived state variable. Both callbacks close over `varName`,
 * `stateVariableForAttributeValue`, `attributeSpecification`, and
 * `attrName`; the callers attach the returned closures to a
 * `stateVarDef` they own.
 *
 * The `definition` resolves the attribute value from one of the four
 * dependency shapes (`attributeComponent` / `attributePrimitive` /
 * `attributeRefResolutions` / fall-back via parent or
 * source-composite), then validates it via `validateAttributeValue`.
 *
 * The `inverseDefinition` (used unless `noInverse` is set) routes a
 * desired value back to the same source — propagating to the parent
 * state variable, source-composite state variable, or essential value
 * when no underlying component is present, or back to the attribute
 * component when one is.
 */
function _buildAttributeDerivedDefinitions({
    varName,
    stateVariableForAttributeValue,
    attributeSpecification,
    attrName,
}: {
    varName: string;
    stateVariableForAttributeValue: string | undefined;
    attributeSpecification: any;
    attrName: string;
}): {
    definition: (args: any) => any;
    inverseDefinition: (args: any) => Promise<any>;
} {
    const definition = function ({
        dependencyValues,
        usedDefault,
        essentialValues,
    }: any) {
        let attributeValue;
        if (dependencyValues.attributeComponent) {
            // The `attributeComponent` dependency is wired only when
            // `createComponentOfType` is set (see the call sites'
            // `returnDependencies`), which is exactly when
            // `_resolveAttributeValueVariable` returns a defined name —
            // so the non-null assertion is safe here.
            attributeValue =
                dependencyValues.attributeComponent.stateValues[
                    stateVariableForAttributeValue!
                ];
        } else if (dependencyValues.attributePrimitive != null) {
            attributeValue = dependencyValues.attributePrimitive;
        } else if (
            dependencyValues.attributeRefResolutions != null &&
            !usedDefault.attributeRefResolutions
        ) {
            attributeValue = dependencyValues.attributeRefResolutions;
        } else {
            // parentValue would be undefined if fallBackToParentStateVariable wasn't specified
            // parentValue would be null if the parentValue state variables
            // did not exist or its value was null
            let haveParentValue = dependencyValues.parentValue != null;
            if (
                haveParentValue &&
                !usedDefault.parentValue &&
                essentialValues[varName] === undefined
            ) {
                return {
                    setValue: {
                        [varName]: dependencyValues.parentValue,
                    },
                    checkForActualChange: { [varName]: true },
                };
            } else {
                // sourceCompositeValue would be undefined if fallBackToSourceCompositeStateVariable wasn't specified
                // sourceCompositeValue would be null if the sourceCompositeValue state variables
                // did not exist or its value was null

                let haveSourceCompositeValue =
                    dependencyValues.sourceCompositeValue != null;
                if (
                    haveSourceCompositeValue &&
                    !usedDefault.sourceCompositeValue &&
                    essentialValues[varName] === undefined
                ) {
                    return {
                        setValue: {
                            [varName]: dependencyValues.sourceCompositeValue,
                        },
                        checkForActualChange: { [varName]: true },
                    };
                } else {
                    return {
                        useEssentialOrDefaultValue: {
                            [varName]: true,
                        },
                        checkForActualChange: { [varName]: true },
                    };
                }
            }
        }

        const res = validateAttributeValue({
            value: attributeValue,
            attributeSpecification,
            attribute: attrName,
        });

        return {
            setValue: { [varName]: res.value },
            checkForActualChange: { [varName]: true },
            sendDiagnostics: res.diagnostics,
        };
    };

    const inverseDefinition = async function ({
        desiredStateVariableValues,
        dependencyValues,
        usedDefault,
        essentialValues,
    }: any) {
        if (!dependencyValues.attributeComponent) {
            if (dependencyValues.attributePrimitive != null) {
                // can't invert if have primitive
                return { success: false };
            }
            if (dependencyValues.attributeRefResolutions != null) {
                // can't invert if have attribute ref resolutions
                return { success: false };
            }

            let haveParentValue = dependencyValues.parentValue != null;
            if (
                haveParentValue &&
                !usedDefault.parentValue &&
                essentialValues[varName] === undefined
            ) {
                // value from parent was used, so propagate back to parent
                return {
                    success: true,
                    instructions: [
                        {
                            setDependency: "parentValue",
                            desiredValue: desiredStateVariableValues[varName],
                        },
                    ],
                };
            } else {
                let haveSourceCompositeValue =
                    dependencyValues.sourceCompositeValue != null;
                if (
                    haveSourceCompositeValue &&
                    !usedDefault.sourceCompositeValue &&
                    essentialValues[varName] === undefined
                ) {
                    // value from source composite was used, so propagate back to source composite
                    return {
                        success: true,
                        instructions: [
                            {
                                setDependency: "sourceCompositeValue",
                                desiredValue:
                                    desiredStateVariableValues[varName],
                            },
                        ],
                    };
                } else {
                    // no component or primitive, so value is essential and give it the desired value, but validated
                    const res = validateAttributeValue({
                        value: desiredStateVariableValues[varName],
                        attributeSpecification,
                        attribute: attrName,
                    });

                    return {
                        success: true,
                        instructions: [
                            {
                                setEssentialValue: varName,
                                value: res.value,
                            },
                        ],
                        sendDiagnostics: res.diagnostics,
                    };
                }
            }
        }

        // attribute based on component
        return {
            success: true,
            instructions: [
                {
                    setDependency: "attributeComponent",
                    desiredValue: desiredStateVariableValues[varName],
                    variableIndex: 0,
                },
            ],
        };
    };

    return { definition, inverseDefinition };
}

/**
 * Coerce / validate an attribute value against its spec. Applies
 * `transformNonFiniteTo`, `toLowerCase`, `trim`, and either
 * `validValues` (falling back to the default with a diagnostic when the
 * value isn't allowed) or `clamp`. Returns the (possibly modified)
 * value alongside any user-facing diagnostics produced along the way.
 */
function validateAttributeValue({
    value,
    attributeSpecification,
    attribute,
}: {
    value: any;
    attributeSpecification: any;
    attribute: string;
}): { value: any; diagnostics: any[] } {
    let diagnostics: any[] = [];

    const valueOrig = value;

    if (
        attributeSpecification.transformNonFiniteTo !== undefined &&
        !Number.isFinite(value)
    ) {
        value = attributeSpecification.transformNonFiniteTo;
    }

    if (attributeSpecification.toLowerCase) {
        value = value.toLowerCase();
    }

    // `validValues` implies `trim` so that extra spaces don't break the matches
    if (attributeSpecification.trim || attributeSpecification.validValues) {
        value = value.trim();
    }

    if (attributeSpecification.validValues) {
        if (!attributeSpecification.validValues.includes(value)) {
            let defaultValue = attributeSpecification.defaultValue;
            if (defaultValue === undefined) {
                if (attributeSpecification.createPrimitiveOfType) {
                    defaultValue = attributeSpecification.defaultPrimitiveValue;
                }
                if (defaultValue === undefined) {
                    throw Error(
                        "Invalid attribute specification: no default value specified",
                    );
                }
            }
            diagnostics.push({
                message: `Invalid value \`${valueOrig}\` for attribute \`${attribute}\`, using value \`${defaultValue}\``,
                type: "info",
            });
            value = defaultValue;
        }
    } else if (attributeSpecification.clamp) {
        if (value < attributeSpecification.clamp[0]) {
            value = attributeSpecification.clamp[0];
        } else if (value > attributeSpecification.clamp[1]) {
            value = attributeSpecification.clamp[1];
        } else if (!Number.isFinite(value)) {
            value = attributeSpecification.defaultValue;
        }
    }

    return { value, diagnostics };
}

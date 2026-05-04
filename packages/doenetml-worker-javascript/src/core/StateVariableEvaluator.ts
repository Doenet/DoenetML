import type Core from "../Core";
import type { ComponentInstance } from "../types/componentInstance";
import type { ComponentIdx } from "@doenet/utils";
/**
 * Resolves a state variable's value: walks the dependency graph to gather
 * fresh inputs, invokes the variable's `definition` function (or
 * `arrayDefinitionByKey` for array entries), validates the result against
 * the declared shape (`hasEssential`, `defaultValue`, `validValues`,
 * `essentialVarName`), records actual changes back to upstream
 * dependencies, and queues downstream invalidation via
 * `markStateVariableAndUpstreamDependentsStale`.
 *
 * Holds a back-reference to Core to read `_components`,
 * `componentInfoObjects`, `dependencies`, `errorComponentsToAdd`,
 * `essentialValuesSavedInDefinition`, `initialAddPhase`, and to dispatch
 * `addDiagnostic`, `getSourceLocationForComponent`,
 * `markStateVariableAndUpstreamDependentsStale`,
 * `processNewStateVariableValues`.
 */
export class StateVariableEvaluator {
    core: Core;

    constructor({ core }: { core: Core }) {
        this.core = core;
    }

    /**
     * Resolve `component.state[stateVariable]` to a fresh value, returning the
     * awaited `value` (or array values for array state variables).
     *
     * Behaviour highlights for callers that need to reason about side effects:
     *  - Lazily resolves any unresolved state variables in the
     *    `additionalStateVariablesDefined` group via
     *    `dependencies.resolveItem`; throws if resolution fails.
     *  - Records a `dependencies.recordActualChangeInUpstreamDependencies`
     *    entry for every variable whose value materially changed (per
     *    `_isUnchanged`), and for the matching array entries when an array
     *    state variable's keys, size, or contents changed.
     *  - Forces a re-evaluation of `expressionWithCodes`-style state via
     *    `component.reprocessAfterEvaluate` (see the kludge note below) when
     *    that flag is set on the component.
     *  - Mutates `component.state[varName].value`,
     *    `_previousValue`, `freshnessInfo`, `arrayValues`, and clears
     *    `forceRecalculation` and `justUpdatedForNewComponent` on the
     *    affected variables. Does not mark anything stale itself —
     *    downstream invalidation is the responsibility of
     *    `markStateVariableAndUpstreamDependentsStale`, called by callers
     *    that record a change.
     */
    async getStateVariableValue({
        component,
        stateVariable,
    }: {
        component: ComponentInstance;
        stateVariable: string;
    }) {
        // console.log(`getting value of state variable ${stateVariable} of ${component.componentIdx}`)

        let stateVarObj = component.state[stateVariable];
        if (!stateVarObj) {
            throw Error(
                `Can't get value of ${stateVariable} of ${component.componentIdx} as it doesn't exist.`,
            );
        }

        if (component.reprocessAfterEvaluate) {
            // This is a kludge
            // due to the fact that Math ignores strings
            // (set in inverse definition of expressionWithCodes).
            // We need change its value a second time after evaluating
            // so that the next time the definition of expressionWithCodes is run,
            // the strings don't show any changes and we'll use the essential value
            // of expressionWithCodes
            let reprocessAfterEvaluate = component.reprocessAfterEvaluate;
            delete component.reprocessAfterEvaluate;

            for (let vName in reprocessAfterEvaluate) {
                if (component.state[vName]) {
                    await this.getStateVariableValue({
                        component,
                        stateVariable: vName,
                    });
                }
            }

            await this.core.processNewStateVariableValues({
                [component.componentIdx]: reprocessAfterEvaluate,
            });
        }

        let additionalStateVariablesDefined =
            stateVarObj.additionalStateVariablesDefined;

        let allStateVariablesAffected = [stateVariable];
        if (additionalStateVariablesDefined) {
            allStateVariablesAffected.push(...additionalStateVariablesDefined);
        }

        let justUpdatedForNewComponent = false;

        for (let varName of allStateVariablesAffected) {
            if (!component.state[varName].isResolved) {
                let result = await this.core.dependencies.resolveItem({
                    componentIdx: component.componentIdx,
                    type: "stateVariable",
                    stateVariable: varName,
                    force: true,
                });

                if (!result.success) {
                    throw Error(
                        `Can't get value of ${stateVariable} of ${component.componentIdx} as ${varName} couldn't be resolved.`,
                    );
                }
            }

            if (component.state[varName].justUpdatedForNewComponent) {
                delete component.state[varName].justUpdatedForNewComponent;
                justUpdatedForNewComponent = true;
            }
        }

        let definitionArgs = await this.getStateVariableDefinitionArguments({
            component,
            stateVariable,
        });
        definitionArgs.componentInfoObjects = this.core.componentInfoObjects;
        definitionArgs.justUpdatedForNewComponent = justUpdatedForNewComponent;
        definitionArgs.initialAddPhase = this.core.initialAddPhase;

        definitionArgs.freshnessInfo = stateVarObj.freshnessInfo;

        // arraySize will be defined if have array or arrayEntry
        // (If have multiple state variables defined, they must be of same size)
        let arraySize = definitionArgs.arraySize;

        // if (component instanceof this.core.componentInfoObjects.allComponentClasses._composite) {
        //   definitionArgs.replacementsWorkspace = new Proxy(component.replacementsWorkspace, readOnlyProxyHandler);
        // }

        let result;

        if (
            Object.keys(definitionArgs.changes).length === 0 &&
            stateVarObj._previousValue !== undefined &&
            !stateVarObj.forceRecalculation
        ) {
            let noChanges = [stateVariable];
            if (additionalStateVariablesDefined) {
                noChanges.push(...additionalStateVariablesDefined);
            }
            // console.log(`no changes for ${stateVariable} of ${component.componentIdx}`);
            // console.log(noChanges)
            result = { noChanges };

            if (stateVarObj.freshenOnNoChanges) {
                stateVarObj.freshenOnNoChanges(definitionArgs);
            }
        } else {
            delete stateVarObj.forceRecalculation;
            result = stateVarObj.definition(definitionArgs);
        }

        let receivedValue: Record<string, boolean> = {
            [stateVariable]: false,
        };

        let valuesChanged: Record<string, any> = {};

        if (additionalStateVariablesDefined) {
            for (let otherVar of additionalStateVariablesDefined) {
                receivedValue[otherVar] = false;
            }
        }

        // console.log(`result for ${stateVariable} of ${component.componentIdx}`)
        // console.log(result);

        for (let varName in result.setValue) {
            if (!(varName in component.state)) {
                throw Error(
                    `Definition of state variable ${stateVariable} of ${component.componentIdx} returned value of ${varName}, which isn't a state variable.`,
                );
            }

            let matchingArrayEntry: string | undefined;

            if (!(varName in receivedValue)) {
                matchingArrayEntry = this._findOrThrowMatchingArrayEntry({
                    varName,
                    receivedValue,
                    component,
                    errorMessage: `Attempting to set value of stateVariable ${varName} in definition of ${stateVariable} of ${component.componentIdx}, but it's not listed as an additional state variable defined.`,
                });
                receivedValue[matchingArrayEntry] = true;
                valuesChanged[matchingArrayEntry] = true;
            } else {
                receivedValue[varName] = true;

                if (component.state[varName].isArray) {
                    if (!valuesChanged[varName]) {
                        valuesChanged[varName] = { arrayKeysChanged: {} };
                    }
                } else {
                    valuesChanged[varName] = true;
                }
            }

            if (!component.state[varName].isResolved) {
                if (
                    !matchingArrayEntry ||
                    !component.state[matchingArrayEntry].isResolved
                ) {
                    throw Error(
                        `Attempting to set value of stateVariable ${varName} of ${component.componentIdx} while it is still unresolved!`,
                    );
                }
            }

            if (component.state[varName].isArray) {
                if (!valuesChanged[varName]) {
                    valuesChanged[varName] = { arrayKeysChanged: {} };
                }

                let checkForActualChange: Record<string, any> = {};
                if (
                    result.checkForActualChange &&
                    result.checkForActualChange[varName]
                ) {
                    checkForActualChange = result.checkForActualChange[varName];
                }

                for (let arrayKey in result.setValue[varName]) {
                    if (checkForActualChange[arrayKey]) {
                        let prevValue = component.state[varName].getArrayValue({
                            arrayKey,
                        });
                        let newValue = result.setValue[varName][arrayKey];
                        if (prevValue !== newValue) {
                            component.state[varName].setArrayValue({
                                value: result.setValue[varName][arrayKey],
                                arrayKey,
                                arraySize,
                            });
                            component.state[varName].usedDefaultByArrayKey[
                                arrayKey
                            ] = false;
                            valuesChanged[varName].arrayKeysChanged[arrayKey] =
                                true;
                        }
                    } else {
                        component.state[varName].setArrayValue({
                            value: result.setValue[varName][arrayKey],
                            arrayKey,
                            arraySize,
                        });
                        component.state[varName].usedDefaultByArrayKey[
                            arrayKey
                        ] = false;
                        valuesChanged[varName].arrayKeysChanged[arrayKey] =
                            true;
                    }
                }
            } else {
                // not an array

                // if (!(Object.getOwnPropertyDescriptor(component.state[varName], 'value').get || component.state[varName].immutable)) {
                //   throw Error(`${varName} of ${component.componentIdx} is not stale, but still setting its value!!`)
                // }

                // delete before assigning value to remove any getter for the property
                delete component.state[varName].value;
                component.state[varName].value = result.setValue[varName];
                delete component.state[varName].usedDefault;

                if (result.checkForActualChange?.[varName]) {
                    if (
                        this._isUnchanged(
                            component.state[varName].value,
                            component.state[varName]._previousValue,
                        )
                    ) {
                        delete valuesChanged[varName];
                    }
                }
            }
        }

        for (let varName in result.useEssentialOrDefaultValue) {
            if (!(varName in component.state)) {
                throw Error(
                    `Definition of state variable ${stateVariable} of ${component.componentIdx} requested essential or default value of ${varName}, which isn't a state variable.`,
                );
            }

            if (!component.state[varName].hasEssential) {
                throw Error(
                    `Definition of state variable ${stateVariable} of ${component.componentIdx} requested essential or default value of ${varName}, but hasEssential is not set.`,
                );
            }

            let matchingArrayEntry: string | undefined;

            if (!(varName in receivedValue)) {
                matchingArrayEntry = this._findOrThrowMatchingArrayEntry({
                    varName,
                    receivedValue,
                    component,
                    errorMessage: `Attempting to set value of stateVariable ${varName} in definition of ${stateVariable} of ${component.componentIdx}, but it's not listed as an additional state variable defined.`,
                });
                receivedValue[matchingArrayEntry] = true;
                valuesChanged[matchingArrayEntry] = true;
            } else {
                receivedValue[varName] = true;
                if (component.state[varName].isArray) {
                    if (!valuesChanged[varName]) {
                        valuesChanged[varName] = { arrayKeysChanged: {} };
                    }
                } else {
                    valuesChanged[varName] = true;
                }
            }

            if (!component.state[varName].isResolved) {
                if (
                    !matchingArrayEntry ||
                    !component.state[matchingArrayEntry].isResolved
                ) {
                    throw Error(
                        `Attempting to set value of stateVariable ${varName} of ${component.componentIdx} while it is still unresolved!`,
                    );
                }
            }

            let essentialVarName = varName;

            if (component.state[varName].essentialVarName) {
                essentialVarName = component.state[varName].essentialVarName;
            }
            let essentialValue = component.essentialState[essentialVarName];

            if (component.state[varName].isArray) {
                // if have an array state variable,
                // then need to have an object keyed on arrayKey

                if (!valuesChanged[varName]) {
                    valuesChanged[varName] = { arrayKeysChanged: {} };
                }

                let checkForActualChange: Record<string, any> = {};
                if (
                    result.checkForActualChange &&
                    result.checkForActualChange[varName]
                ) {
                    checkForActualChange = result.checkForActualChange[varName];
                }

                for (let arrayKey in result.useEssentialOrDefaultValue[
                    varName
                ]) {
                    let prevValue;
                    if (checkForActualChange[arrayKey]) {
                        prevValue = component.state[varName].getArrayValue({
                            arrayKey,
                        });
                    }

                    let essentialValueForArrayKey;
                    if (Array.isArray(essentialValue)) {
                        essentialValueForArrayKey = component.state[
                            varName
                        ].getArrayValue({
                            arrayKey,
                            arrayValues: essentialValue,
                        });
                    } else {
                        essentialValue = component.essentialState[
                            essentialVarName
                        ] = [];
                    }

                    if (essentialValueForArrayKey !== undefined) {
                        component.state[varName].setArrayValue({
                            value: essentialValueForArrayKey,
                            arrayKey,
                            arraySize,
                        });
                    } else {
                        let defaultValue =
                            result.useEssentialOrDefaultValue[varName][arrayKey]
                                .defaultValue;
                        if (defaultValue !== undefined) {
                            // save to state variable
                            component.state[varName].setArrayValue({
                                value: defaultValue,
                                arrayKey,
                                arraySize,
                            });

                            component.state[varName].usedDefaultByArrayKey[
                                arrayKey
                            ] = true;
                        } else if (
                            component.state[varName].defaultValueByArrayKey?.(
                                arrayKey,
                            ) !== undefined
                        ) {
                            component.state[varName].setArrayValue({
                                value: component.state[
                                    varName
                                ].defaultValueByArrayKey(arrayKey),
                                arrayKey,
                                arraySize,
                            });
                            component.state[varName].usedDefaultByArrayKey[
                                arrayKey
                            ] = true;
                        } else {
                            throw Error(
                                `Neither value nor default value specified; state variable: ${varName}, component: ${component.componentIdx}, arrayKey: ${arrayKey}.`,
                            );
                        }
                    }

                    if (checkForActualChange[arrayKey]) {
                        let newValue = component.state[varName].getArrayValue({
                            arrayKey,
                        });
                        if (newValue !== prevValue) {
                            valuesChanged[varName].arrayKeysChanged[arrayKey] =
                                true;
                        }
                    } else {
                        valuesChanged[varName].arrayKeysChanged[arrayKey] =
                            true;
                    }
                }
            } else {
                if (essentialValue !== undefined) {
                    // delete before assigning essential value to remove any getter for the property
                    delete component.state[varName].value;
                    component.state[varName].value = essentialValue;
                } else {
                    let defaultValue =
                        result.useEssentialOrDefaultValue[varName].defaultValue;
                    if (defaultValue !== undefined) {
                        // save state variable value
                        delete component.state[varName].value;
                        component.state[varName].value = defaultValue;

                        component.state[varName].usedDefault = true;
                    } else if (
                        component.state[varName].defaultValue !== undefined
                    ) {
                        // This default value will be the same every time,
                        // so we don't need to save its value

                        // delete before assigning value to remove any getter for the property
                        delete component.state[varName].value;
                        component.state[varName].value =
                            component.state[varName].defaultValue;
                        component.state[varName].usedDefault = true;
                    } else {
                        throw Error(
                            `Neither value nor default value specified; state variable: ${varName}, component: ${component.componentIdx}.`,
                        );
                    }
                }

                if (result.checkForActualChange?.[varName]) {
                    if (
                        this._isUnchanged(
                            component.state[varName].value,
                            component.state[varName]._previousValue,
                        )
                    ) {
                        delete valuesChanged[varName];
                    }
                }
            }
        }

        for (let varName in result.markAsUsedDefault) {
            if (!component.state[varName].isResolved) {
                throw Error(
                    `Marking state variable as used default when it isn't yet resolved: ${varName} of ${component.componentIdx}`,
                );
            }

            if (!(varName in receivedValue)) {
                this._findOrThrowMatchingArrayEntry({
                    varName,
                    receivedValue,
                    component,
                    errorMessage: `Marking state variable  ${varName} as used default in definition of ${stateVariable} of ${component.componentIdx}, but it's not listed as an additional state variable defined.`,
                });
            }

            if (Array.isArray(result.markAsUsedDefault[varName])) {
                for (let arrayKey in result.markAsUsedDefault[varName]) {
                    component.state[varName].usedDefaultByArrayKey[arrayKey] =
                        Boolean(result.markAsUsedDefault[varName][arrayKey]);
                }
            } else {
                component.state[varName].usedDefault = Boolean(
                    result.markAsUsedDefault[varName],
                );
            }
        }

        if (result.noChanges) {
            for (let varName of result.noChanges) {
                if (!component.state[varName].isResolved) {
                    // TODO: is this the correct response to having no changes but a variable not resolved?
                    // This scenario was occasionally occurring with readyToExpandWhenResolved in tests
                    component.state[varName].isResolved = true;
                    // throw Error(`Claiming state variable is unchanged when it isn't yet resolved: ${varName} of ${component.componentIdx}`)
                }

                if (!(varName in receivedValue)) {
                    this._findOrThrowMatchingArrayEntry({
                        varName,
                        receivedValue,
                        component,
                        errorMessage: `Claiming stateVariable ${varName} is unchanged in definition of ${stateVariable} of ${component.componentIdx}, but it's not listed as an additional state variable defined.`,
                    });
                }

                receivedValue[varName] = true;

                if (
                    Object.getOwnPropertyDescriptor(
                        component.state[varName],
                        "value",
                    )?.get ||
                    component.state[varName].immutable
                ) {
                    // have getter, so state variable was marked as stale
                    // delete getter then assign previous value
                    delete component.state[varName].value;
                    component.state[varName].value =
                        component.state[varName]._previousValue;
                }
            }
        }

        for (let varName in result.setEssentialValue) {
            if (!(varName in component.state)) {
                throw Error(
                    `Definition of state variable ${stateVariable} of ${component.componentIdx} tried to make ${varName} essential, which isn't a state variable.`,
                );
            }

            if (!(varName in receivedValue)) {
                this._findOrThrowMatchingArrayEntry({
                    varName,
                    receivedValue,
                    component,
                    errorMessage: `Attempting to set essential value of stateVariable ${varName} in definition of ${stateVariable} of ${component.componentIdx}, but it's not listed as an additional state variable defined.`,
                });
            }

            if (!component.state[varName].hasEssential) {
                throw Error(
                    `Attempting to set the essential value of stateVariable ${varName} in definition of ${stateVariable} of ${component.componentIdx}, but it does not have an essential value`,
                );
            }

            // Setting essential value is only valid if the essential value is not shadowed
            // (or if the state variable itself is shadowed,
            // which implicitly means the essential value is not shadowed)
            // Otherwise, changing the essential value could change the effective dependencies
            // of the shadowed state variables, which would necessitate recalculating those values.
            // Not only is marking those values stale not available when getting state variable values,
            // but it would cause an infinite loop when those definitions also set the essential value

            if (
                !(
                    component.state[varName].shadowVariable ||
                    component.state[varName].doNotShadowEssential
                )
            ) {
                throw Error(
                    `Attempting to set the essential value of stateVariable ${varName} in definition of ${stateVariable} of ${component.componentIdx}, but it is not allowed unless the state variable is shadowed or the essential state is not shadowed.`,
                );
            }

            if (
                !this.core.essentialValuesSavedInDefinition[component.stateId]
            ) {
                this.core.essentialValuesSavedInDefinition[component.stateId] =
                    {};
            }

            let essentialVarName = varName;
            if (component.state[varName].essentialVarName) {
                essentialVarName = component.state[varName].essentialVarName;
            }

            if (component.state[varName].isArray) {
                let essentialArray = component.essentialState[essentialVarName];

                if (!Array.isArray(essentialArray)) {
                    essentialArray = component.essentialState[
                        essentialVarName
                    ] = [];
                }

                // Since setting an essential value during a definition,
                // we also add the value to essentialValuesSavedInDefinition
                // so that it will be saved to the database during the next update

                if (
                    !this.core.essentialValuesSavedInDefinition[
                        component.stateId
                    ][varName]
                ) {
                    // include key mergeObject to let external functions
                    // know that new attributes of the object
                    // should be merged into the old object
                    this.core.essentialValuesSavedInDefinition[
                        component.stateId
                    ][varName] = {
                        mergeObject: true,
                    };
                }
                for (let arrayKey in result.setEssentialValue[varName]) {
                    component.state[varName].setArrayValue({
                        value: result.setEssentialValue[varName][arrayKey],
                        arrayKey,
                        arraySize,
                        arrayValues: essentialArray,
                    });

                    this.core.essentialValuesSavedInDefinition[
                        component.stateId
                    ][varName][arrayKey] =
                        result.setEssentialValue[varName][arrayKey];
                }
            } else {
                component.essentialState[essentialVarName] =
                    result.setEssentialValue[varName];

                // Since setting an essential value during a definition,
                // we also add the value to essentialValuesSavedInDefinition
                // so that it will be saved to the database during the next update
                this.core.essentialValuesSavedInDefinition[component.stateId][
                    varName
                ] = result.setEssentialValue[varName];
            }
        }

        if (result.setCreateComponentOfType) {
            for (let varName in result.setCreateComponentOfType) {
                if (
                    !component.state[varName].shadowingInstructions
                        ?.hasVariableComponentType
                ) {
                    throw Error(
                        `Cannot set type of ${varName} of ${component.componentIdx} as it it does not have the hasVariableComponentType attribute.`,
                    );
                }
                let changedComponentType = false;
                let shadowingInstructions =
                    component.state[varName].shadowingInstructions;
                if (!shadowingInstructions) {
                    shadowingInstructions = component.state[
                        varName
                    ].shadowingInstructions = {};
                }
                let originalCreateComponentOfType =
                    shadowingInstructions.createComponentOfType;
                let newCreateComponentOfType =
                    result.setCreateComponentOfType[varName];
                if (Array.isArray(originalCreateComponentOfType)) {
                    if (Array.isArray(newCreateComponentOfType)) {
                        if (
                            originalCreateComponentOfType.length !==
                            newCreateComponentOfType.length
                        ) {
                            changedComponentType = true;
                        } else if (
                            originalCreateComponentOfType.some(
                                (v, i) => v != newCreateComponentOfType[i],
                            )
                        ) {
                            changedComponentType = true;
                        }
                    } else {
                        changedComponentType = true;
                    }
                } else if (Array.isArray(newCreateComponentOfType)) {
                    changedComponentType = true;
                } else {
                    changedComponentType =
                        originalCreateComponentOfType !==
                        newCreateComponentOfType;
                }
                if (changedComponentType) {
                    valuesChanged[varName] = true;
                }
                shadowingInstructions.createComponentOfType =
                    result.setCreateComponentOfType[varName];
                if (
                    component.state[varName].isArray &&
                    component.state[varName].arrayEntryNames
                ) {
                    let arrayComponentType =
                        result.setCreateComponentOfType[varName];
                    let arrayComponentTypeIsArray =
                        Array.isArray(arrayComponentType);
                    for (let arrayEntryName of component.state[varName]
                        .arrayEntryNames) {
                        // TODO: address multidimensional arrays
                        if (arrayComponentTypeIsArray) {
                            let arrayKeys =
                                await component.state[arrayEntryName].arrayKeys;
                            let componentType = [];
                            for (let arrayKey of arrayKeys) {
                                let ind =
                                    component.state[varName].keyToIndex(
                                        arrayKey,
                                    );
                                componentType.push(arrayComponentType[ind]);
                            }
                            component.state[
                                arrayEntryName
                            ].shadowingInstructions.createComponentOfType =
                                componentType;
                        } else {
                            component.state[
                                arrayEntryName
                            ].shadowingInstructions.createComponentOfType =
                                arrayComponentType;
                        }
                    }
                }
            }
        }

        if (result.arraySizeChanged) {
            for (let varName of result.arraySizeChanged) {
                await component.state[varName].adjustArrayToNewArraySize();

                if (valuesChanged[varName] === undefined) {
                    valuesChanged[varName] = { arrayKeysChanged: {} };
                } else if (valuesChanged[varName] === true) {
                    valuesChanged[varName] = {
                        allArrayKeysChanged: true,
                        arrayKeysChanged: {},
                    };
                }
                valuesChanged[varName].arraySizeChanged = true;
            }
        }

        if (result.sendDiagnostics?.length > 0) {
            const { position, sourceDoc } =
                this.core.getSourceLocationForComponent(component);

            for (const diagnostic of result.sendDiagnostics) {
                const addedDiagnostic = this.core.addDiagnostic({
                    position,
                    sourceDoc,
                    ...diagnostic,
                });

                if (
                    addedDiagnostic &&
                    diagnostic?.type === "error" &&
                    this.core.initialAddPhase
                ) {
                    this.core.errorComponentsToAdd.push({
                        componentIdx: component.componentIdx,
                        position,
                        sourceDoc,
                        ...diagnostic,
                    });
                }
            }
        }

        for (let varName in receivedValue) {
            if (
                !(
                    receivedValue[varName] ||
                    component.state[varName].isArrayEntry ||
                    component.state[varName].isArray
                )
            ) {
                throw Error(
                    `definition of ${stateVariable} of ${component.componentIdx} didn't return value of ${varName}`,
                );
            }

            if (component.state[varName].isArray) {
                // delete before assigning value to remove any getter for the property
                delete component.state[varName].value;
                component.state[varName].value =
                    component.state[varName].arrayValues;
            } else if (component.state[varName].isArrayEntry) {
                delete component.state[varName].value;
                component.state[varName].value =
                    await component.state[varName].getValueFromArrayValues();
            }
        }

        for (let varName in valuesChanged) {
            this.core.dependencies.recordActualChangeInUpstreamDependencies({
                component,
                varName,
                changes: valuesChanged[varName], // so far, just in case is an array state variable
            });

            if (component.state[varName].isArray) {
                let arrayVarNamesChanged: string[] = [];
                if (
                    valuesChanged[varName] === true ||
                    valuesChanged[varName].allArrayKeysChanged ||
                    valuesChanged[varName].arraySizeChanged
                ) {
                    if (component.state[varName].arrayEntryNames) {
                        arrayVarNamesChanged =
                            component.state[varName].arrayEntryNames;
                    }
                } else {
                    let varNamesByArrayKey =
                        component.state[varName].varNamesIncludingArrayKeys;
                    for (let arrayKeyChanged in valuesChanged[varName]
                        .arrayKeysChanged) {
                        let additionalVarNamesChanged =
                            varNamesByArrayKey[arrayKeyChanged];
                        if (additionalVarNamesChanged) {
                            arrayVarNamesChanged.push(
                                ...additionalVarNamesChanged,
                            );
                        }
                    }
                }

                // remove duplicates
                arrayVarNamesChanged = [...new Set(arrayVarNamesChanged)];

                for (let arrayVarName of arrayVarNamesChanged) {
                    this.core.dependencies.recordActualChangeInUpstreamDependencies(
                        {
                            component,
                            varName: arrayVarName,
                        },
                    );
                }
            }
        }

        return await stateVarObj.value;
    }

    /**
     * Build definition/inverse-definition args for a state variable.
     * When consumeChanges is false, dependency change flags are observed but preserved
     * for a later consuming read.
     */
    async getStateVariableDefinitionArguments({
        component,
        stateVariable,
        excludeDependencyValues = false,
        consumeChanges = true,
    }: {
        component: ComponentInstance;
        stateVariable: string;
        excludeDependencyValues?: boolean;
        consumeChanges?: boolean;
    }) {
        // console.log(`get state variable dependencies of ${component.componentIdx}, ${stateVariable}`)

        let args;
        if (excludeDependencyValues) {
            args = {};
        } else {
            args =
                await this.core.dependencies.getStateVariableDependencyValues({
                    component,
                    stateVariable,
                    consumeChanges,
                });
        }

        args.componentIdx = component.componentIdx;

        let stateVarObj = component.state[stateVariable];
        if (stateVarObj.isArrayEntry) {
            args.arrayKeys = await stateVarObj.arrayKeys;
            args.arraySize = await stateVarObj.arraySize;
        } else if (stateVarObj.isArray) {
            args.arraySize = await stateVarObj.arraySize;
        }

        if (stateVarObj.createWorkspace) {
            args.workspace = stateVarObj.workspace;
        }

        if (
            stateVarObj.providePreviousValuesInDefinition ||
            stateVarObj.provideEssentialValuesInDefinition
        ) {
            let allStateVariablesDefined = [stateVariable];
            if (stateVarObj.additionalStateVariablesDefined) {
                allStateVariablesDefined.push(
                    ...stateVarObj.additionalStateVariablesDefined,
                );
            }
            if (stateVarObj.providePreviousValuesInDefinition) {
                let previousValues: Record<string, any> = {};
                for (let varName of allStateVariablesDefined) {
                    if (component.state[varName].isArrayEntry) {
                        varName = component.state[varName].arrayStateVariable;
                    }
                    previousValues[varName] =
                        component.state[varName]._previousValue;
                }
                // args.previousValues = new Proxy(previousValues, readOnlyProxyHandler);
                args.previousValues = previousValues;
            }
            if (stateVarObj.provideEssentialValuesInDefinition) {
                let essentialValues: Record<string, any> = {};
                for (let varName of allStateVariablesDefined) {
                    if (component.state[varName].isArrayEntry) {
                        varName = component.state[varName].arrayStateVariable;
                    }
                    let essentialVarName = varName;
                    if (component.state[varName].essentialVarName) {
                        essentialVarName =
                            component.state[varName].essentialVarName;
                    }

                    essentialValues[varName] =
                        component.essentialState[essentialVarName];
                }
                // args.essentialValues = new Proxy(essentialValues, readOnlyProxyHandler);
                args.essentialValues = essentialValues;
            }
        }

        return args;
    }

    /**
     * Record that `componentIdx`/`varName` has actually changed (called
     * after the bulk-write path has updated values in `comp.essentialState`
     * and friends). Three side effects, in order:
     *   1. `markStateVariableAndUpstreamDependentsStale` — invalidate
     *      `varName` and propagate up the dependency graph. The mark-stale
     *      pass already covers `additionalStateVariablesDefined`.
     *   2. Set `forceRecalculation = true` on `varName` and every entry in
     *      its `additionalStateVariablesDefined` group, so the next
     *      `getStateVariableValue` call ignores the "no changes detected"
     *      fast-path and re-runs the definition.
     *   3. `recordActualChangeInUpstreamDependencies` for each variable in
     *      the group, so dependents see a concrete change flag.
     */
    async recordActualChangeInStateVariable({
        componentIdx,
        varName,
    }: {
        componentIdx: ComponentIdx;
        varName: string;
    }) {
        let component = this.core._components[componentIdx];

        // mark stale always includes additional state variables defined
        await this.core.markStateVariableAndUpstreamDependentsStale({
            component,
            varName,
        });

        let allStateVariables = [varName];
        if (component.state[varName].additionalStateVariablesDefined) {
            allStateVariables.push(
                ...component.state[varName].additionalStateVariablesDefined,
            );
        }

        for (let vName of allStateVariables) {
            component.state[vName].forceRecalculation = true;
            this.core.dependencies.recordActualChangeInUpstreamDependencies({
                component,
                varName: vName,
            });
        }
    }

    /**
     * Look up `varName` in `receivedValue`'s array-entry alternates: scan
     * the component's `arrayEntryNames` for one already in `receivedValue`,
     * and return it. Throws with `errorMessage` if no array-entry match is
     * found (or if the state variable is not an array). The caller decides
     * whether to additionally mark the entry on `receivedValue`/`valuesChanged`.
     */
    _findOrThrowMatchingArrayEntry({
        varName,
        receivedValue,
        component,
        errorMessage,
    }: {
        varName: string;
        receivedValue: Record<string, any>;
        component: any;
        errorMessage: string;
    }): string {
        let matchingArrayEntry: string | undefined;
        if (
            component.state[varName].isArray &&
            component.state[varName].arrayEntryNames
        ) {
            for (let arrayEntryName of component.state[varName]
                .arrayEntryNames) {
                if (arrayEntryName in receivedValue) {
                    matchingArrayEntry = arrayEntryName;
                    break;
                }
            }
        }
        if (!matchingArrayEntry) {
            throw Error(errorMessage);
        }
        return matchingArrayEntry;
    }

    /**
     * Decide whether two state-variable values should be treated as
     * unchanged for the purpose of `checkForActualChange`. Triple-equals for
     * scalars; for arrays, a shallow first-dimension comparison.
     *
     * TODO: deeper comparison for arrays? Likely unnecessary — array state
     * variables usually surface deeper changes through their own machinery.
     */
    _isUnchanged(newValue: any, previousValue: any): boolean {
        if (newValue === previousValue) {
            return true;
        }
        if (Array.isArray(newValue) && Array.isArray(previousValue)) {
            return (
                newValue.length === previousValue.length &&
                newValue.every((v, i) => v === previousValue[i])
            );
        }
        return false;
    }

    // The five state-variable name-resolution helpers below live as pure
    // functions in StateVariableNameResolver.ts. The wrappers preserve the
    // public surface (`core.findCaseInsensitiveMatches`, etc., plus the
    // by-reference passes used in composite sugar functions) by injecting
    // `componentInfoObjects` and delegating.
}

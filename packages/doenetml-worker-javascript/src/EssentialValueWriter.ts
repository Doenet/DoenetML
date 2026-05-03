import me from "math-expressions";
import { preprocessMathInverseDefinition } from "./utils/math";

/**
 * Applies authored / interactive state-variable changes to the live
 * component tree:
 *
 *  - `processNewStateVariableValues` is the bulk path used at boot to
 *    re-apply persisted/restored state
 *  - `requestComponentChanges` is the per-update path that walks an
 *    update instruction's inverse-definition chain, threading desired
 *    values through dependencies until each lands on an essential or
 *    inverse-set target
 *  - `calculateEssentialVariableChanges` and
 *    `calculatePrimitiveChildChanges` produce the diff records that
 *    feed the persistence pipeline
 *  - `replacementChangesFromCompositesToUpdate` is the queued flush of
 *    composites whose replacements need recomputing after a value moved
 *
 * Writes directly to `comp.essentialState[*]`, `compStateObj.usedDefault`
 * / `usedDefaultByArrayKey`, `parent.definingChildren[*]`, and
 * `updateInfo.stateVariableUpdatesForMissingComponents`. Reads (but does
 * not own) `cumulativeStateVariableChanges` (written by `UpdateExecutor`
 * and `DeletionEngine`) and `essentialValuesSavedInDefinition` (written
 * by `StateVariableEvaluator`). Holds a back-reference to Core for the
 * rest of the hot state and the other extracted managers.
 *
 * Note: this is the essential-write engine. The save-to-localStorage /
 * database I/O it triggers lives in `StatePersistence`, instantiated
 * separately on Core.
 */
export class EssentialValueWriter {
    core: any;

    constructor({ core }: { core: any }) {
        this.core = core;
    }

    async executeUpdateStateVariables(newStateVariableValues) {
        await this.processNewStateVariableValues(newStateVariableValues);

        // calculate any replacement changes on composites touched
        let replacementResult =
            await this.replacementChangesFromCompositesToUpdate();

        if (replacementResult.updatedComposites) {
            // make sure the new composite replacements didn't
            // create other composites that have to be expanded
            await this.core.expandAllComposites(this.core.document);
            await this.core.expandAllComposites(this.core.document, true);

            if (this.core.updateInfo.stateVariablesToEvaluate) {
                let stateVariablesToEvaluate =
                    this.core.updateInfo.stateVariablesToEvaluate;
                this.core.updateInfo.stateVariablesToEvaluate = [];
                for (let {
                    componentIdx,
                    stateVariable,
                } of stateVariablesToEvaluate) {
                    let comp = this.core._components[componentIdx];
                    if (comp && comp.state[stateVariable]) {
                        await this.core.getStateVariableValue({
                            component: comp,
                            stateVariable,
                        });
                    }
                }
            }
        }

        // calculate any replacement changes on composites touched again
        await this.replacementChangesFromCompositesToUpdate();

        // TODO: do we need to check again if update composites to expand again?
        // If so, how would we end the loop?
    }

    async replacementChangesFromCompositesToUpdate() {
        let compositesToUpdateReplacements = [
            ...this.core.updateInfo.compositesToUpdateReplacements,
        ];
        this.core.updateInfo.compositesToUpdateReplacements.clear();

        let compositesNotReady = new Set([]);

        let nPasses = 0;

        let updatedComposites = false;

        let componentChanges: any[] = []; // TODO: what to do with componentChanges?
        while (compositesToUpdateReplacements.length > 0) {
            for (let cIdx of compositesToUpdateReplacements) {
                let composite = this.core._components[cIdx];
                if (
                    composite instanceof
                        this.core.componentInfoObjects.allComponentClasses
                            ._composite &&
                    composite.isExpanded &&
                    !composite.isInErrorState
                ) {
                    if (
                        composite.state.readyToExpandWhenResolved
                            .initiallyResolved
                    ) {
                        if (
                            await composite.stateValues
                                .isInactiveCompositeReplacement
                        ) {
                            this.core.updateInfo.inactiveCompositesToUpdateReplacements.add(
                                cIdx,
                            );
                        } else {
                            let result =
                                await this.core.updateCompositeReplacements({
                                    component: composite,
                                    componentChanges,
                                });

                            if (
                                Object.keys(result.addedComponents).length > 0
                            ) {
                                updatedComposites = true;
                            }
                            if (
                                Object.keys(result.deletedComponents).length > 0
                            ) {
                                updatedComposites = true;
                            }
                        }
                    } else {
                        compositesNotReady.add(cIdx);
                    }
                }
            }
            // Is it possible that could ever get an infinite loop here?
            // I.e., is there some type of circular dependency among composites
            // that could happen and we aren't detecting?
            // Note: have encountered cases where a composite must be updated twice
            // in this loop
            // Note 2: if we don't update a composite here, the state variable indicating
            // its replacements need processing may remain stale, which will
            // prevent futher changes from being triggered
            compositesToUpdateReplacements = [
                ...this.core.updateInfo.compositesToUpdateReplacements,
            ];
            this.core.updateInfo.compositesToUpdateReplacements.clear();

            // just in case have infinite loop, throw error after 100 passes
            nPasses++;
            if (nPasses > 100) {
                throw Error(
                    `Seem to have an infinite loop while calculating replacement changes`,
                );
            }
        }

        this.core.updateInfo.compositesToUpdateReplacements =
            compositesNotReady;

        // return { componentChanges };
        return { updatedComposites };
    }

    async processNewStateVariableValues(
        newStateVariableValues,
        newComponent = false,
    ) {
        // console.log("process new state variable values");
        // console.log(JSON.parse(JSON.stringify(newStateVariableValues)));

        let nFailures = 0;

        let foundIgnore = false;

        for (const cIdxStr in newStateVariableValues) {
            const cIdx = Number(cIdxStr);
            let comp = this.core._components[cIdx];

            if (comp === undefined) {
                // console.warn(`can't update state variables of component ${cIdx}, as it doesn't exist.`);
                // nFailures += 1;

                let updatesForComp =
                    this.core.updateInfo
                        .stateVariableUpdatesForMissingComponents[cIdx];
                if (updatesForComp === undefined) {
                    updatesForComp =
                        this.core.updateInfo.stateVariableUpdatesForMissingComponents[
                            cIdx
                        ] = {};
                }

                Object.assign(updatesForComp, newStateVariableValues[cIdx]);

                continue;
            }

            let newComponentStateVariables = newStateVariableValues[cIdx];

            for (let vName in newComponentStateVariables) {
                let compStateObj = comp.state[vName];
                if (compStateObj === undefined) {
                    let match = vName.match(/^__def_primitive_(\d+)$/);

                    if (!match && newComponent) {
                        // if we have a newly created component, then we don't ignore primitive definitions
                        // (they are ignored as an optimization when changing variables dynamically
                        // so that child don't have to be reprocessed)
                        match = vName.match(/^__def_primitive_ignore_(\d+)$/);
                    }

                    if (match) {
                        let childInd = Number(match[1]);

                        comp.definingChildren[childInd] =
                            newComponentStateVariables[vName];

                        await this.core.processNewDefiningChildren({
                            parent: comp,
                            expandComposites: false,
                        });

                        continue;
                    } else {
                        match = vName.match(/^__def_primitive_ignore_(\d+)$/);

                        if (match) {
                            let childInd = Number(match[1]);

                            comp.definingChildren[childInd] =
                                newComponentStateVariables[vName];

                            foundIgnore = true;

                            // since marked to ignore, we don't process new defining children

                            continue;
                        }
                    }

                    this.core.addDiagnostic({
                        type: "info",
                        message: `can't update state variable ${vName} of component ${cIdx}, as it doesn't exist.`,
                        position: this.core._components[cIdx].position,
                        sourceDoc: this.core._components[cIdx].sourceDoc,
                    });
                    continue;
                }

                if (!compStateObj.hasEssential) {
                    this.core.addDiagnostic({
                        type: "info",
                        message: `can't update state variable ${vName} of component ${cIdx}, as it does not have an essential state variable.`,
                        position: this.core._components[cIdx].position,
                        sourceDoc: this.core._components[cIdx].sourceDoc,
                    });
                    continue;
                }

                let essentialVarName = vName;
                if (comp.state[vName].essentialVarName) {
                    essentialVarName = comp.state[vName].essentialVarName;
                }

                if (
                    vName in
                    this.core.rendererVariablesByComponentType[
                        comp.componentType
                    ]
                ) {
                    this.core.updateInfo.componentsToUpdateRenderers.add(
                        comp.componentIdx,
                    );
                }

                if (compStateObj.isArray) {
                    let essentialArray = comp.essentialState[essentialVarName];

                    if (!Array.isArray(essentialArray)) {
                        essentialArray = comp.essentialState[essentialVarName] =
                            [];
                    }

                    let arrayEntryNamesAffected = [];

                    // If array size state variable isn't initially resolved,
                    // arraySize will return an empty array.
                    // Call its value to resolve it
                    if (
                        !comp.state[compStateObj.arraySizeStateVariable]
                            .initiallyResolved
                    ) {
                        await comp.state[compStateObj.arraySizeStateVariable]
                            .value;
                    }

                    let arraySize = await compStateObj.arraySize;

                    // newComponentStateVariables[vName] must be an object keyed on arrayKeys
                    // except that it will have mergeObject=true
                    // to tell external functions new attributes of the object
                    // should be merged into the old object

                    for (let arrayKey in newComponentStateVariables[vName]) {
                        if (arrayKey === "mergeObject") {
                            continue;
                        }

                        let set = (x) => x;
                        if (compStateObj.set) {
                            set = compStateObj.set;
                        }

                        let setResult = compStateObj.setArrayValue({
                            value: set(
                                newComponentStateVariables[vName][arrayKey],
                            ),
                            arrayKey,
                            arraySize,
                            arrayValues: essentialArray,
                        });

                        compStateObj.usedDefaultByArrayKey[arrayKey] = false;

                        nFailures += setResult.nFailures;

                        // mark any array entry state variables containing arrayKey
                        // as affected

                        let varNamesContainingArrayKey =
                            compStateObj.varNamesIncludingArrayKeys[arrayKey];
                        if (varNamesContainingArrayKey) {
                            arrayEntryNamesAffected.push(
                                ...varNamesContainingArrayKey,
                            );
                        }
                    }

                    for (let arrayEntryName of arrayEntryNamesAffected) {
                        await this.core.recordActualChangeInStateVariable({
                            componentIdx: cIdx,
                            varName: arrayEntryName,
                        });
                    }
                } else {
                    // don't have array

                    if (!compStateObj.hasEssential) {
                        this.core.addDiagnostic({
                            type: "info",
                            message: `can't update state variable ${vName} of component ${cIdx}, as it does not have an essential state variable.`,
                            position: this.core._components[cIdx].position,
                            sourceDoc: this.core._components[cIdx].sourceDoc,
                        });
                        continue;
                    }

                    if (compStateObj.set) {
                        comp.essentialState[essentialVarName] =
                            compStateObj.set(newComponentStateVariables[vName]);
                    } else {
                        comp.essentialState[essentialVarName] =
                            newComponentStateVariables[vName];
                    }

                    delete compStateObj.usedDefault;
                }

                await this.core.recordActualChangeInStateVariable({
                    componentIdx: cIdx,
                    varName: vName,
                });
            }
        }

        return { nFailures, foundIgnore };
    }

    async requestComponentChanges({
        instruction,
        initialChange = true,
        workspace,
        newStateVariableValues,
    }) {
        // console.log(`request component changes`);
        // console.log(instruction);
        // console.log('overall workspace')
        // console.log(JSON.parse(JSON.stringify(workspace)))

        let component = this.core._components[instruction.componentIdx];

        let stateVariable = this.core.substituteAliases({
            stateVariables: [instruction.stateVariable],
            componentClass: component.constructor,
        })[0];

        if (workspace[instruction.componentIdx] === undefined) {
            workspace[instruction.componentIdx] = {};
        }
        let componentWorkspace = workspace[instruction.componentIdx];

        let stateVarObj = component.state[stateVariable];

        let additionalStateVariablesDefined =
            stateVarObj.additionalStateVariablesDefined;

        let allStateVariablesAffected = [stateVariable];
        if (additionalStateVariablesDefined) {
            allStateVariablesAffected.push(...additionalStateVariablesDefined);
        }

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
        }

        let inverseDefinitionArgs =
            await this.core.getStateVariableDefinitionArguments({
                component,
                stateVariable,
                excludeDependencyValues:
                    stateVarObj.excludeDependencyValuesInInverseDefinition,
                consumeChanges: false,
            });
        inverseDefinitionArgs.componentInfoObjects =
            this.core.componentInfoObjects;
        inverseDefinitionArgs.initialChange = initialChange;
        inverseDefinitionArgs.stateValues = component.stateValues;
        inverseDefinitionArgs.overrideFixed = instruction.overrideFixed;
        inverseDefinitionArgs.shadowedVariable = instruction.shadowedVariable;
        inverseDefinitionArgs.sourceDetails = instruction.sourceDetails;

        if (instruction.overrides) {
            inverseDefinitionArgs.overrides = instruction.overrides;
        }

        let stateVariableForWorkspace = stateVariable;

        if (stateVarObj.isArrayEntry) {
            let arrayStateVariable = stateVarObj.arrayStateVariable;
            stateVariableForWorkspace = arrayStateVariable;

            let desiredValuesForArray: Record<string, any> = {};
            if (inverseDefinitionArgs.arrayKeys.length === 1) {
                if ("value" in instruction) {
                    desiredValuesForArray[inverseDefinitionArgs.arrayKeys[0]] =
                        instruction.value;
                } else if ("valueOfStateVariable" in instruction) {
                    let otherStateVariable = this.core.substituteAliases({
                        stateVariables: [instruction.valueOfStateVariable],
                        componentClass: component.constructor,
                    })[0];
                    let sObj = component.state[otherStateVariable];
                    if (sObj) {
                        desiredValuesForArray[
                            inverseDefinitionArgs.arrayKeys[0]
                        ] = await sObj.value;
                    } else {
                        throw Error(
                            `Invalid instruction to change ${instruction.stateVariable} of ${instruction.componentIdx}, value of state variable ${instruction.valueOfStateVariable} not found.`,
                        );
                    }
                }
            } else {
                for (let [
                    ind,
                    arrayKey,
                ] of inverseDefinitionArgs.arrayKeys.entries()) {
                    if (Array.isArray(instruction.value)) {
                        desiredValuesForArray[arrayKey] =
                            instruction.value[ind];
                    } else if (instruction.value instanceof me.class) {
                        try {
                            desiredValuesForArray[arrayKey] =
                                instruction.value.get_component(ind);
                        } catch (e) {}
                    }
                }
            }
            inverseDefinitionArgs.desiredStateVariableValues = {
                [arrayStateVariable]: desiredValuesForArray,
            };
        } else {
            if ("value" in instruction) {
                inverseDefinitionArgs.desiredStateVariableValues = {
                    [stateVariable]: instruction.value,
                };
            } else if ("valueOfStateVariable" in instruction) {
                let otherStateVariable = this.core.substituteAliases({
                    stateVariables: [instruction.valueOfStateVariable],
                    componentClass: component.constructor,
                })[0];
                let sObj = component.state[otherStateVariable];
                if (sObj) {
                    inverseDefinitionArgs.desiredStateVariableValues = {
                        [stateVariable]: await sObj.value,
                    };
                } else {
                    throw Error(
                        `Invalid instruction to change ${instruction.stateVariable} of ${instruction.componentIdx}, value of state variable ${instruction.valueOfStateVariable} not found.`,
                    );
                }
            }
        }

        let stateVariableWorkspace =
            componentWorkspace[stateVariableForWorkspace];
        if (stateVariableWorkspace === undefined) {
            stateVariableWorkspace = componentWorkspace[
                stateVariableForWorkspace
            ] = {};
        }

        if (stateVarObj.additionalStateVariablesDefined) {
            // combine workspaces of additional state variables into one
            for (let varName2 of stateVarObj.additionalStateVariablesDefined) {
                let stateVariableForWorkspace2 = varName2;
                let stateVarObj2 = component.state[varName2];
                if (stateVarObj2.isArray) {
                    stateVariableForWorkspace2 = stateVarObj.arrayStateVariable;
                }
                let stateVariableWorkspace2 =
                    componentWorkspace[stateVariableForWorkspace2];
                if (stateVariableWorkspace2) {
                    Object.assign(
                        stateVariableWorkspace,
                        stateVariableWorkspace2,
                    );
                    componentWorkspace[stateVariableForWorkspace2] =
                        stateVariableWorkspace;
                }
            }
        }

        inverseDefinitionArgs.workspace = stateVariableWorkspace;

        if (instruction.additionalStateVariableValues) {
            for (let varName2 in instruction.additionalStateVariableValues) {
                if (
                    !stateVarObj.additionalStateVariablesDefined.includes(
                        varName2,
                    )
                ) {
                    this.core.addDiagnostic({
                        type: "info",
                        message: `Can't invert ${varName2} at the same time as ${stateVariable}, as not an additional state variable defined`,
                        position: component.position,
                        sourceDoc: component.sourceDoc,
                    });
                    continue;
                }
                // Note: don't check if varName2 is an array
                // Haven't implemented changing an array as an additional state variable value
                inverseDefinitionArgs.desiredStateVariableValues[varName2] =
                    instruction.additionalStateVariableValues[varName2];
            }
        }

        if (!stateVarObj.inverseDefinition) {
            this.core.addDiagnostic({
                type: "info",
                message: `Cannot change state variable ${stateVariable} of ${component.componentIdx} as it doesn't have an inverse definition`,
                position: component.position,
                sourceDoc: component.sourceDoc,
            });
            return;
        }

        if (
            !instruction.overrideFixed &&
            !stateVarObj.ignoreFixed &&
            (await component.stateValues.fixed)
        ) {
            this.core.addDiagnostic({
                type: "info",
                message: `Changing ${stateVariable} of ${component.componentIdx} did not succeed because fixed is true.`,
                position: component.position,
                sourceDoc: component.sourceDoc,
            });
            return;
        }

        if (
            !instruction.overrideFixed &&
            stateVarObj.isLocation &&
            (await component.stateValues.fixLocation)
        ) {
            this.core.addDiagnostic({
                type: "info",
                message: `Changing ${stateVariable} of ${component.componentIdx} did not succeed because fixLocation is true.`,
                position: component.position,
                sourceDoc: component.sourceDoc,
            });
            return;
        }

        if (
            !(
                initialChange ||
                (await component.stateValues.modifyIndirectly) !== false
            )
        ) {
            this.core.addDiagnostic({
                type: "info",
                message: `Changing ${stateVariable} of ${component.componentIdx} did not succeed because modifyIndirectly is false.`,
                position: component.position,
                sourceDoc: component.sourceDoc,
            });
            return;
        }

        let inverseResult = await stateVarObj.inverseDefinition(
            inverseDefinitionArgs,
        );

        // Clear any change flags that were set during the inverse definition call
        // This ensures stale flags don't accumulate, even though we didn't consume during the call
        if (!stateVarObj.excludeDependencyValuesInInverseDefinition) {
            await this.core.dependencies.getStateVariableDependencyValues({
                component,
                stateVariable,
                consumeChanges: true,
            });
        }

        if (inverseResult.sendDiagnostics) {
            for (const diagnostic of inverseResult.sendDiagnostics) {
                this.core.addDiagnostic({
                    position: component.position,
                    sourceDoc: component.sourceDoc,
                    ...diagnostic,
                });
            }
        }

        if (!inverseResult.success) {
            // console.log(`Changing ${stateVariable} of ${component.componentIdx} did not succeed.`);
            return;
        }

        // console.log("inverseResult");
        // console.log(inverseResult);

        let combinedInstructions: any[] = [];

        let arrayInstructionInProgress: any;

        for (let newInstruction of inverseResult.instructions) {
            let foundArrayInstruction = false;

            if (newInstruction.setDependency) {
                let dependencyName = newInstruction.setDependency;

                let dep =
                    this.core.dependencies.downstreamDependencies[
                        component.componentIdx
                    ][stateVariable][dependencyName];
                if (
                    ["stateVariable", "parentStateVariable"].includes(
                        dep.dependencyType,
                    ) &&
                    dep.downstreamComponentIndices.length === 1
                ) {
                    let dComponentIdx = dep.downstreamComponentIndices[0];
                    let dVarName =
                        dep.mappedDownstreamVariableNamesByComponent[0][0];

                    let depStateVarObj =
                        this.core._components[dComponentIdx].state[dVarName];

                    if (
                        (depStateVarObj.isArrayEntry ||
                            depStateVarObj.isArray) &&
                        !depStateVarObj.doNotCombineInverseArrayInstructions
                    ) {
                        let arrayStateVariable = depStateVarObj.isArrayEntry
                            ? depStateVarObj.arrayStateVariable
                            : dVarName;

                        if (
                            arrayInstructionInProgress &&
                            !(
                                arrayInstructionInProgress.componentIdx ===
                                    dComponentIdx &&
                                arrayInstructionInProgress.stateVariable ===
                                    arrayStateVariable &&
                                arrayInstructionInProgress.shadowedVariable ===
                                    newInstruction.shadowedVariable &&
                                arrayInstructionInProgress.treatAsInitialChange ===
                                    newInstruction.treatAsInitialChange
                            )
                        ) {
                            // arrayInstructionInProgress didn't match,
                            // so add it to combined instructions
                            combinedInstructions.push(
                                arrayInstructionInProgress,
                            );
                            arrayInstructionInProgress = undefined;
                        }

                        // haven't implemented combining when have additional dependency values
                        if (
                            !(
                                newInstruction.additionalDependencyValues ||
                                depStateVarObj.basedOnArrayKeyStateVariables
                            )
                        ) {
                            foundArrayInstruction = true;

                            if (!arrayInstructionInProgress) {
                                arrayInstructionInProgress = {
                                    combinedArray: true,
                                    componentIdx: dComponentIdx,
                                    stateVariable: arrayStateVariable,
                                    shadowedVariable:
                                        newInstruction.shadowedVariable,
                                    treatAsInitialChange:
                                        newInstruction.treatAsInitialChange,
                                    desiredValue: {},
                                };
                            }

                            if (depStateVarObj.isArrayEntry) {
                                let arrayKeys = await depStateVarObj.arrayKeys;

                                if (arrayKeys.length === 0) {
                                    // To allow for the possibility of setting array components
                                    // that don't yet exist, we recompute the array keys
                                    // under the scenario that we ignore the array size.
                                    // Unless allowExtraArrayKeysInInverse is set, any extra keys will be
                                    // filtered out, so add them only in this case.
                                    let depArrayStateVarObj =
                                        this.core._components[dComponentIdx]
                                            .state[arrayStateVariable];
                                    if (
                                        depArrayStateVarObj.allowExtraArrayKeysInInverse
                                    ) {
                                        arrayKeys =
                                            depArrayStateVarObj.getArrayKeysFromVarName(
                                                {
                                                    arrayEntryPrefix:
                                                        depStateVarObj.entryPrefix,
                                                    varEnding:
                                                        depStateVarObj.varEnding,
                                                    numDimensions:
                                                        depArrayStateVarObj.numDimensions,
                                                },
                                            );
                                    }
                                }

                                if (arrayKeys.length === 1) {
                                    arrayInstructionInProgress.desiredValue[
                                        arrayKeys[0]
                                    ] = newInstruction.desiredValue;
                                } else {
                                    for (let [
                                        ind,
                                        arrayKey,
                                    ] of arrayKeys.entries()) {
                                        arrayInstructionInProgress.desiredValue[
                                            arrayKey
                                        ] = newInstruction.desiredValue[ind];
                                    }
                                }
                            } else {
                                if (
                                    depStateVarObj.numDimensions === 1 ||
                                    !Array.isArray(newInstruction.desiredValue)
                                ) {
                                    if (
                                        typeof newInstruction.desiredValue ===
                                            "object" &&
                                        !(
                                            newInstruction.desiredValue instanceof
                                            me.class
                                        )
                                    ) {
                                        Object.assign(
                                            arrayInstructionInProgress.desiredValue,
                                            newInstruction.desiredValue,
                                        );
                                    } else {
                                        // If the desired value isn't a non math-expression object,
                                        // then it is clearly not in the form {arrayKey:value}.
                                        // Since we don't have an arrayKey, just set the first array key in the array.
                                        let firstArrayKey = Array(
                                            depStateVarObj.numDimensions,
                                        )
                                            .fill("0")
                                            .join(",");
                                        arrayInstructionInProgress.desiredValue[
                                            firstArrayKey
                                        ] = newInstruction.desiredValue;
                                    }
                                } else {
                                    // need to convert multidimensional array (newInstruction.desiredValue)
                                    // to an object with multidimesional arrayKeys
                                    // where each array key is a concatenation of the array indices, joined by commas

                                    let convert_md_array = (
                                        array: any,
                                        n_dim: number,
                                    ): Record<string, any> => {
                                        if (n_dim === 1) {
                                            return Object.assign({}, array);
                                        } else {
                                            let new_obj: Record<string, any> =
                                                {};
                                            for (let ind in array) {
                                                let sub_obj = convert_md_array(
                                                    array[ind],
                                                    n_dim - 1,
                                                );
                                                for (let key in sub_obj) {
                                                    new_obj[`${ind},${key}`] =
                                                        sub_obj[key];
                                                }
                                            }
                                            return new_obj;
                                        }
                                    };
                                    Object.assign(
                                        arrayInstructionInProgress.desiredValue,
                                        convert_md_array(
                                            newInstruction.desiredValue,
                                            depStateVarObj.numDimensions,
                                        ),
                                    );
                                }
                            }
                        }
                    }
                }
            }

            if (!foundArrayInstruction) {
                if (arrayInstructionInProgress) {
                    combinedInstructions.push(arrayInstructionInProgress);
                    arrayInstructionInProgress = undefined;
                }
                combinedInstructions.push(newInstruction);
            }
        }

        if (arrayInstructionInProgress) {
            combinedInstructions.push(arrayInstructionInProgress);
            arrayInstructionInProgress = undefined;
        }

        for (let newInstruction of combinedInstructions) {
            if (newInstruction.setEssentialValue) {
                if (
                    !allStateVariablesAffected.includes(
                        newInstruction.setEssentialValue,
                    )
                ) {
                    let foundArrayMatch = false;
                    if (stateVarObj.isArrayEntry) {
                        let arrayStateVariables = [
                            stateVarObj.arrayStateVariable,
                        ];
                        if (stateVarObj.additionalStateVariablesDefined) {
                            for (let vName of stateVarObj.additionalStateVariablesDefined) {
                                let sObj = component.state[vName];
                                if (sObj.isArrayEntry) {
                                    arrayStateVariables.push(
                                        sObj.arrayStateVariable,
                                    );
                                }
                            }
                        }
                        foundArrayMatch = arrayStateVariables.includes(
                            newInstruction.setEssentialValue,
                        );
                    }
                    if (!foundArrayMatch) {
                        throw Error(
                            `Invalid inverse definition of ${stateVariable} of ${component.componentIdx}: specified changing value of ${newInstruction.setEssentialValue}, which is not a state variable defined with ${stateVariable}.`,
                        );
                    }
                }

                if (
                    !component.state[newInstruction.setEssentialValue]
                        .hasEssential
                ) {
                    throw Error(
                        `Invalid inverse definition of ${stateVariable} of ${component.componentIdx}: can't set essential value of ${newInstruction.setEssentialValue} if it is does not have an essential value.`,
                    );
                }

                if (!("value" in newInstruction)) {
                    throw Error(
                        `Invalid inverse definition of ${stateVariable} of ${component.componentIdx}: setEssentialValue must specify a value`,
                    );
                }

                let value = newInstruction.value;

                if (value instanceof me.class) {
                    let result = await preprocessMathInverseDefinition({
                        desiredValue: value,
                        stateValues: component.stateValues,
                        variableName: newInstruction.setEssentialValue,
                        workspace: stateVariableWorkspace,
                    });
                    value = result.desiredValue;
                }

                if (
                    component.state[newInstruction.setEssentialValue]
                        .doNotShadowEssential ||
                    component.state[newInstruction.setEssentialValue]
                        .shadowVariable
                ) {
                    // Note: if shadow state variable, then we don't shadow essential
                    // as the shadowed state variables will not use the essential value

                    this.calculateEssentialVariableChanges({
                        component,
                        varName: newInstruction.setEssentialValue,
                        value,
                        newStateVariableValues,
                        recurseToShadows: false,
                    });
                } else {
                    // For setting essential value, we keep the values for all
                    // shadowed components in sync.
                    // We find the original component and the recurse on all the components
                    // that shadow it.
                    // Don't include shadows due to propVariable
                    // unless it is a plain copy marked as returning the same type
                    let baseComponent = component;
                    while (
                        baseComponent.shadows &&
                        (baseComponent.shadows.propVariable === undefined ||
                            (baseComponent.doenetAttributes.fromImplicitProp &&
                                this.core._components[
                                    baseComponent.shadows.componentIdx
                                ].constructor.implicitPropReturnsSameType))
                    ) {
                        baseComponent =
                            this.core._components[
                                baseComponent.shadows.componentIdx
                            ];

                        // if any of the shadow sources are fixed, reject this change
                        if (
                            !instruction.overrideFixed &&
                            !stateVarObj.ignoreFixed &&
                            (await baseComponent.stateValues.fixed)
                        ) {
                            this.core.addDiagnostic({
                                type: "info",
                                message: `Changing ${stateVariable} of ${baseComponent.componentIdx} did not succeed because fixed is true.`,
                                position: baseComponent.position,
                                sourceDoc: baseComponent.sourceDoc,
                            });
                            return;
                        }

                        // if any of the shadow sources of a locatoin are fixLocation, reject this change
                        if (
                            !instruction.overrideFixed &&
                            !stateVarObj.isLocation &&
                            (await baseComponent.stateValues.fixLocation)
                        ) {
                            this.core.addDiagnostic({
                                type: "info",
                                message: `Changing ${stateVariable} of ${baseComponent.componentIdx} did not succeed because fixLocation is true.`,
                                position: baseComponent.position,
                                sourceDoc: baseComponent.sourceDoc,
                            });
                            return;
                        }
                    }

                    this.calculateEssentialVariableChanges({
                        component: baseComponent,
                        varName: newInstruction.setEssentialValue,
                        value,
                        newStateVariableValues,
                    });
                }
            } else if (newInstruction.setDependency) {
                let dependencyName = newInstruction.setDependency;

                let dep =
                    this.core.dependencies.downstreamDependencies[
                        component.componentIdx
                    ][stateVariable][dependencyName];

                if (dep.dependencyType === "child") {
                    if (newInstruction.childIndex === undefined) {
                        newInstruction.childIndex = 0;
                    }
                    if (newInstruction.variableIndex === undefined) {
                        newInstruction.variableIndex = 0;
                    }

                    let childInd = newInstruction.childIndex;

                    if (dep.downstreamPrimitives[childInd] !== null) {
                        // have a primitive child
                        // if desiredValue is same type of primitive, set it as a state variable

                        // TODO: how to address case if string index could change

                        if (
                            typeof newInstruction.desiredValue ===
                            typeof dep.downstreamPrimitives[childInd]
                        ) {
                            let parent = this.core._components[dep.parentIdx];

                            let activeChildInd =
                                dep.activeChildrenIndices[childInd];

                            // TODO: if child is a replacement of a composite, determine what to do
                            if (parent.compositeReplacementActiveRange) {
                                for (let compositeObj of parent.compositeReplacementActiveRange) {
                                    if (
                                        compositeObj.firstInd <=
                                            activeChildInd &&
                                        compositeObj.lastInd >= activeChildInd
                                    ) {
                                        throw Error(
                                            `Need to implement changing primitive replacements from composite (parent ${parent.componentIdx}, activeChildInd ${activeChildInd})`,
                                        );
                                    }
                                }
                            }

                            let definingInd = activeChildInd;
                            if (parent.compositeReplacementActiveRange) {
                                for (let compositeObj of parent.compositeReplacementActiveRange) {
                                    if (compositeObj.lastInd < definingInd) {
                                        definingInd -=
                                            compositeObj.lastInd -
                                            compositeObj.firstInd;
                                    }
                                }
                            }

                            // For primitive children, we keep the values for all
                            // shadowed parents in sync.
                            // We find the original parent and the recurse on all the parents
                            // that shadow it
                            let baseParent = parent;
                            while (
                                baseParent.shadows &&
                                baseParent.shadows.propVariable === undefined
                            ) {
                                baseParent =
                                    this.core._components[
                                        baseParent.shadows.componentIdx
                                    ];
                            }

                            let markToIgnoreForParent;

                            if (newInstruction.ignoreChildChangeForComponent) {
                                markToIgnoreForParent = parent.componentIdx;
                            }

                            this.calculatePrimitiveChildChanges({
                                parent: baseParent,
                                definingInd,
                                newValue: newInstruction.desiredValue,
                                newStateVariableValues,
                                markToIgnoreForParent,
                            });
                        }
                    } else {
                        // find downstream ind of childInd

                        let downstreamInd =
                            dep.downstreamPrimitives
                                .slice(0, childInd + 1)
                                .filter((x) => !x).length - 1;

                        let cIdx =
                            dep.downstreamComponentIndices[downstreamInd];
                        if (cIdx == undefined) {
                            throw Error(
                                `Invalid inverse definition of ${stateVariable} of ${component.componentIdx}: ${dependencyName} child of index ${newInstruction.childIndex} does not exist.`,
                            );
                        }
                        let varName =
                            dep.mappedDownstreamVariableNamesByComponent[
                                newInstruction.childIndex
                            ][newInstruction.variableIndex];
                        if (!varName) {
                            throw Error(
                                `Invalid inverse definition of ${stateVariable} of ${component.componentIdx}: ${dependencyName} variable of index ${newInstruction.variableIndex} does not exist.`,
                            );
                        }
                        let inst = {
                            componentIdx: cIdx,
                            stateVariable: varName,
                            value: newInstruction.desiredValue,
                            overrideFixed: instruction.overrideFixed,
                            arrayKey: newInstruction.arrayKey,
                        };
                        await this.requestComponentChanges({
                            instruction: inst,
                            initialChange:
                                newInstruction.treatAsInitialChange === true,
                            workspace,
                            newStateVariableValues,
                        });
                    }
                } else if (
                    [
                        "attributeComponent",
                        "shadowSource",
                        "adapterSource",
                        "targetComponent",
                    ].includes(dep.dependencyType)
                ) {
                    let cIdx = dep.downstreamComponentIndices[0];
                    let varName =
                        dep.mappedDownstreamVariableNamesByComponent[0][
                            newInstruction.variableIndex
                        ];
                    if (!varName) {
                        throw Error(
                            `Invalid inverse definition of ${stateVariable} of ${component.componentIdx}: ${dependencyName} variable of index ${newInstruction.variableIndex} does not exist.`,
                        );
                    }
                    let inst = {
                        componentIdx: cIdx,
                        stateVariable: varName,
                        value: newInstruction.desiredValue,
                        overrideFixed: instruction.overrideFixed,
                        arrayKey: newInstruction.arrayKey,
                    };
                    await this.requestComponentChanges({
                        instruction: inst,
                        initialChange:
                            newInstruction.treatAsInitialChange === true,
                        workspace,
                        newStateVariableValues,
                    });
                } else if (
                    [
                        "stateVariable",
                        "parentStateVariable",
                        "adapterSourceStateVariable",
                        "sourceCompositeStateVariable",
                    ].includes(dep.dependencyType) &&
                    dep.downstreamComponentIndices.length === 1
                ) {
                    let dComponentIdx = dep.downstreamComponentIndices[0];
                    let dVarName =
                        dep.mappedDownstreamVariableNamesByComponent[0][0];

                    let inst: any = {
                        componentIdx: dComponentIdx,
                        stateVariable: dVarName,
                        value: newInstruction.desiredValue,
                        overrideFixed: instruction.overrideFixed,
                        shadowedVariable: newInstruction.shadowedVariable,
                    };
                    if (newInstruction.additionalDependencyValues) {
                        // it is possible to simultaneously set the values of multiple
                        // component state variables, if they share a definition
                        // i.e. are in additionalStateVariablesDefined

                        let stateVarObj =
                            this.core._components[dComponentIdx].state[
                                dVarName
                            ];
                        for (let dependencyName2 in newInstruction.additionalDependencyValues) {
                            let dep2 =
                                this.core.dependencies.downstreamDependencies[
                                    component.componentIdx
                                ][stateVariable][dependencyName2];
                            if (
                                !(
                                    [
                                        "stateVariable",
                                        "parentStateVariable",
                                    ].includes(dep2.dependencyType) &&
                                    dep2.downstreamComponentIndices.length === 1
                                )
                            ) {
                                this.core.addDiagnostic({
                                    type: "info",
                                    message: `Can't simultaneously set additional dependency value ${dependencyName2} if it isn't a state variable`,
                                    position:
                                        this.core._components[dComponentIdx]
                                            .position,
                                    sourceDoc:
                                        this.core._components[dComponentIdx]
                                            .sourceDoc,
                                });
                                continue;
                            }

                            let varName2 =
                                dep2
                                    .mappedDownstreamVariableNamesByComponent[0][0];
                            if (
                                dep2.downstreamComponentIndices[0] !==
                                    dComponentIdx ||
                                !stateVarObj.additionalStateVariablesDefined.includes(
                                    varName2,
                                )
                            ) {
                                this.core.addDiagnostic({
                                    type: "info",
                                    message: `Can't simultaneously set additional dependency value ${dependencyName2} if it doesn't correspond to additional state variable defined of ${dependencyName}'s state variable`,
                                    position:
                                        this.core._components[dComponentIdx]
                                            .position,
                                    sourceDoc:
                                        this.core._components[dComponentIdx]
                                            .sourceDoc,
                                });
                                continue;
                            }
                            if (!inst.additionalStateVariableValues) {
                                inst.additionalStateVariableValues = {};
                            }
                            inst.additionalStateVariableValues[varName2] =
                                newInstruction.additionalDependencyValues[
                                    dependencyName2
                                ];
                        }
                    }
                    await this.requestComponentChanges({
                        instruction: inst,
                        initialChange:
                            newInstruction.treatAsInitialChange === true,
                        workspace,
                        newStateVariableValues,
                    });
                } else {
                    throw Error(
                        `unimplemented dependency type ${dep.dependencyType} in requestComponentChanges`,
                    );
                }
            } else if (newInstruction.combinedArray) {
                let inst = {
                    componentIdx: newInstruction.componentIdx,
                    stateVariable: newInstruction.stateVariable,
                    value: newInstruction.desiredValue,
                    overrideFixed: instruction.overrideFixed,
                    shadowedVariable: newInstruction.shadowedVariable,
                };

                await this.requestComponentChanges({
                    instruction: inst,
                    initialChange: newInstruction.treatAsInitialChange === true,
                    workspace,
                    newStateVariableValues,
                });
            } else {
                console.log(newInstruction);
                throw Error(
                    `Unrecognized instruction in inverse definition of ${stateVariable} of ${component.componentIdx}`,
                );
            }
        }

        return;
    }

    calculateEssentialVariableChanges({
        component,
        varName,
        value,
        newStateVariableValues,
        recurseToShadows = true,
    }) {
        if (!newStateVariableValues[component.componentIdx]) {
            newStateVariableValues[component.componentIdx] = {};
        }

        if (component.state[varName].isArray) {
            if (!newStateVariableValues[component.componentIdx][varName]) {
                // include key mergeObject to let external functions
                // know that new attributes of the object
                // should be merged into the old object
                newStateVariableValues[component.componentIdx][varName] = {
                    mergeObject: true,
                };
            }

            Object.assign(
                newStateVariableValues[component.componentIdx][varName],
                value,
            );
        } else {
            newStateVariableValues[component.componentIdx][varName] = value;
        }

        if (recurseToShadows && component.shadowedBy) {
            for (let shadow of component.shadowedBy) {
                // Don't include shadows due to propVariable
                // unless it is a plain copy marked as returning the same type
                if (
                    shadow.shadows.propVariable === undefined ||
                    (shadow.doenetAttributes.fromImplicitProp &&
                        component.constructor.implicitPropReturnsSameType)
                ) {
                    this.calculateEssentialVariableChanges({
                        component: shadow,
                        varName,
                        value,
                        newStateVariableValues,
                    });
                }
            }
        }
    }

    calculatePrimitiveChildChanges({
        parent,
        definingInd,
        newValue,
        newStateVariableValues,
        markToIgnoreForParent,
    }) {
        if (!newStateVariableValues[parent.componentIdx]) {
            newStateVariableValues[parent.componentIdx] = {};
        }
        if (parent.componentIdx === markToIgnoreForParent) {
            newStateVariableValues[parent.componentIdx][
                `__def_primitive_ignore_${definingInd}`
            ] = newValue;
        } else {
            newStateVariableValues[parent.componentIdx][
                `__def_primitive_${definingInd}`
            ] = newValue;
        }

        if (parent.shadowedBy) {
            for (let shadow of parent.shadowedBy) {
                if (shadow.shadows.propVariable === undefined) {
                    this.calculatePrimitiveChildChanges({
                        parent: shadow,
                        definingInd,
                        newValue,
                        newStateVariableValues,
                        markToIgnoreForParent,
                    });
                }
            }
        }
    }
}

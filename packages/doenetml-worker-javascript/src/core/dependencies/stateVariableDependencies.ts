/**
 * Dependency subclasses that read state-variable values from a single
 * downstream component. `StateVariableDependency` is the workhorse;
 * the rest specialize it (component-type lookup, array-size lookup,
 * unresolved-path resolution, multi-variable bundles, recursive
 * dependency walks).
 */

import { Dependency, cloneChangeMetadataIfNeeded } from "./Dependency";

export class StateVariableDependency extends Dependency {
    static dependencyType = "stateVariable";

    setUpParameters() {
        if (this.definition.componentIdx != undefined) {
            this.componentIdx = this.definition.componentIdx;
            this.specifiedComponentName = this.componentIdx;
        } else {
            this.componentIdx = this.upstreamComponentIdx;
        }

        if (this.definition.variableName == undefined) {
            throw Error(
                `Invalid state variable ${this.representativeStateVariable} of ${this.upstreamComponentIdx}, dependency ${this.dependencyName}: variableName is not defined`,
            );
        }
        this.originalDownstreamVariableNames = [this.definition.variableName];

        // In order to be allowed to set a value in an inverse definition,
        // we must create a dependency (as that way we can detect circular dependencies)
        // However, if the value won't be used in the definition, add the flag onlyToSetInInverseDefinition,
        // which we prevent its value from being calculated or marked stale
        // due to this dependency (or included in recursive dependency values)
        if (this.definition.onlyToSetInInverseDefinition) {
            this.onlyToSetInInverseDefinition = true;
        }

        if (this.definition.returnAsComponentObject) {
            this.returnSingleComponent = true;
        } else {
            this.returnSingleVariableValue = true;
        }
    }

    async determineDownstreamComponents() {
        let component = this.dependencyHandler._components[this.componentIdx];

        if (!component) {
            this.addBlockerUpdateTriggerForMissingComponent(this.componentIdx);

            return {
                success: false,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }

        return {
            success: true,
            downstreamComponentIndices: [this.componentIdx],
            downstreamComponentTypes: [component.componentType],
        };
    }

    deleteFromUpdateTriggers() {
        if (this.specifiedComponentName) {
            this.deleteUpdateTriggerForMissingComponent(
                this.specifiedComponentName,
            );
        }
    }
}

/**
 * A dependency to return the value of the state variable given an `unresolvedPath`.
 *
 * Only the first component of `unresolvedPath` {name, index} is used.
 *
 * If only `name` is provided, then return the value of the state variable `name`.
 *
 * If only `index` is provided, then the component must have `variableForIndexAsProp` set to an array state variable.
 * The value of the index from the array state variable is returned.
 *
 * If both `name` and `index` are provided, then `name` must be an array state variable.
 * The value of the index from the array state variable is returned.
 */
export class StateVariableFromUnresolvedPathDependency extends Dependency {
    static dependencyType = "stateVariableFromUnresolvedPath";

    setUpParameters() {
        if (this.definition.componentIdx != undefined) {
            this.componentIdx = this.definition.componentIdx;
            this.specifiedComponentName = this.componentIdx;
        } else {
            this.componentIdx = this.upstreamComponentIdx;
        }

        if (!this.definition.unresolvedPath) {
            throw Error(
                `Invalid state variable ${this.representativeStateVariable} of ${this.upstreamComponentIdx}, dependency ${this.dependencyName}: unresolvedPath is not defined`,
            );
        }

        this.originalDownstreamVariableNames = [];

        if (this.definition.returnAsComponentObject) {
            this.returnSingleComponent = true;
        } else {
            this.returnSingleVariableValue = true;
        }
    }

    async determineDownstreamComponents() {
        const component = this.dependencyHandler._components[this.componentIdx];

        if (!component) {
            this.addBlockerUpdateTriggerForMissingComponent(this.componentIdx);

            return {
                success: false,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }

        let unresolvedPath = [...this.definition.unresolvedPath];
        let nextPart = unresolvedPath.shift();

        let variableName = nextPart.name;

        if (variableName === "") {
            variableName = component.constructor.variableForIndexAsProp;
            if (!variableName) {
                // if refer to index on a component that doesn't have variableForIndexAsProp,
                // then return nothing
                return {
                    success: true,
                    downstreamComponentIndices: [],
                    downstreamComponentTypes: [],
                };
            }
        }

        this.originalDownstreamVariableNames = [variableName];

        let propIndex = [];
        let foundBadIndex = false;
        if (nextPart.index.length > 0) {
            propIndex = nextPart.index.map((index_part: any) =>
                Math.round(Number(index_part.value[0])),
            );
            if (!propIndex.every(Number.isFinite)) {
                foundBadIndex = true;
            }
        }

        nextPart = unresolvedPath.shift();

        if (
            foundBadIndex ||
            unresolvedPath.length > 0 ||
            nextPart?.index.length > 0
        ) {
            // At this point, we haven't implement searching an entire path.
            // Hence, we regard the reference as invalid and return nothing if
            // 1. we have a bad index
            // 2. we have a third part of the unresolved path, or
            // 3. the second part of the unresolved path as an index.
            return {
                success: true,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }

        if (nextPart != undefined) {
            let foundMatchToNextName = false;

            // `indexAliases` exists on the runtime descriptor objects but
            // isn't part of the declared `StateVariableDescription` type
            // yet — see `utils/componentInfoObjects.ts`. Cast locally so
            // adding it to the public type can be a separate, audited PR.
            const stateVarInfo = this.dependencyHandler.componentInfoObjects
                .publicStateVariableInfo[component.componentType]
                .stateVariableDescriptions[variableName] as any;

            if (stateVarInfo?.indexAliases) {
                const dim = propIndex.length;
                const aliases = stateVarInfo.indexAliases[dim];

                const aliasIdx = aliases.indexOf(nextPart.name);
                if (aliasIdx !== -1) {
                    propIndex.push(aliasIdx + 1);
                    foundMatchToNextName = true;
                }
            } else {
                const arrayEntryCheck =
                    this.dependencyHandler.core.checkIfArrayEntry({
                        stateVariable: variableName,
                        component,
                    });

                if (arrayEntryCheck.isArrayEntry) {
                    const arrayVariableName = arrayEntryCheck.arrayVariableName;
                    const arrayEntryPrefix = arrayEntryCheck.arrayEntryPrefix;

                    const arrayStateVarObj = component.state[arrayVariableName];

                    if (arrayStateVarObj.indexAliases) {
                        const arrayDimensions = arrayStateVarObj.numDimensions;
                        const entryDimensions =
                            arrayStateVarObj.returnEntryDimensions(
                                arrayEntryPrefix,
                            );

                        // If we have a 3D array and a 1D entry, that means we've used up 2 dimensions to get to the entry,
                        // and we have to skip two dimensions of the array to get to the dimension corresponding to the entries components.
                        const dimensionInArray =
                            arrayDimensions - entryDimensions;

                        const dim = propIndex.length;
                        const aliases =
                            arrayStateVarObj.indexAliases[
                                dim + dimensionInArray
                            ];

                        const aliasIdx = aliases.indexOf(nextPart.name);
                        if (aliasIdx !== -1) {
                            propIndex.push(aliasIdx + 1);
                            foundMatchToNextName = true;
                        }
                    }
                }
            }

            // If the name to the second part of the unresolved path did not match,
            // then we regard the reference as invalid and return nothing
            if (!foundMatchToNextName) {
                return {
                    success: true,
                    downstreamComponentIndices: [],
                    downstreamComponentTypes: [],
                };
            }
        }

        if (propIndex.length > 0) {
            this.propIndex = propIndex;
        }

        return {
            success: true,
            downstreamComponentIndices: [this.componentIdx],
            downstreamComponentTypes: [component.componentType],
        };
    }

    deleteFromUpdateTriggers() {
        if (this.specifiedComponentName) {
            this.deleteUpdateTriggerForMissingComponent(
                this.specifiedComponentName,
            );
        }
    }
}

export class MultipleStateVariablesDependency extends Dependency {
    static dependencyType = "multipleStateVariables";

    setUpParameters() {
        if (this.definition.componentIdx != undefined) {
            this.componentIdx = this.definition.componentIdx;
            this.specifiedComponentName = this.componentIdx;
        } else {
            this.componentIdx = this.upstreamComponentIdx;
        }

        if (!Array.isArray(this.definition.variableNames)) {
            throw Error(
                `Invalid state variable ${this.representativeStateVariable} of ${this.upstreamComponentIdx}, dependency ${this.dependencyName}: variableNames must be an array`,
            );
        }
        this.originalDownstreamVariableNames = this.definition.variableNames;

        this.returnSingleComponent = true;
    }

    async determineDownstreamComponents() {
        let component = this.dependencyHandler._components[this.componentIdx];

        if (!component) {
            let dependenciesMissingComponent =
                this.dependencyHandler.updateTriggers
                    .dependenciesMissingComponentBySpecifiedName[
                    this.componentIdx
                ];
            if (!dependenciesMissingComponent) {
                dependenciesMissingComponent =
                    this.dependencyHandler.updateTriggers.dependenciesMissingComponentBySpecifiedName[
                        this.componentIdx
                    ] = [];
            }
            if (!dependenciesMissingComponent.includes(this)) {
                dependenciesMissingComponent.push(this);
            }

            for (let varName of this.upstreamVariableNames) {
                await this.dependencyHandler.addBlocker({
                    blockerComponentIdx: this.componentIdx,
                    blockerType: "componentIdentity",
                    componentIdxBlocked: this.upstreamComponentIdx,
                    typeBlocked: "recalculateDownstreamComponents",
                    stateVariableBlocked: varName,
                    dependencyBlocked: this.dependencyName,
                });

                await this.dependencyHandler.addBlocker({
                    blockerComponentIdx: this.upstreamComponentIdx,
                    blockerType: "recalculateDownstreamComponents",
                    blockerStateVariable: varName,
                    blockerDependency: this.dependencyName,
                    componentIdxBlocked: this.upstreamComponentIdx,
                    typeBlocked: "stateVariable",
                    stateVariableBlocked: varName,
                });
            }

            return {
                success: false,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }

        return {
            success: true,
            downstreamComponentIndices: [this.componentIdx],
            downstreamComponentTypes: [component.componentType],
        };
    }

    deleteFromUpdateTriggers() {
        if (this.specifiedComponentName) {
            let dependenciesMissingComponent =
                this.dependencyHandler.updateTriggers
                    .dependenciesMissingComponentBySpecifiedName[
                    this.specifiedComponentName
                ];
            if (dependenciesMissingComponent) {
                let ind = dependenciesMissingComponent.indexOf(this);
                if (ind !== -1) {
                    dependenciesMissingComponent.splice(ind, 1);
                }
            }
        }
    }
}

export class StateVariableComponentTypeDependency extends StateVariableDependency {
    static dependencyType = "stateVariableComponentType";

    async getValue({ verbose = false, consumeChanges = true }: any = {}) {
        let value: any = [];
        let changes: any = {};

        if (this.staticValue) {
            value = [this.staticValue];
        } else {
            if (this.componentIdentitiesChanged) {
                changes.componentIdentitiesChanged = true;
                if (consumeChanges) {
                    this.componentIdentitiesChanged = false;
                }
            }

            if (this.downstreamComponentIndices.length === 1) {
                let componentIdx = this.downstreamComponentIndices[0];
                let depComponent =
                    this.dependencyHandler.components[componentIdx];

                let componentObj: any = {
                    componentIdx: depComponent.componentIdx,
                    componentType: depComponent.componentType,
                };

                componentObj.stateValues = {};

                let originalVarName = this.originalDownstreamVariableNames[0];
                let mappedVarName =
                    this.mappedDownstreamVariableNamesByComponent[0][0];

                let nameForOutput = this.useMappedVariableNames
                    ? mappedVarName
                    : originalVarName;

                if (
                    !this.variablesOptional ||
                    mappedVarName in depComponent.state
                ) {
                    if (!depComponent.state[mappedVarName].deferred) {
                        let stateVarObj = depComponent.state[mappedVarName];
                        // call getter to make sure component type is set
                        await stateVarObj.value;
                        componentObj.stateValues[nameForOutput] =
                            stateVarObj.componentType;

                        if (stateVarObj.isArray) {
                            // If array, use componentType from wrapping components, if exist.
                            // See description of returnWrappingComponents in Core.js.
                            if (stateVarObj.wrappingComponents?.length > 0) {
                                let wrapCT =
                                    stateVarObj.wrappingComponents[
                                        stateVarObj.wrappingComponents.length -
                                            1
                                    ][0];
                                if (typeof wrapCT === "object") {
                                    wrapCT = wrapCT.componentType;
                                }
                                componentObj.stateValues[nameForOutput] =
                                    wrapCT;
                            }
                        }

                        // absent when already consumed and not marked
                        // changed since
                        let valueChanged0 =
                            this.valuesChanged[0][mappedVarName];
                        if (valueChanged0?.changed) {
                            if (!changes.valuesChanged) {
                                changes.valuesChanged = {};
                            }
                            if (!changes.valuesChanged[0]) {
                                changes.valuesChanged[0] = {};
                            }
                            changes.valuesChanged[0][nameForOutput] =
                                cloneChangeMetadataIfNeeded({
                                    changeMetadata: valueChanged0,
                                    consumeChanges,
                                });
                        }
                        if (consumeChanges) {
                            this.consumeChangeRecord(0, mappedVarName);
                        }

                        let hasVariableComponentType =
                            stateVarObj.shadowingInstructions
                                ?.hasVariableComponentType;
                        if (
                            !hasVariableComponentType &&
                            stateVarObj.isArrayEntry
                        ) {
                            let arrayStateVarObj =
                                depComponent.state[
                                    stateVarObj.arrayStateVariable
                                ];
                            hasVariableComponentType =
                                arrayStateVarObj.shadowingInstructions
                                    ?.hasVariableComponentType;
                        }
                        if (!hasVariableComponentType) {
                            // since this value won't change,
                            // remove the downstream dependency
                            // and create static value
                            this.staticValue = componentObj;
                            await this.removeDownstreamComponent({
                                indexToRemove: 0,
                                recordChange: false,
                            });
                        }
                    }
                }

                value = [componentObj];
            }
        }

        if (!verbose) {
            if (this.returnSingleVariableValue) {
                if (value.length === 1) {
                    value = value[0];
                    let stateVariables = Object.keys(value.stateValues);
                    if (
                        changes.valuesChanged &&
                        changes.valuesChanged[0] &&
                        changes.valuesChanged[0][0]
                    ) {
                        changes.valuesChanged = changes.valuesChanged[0][0];
                    }

                    if (stateVariables.length === 1) {
                        value = value.stateValues[stateVariables[0]];
                    } else {
                        value = null;
                    }
                } else {
                    value = null;
                }
            } else if (this.returnSingleComponent) {
                if (value.length === 1) {
                    value = value[0];
                    if (changes.valuesChanged && changes.valuesChanged[0]) {
                        changes.valuesChanged = changes.valuesChanged[0];
                    }
                } else {
                    value = null;
                }
            }
        }

        // if (!this.doNotProxy && value !== null && typeof value === 'object') {
        //   value = new Proxy(value, readOnlyProxyHandler)
        // }

        return { value, changes, usedDefault: false };
    }
}

export class StateVariableArraySizeDependency extends StateVariableDependency {
    static dependencyType = "stateVariableArraySize";

    static convertToArraySize = true;
}

export class RecursiveDependencyValuesDependency extends Dependency {
    static dependencyType = "recursiveDependencyValues";

    setUpParameters() {
        if (this.definition.componentIdx != undefined) {
            this.componentIdx = this.definition.componentIdx;
            this.specifiedComponentName = this.componentIdx;
        } else {
            this.componentIdx = this.upstreamComponentIdx;
        }

        if (this.definition.variableNames === undefined) {
            throw Error(
                `Invalid state variable ${this.representativeStateVariable} of ${this.upstreamComponentIdx}, dependency ${this.dependencyName}: variableNames is not defined`,
            );
        }

        this.startingVariableNames = this.definition.variableNames;

        this.originalVariablesByComponent = true;

        this.includeImmediateValueWithValue =
            this.definition.includeImmediateValueWithValue;
        this.includeRawValueWithImmediateValue =
            this.definition.includeRawValueWithImmediateValue;
        this.includeOnlyEssentialValues =
            this.definition.includeOnlyEssentialValues;

        this.variablesOptional = true;
    }

    async determineDownstreamComponents({ force = false } = {}) {
        // console.log(`determine downstream of ${this.dependencyName}, ${this.representativeStateVariable}, ${this.upstreamComponentIdx}`)

        this.missingComponents = [];
        this.originalDownstreamVariableNamesByComponent = [];

        let result = await this.getRecursiveDependencyVariables({
            componentIdx: this.componentIdx,
            variableNames: this.startingVariableNames,
            force,
        });

        if (!result.success) {
            return {
                success: false,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }

        let downstreamComponentIndices = [];
        let downstreamComponentTypes = [];

        for (const componentIdxStr in result.components) {
            const componentIdx = Number(componentIdxStr);
            if (this.includeOnlyEssentialValues) {
                let essentialVarNames = [];
                let component =
                    this.dependencyHandler._components[componentIdx];
                for (let vName of result.components[componentIdx]
                    .variableNames) {
                    if (component.state[vName]?.hasEssential) {
                        essentialVarNames.push(vName);
                    } else if (component.state[vName]?.isArrayEntry) {
                        if (
                            component.state[
                                component.state[vName].arrayStateVariable
                            ].hasEssential
                        ) {
                            essentialVarNames.push(vName);
                        }
                    }
                }
                if (essentialVarNames.length > 0) {
                    downstreamComponentIndices.push(componentIdx);
                    downstreamComponentTypes.push(
                        result.components[componentIdx].componentType,
                    );
                    this.originalDownstreamVariableNamesByComponent.push(
                        essentialVarNames,
                    );
                }
            } else {
                downstreamComponentIndices.push(componentIdx);
                downstreamComponentTypes.push(
                    result.components[componentIdx].componentType,
                );
                this.originalDownstreamVariableNamesByComponent.push(
                    result.components[componentIdx].variableNames,
                );
            }
        }

        return {
            success: true,
            downstreamComponentIndices,
            downstreamComponentTypes,
        };
    }

    async getRecursiveDependencyVariables({
        componentIdx,
        variableNames,
        force,
        components = {},
    }: any): Promise<any> {
        // console.log(`get recursive dependency variables for ${componentIdx}`, variableNames)

        let component = this.dependencyHandler._components[componentIdx];

        if (!component) {
            if (!this.missingComponents.includes(componentIdx)) {
                let dependenciesMissingComponent =
                    this.dependencyHandler.updateTriggers
                        .dependenciesMissingComponentBySpecifiedName[
                        componentIdx
                    ];
                if (!dependenciesMissingComponent) {
                    dependenciesMissingComponent =
                        this.dependencyHandler.updateTriggers.dependenciesMissingComponentBySpecifiedName[
                            componentIdx
                        ] = [];
                }
                if (!dependenciesMissingComponent.includes(this)) {
                    dependenciesMissingComponent.push(this);
                }
            }

            for (let varName of this.upstreamVariableNames) {
                await this.dependencyHandler.addBlocker({
                    blockerComponentIdx: componentIdx,
                    blockerType: "componentIdentity",
                    componentIdxBlocked: this.upstreamComponentIdx,
                    typeBlocked: "recalculateDownstreamComponents",
                    stateVariableBlocked: varName,
                    dependencyBlocked: this.dependencyName,
                });

                await this.dependencyHandler.addBlocker({
                    blockerComponentIdx: this.upstreamComponentIdx,
                    blockerType: "recalculateDownstreamComponents",
                    blockerStateVariable: varName,
                    blockerDependency: this.dependencyName,
                    componentIdxBlocked: this.upstreamComponentIdx,
                    typeBlocked: "stateVariable",
                    stateVariableBlocked: varName,
                });
            }

            return {
                success: false,
            };
        }

        if (
            this.includeImmediateValueWithValue &&
            variableNames.includes("value") &&
            !variableNames.includes("immediateValue") &&
            "immediateValue" in component.state
        ) {
            variableNames = [...variableNames, "immediateValue"];
        }

        if (
            this.includeRawValueWithImmediateValue &&
            variableNames.includes("immediateValue") &&
            !variableNames.includes("rawRendererValue") &&
            "rawRendererValue" in component.state
        ) {
            variableNames = [...variableNames, "rawRendererValue"];
        }

        let thisComponentObj = components[componentIdx];
        if (!thisComponentObj) {
            thisComponentObj = components[componentIdx] = {
                componentIdx,
                componentType: component.componentType,
                variableNames: [],
            };
        }

        let triggersForComponent =
            this.dependencyHandler.updateTriggers
                .dependenciesBasedOnDependenciesOfStateVariables[componentIdx];
        if (!triggersForComponent) {
            triggersForComponent =
                this.dependencyHandler.updateTriggers.dependenciesBasedOnDependenciesOfStateVariables[
                    componentIdx
                ] = {};
        }

        for (let varName of variableNames) {
            if (!thisComponentObj.variableNames.includes(varName)) {
                thisComponentObj.variableNames.push(varName);

                let triggersForVarName = triggersForComponent[varName];
                if (!triggersForVarName) {
                    triggersForVarName = triggersForComponent[varName] = [];
                }
                if (!triggersForVarName.includes(this)) {
                    triggersForVarName.push(this);
                }

                let stateVarObj = component.state[varName];

                if (stateVarObj) {
                    if (!stateVarObj.isResolved) {
                        if (force) {
                            await stateVarObj.value;
                        } else {
                            for (let vName of this.upstreamVariableNames) {
                                await this.dependencyHandler.addBlocker({
                                    blockerComponentIdx: componentIdx,
                                    blockerType: "stateVariable",
                                    blockerStateVariable: varName,
                                    componentIdxBlocked:
                                        this.upstreamComponentIdx,
                                    typeBlocked:
                                        "recalculateDownstreamComponents",
                                    stateVariableBlocked: vName,
                                    dependencyBlocked: this.dependencyName,
                                });

                                await this.dependencyHandler.addBlocker({
                                    blockerComponentIdx:
                                        this.upstreamComponentIdx,
                                    blockerType:
                                        "recalculateDownstreamComponents",
                                    blockerStateVariable: vName,
                                    blockerDependency: this.dependencyName,
                                    componentIdxBlocked:
                                        this.upstreamComponentIdx,
                                    typeBlocked: "stateVariable",
                                    stateVariableBlocked: vName,
                                });
                            }
                            return { success: false };
                        }
                    }

                    let downDeps =
                        this.dependencyHandler.downstreamDependencies[
                            component.componentIdx
                        ][varName];

                    for (let dependencyName in downDeps) {
                        let dep = downDeps[dependencyName];
                        if (dep.onlyToSetInInverseDefinition) {
                            continue;
                        }
                        for (let [
                            cInd,
                            cIdx,
                        ] of dep.downstreamComponentIndices.entries()) {
                            let varNames = [];
                            if (
                                dep.originalDownstreamVariableNames.length >
                                    0 ||
                                dep.originalVariablesByComponent
                            ) {
                                varNames =
                                    dep
                                        .mappedDownstreamVariableNamesByComponent[
                                        cInd
                                    ];
                            }
                            let result =
                                await this.getRecursiveDependencyVariables({
                                    componentIdx: cIdx,
                                    variableNames: varNames,
                                    force,
                                    components,
                                });

                            if (!result.success) {
                                return { success: false };
                            }
                        }
                    }
                }
            }
        }

        return {
            success: true,
            components,
        };
    }

    async getValue({ consumeChanges = true }: any = {}) {
        this.gettingValue = true;
        this.varsWithUpdatedDeps = {};

        let result: any;
        let accumulatedVarsWithUpdatedDeps: Record<string, any> = {};

        let foundNewUpdated = true;

        let changes: any = {};

        try {
            while (foundNewUpdated) {
                foundNewUpdated = false;
                result = await super.getValue({
                    consumeChanges: consumeChanges,
                });

                if (result.changes.valuesChanged) {
                    if (!changes.valuesChanged) {
                        changes.valuesChanged = result.changes.valuesChanged;
                    } else {
                        for (let ind in result.changes.valuesChanged) {
                            let changeObj = result.changes.valuesChanged[ind];
                            if (!changes.valuesChanged[ind]) {
                                changes.valuesChanged[ind] = changeObj;
                            } else {
                                for (let depName in changeObj) {
                                    changes.valuesChanged[ind][depName] =
                                        changeObj[depName];
                                }
                            }
                        }
                    }
                }

                for (const cIdxStr in this.varsWithUpdatedDeps) {
                    let compAccumulated =
                        accumulatedVarsWithUpdatedDeps[cIdxStr];
                    if (!compAccumulated) {
                        compAccumulated = accumulatedVarsWithUpdatedDeps[
                            cIdxStr
                        ] = [];
                    }
                    for (let vName of this.varsWithUpdatedDeps[cIdxStr]) {
                        if (!compAccumulated.includes(vName)) {
                            compAccumulated.push(vName);
                            foundNewUpdated = true;
                        }
                    }
                }

                if (foundNewUpdated) {
                    this.varsWithUpdatedDeps = {};
                    await this.recalculateDownstreamComponents();
                }
            }
        } finally {
            this.gettingValue = false;
        }

        result.changes = changes;

        return result;
    }

    deleteFromUpdateTriggers() {
        for (let componentIdx of this.missingComponents) {
            let dependenciesMissingComponent =
                this.dependencyHandler.updateTriggers
                    .dependenciesMissingComponentBySpecifiedName[componentIdx];
            if (dependenciesMissingComponent) {
                let ind = dependenciesMissingComponent.indexOf(this);
                if (ind !== -1) {
                    dependenciesMissingComponent.splice(ind, 1);
                }
            }
        }
    }
}

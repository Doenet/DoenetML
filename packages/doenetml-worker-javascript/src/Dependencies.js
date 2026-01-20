import {
    ancestorsIncludingComposites,
    gatherDescendants,
} from "./utils/descendants";
import {
    retrieveTextFileForCid,
    deepClone,
    deepCompare,
    getLineCharRange,
} from "@doenet/utils";

const dependencyTypeArray = [];

export class DependencyHandler {
    constructor({ _components, componentInfoObjects, core }) {
        this.upstreamDependencies = {};
        this.downstreamDependencies = {};
        this.switchDependencies = {};

        this.circularCheckPassed = {};
        this.circularResolveBlockedCheckPassed = {};

        this.dependencyTypes = {};
        dependencyTypeArray.forEach(
            (dt) => (this.dependencyTypes[dt.dependencyType] = dt),
        );

        this.core = core;
        this._components = _components;
        this.componentInfoObjects = componentInfoObjects;

        this.updateTriggers = {
            descendantDependenciesByAncestor: {},
            ancestorDependenciesByPotentialAncestor: {},
            replacementDependenciesByComposite: {},
            childDependenciesByParent: {},
            parentDependenciesByParent: {},
            dependenciesMissingComponentBySpecifiedName: {},
            dependenciesBasedOnDependenciesOfStateVariables: {},
            primaryShadowDependencies: {},
            componentsReferencingAttributeByReferenced: {},
        };

        this.resolveBlockers = {
            neededToResolve: {},
            resolveBlockedBy: {},
        };

        this.attributeRefResolutionDependenciesByReferenced = {};
    }

    async setUpComponentDependencies(component) {
        // if component already has downstream dependencies
        // delete them, and the corresponding upstream dependencies
        if (this.downstreamDependencies[component.componentIdx]) {
            this.deleteAllDownstreamDependencies({ component });
        }

        // console.log(`set up component dependencies of ${component.componentIdx}`)
        this.downstreamDependencies[component.componentIdx] = {};
        if (!this.upstreamDependencies[component.componentIdx]) {
            this.upstreamDependencies[component.componentIdx] = {};
        }

        let stateVariablesToProccess = [];
        let additionalStateVariablesThatWillBeProcessed = [];
        for (let stateVariable in component.state) {
            if (
                !(
                    component.state[stateVariable].isArrayEntry ||
                    component.state[stateVariable].isAlias ||
                    additionalStateVariablesThatWillBeProcessed.includes(
                        stateVariable,
                    )
                )
            ) {
                // TODO: if do indeed keep aliases deleted from state, then don't need second check, above
                stateVariablesToProccess.push(stateVariable);
                if (
                    component.state[stateVariable]
                        .additionalStateVariablesDefined
                ) {
                    additionalStateVariablesThatWillBeProcessed.push(
                        ...component.state[stateVariable]
                            .additionalStateVariablesDefined,
                    );
                }
            }
        }

        for (let stateVariable of stateVariablesToProccess) {
            let allStateVariablesAffected = [stateVariable];
            if (
                component.state[stateVariable].additionalStateVariablesDefined
            ) {
                allStateVariablesAffected.push(
                    ...component.state[stateVariable]
                        .additionalStateVariablesDefined,
                );
            }

            await this.setUpStateVariableDependencies({
                component,
                stateVariable,
                allStateVariablesAffected,
            });
        }
    }

    async setUpStateVariableDependencies({
        component,
        stateVariable,
        allStateVariablesAffected,
    }) {
        let stateVarObj = component.state[stateVariable];
        let dependencies;

        if (stateVarObj.stateVariablesDeterminingDependencies) {
            dependencies = {};

            if (stateVarObj.stateVariablesDeterminingDependencies) {
                dependencies.__determine_dependencies = {
                    dependencyType: "determineDependencies",
                    variableNames:
                        stateVarObj.stateVariablesDeterminingDependencies,
                };
            }
        } else {
            // Note: arrays now always have a state variable determining dependencies
            // (the array size state variable)
            // so we don't have to deal with them here

            dependencies = await stateVarObj.returnDependencies({
                componentInfoObjects: this.componentInfoObjects,
                sharedParameters: component.sharedParameters,
            });
        }

        for (let dependencyName in dependencies) {
            let dependencyDefinition = dependencies[dependencyName];
            if (
                !(dependencyDefinition.dependencyType in this.dependencyTypes)
            ) {
                throw Error(
                    `Unrecognized dependency type ${dependencyDefinition.dependencyType} for ${dependencyName} of ${stateVariable} of ${component.componentIdx}`,
                );
            }
            let dep = new this.dependencyTypes[
                dependencyDefinition.dependencyType
            ]({
                component,
                stateVariable,
                allStateVariablesAffected,
                dependencyName,
                dependencyDefinition,
                dependencyHandler: this,
                expandComposites: false,
                forceExpandComposites: false,
            });

            await dep.initialize();

            dep.checkForCircular();
        }
    }

    deleteAllDownstreamDependencies({ component, stateVariables = "__all__" }) {
        // console.log(`delete all downstream dependencies of ${component.componentIdx}, ${stateVariables.toString()}`)
        // console.log(deepClone(this.downstreamDependencies[component.componentIdx]))
        // console.log(deepClone(this.upstreamDependencies))

        let componentIdx = component.componentIdx;

        let stateVariablesToAdddress;
        if (stateVariables === "__all__") {
            stateVariablesToAdddress = Object.keys(
                this.downstreamDependencies[componentIdx],
            );
        } else {
            stateVariablesToAdddress = stateVariables;
        }

        for (let stateVariable of stateVariablesToAdddress) {
            let downDeps =
                this.downstreamDependencies[componentIdx][stateVariable];

            for (let downDepName in downDeps) {
                downDeps[downDepName].deleteDependency();
            }

            delete this.downstreamDependencies[componentIdx][stateVariable];
        }

        if (
            Object.keys(this.downstreamDependencies[componentIdx]).length ===
                0 &&
            !this.components[componentIdx]
        ) {
            delete this.downstreamDependencies[componentIdx];
        }
    }

    async deleteAllUpstreamDependencies({
        component,
        stateVariables = "__all__",
        completelyDelete = false,
    }) {
        // if completelyDelete is false, then just remove component from dependency

        // console.log(`delete all upstream dependencies of ${component.componentIdx}, ${stateVariables.toString()}`)
        // console.log(`completelyDelete: ${completelyDelete}`)
        // console.log(deepClone(this.downstreamDependencies))
        // console.log(deepClone(this.upstreamDependencies))

        let componentIdx = component.componentIdx;

        let stateVariablesToAdddress;
        if (stateVariables === "__all__") {
            stateVariablesToAdddress = Object.keys(
                this.upstreamDependencies[componentIdx],
            );
        } else {
            stateVariablesToAdddress = stateVariables;
        }

        for (let stateVariable of stateVariablesToAdddress) {
            if (this.upstreamDependencies[componentIdx][stateVariable]) {
                // loop over shallow copy, as upstream dependencies are changed in deleteDownstreamDependency
                for (let upDep of [
                    ...this.upstreamDependencies[componentIdx][stateVariable],
                ]) {
                    if (completelyDelete) {
                        // Note: this completely deletes the dependency even if there
                        // were other downstream components involved
                        for (let upVarName of upDep.upstreamVariableNames) {
                            if (
                                this._components[upDep.upstreamComponentIdx]
                                    .state[upVarName].initiallyResolved
                            ) {
                                await this.core.markStateVariableAndUpstreamDependentsStale(
                                    {
                                        component:
                                            this.components[
                                                upDep.upstreamComponentIdx
                                            ],
                                        varName: upVarName,
                                    },
                                );
                            }
                        }
                        upDep.deleteDependency();
                    } else {
                        // Note: this keeps the downstream dependency in the upstream component
                        // even if this is the last downstream component
                        await upDep.removeDownstreamComponent({
                            indexToRemove:
                                upDep.downstreamComponentIndices.indexOf(
                                    componentIdx,
                                ),
                        });
                    }
                }
            }

            // clean up by deleting entries that should now be empty objects
            delete this.upstreamDependencies[componentIdx][stateVariable];
        }

        if (
            Object.keys(this.upstreamDependencies[componentIdx]).length === 0 &&
            !this._components[componentIdx]
        ) {
            delete this.upstreamDependencies[componentIdx];
        }
    }

    async addBlockersFromChangedStateVariableDependencies({
        componentIdx,
        stateVariables,
    }) {
        let triggersForComponent =
            this.updateTriggers.dependenciesBasedOnDependenciesOfStateVariables[
                componentIdx
            ];
        if (triggersForComponent) {
            for (let varName of stateVariables) {
                let triggersForVarName = triggersForComponent[varName];
                if (triggersForVarName) {
                    for (let dep of triggersForVarName) {
                        if (dep.gettingValue) {
                            let compWithUpdated =
                                dep.varsWithUpdatedDeps[componentIdx];
                            if (!compWithUpdated) {
                                compWithUpdated = dep.varsWithUpdatedDeps[
                                    componentIdx
                                ] = [];
                            }
                            if (!compWithUpdated.includes(varName)) {
                                compWithUpdated.push(varName);
                            }
                        } else {
                            for (let vName of dep.upstreamVariableNames) {
                                await this.addBlocker({
                                    blockerComponentIdx:
                                        dep.upstreamComponentIdx,
                                    blockerType:
                                        "recalculateDownstreamComponents",
                                    blockerStateVariable: vName,
                                    blockerDependency: dep.dependencyName,
                                    componentIdxBlocked:
                                        dep.upstreamComponentIdx,
                                    typeBlocked: "stateVariable",
                                    stateVariableBlocked: vName,
                                });
                            }
                        }
                    }
                }
            }
        }
    }

    async addBlockersFromChangedActiveChildren({ parent }) {
        // console.log(`add blockers to dependencies of active children of ${parent.componentIdx}`)

        await this.collateCountersAndPropagateToAncestors(parent);

        if (
            this.updateTriggers.childDependenciesByParent[parent.componentIdx]
        ) {
            for (let dep of this.updateTriggers.childDependenciesByParent[
                parent.componentIdx
            ]) {
                for (let varName of dep.upstreamVariableNames) {
                    await this.addBlocker({
                        blockerComponentIdx: dep.upstreamComponentIdx,
                        blockerType: "recalculateDownstreamComponents",
                        blockerStateVariable: varName,
                        blockerDependency: dep.dependencyName,
                        componentIdxBlocked: dep.upstreamComponentIdx,
                        typeBlocked: "stateVariable",
                        stateVariableBlocked: varName,
                    });
                }
                await this.addBlockersFromChangedStateVariableDependencies({
                    componentIdx: dep.upstreamComponentIdx,
                    stateVariables: dep.upstreamVariableNames,
                });
            }
        }

        if (parent.ancestors) {
            if (
                this.updateTriggers.parentDependenciesByParent[
                    parent.componentIdx
                ]
            ) {
                for (let dep of this.updateTriggers.parentDependenciesByParent[
                    parent.componentIdx
                ]) {
                    for (let varName of dep.upstreamVariableNames) {
                        await this.addBlocker({
                            blockerComponentIdx: dep.upstreamComponentIdx,
                            blockerType: "recalculateDownstreamComponents",
                            blockerStateVariable: varName,
                            blockerDependency: dep.dependencyName,
                            componentIdxBlocked: dep.upstreamComponentIdx,
                            typeBlocked: "stateVariable",
                            stateVariableBlocked: varName,
                        });
                    }
                    await this.addBlockersFromChangedStateVariableDependencies({
                        componentIdx: dep.upstreamComponentIdx,
                        stateVariables: dep.upstreamVariableNames,
                    });
                }
            }

            for (let ancestorIdx of [
                parent.componentIdx,
                ...ancestorsIncludingComposites(parent, this.components),
            ]) {
                await this.addDescendantBlockersToAncestor(ancestorIdx);
            }

            if (
                this.updateTriggers.ancestorDependenciesByPotentialAncestor[
                    parent.componentIdx
                ]
            ) {
                for (let dep of this.updateTriggers
                    .ancestorDependenciesByPotentialAncestor[
                    parent.componentIdx
                ]) {
                    for (let varName of dep.upstreamVariableNames) {
                        await this.addBlocker({
                            blockerComponentIdx: dep.upstreamComponentIdx,
                            blockerType: "recalculateDownstreamComponents",
                            blockerStateVariable: varName,
                            blockerDependency: dep.dependencyName,
                            componentIdxBlocked: dep.upstreamComponentIdx,
                            typeBlocked: "stateVariable",
                            stateVariableBlocked: varName,
                        });
                    }
                    await this.addBlockersFromChangedStateVariableDependencies({
                        componentIdx: dep.upstreamComponentIdx,
                        stateVariables: dep.upstreamVariableNames,
                    });
                }
            }
        }
    }

    async resolveBlockersFromChangedActiveChildren(parent, force = false) {
        // console.log(`resolve blockers for dependencies of active children of ${parent.componentIdx}`)

        await this.collateCountersAndPropagateToAncestors(parent);

        if (
            this.updateTriggers.childDependenciesByParent[parent.componentIdx]
        ) {
            for (let dep of this.updateTriggers.childDependenciesByParent[
                parent.componentIdx
            ]) {
                await this.resolveIfReady({
                    componentIdx: dep.upstreamComponentIdx,
                    type: "recalculateDownstreamComponents",
                    stateVariable: dep.representativeStateVariable,
                    dependency: dep.dependencyName,
                    force,
                    // recurseUpstream: true,
                });
            }
        }

        if (parent.ancestors) {
            if (
                this.updateTriggers.parentDependenciesByParent[
                    parent.componentIdx
                ]
            ) {
                for (let dep of this.updateTriggers.parentDependenciesByParent[
                    parent.componentIdx
                ]) {
                    await this.resolveIfReady({
                        componentIdx: dep.upstreamComponentIdx,
                        type: "recalculateDownstreamComponents",
                        stateVariable: dep.representativeStateVariable,
                        dependency: dep.dependencyName,
                        force,
                        // recurseUpstream: true
                    });
                }
            }

            for (let ancestorIdx of [
                parent.componentIdx,
                ...ancestorsIncludingComposites(parent, this.components),
            ]) {
                await this.resolveDescendantBlockersToAncestor(
                    ancestorIdx,
                    force,
                );
            }

            if (
                this.updateTriggers.ancestorDependenciesByPotentialAncestor[
                    parent.componentIdx
                ]
            ) {
                for (let dep of this.updateTriggers
                    .ancestorDependenciesByPotentialAncestor[
                    parent.componentIdx
                ]) {
                    await this.resolveIfReady({
                        componentIdx: dep.upstreamComponentIdx,
                        type: "recalculateDownstreamComponents",
                        stateVariable: dep.representativeStateVariable,
                        dependency: dep.dependencyName,
                        force,
                        // recurseUpstream: true
                    });
                }
            }
        }
    }

    async addDescendantBlockersToAncestor(ancestorIdx) {
        // console.log(`update descendant dependencies for ${ancestorIdx}`)

        if (this.updateTriggers.descendantDependenciesByAncestor[ancestorIdx]) {
            for (let dep of this.updateTriggers
                .descendantDependenciesByAncestor[ancestorIdx]) {
                for (let varName of dep.upstreamVariableNames) {
                    await this.addBlocker({
                        blockerComponentIdx: dep.upstreamComponentIdx,
                        blockerType: "recalculateDownstreamComponents",
                        blockerStateVariable: varName,
                        blockerDependency: dep.dependencyName,
                        componentIdxBlocked: dep.upstreamComponentIdx,
                        typeBlocked: "stateVariable",
                        stateVariableBlocked: varName,
                    });
                }
                await this.addBlockersFromChangedStateVariableDependencies({
                    componentIdx: dep.upstreamComponentIdx,
                    stateVariables: dep.upstreamVariableNames,
                });
            }
        }
    }

    async resolveDescendantBlockersToAncestor(ancestorIdx, force = false) {
        // console.log(`update descendant dependencies for ${ancestorIdx}`)

        if (this.updateTriggers.descendantDependenciesByAncestor[ancestorIdx]) {
            for (let dep of this.updateTriggers
                .descendantDependenciesByAncestor[ancestorIdx]) {
                await this.resolveIfReady({
                    componentIdx: dep.upstreamComponentIdx,
                    type: "recalculateDownstreamComponents",
                    stateVariable: dep.representativeStateVariable,
                    dependency: dep.dependencyName,
                    force,
                    // recurseUpstream: true
                });
            }
        }
    }

    async addBlockersFromChangedReplacements(composite) {
        if (
            this.updateTriggers.replacementDependenciesByComposite[
                composite.componentIdx
            ]
        ) {
            for (let dep of this.updateTriggers
                .replacementDependenciesByComposite[composite.componentIdx]) {
                for (let varName of dep.upstreamVariableNames) {
                    await this.addBlocker({
                        blockerComponentIdx: dep.upstreamComponentIdx,
                        blockerType: "recalculateDownstreamComponents",
                        blockerStateVariable: varName,
                        blockerDependency: dep.dependencyName,
                        componentIdxBlocked: dep.upstreamComponentIdx,
                        typeBlocked: "stateVariable",
                        stateVariableBlocked: varName,
                    });
                }
            }
        }

        for (let ancestorIdx of [
            composite.componentIdx,
            ...ancestorsIncludingComposites(composite, this.components),
        ]) {
            await this.addDescendantBlockersToAncestor(ancestorIdx);
        }
    }

    checkForCircularDependency({
        componentIdx,
        varName,
        previouslyVisited = [],
    }) {
        let stateVariableIdentifier = componentIdx + ":" + varName;

        if (previouslyVisited.includes(stateVariableIdentifier)) {
            // Found circular dependency
            // Create error message with list of component types and names involved

            console.log(
                "found circular",
                stateVariableIdentifier,
                previouslyVisited,
            );

            let componentNameRe = /^(.*):/;
            let componentsInvolved = previouslyVisited.map(
                (x) => this.components[x.match(componentNameRe)[1]],
            );

            let message = this.getCircularDependencyMessage(componentsInvolved);

            throw Error(message);
        } else {
            // shallow copy so don't change original
            previouslyVisited = [...previouslyVisited, stateVariableIdentifier];
        }

        if (!this.circularCheckPassed[stateVariableIdentifier]) {
            this.circularCheckPassed[stateVariableIdentifier] = true;

            if (componentIdx in this.downstreamDependencies) {
                let downDeps =
                    this.downstreamDependencies[componentIdx][varName];
                for (let dependencyName in downDeps) {
                    let dep = downDeps[dependencyName];

                    let downstreamComponentIndices =
                        dep.downstreamComponentIndices;
                    if (!downstreamComponentIndices) {
                        continue;
                    }
                    let mappedDownstreamVariableNamesByComponent =
                        dep.mappedDownstreamVariableNamesByComponent;
                    if (!mappedDownstreamVariableNamesByComponent) {
                        continue;
                    }

                    for (let [
                        ind,
                        cIdx,
                    ] of downstreamComponentIndices.entries()) {
                        let varNames =
                            mappedDownstreamVariableNamesByComponent[ind];
                        for (let vname of varNames) {
                            this.checkForCircularDependency({
                                componentIdx: cIdx,
                                varName: vname,
                                previouslyVisited,
                            });
                        }
                    }
                }
            }
        }
    }

    resetCircularCheckPassed(componentIdx, varName) {
        let stateVariableIdentifier = componentIdx + ":" + varName;
        if (this.circularCheckPassed[stateVariableIdentifier]) {
            delete this.circularCheckPassed[stateVariableIdentifier];

            let upstream = this.upstreamDependencies[componentIdx][varName];

            if (upstream) {
                for (let upDep of upstream) {
                    for (let vName of upDep.upstreamVariableNames) {
                        if (vName !== "__identity") {
                            this.resetCircularCheckPassed(
                                upDep.upstreamComponentIdx,
                                vName,
                            );
                        }
                    }
                }
            }
        }
    }

    async updateDependencies({ componentIdx, stateVariable, dependency }) {
        // console.log(`update dependencies of ${stateVariable} of ${componentIdx}`)

        let component = this._components[componentIdx];
        let stateVarObj = component.state[stateVariable];
        let allStateVariablesAffected = [stateVariable];
        if (stateVarObj.additionalStateVariablesDefined) {
            allStateVariablesAffected.push(
                ...stateVarObj.additionalStateVariablesDefined,
            );
        }

        let determineDeps =
            this.downstreamDependencies[componentIdx][stateVariable]
                .__determine_dependencies;
        let dependencyResult;

        if (determineDeps) {
            let resolvedAll = true;

            // check if can actually resolve all variables of determineDeps
            if (determineDeps.originalDownstreamVariableNames.length > 0) {
                for (let [
                    ind,
                    cIdx,
                ] of determineDeps.downstreamComponentIndices.entries()) {
                    let comp = this._components[cIdx];
                    for (let vName of determineDeps
                        .mappedDownstreamVariableNamesByComponent[ind]) {
                        let resolved = comp.state[vName].isResolved;

                        if (!resolved) {
                            let result = await this.resolveItem({
                                componentIdx: cIdx,
                                type: "stateVariable",
                                stateVariable: vName,
                            });
                            resolved = result.success;
                        }

                        if (!resolved) {
                            resolvedAll = false;

                            for (let vName2 of allStateVariablesAffected) {
                                await this.addBlocker({
                                    blockerComponentIdx: cIdx,
                                    blockerType: "stateVariable",
                                    blockerStateVariable: vName,
                                    componentIdxBlocked: componentIdx,
                                    typeBlocked: "determineDependencies",
                                    stateVariableBlocked: vName2,
                                    dependencyBlocked: dependency,
                                });
                            }
                        }
                    }
                }
            }

            if (resolvedAll) {
                dependencyResult = await determineDeps.getValue();
            } else {
                return { success: false };
            }
        } else {
            dependencyResult = { changes: {}, value: { stateValues: {} } };
        }

        if (
            Object.keys(dependencyResult.changes).length === 0 &&
            stateVarObj._previousValue !== undefined
        ) {
            // console.log(`no changes for ${stateVariable}`)
            // console.log(dependencyResult)
            // console.log(stateVarObj._previousValue);
            // no changes
            return { success: true };
        }

        // TODO: should we change the output of returnDependencies
        // to be an object with one key being dependencies?
        // That way, we could add another attribute to the return value
        // rather than having returnDependencies add the attribute
        // changedDependency to the arguments
        // (Currently array and array entry state variable could set
        // returnDepArgs.changedDependency to true)
        let returnDepArgs = {
            stateValues: Object.assign({}, dependencyResult.value.stateValues),
            componentInfoObjects: this.componentInfoObjects,
            sharedParameters: component.sharedParameters,
        };

        let newDependencies =
            await stateVarObj.returnDependencies(returnDepArgs);

        if (stateVarObj.stateVariablesDeterminingDependencies) {
            // keep the determineDependencies dependency
            newDependencies.__determine_dependencies = {
                dependencyType: "determineDependencies",
                variableNames:
                    stateVarObj.stateVariablesDeterminingDependencies,
            };
        }

        // console.log("newDependencies")
        // console.log(newDependencies)

        let changeResult = await this.replaceDependenciesIfChanged({
            component,
            stateVariable,
            newDependencies,
            allStateVariablesAffected,
        });

        // console.log("changeResult")
        // console.log(changeResult)

        if (
            !(changeResult.changedDependency || returnDepArgs.changedDependency)
        ) {
            // || arraySizeChanged) {
            // console.log(`didn't actually change a dependency for ${stateVariable} of ${component.componentIdx}`)
            return { success: true };
        }

        // console.log(`actually did change a dependency for ${stateVariable} of ${component.componentIdx}`)

        for (let dep of changeResult.newlyCreatedDependencies) {
            dep.checkForCircular();
        }

        for (let varName of allStateVariablesAffected) {
            this.checkForCircularDependency({
                componentIdx: component.componentIdx,
                varName,
            });
            component.state[varName].forceRecalculation = true;
        }

        if (stateVarObj.initiallyResolved) {
            // note: markStateVariableAndUpstreamDependentsStale includes
            // any additionalStateVariablesDefined with stateVariable
            await this.core.markStateVariableAndUpstreamDependentsStale({
                component,
                varName: stateVariable,
            });
        }

        for (let varName of allStateVariablesAffected) {
            if (component.state[varName].initiallyResolved) {
                this.recordActualChangeInUpstreamDependencies({
                    component,
                    varName,
                });
            }
        }

        await this.addBlockersFromChangedStateVariableDependencies({
            componentIdx,
            stateVariables: allStateVariablesAffected,
        });

        // console.log(`finished updating dependencies of ${stateVariable} of ${component.componentIdx}`)

        return { success: true };
    }

    async replaceDependenciesIfChanged({
        component,
        stateVariable,
        newDependencies,
        allStateVariablesAffected,
    }) {
        // Note: currentDeps object is downstream dependencies
        // of allStateVariablesAffected
        let currentDeps =
            this.downstreamDependencies[component.componentIdx][stateVariable];

        let changedDependency = false;

        let newlyCreatedDependencies = [];

        for (let dependencyName in currentDeps) {
            if (!(dependencyName in newDependencies)) {
                changedDependency = true;
                currentDeps[dependencyName].deleteDependency();
            }
        }

        for (let dependencyName in newDependencies) {
            if (dependencyName in currentDeps) {
                let dependencyDefinition = newDependencies[dependencyName];
                let currentDep = currentDeps[dependencyName];
                if (!deepCompare(dependencyDefinition, currentDep.definition)) {
                    changedDependency = true;
                    currentDeps[dependencyName].deleteDependency();

                    let dependencyDefinition = newDependencies[dependencyName];

                    let dep = new this.dependencyTypes[
                        dependencyDefinition.dependencyType
                    ]({
                        component,
                        stateVariable,
                        allStateVariablesAffected,
                        dependencyName,
                        dependencyDefinition,
                        dependencyHandler: this,
                    });

                    await dep.initialize();

                    newlyCreatedDependencies.push(dep);
                }
            } else {
                changedDependency = true;
                let dependencyDefinition = newDependencies[dependencyName];
                let dep = new this.dependencyTypes[
                    dependencyDefinition.dependencyType
                ]({
                    component,
                    stateVariable,
                    allStateVariablesAffected,
                    dependencyName,
                    dependencyDefinition,
                    dependencyHandler: this,
                });

                await dep.initialize();

                newlyCreatedDependencies.push(dep);
            }
        }
        return { changedDependency, newlyCreatedDependencies };
    }

    async checkForDependenciesOnNewComponent(componentIdx) {
        // console.log(`check for dependencies on new component ${componentIdx}`)

        let variablesChanged = [];

        let variablesJustResolved = {};

        if (
            this.updateTriggers.dependenciesMissingComponentBySpecifiedName[
                componentIdx
            ]
        ) {
            for (let dep of this.updateTriggers
                .dependenciesMissingComponentBySpecifiedName[componentIdx]) {
                let upComponent = this._components[dep.upstreamComponentIdx];

                if (!upComponent) {
                    continue;
                }

                let upVarsInUpstreamComponent = true;

                for (let upVar of dep.upstreamVariableNames) {
                    if (!(upVar in upComponent.state)) {
                        upVarsInUpstreamComponent = false;
                        break;
                    }
                }

                if (!upVarsInUpstreamComponent) {
                    continue;
                }

                for (let varName of dep.upstreamVariableNames) {
                    let stateVarObj = upComponent.state[varName];
                    if (stateVarObj.initiallyResolved) {
                        if (
                            !(
                                variablesJustResolved[
                                    dep.upstreamComponentIdx
                                ] &&
                                variablesJustResolved[dep.upstreamComponentIdx][
                                    varName
                                ]
                            )
                        ) {
                            // console.log(`****** a variable value changed because have a new component ******`)
                            // console.log(`${dep.dependencyName} of ${varName} of ${dep.upstreamComponentIdx}`)
                            variablesChanged.push({
                                componentIdx: dep.upstreamComponentIdx,
                                varName,
                            });
                        }
                    }
                }

                for (let varName of dep.upstreamVariableNames) {
                    this.deleteFromNeededToResolve({
                        componentIdxBlocked: dep.upstreamComponentIdx,
                        typeBlocked: "recalculateDownstreamComponents",
                        stateVariableBlocked: varName,
                        dependencyBlocked: dep.dependencyName,
                        blockerComponentIdx: componentIdx,
                        blockerType: "componentIdentity",
                    });
                }

                // resolving for one variable will resolve for all upstreamVariableNames
                let result = await this.resolveIfReady({
                    componentIdx: dep.upstreamComponentIdx,
                    type: "recalculateDownstreamComponents",
                    stateVariable: dep.representativeStateVariable,
                    dependency: dep.dependencyName,
                    expandComposites: false,
                    recurseUpstream: true,
                });

                if (result.success) {
                    for (let varName of dep.upstreamVariableNames) {
                        if (!upComponent.state[varName].initiallyResolved) {
                            if (
                                !variablesJustResolved[dep.upstreamComponentIdx]
                            ) {
                                variablesJustResolved[
                                    dep.upstreamComponentIdx
                                ] = {};
                            }
                            variablesJustResolved[dep.upstreamComponentIdx][
                                varName
                            ] = true;
                        }
                    }
                } else {
                    for (let varName of dep.upstreamVariableNames) {
                        await this.addBlocker({
                            blockerComponentIdx: dep.upstreamComponentIdx,
                            blockerType: "recalculateDownstreamComponents",
                            blockerStateVariable: varName,
                            blockerDependency: dep.dependencyName,
                            componentIdxBlocked: dep.upstreamComponentIdx,
                            typeBlocked: "stateVariable",
                            stateVariableBlocked: varName,
                        });
                    }
                }
            }

            delete this.updateTriggers
                .dependenciesMissingComponentBySpecifiedName[componentIdx];
        }

        return variablesChanged;
    }

    async getStateVariableDependencyValues({ component, stateVariable }) {
        let dependencyValues = {};
        let dependencyChanges = {};
        let dependencyUsedDefault = {};

        let downDeps =
            this.downstreamDependencies[component.componentIdx][stateVariable];

        for (let dependencyName in downDeps) {
            let dep = downDeps[dependencyName];

            if (dep.onlyToSetInInverseDefinition) {
                continue;
            }

            let { value, changes, usedDefault } = await dep.getValue();

            dependencyValues[dependencyName] = value;
            if (Object.keys(changes).length > 0) {
                dependencyChanges[dependencyName] = changes;
            }
            if (usedDefault) {
                dependencyUsedDefault[dependencyName] = usedDefault;
            }
        }

        return {
            dependencyValues,
            changes: dependencyChanges,
            usedDefault: dependencyUsedDefault,
        };
    }

    recordActualChangeInUpstreamDependencies({ component, varName, changes }) {
        // console.log(`record actual change in ${varName} of ${component.componentIdx}`)
        // console.log(deepClone(changes))

        let componentIdx = component.componentIdx;

        let upstream = this.upstreamDependencies[componentIdx][varName];

        if (upstream) {
            for (let upDep of upstream) {
                if (upDep.valuesChanged) {
                    let ind =
                        upDep.downstreamComponentIndices.indexOf(componentIdx);
                    let upValuesChanged = upDep.valuesChanged[ind][varName];

                    // Note (dated July 20, 2023):
                    // The code in the next two sections references a variable upValuesChangedSub
                    // that is not defined, so it will throw an error if evaluated.
                    // This code is years old at this point and all tests have been passing.
                    // Either there is a rare edge case that will call this code and we need to fix it,
                    // or this code is no longer used.
                    // TODO: determine if this code is need.  Fix it if it is needed or else delete it.

                    if (!upValuesChanged) {
                        // check if have an alias that maps to varName
                        if (component.stateVarAliases) {
                            for (let alias in component.stateVarAliases) {
                                if (
                                    component.stateVarAliases[alias] ===
                                        varName &&
                                    alias in upValuesChangedSub
                                ) {
                                    upValuesChanged = upValuesChangedSub[alias];
                                }
                            }
                        }
                    }

                    // if still don't have record of change, create new change object
                    // (Should only be needed when have array entry variables,
                    // where original change was recorded in array)
                    if (!upValuesChanged) {
                        if (!component.state[varName].isArrayEntry) {
                            throw Error(
                                `Something is wrong, as a variable ${varName} of ${component.componentIdx} actually changed, but wasn't marked with a potential change`,
                            );
                        }
                        upValuesChanged = upValuesChangedSub[varName] = {
                            changed: {},
                        };
                    }

                    if (
                        component.state[varName] &&
                        component.state[varName].isArray
                    ) {
                        if (upValuesChanged.changed === undefined) {
                            upValuesChanged.changed = { arrayKeysChanged: {} };
                        } else if (upValuesChanged.changed === true) {
                            upValuesChanged.changed = {
                                allArrayKeysChanged: true,
                                arraySizeChanged: true,
                                arrayKeysChanged: {},
                            };
                        }
                        if (changes) {
                            if (changes.allArrayKeysChanged) {
                                upValuesChanged.changed.allArrayKeysChanged = true;
                            }
                            if (changes.arraySizeChanged) {
                                upValuesChanged.changed.arraySizeChanged = true;
                            }
                            Object.assign(
                                upValuesChanged.changed.arrayKeysChanged,
                                changes.arrayKeysChanged,
                            );
                        }
                    } else {
                        upValuesChanged.changed = true;
                    }
                }
            }
        }
    }

    async collateCountersAndPropagateToAncestors(component) {
        let allCounterNames = Object.keys(component.counters);
        for (let childIdx of component.allChildrenOrdered) {
            let child = this._components[childIdx];
            if (child) {
                // skip placeholders
                for (let counterName in child.counters) {
                    if (!allCounterNames.includes(counterName)) {
                        allCounterNames.push(counterName);
                    }
                }
            }
        }

        let foundChange = false;

        for (let counterName of allCounterNames) {
            let counters = component.counters[counterName];
            if (!counters) {
                counters = component.counters[counterName] = {
                    dependencies: [],
                    componentList: [],
                };
            }

            let componentList = [];
            if (counters.dependencies.length > 0) {
                // counter is in component itself
                componentList.push(component.componentIdx);
            }

            for (let childIdx of component.allChildrenOrdered) {
                let child = this._components[childIdx];
                if (child) {
                    //skip placeholders
                    let childCounters = child.counters[counterName];
                    if (childCounters) {
                        componentList.push(...childCounters.componentList);
                    }
                }
            }

            if (
                componentList.length !== counters.componentList.length ||
                counters.componentList.some((v, i) => v != componentList[i])
            ) {
                foundChange = true;
                counters.componentList = componentList;
            }
        }

        if (!foundChange) {
            return { foundChange: false };
        }

        if (!component.ancestors[0]) {
            // made it to document
            // set values of counters
            for (let counterName of allCounterNames) {
                let counters = component.counters[counterName];
                for (let [ind, cIdx] of counters.componentList.entries()) {
                    let comp = this._components[cIdx];
                    let compCounter = comp.counters[counterName];
                    compCounter.value = ind + 1;
                    for (let dep of compCounter.dependencies) {
                        if (
                            comp.state[dep.representativeStateVariable]
                                .initiallyResolved
                        ) {
                            // note: markStateVariableAndUpstreamDependentsStale includes
                            // any additionalStateVariablesDefined with stateVariable
                            await this.core.markStateVariableAndUpstreamDependentsStale(
                                {
                                    component: comp,
                                    varName: dep.representativeStateVariable,
                                },
                            );

                            for (let varName of dep.upstreamVariableNames) {
                                // have to force recalculation
                                // since counter dep doesn't show values changed
                                comp.state[varName].forceRecalculation = true;

                                this.recordActualChangeInUpstreamDependencies({
                                    component: comp,
                                    varName,
                                });
                            }
                        }
                    }
                }
            }
            return { foundChange: true, finishedPropagation: true };
        }

        let parent = this._components[component.ancestors[0].componentIdx];
        if (
            !(
                parent &&
                parent.allChildrenOrdered.includes(component.componentIdx)
            )
        ) {
            return { foundChange: true, finishedPropagation: false };
        }

        let parentResult =
            await this.collateCountersAndPropagateToAncestors(parent);

        if (!parentResult.foundChange) {
            console.error(
                `we found a change in propagating counters for ${component.componentIdx}, but no change for ancestors!`,
            );
        }

        return {
            foundChange: true,
            finishedPropagation: parentResult.finishedPropagation,
        };
    }

    getNeededToResolve({ componentIdx, type, stateVariable, dependency }) {
        let neededToResolveForComponent =
            this.resolveBlockers.neededToResolve[componentIdx];
        if (!neededToResolveForComponent) {
            neededToResolveForComponent = this.resolveBlockers.neededToResolve[
                componentIdx
            ] = {};
        }

        let neededToResolve = neededToResolveForComponent[type];
        if (!neededToResolve) {
            neededToResolve = neededToResolveForComponent[type] = {};
        }

        // have an extra level if include a state variable
        if (stateVariable) {
            let neededToResolveTemp = neededToResolve;
            neededToResolve = neededToResolveTemp[stateVariable];
            if (!neededToResolve) {
                neededToResolve = neededToResolveTemp[stateVariable] = {};
            }

            // have yet another level if include a dependency
            if (dependency) {
                let neededToResolveTemp = neededToResolve;
                neededToResolve = neededToResolveTemp[dependency];
                if (!neededToResolve) {
                    neededToResolve = neededToResolveTemp[dependency] = {};
                }
            }
        }

        return neededToResolve;
    }

    deleteFromNeededToResolve({
        componentIdxBlocked,
        typeBlocked,
        stateVariableBlocked,
        dependencyBlocked,
        blockerType,
        blockerCode,
        deleteFromReciprocal = true,
    }) {
        // console.log(`delete from needed to resolve ${componentIdxBlocked}, ${typeBlocked}, ${stateVariableBlocked}, ${dependencyBlocked}, ${blockerType}, ${blockerCode}`)
        // console.log(JSON.parse(JSON.stringify(this.resolveBlockers)))

        let codeBlocked = componentIdxBlocked.toString();
        if (stateVariableBlocked) {
            codeBlocked += "|" + stateVariableBlocked;
            if (dependencyBlocked) {
                codeBlocked += "|" + dependencyBlocked;
            }
        }

        let deleteBlockerTypeAndCode = function (neededObj) {
            if (blockerType) {
                if (neededObj[blockerType]) {
                    if (blockerCode) {
                        let ind = neededObj[blockerType].indexOf(blockerCode);
                        if (ind !== -1) {
                            neededObj[blockerType].splice(ind, 1);
                        }
                        if (neededObj[blockerType].length === 0) {
                            delete neededObj[blockerType];
                        }
                        if (deleteFromReciprocal) {
                            let [
                                blockerComponentIdx,
                                blockerStateVariable,
                                blockerDependency,
                            ] =
                                typeof blockerCode === "string"
                                    ? blockerCode.split("|")
                                    : [blockerCode];
                            this.deleteFromResolveBlockedBy({
                                blockerComponentIdx,
                                blockerType,
                                blockerStateVariable,
                                blockerDependency,
                                typeBlocked,
                                codeBlocked,
                                deleteFromReciprocal: false,
                            });
                        }
                    } else {
                        // no blockerCode given, so deleting all for blockerType
                        // Just delete from reciprocal here
                        // (can't actually delete originals in this function, as need access to parent object)
                        if (deleteFromReciprocal) {
                            for (let code of neededObj[blockerType]) {
                                let [
                                    blockerComponentIdx,
                                    blockerStateVariable,
                                    blockerDependency,
                                ] =
                                    typeof code === "string"
                                        ? code.split("|")
                                        : [code];
                                this.deleteFromResolveBlockedBy({
                                    blockerComponentIdx,
                                    blockerType,
                                    blockerStateVariable,
                                    blockerDependency,
                                    typeBlocked,
                                    codeBlocked,
                                    deleteFromReciprocal: false,
                                });
                            }
                        }

                        delete neededObj[blockerType];
                    }
                }
            } else {
                // no blockerType given, so deleting all blockerCodes for all blockerTypes
                if (deleteFromReciprocal) {
                    for (let type in neededObj) {
                        for (let code of neededObj[type]) {
                            let [
                                blockerComponentIdx,
                                blockerStateVariable,
                                blockerDependency,
                            ] =
                                typeof code === "string"
                                    ? code.split("|")
                                    : [code];
                            this.deleteFromResolveBlockedBy({
                                blockerComponentIdx,
                                blockerType: type,
                                blockerStateVariable,
                                blockerDependency,
                                typeBlocked,
                                codeBlocked,
                                deleteFromReciprocal: false,
                            });
                        }
                    }
                }
            }
        }.bind(this);

        let neededToResolveForComponent =
            this.resolveBlockers.neededToResolve[componentIdxBlocked];

        if (neededToResolveForComponent) {
            let neededToResolveForType =
                neededToResolveForComponent[typeBlocked];

            if (neededToResolveForType) {
                // have an extra level if include a state variable
                if (stateVariableBlocked) {
                    let neededToResolveForStateVariable =
                        neededToResolveForType[stateVariableBlocked];
                    if (neededToResolveForStateVariable) {
                        // have yet another level if include a dependency
                        if (dependencyBlocked) {
                            let neededToResolveForDependency =
                                neededToResolveForStateVariable[
                                    dependencyBlocked
                                ];
                            if (neededToResolveForDependency) {
                                deleteBlockerTypeAndCode(
                                    neededToResolveForDependency,
                                );
                                if (
                                    !blockerType ||
                                    Object.keys(neededToResolveForDependency)
                                        .length === 0
                                ) {
                                    delete neededToResolveForStateVariable[
                                        dependencyBlocked
                                    ];
                                }
                            }
                            if (
                                Object.keys(neededToResolveForStateVariable)
                                    .length === 0
                            ) {
                                delete neededToResolveForType[
                                    stateVariableBlocked
                                ];
                            }
                        } else {
                            deleteBlockerTypeAndCode(
                                neededToResolveForStateVariable,
                            );
                            if (
                                !blockerType ||
                                Object.keys(neededToResolveForStateVariable)
                                    .length === 0
                            ) {
                                delete neededToResolveForType[
                                    stateVariableBlocked
                                ];
                            }
                        }
                    }
                    if (Object.keys(neededToResolveForType).length === 0) {
                        delete neededToResolveForComponent[typeBlocked];
                    }
                } else {
                    deleteBlockerTypeAndCode(neededToResolveForType);
                    if (
                        !blockerType ||
                        Object.keys(neededToResolveForType).length === 0
                    ) {
                        delete neededToResolveForComponent[typeBlocked];
                    }
                }
            }

            if (Object.keys(neededToResolveForComponent).length === 0) {
                delete this.resolveBlockers.neededToResolve[
                    componentIdxBlocked
                ];
            }
        }

        // console.log(`done deleting from needed to resolve ${componentIdxBlocked}, ${typeBlocked}, ${stateVariableBlocked}, ${dependencyBlocked}, ${blockerType}, ${blockerCode}`)
        // console.log(JSON.parse(JSON.stringify(this.resolveBlockers)))
    }

    checkIfHaveNeededToResolve({
        componentIdx,
        type,
        stateVariable,
        dependency,
    }) {
        let neededToResolveForComponent =
            this.resolveBlockers.neededToResolve[componentIdx];
        if (!neededToResolveForComponent) {
            return false;
        }

        let neededToResolve = neededToResolveForComponent[type];
        if (!neededToResolve) {
            return false;
        }

        // have an extra level if include a state variable
        if (stateVariable) {
            let neededToResolveTemp = neededToResolve;
            neededToResolve = neededToResolveTemp[stateVariable];
            if (!neededToResolve) {
                return false;
            }

            // have yet another level if include a dependency
            if (dependency) {
                let neededToResolveTemp = neededToResolve;
                neededToResolve = neededToResolveTemp[dependency];
                if (!neededToResolve) {
                    return false;
                }
            }
        }

        return Object.keys(neededToResolve).length > 0;
    }

    getResolveBlockedBy({ componentIdx, type, stateVariable, dependency }) {
        let resolveBlockedByComponent =
            this.resolveBlockers.resolveBlockedBy[componentIdx];
        if (!resolveBlockedByComponent) {
            resolveBlockedByComponent = this.resolveBlockers.resolveBlockedBy[
                componentIdx
            ] = {};
        }

        let resolveBlockedBy = resolveBlockedByComponent[type];
        if (!resolveBlockedBy) {
            resolveBlockedBy = resolveBlockedByComponent[type] = {};
        }

        // have an extra level if include a state variable
        if (stateVariable) {
            let resolveBlockedByTemp = resolveBlockedBy;
            resolveBlockedBy = resolveBlockedByTemp[stateVariable];
            if (!resolveBlockedBy) {
                resolveBlockedBy = resolveBlockedByTemp[stateVariable] = {};
            }

            // have yet another level if include a dependency
            if (dependency) {
                let resolveBlockedByTemp = resolveBlockedBy;
                resolveBlockedBy = resolveBlockedByTemp[dependency];
                if (!resolveBlockedBy) {
                    resolveBlockedBy = resolveBlockedByTemp[dependency] = {};
                }
            }
        }

        return resolveBlockedBy;
    }

    deleteFromResolveBlockedBy({
        blockerComponentIdx,
        blockerType,
        blockerStateVariable,
        blockerDependency,
        typeBlocked,
        codeBlocked,
        deleteFromReciprocal = true,
    }) {
        // console.log(`delete from resolve blocked by ${blockerComponentIdx}, ${blockerType}, ${blockerStateVariable}, ${blockerDependency}, ${typeBlocked}, ${codeBlocked}`)
        // console.log(JSON.parse(JSON.stringify(this.resolveBlockers)))

        let blockerCode = blockerComponentIdx.toString();
        if (blockerStateVariable) {
            blockerCode += "|" + blockerStateVariable;
            if (blockerDependency) {
                blockerCode += "|" + blockerDependency;
            }
        }

        let deleteTypeAndCodeBlocked = function (neededObj) {
            if (typeBlocked) {
                if (neededObj[typeBlocked]) {
                    if (codeBlocked) {
                        let ind = neededObj[typeBlocked].indexOf(codeBlocked);
                        if (ind !== -1) {
                            neededObj[typeBlocked].splice(ind, 1);
                        }
                        if (neededObj[typeBlocked].length === 0) {
                            delete neededObj[typeBlocked];
                        }
                        if (deleteFromReciprocal) {
                            let [
                                componentIdxBlocked,
                                stateVariableBlocked,
                                dependencyBlocked,
                            ] =
                                typeof codeBlocked === "string"
                                    ? codeBlocked.split("|")
                                    : [codeBlocked];

                            this.deleteFromNeededToResolve({
                                componentIdxBlocked,
                                typeBlocked,
                                stateVariableBlocked,
                                dependencyBlocked,
                                blockerType,
                                blockerCode,
                                deleteFromReciprocal: false,
                            });
                        }
                    } else {
                        // no codeBlocked given, so deleting all for typeBlocked
                        if (deleteFromReciprocal) {
                            for (let code of neededObj[typeBlocked]) {
                                let [
                                    componentIdxBlocked,
                                    stateVariableBlocked,
                                    dependencyBlocked,
                                ] =
                                    typeof code === "string"
                                        ? code.split("|")
                                        : [code];
                                this.deleteFromNeededToResolve({
                                    componentIdxBlocked,
                                    typeBlocked,
                                    stateVariableBlocked,
                                    dependencyBlocked,
                                    blockerType,
                                    blockerCode,
                                    deleteFromReciprocal: false,
                                });
                            }
                        }

                        delete neededObj[typeBlocked];
                    }
                }
            } else {
                // no typeBlocked given, so will delete all codeBlockeds for all typeBlockeds
                // Just delete from reciprocal here
                // (can't actually delete originals in this function, as need access to parent object)
                if (deleteFromReciprocal) {
                    for (let type in neededObj) {
                        for (let code of neededObj[type]) {
                            let [
                                componentIdxBlocked,
                                stateVariableBlocked,
                                dependencyBlocked,
                            ] =
                                typeof code === "string"
                                    ? code.split("|")
                                    : [code];
                            this.deleteFromNeededToResolve({
                                componentIdxBlocked,
                                typeBlocked: type,
                                stateVariableBlocked,
                                dependencyBlocked,
                                blockerType,
                                blockerCode,
                                deleteFromReciprocal: false,
                            });
                        }
                    }
                }
            }
        }.bind(this);

        let resolveBlockedByForComponent =
            this.resolveBlockers.resolveBlockedBy[blockerComponentIdx];

        if (resolveBlockedByForComponent) {
            let resolveBlockedByForType =
                resolveBlockedByForComponent[blockerType];

            if (resolveBlockedByForType) {
                // have an extra level if include a state variable
                if (blockerStateVariable) {
                    let resolveBlockedByForStateVariable =
                        resolveBlockedByForType[blockerStateVariable];
                    if (resolveBlockedByForStateVariable) {
                        // have yet another level if include a dependency
                        if (blockerDependency) {
                            let resolveBlockedByForDependency =
                                resolveBlockedByForStateVariable[
                                    blockerDependency
                                ];
                            if (resolveBlockedByForDependency) {
                                deleteTypeAndCodeBlocked(
                                    resolveBlockedByForDependency,
                                );
                                if (
                                    !typeBlocked ||
                                    Object.keys(resolveBlockedByForDependency)
                                        .length === 0
                                ) {
                                    delete resolveBlockedByForStateVariable[
                                        blockerDependency
                                    ];
                                }
                            }
                            if (
                                Object.keys(resolveBlockedByForStateVariable)
                                    .length === 0
                            ) {
                                delete resolveBlockedByForType[
                                    blockerStateVariable
                                ];
                            }
                        } else {
                            deleteTypeAndCodeBlocked(
                                resolveBlockedByForStateVariable,
                            );
                            if (
                                !typeBlocked ||
                                Object.keys(resolveBlockedByForStateVariable)
                                    .length === 0
                            ) {
                                delete resolveBlockedByForType[
                                    blockerStateVariable
                                ];
                            }
                        }
                    }
                    if (Object.keys(resolveBlockedByForType).length === 0) {
                        delete resolveBlockedByForComponent[blockerType];
                    }
                } else {
                    deleteTypeAndCodeBlocked(resolveBlockedByForType);
                    if (
                        !typeBlocked ||
                        Object.keys(resolveBlockedByForType).length === 0
                    ) {
                        delete resolveBlockedByForComponent[blockerType];
                    }
                }
            }

            if (Object.keys(resolveBlockedByForComponent).length === 0) {
                delete this.resolveBlockers.resolveBlockedBy[
                    blockerComponentIdx
                ];
            }
        }

        // console.log(`done deleting from resolve blocked by ${blockerComponentIdx}, ${blockerType}, ${blockerStateVariable}, ${blockerDependency}, ${typeBlocked}, ${codeBlocked}`)
        // console.log(JSON.parse(JSON.stringify(this.resolveBlockers)))
    }

    async addBlocker({
        blockerComponentIdx,
        blockerType,
        blockerStateVariable,
        blockerDependency,
        componentIdxBlocked,
        typeBlocked,
        stateVariableBlocked,
        dependencyBlocked,
    }) {
        let blockerCode = blockerComponentIdx.toString();
        if (blockerStateVariable) {
            blockerCode += "|" + blockerStateVariable;
            if (blockerDependency) {
                blockerCode += "|" + blockerDependency;
            }
        }

        let codeBlocked = componentIdxBlocked;
        if (stateVariableBlocked) {
            codeBlocked += "|" + stateVariableBlocked;
            if (dependencyBlocked) {
                codeBlocked += "|" + dependencyBlocked;
            }
        }

        let neededForBlocked = this.getNeededToResolve({
            componentIdx: componentIdxBlocked,
            type: typeBlocked,
            stateVariable: stateVariableBlocked,
            dependency: dependencyBlocked,
        });

        let neededToResolveBlocked = neededForBlocked[blockerType];
        if (!neededToResolveBlocked) {
            neededToResolveBlocked = neededForBlocked[blockerType] = [];
        }

        // if blockers is already recorded, then nothing to do
        if (neededToResolveBlocked.includes(blockerCode)) {
            return;
        }

        neededToResolveBlocked.push(blockerCode);

        if (typeBlocked === "stateVariable") {
            let component = this._components[componentIdxBlocked];
            if (component) {
                let stateVarObj = component.state[stateVariableBlocked];
                stateVarObj.isResolved = false;
                if (stateVarObj.initiallyResolved) {
                    // note: markStateVariableAndUpstreamDependentsStale includes
                    // any additionalStateVariablesDefined with stateVariable
                    await this.core.markStateVariableAndUpstreamDependentsStale(
                        {
                            component,
                            varName: stateVariableBlocked,
                        },
                    );

                    // record that stateVarObj is blocking its upstream dependencies
                    let upDeps =
                        this.upstreamDependencies[componentIdxBlocked][
                            stateVariableBlocked
                        ];
                    if (upDeps) {
                        for (let dep of upDeps) {
                            if (this._components[dep.upstreamComponentIdx]) {
                                for (let vName of dep.upstreamVariableNames) {
                                    await this.addBlocker({
                                        blockerComponentIdx:
                                            componentIdxBlocked,
                                        blockerType: "stateVariable",
                                        blockerStateVariable:
                                            stateVariableBlocked,
                                        componentIdxBlocked:
                                            dep.upstreamComponentIdx,
                                        typeBlocked: "stateVariable",
                                        stateVariableBlocked: vName,
                                    });
                                }
                            }
                        }
                    }
                }
            }
        }

        // record that blocked by blocker
        let resolvedBlockedByBlocker = this.getResolveBlockedBy({
            componentIdx: blockerComponentIdx,
            type: blockerType,
            stateVariable: blockerStateVariable,
            dependency: blockerDependency,
        });

        let blockedByBlocker = resolvedBlockedByBlocker[typeBlocked];
        if (!blockedByBlocker) {
            blockedByBlocker = resolvedBlockedByBlocker[typeBlocked] = [];
        }
        if (!blockedByBlocker.includes(codeBlocked)) {
            blockedByBlocker.push(codeBlocked);
        }

        this.resetCircularResolveBlockerCheckPassed({
            componentIdx: componentIdxBlocked,
            type: typeBlocked,
            stateVariable: stateVariableBlocked,
            dependency: dependencyBlocked,
        });

        this.checkForCircularResolveBlocker({
            componentIdx: componentIdxBlocked,
            type: typeBlocked,
            stateVariable: stateVariableBlocked,
            dependency: dependencyBlocked,
        });
    }

    async processNewlyResolved({
        componentIdxNewlyResolved,
        typeNewlyResolved,
        stateVariableNewlyResolved,
        dependencyNewlyResolved,
        expandComposites = true,
        force = false,
        recurseUpstream = false,
    }) {
        // console.log(`process newly resolved ${componentIdxNewlyResolved}, ${typeNewlyResolved}, ${stateVariableNewlyResolved}`)

        // Note: even if expandComposites=false and force=false
        // we still might expand composites and force evaluate
        // as resolving a determineDependency will call updateDependencies
        // and updateDependencies calls the getters on
        // the state variables determining dependencies

        if (typeNewlyResolved === "stateVariable") {
            let component = this._components[componentIdxNewlyResolved];
            if (component) {
                let stateVarObj = component.state[stateVariableNewlyResolved];
                if (stateVarObj) {
                    component.state[stateVariableNewlyResolved].isResolved =
                        true;
                    component.state[
                        stateVariableNewlyResolved
                    ].initiallyResolved = true;
                }
            }
        } else if (typeNewlyResolved === "componentIdentity") {
            if (!(componentIdxNewlyResolved in this._components || force)) {
                // console.log(`cannot resolve component identity ${componentIdxNewlyResolved} as component doesn't exist`);
                return { success: false };
            }
        } else {
            if (typeNewlyResolved === "recalculateDownstreamComponents") {
                let dep;

                // if dep doesn't exist, ignore this blocker
                // and continue to resolve anything blocked by it
                try {
                    dep =
                        this.downstreamDependencies[componentIdxNewlyResolved][
                            stateVariableNewlyResolved
                        ][dependencyNewlyResolved];
                } catch (e) {}

                if (dep) {
                    let result = await dep.recalculateDownstreamComponents({
                        force,
                    });

                    if (!(result.success || force)) {
                        return result;
                    }

                    for (let varName of dep.upstreamVariableNames) {
                        this.deleteFromNeededToResolve({
                            componentIdxBlocked: dep.upstreamComponentIdx,
                            typeBlocked: "stateVariable",
                            stateVariableBlocked: varName,
                            blockerType: "recalculateDownstreamComponents",
                            blockerCode:
                                dep.upstreamComponentIdx +
                                "|" +
                                varName +
                                "|" +
                                dependencyNewlyResolved,
                        });
                    }
                    for (let varName of dep.upstreamVariableNames) {
                        await this.resolveIfReady({
                            componentIdx: dep.upstreamComponentIdx,
                            type: "stateVariable",
                            stateVariable: varName,
                            expandComposites,
                            force,
                            recurseUpstream,
                        });
                    }

                    // No need to resolve items blocked by the newly resolved (below)
                    // as the above did this and even more
                    // (resolving all upstream variables of the dependency)
                    return { success: true };
                }
            } else if (typeNewlyResolved === "determineDependencies") {
                let dep;

                // if dep doesn't exist, ignore this blocker
                // and continue to resolve anything blocked by it
                try {
                    dep =
                        this.downstreamDependencies[componentIdxNewlyResolved][
                            stateVariableNewlyResolved
                        ][dependencyNewlyResolved];
                } catch (e) {}

                if (dep) {
                    // check if there are any other determineDependencies blocking state variable
                    let neededForItem = this.getNeededToResolve({
                        componentIdx: componentIdxNewlyResolved,
                        type: "stateVariable",
                        stateVariable: stateVariableNewlyResolved,
                    });

                    let foundDetermineDependenciesNotResolved = false;
                    let determineDepsDependencies = [];
                    if (neededForItem.determineDependencies) {
                        for (let code of neededForItem.determineDependencies) {
                            let [
                                blockerComponentIdx,
                                blockerStateVariable,
                                blockerDependency,
                            ] =
                                typeof code === "string"
                                    ? code.split("|")
                                    : [code];

                            if (
                                this.checkIfHaveNeededToResolve({
                                    componentIdx: componentIdxNewlyResolved,
                                    type: "determineDependency",
                                    stateVariable: stateVariableNewlyResolved,
                                    dependency: blockerDependency,
                                })
                            ) {
                                foundDetermineDependenciesNotResolved = true;
                                break;
                            }

                            determineDepsDependencies.push(blockerDependency);
                        }
                    }

                    if (foundDetermineDependenciesNotResolved) {
                        // nothing more to do as still cannot update dependencies
                        // of state variable
                        return { success: true };
                    }

                    // if all determine dependences have been resolved
                    // recalculate dependencies for state variable
                    let result = await this.updateDependencies({
                        componentIdx: componentIdxNewlyResolved,
                        stateVariable: stateVariableNewlyResolved,
                        dependency: dependencyNewlyResolved,
                    });

                    if (!result.success) {
                        // console.log(`failing to update dependencies`)
                        return { success: false };
                    }

                    // resolve all state variables defined from dep
                    // as they all had their dependencies updated
                    for (let varName of dep.upstreamVariableNames) {
                        for (let dependency of determineDepsDependencies) {
                            this.deleteFromResolveBlockedBy({
                                blockerComponentIdx: dep.upstreamComponentIdx,
                                blockerType: "determineDependencies",
                                blockerStateVariable: varName,
                                blockerDependency: dependency,
                            });
                        }
                        await this.resolveIfReady({
                            componentIdx: componentIdxNewlyResolved,
                            type: "stateVariable",
                            stateVariable: varName,
                            expandComposites,
                            force,
                            recurseUpstream,
                        });
                    }

                    // No need to resolve items blocked by the newly resolved (below)
                    // as the above did this and even more
                    // (resolving all upstream variables of the dependency)
                    return { success: true };
                }
            } else if (typeNewlyResolved === "childMatches") {
                let component = this._components[componentIdxNewlyResolved];

                if (component) {
                    if (!component.childrenMatched) {
                        let result =
                            await this.core.deriveChildResultsFromDefiningChildren(
                                {
                                    parent: component,
                                    expandComposites,
                                    forceExpandComposites: force,
                                },
                            );

                        if (
                            !result.skipping &&
                            !(
                                component.childrenMatchedWithPlaceholders ||
                                force
                            )
                        ) {
                            // console.warn(`cannot resolve child logic of ${componentIdxNewlyResolved} as child logic isn't satisfied`);
                            return { success: false };
                        }
                    }
                }
            } else if (typeNewlyResolved === "expandComposite") {
                let composite = this._components[componentIdxNewlyResolved];
                if (!composite.isExpanded) {
                    if (
                        this.core.updateInfo.compositesBeingExpanded.includes(
                            componentIdxNewlyResolved,
                        )
                    ) {
                        return { success: false };
                    }

                    await this.core.expandCompositeComponent(
                        this._components[componentIdxNewlyResolved],
                    );
                }
            } else {
                throw Error(
                    `Unrecognized type newly resolved: ${typeNewlyResolved}`,
                );
            }
        }

        let resolveBlockedByNewlyResolved = this.getResolveBlockedBy({
            componentIdx: componentIdxNewlyResolved,
            type: typeNewlyResolved,
            stateVariable: stateVariableNewlyResolved,
            dependency: dependencyNewlyResolved,
        });

        // use shallow copies as we are deleting the blockers as we loop through
        resolveBlockedByNewlyResolved = Object.assign(
            {},
            resolveBlockedByNewlyResolved,
        );

        for (let type in resolveBlockedByNewlyResolved) {
            for (let code of [...resolveBlockedByNewlyResolved[type]]) {
                // first delete
                this.deleteFromResolveBlockedBy({
                    blockerComponentIdx: componentIdxNewlyResolved,
                    blockerType: typeNewlyResolved,
                    blockerStateVariable: stateVariableNewlyResolved,
                    blockerDependency: dependencyNewlyResolved,
                    typeBlocked: type,
                    codeBlocked: code,
                });

                if (recurseUpstream) {
                    let [cIdx, vName, depName] =
                        typeof code === "string" ? code.split("|") : [code];

                    await this.resolveIfReady({
                        componentIdx: cIdx,
                        type,
                        stateVariable: vName,
                        dependency: depName,
                        expandComposites,
                        force,
                        recurseUpstream,
                    });
                }
            }
        }

        return { success: true };
    }

    async resolveStateVariablesIfReady({ component, stateVariables }) {
        // console.log(`resolve state variables if ready for ${component.componentIdx}`);

        let componentIdx = component.componentIdx;

        if (!stateVariables) {
            await this.resolveIfReady({
                componentIdx,
                type: "componentIdentity",
                expandComposites: false,
                // recurseUpstream: true
            });

            stateVariables = Object.keys(component.state);
        }

        for (let varName of stateVariables) {
            // TODO: remove this commented out code if it turns out we don't need `determineDependenciesImmediately`

            // let stateVarObj = component.state[varName];

            // if (stateVarObj && stateVarObj.determineDependenciesImmediately) {
            //     let neededForItem = this.getNeededToResolve({
            //         componentIdx,
            //         type: "stateVariable",
            //         stateVariable: varName,
            //     });

            //     let determineDepsBlockers = neededForItem.determineDependencies;
            //     if (determineDepsBlockers) {
            //         for (let blockerCode of determineDepsBlockers) {
            //             let [
            //                 blockerComponentIdx,
            //                 blockerStateVariable,
            //                 blockerDependency,
            //             ] =
            //                 typeof blockerCode === "string"
            //                     ? blockerCode.split("|")
            //                     : [blockerCode];

            //             await this.resolveIfReady({
            //                 componentIdx: blockerComponentIdx,
            //                 type: "determineDependencies",
            //                 stateVariable: blockerStateVariable,
            //                 dependency: blockerDependency,
            //                 expandComposites: true, // TODO: why is this true?
            //                 // recurseUpstream: true
            //             });
            //         }
            //     }
            // }
            await this.resolveIfReady({
                componentIdx,
                type: "stateVariable",
                stateVariable: varName,
                expandComposites: false,
                // recurseUpstream: true
            });
        }

        // console.log(`finished resolving state variables if ready ${component.componentIdx}`);
        // console.log(JSON.parse(JSON.stringify(this.resolveBlockers)))
    }

    async resolveIfReady({
        componentIdx,
        type,
        stateVariable,
        dependency,
        expandComposites = true,
        force = false,
        recurseUpstream = false,
    }) {
        // console.log(`resolve if ready ${componentIdx}, ${type}, ${stateVariable}, ${dependency}`)

        let haveNeededToResolve = this.checkIfHaveNeededToResolve({
            componentIdx,
            type,
            stateVariable,
            dependency,
        });

        if (haveNeededToResolve) {
            return { success: false };
        }

        // Although needed to resolve is empty,
        // running deleteFromNeededToResolve will remove
        // the empty data structures
        this.deleteFromNeededToResolve({
            componentIdxBlocked: componentIdx,
            typeBlocked: type,
            stateVariableBlocked: stateVariable,
            dependencyBlocked: dependency,
        });

        let result = await this.processNewlyResolved({
            componentIdxNewlyResolved: componentIdx,
            typeNewlyResolved: type,
            stateVariableNewlyResolved: stateVariable,
            dependencyNewlyResolved: dependency,
            expandComposites,
            force,
            recurseUpstream,
        });

        return result;
    }

    async resolveItem({
        componentIdx,
        type,
        stateVariable,
        dependency,
        force = false,
        recurseUpstream = false,
        expandComposites = true,
        numPreviouslyNeeded,
    }) {
        // if (!this.resolveLevels) {
        //   this.resolveLevels = 0;
        // }
        // this.resolveLevels++;

        // console.log(`${" ".repeat(this.resolveLevels - 1)}${this.resolveLevels}. resolve item ${componentIdx}, ${type}, ${stateVariable}, ${dependency}, ${expandComposites}, ${force}`)

        // Note: even if expandComposites=false and force=false
        // we still might expand composites and force evaluate
        // as resolving a determineDependency will call updateDependencies
        // and updateDependencies calls the getters on
        // the state variables determining dependencies

        let neededForItem = this.getNeededToResolve({
            componentIdx,
            type,
            stateVariable,
            dependency,
        });

        // first resolve determine dependencies, if it exists

        let determineDepsBlockers = neededForItem.determineDependencies;

        if (determineDepsBlockers && determineDepsBlockers.length > 0) {
            for (let blockerCode of [...determineDepsBlockers]) {
                let [
                    blockerComponentIdx,
                    blockerStateVariable,
                    blockerDependency,
                ] =
                    typeof blockerCode === "string"
                        ? blockerCode.split("|")
                        : [blockerCode];

                let result = await this.resolveItem({
                    componentIdx: blockerComponentIdx,
                    type: "determineDependencies",
                    stateVariable: blockerStateVariable,
                    dependency: blockerDependency,
                    force, //recurseUpstream
                    expandComposites,
                });

                if (!result.success) {
                    // console.log(`${" ".repeat(this.resolveLevels - 1)}${this.resolveLevels}. couldn't resolve ${componentIdx}, ${type}, ${stateVariable}, ${dependency}`)
                    // this.resolveLevels--;
                    return result;
                }
            }
        }

        let stateVarObj;
        if (type === "stateVariable" && this._components[componentIdx]) {
            stateVarObj = this._components[componentIdx].state[stateVariable];
            if (stateVarObj) {
                stateVarObj.currentlyResolving = true;
            }
        }

        // first try without forcing
        // i.e., without passing force on to resolveItem
        // that way, if force===true, we'll first iterate
        // to possibly reveal other items needed resolve
        // that are picked up from the failures

        let previousNFailures = Infinity;
        let nFailures = Infinity;
        while (Object.keys(neededForItem).length > 0 || nFailures > 0) {
            if (Number.isFinite(nFailures) && nFailures >= previousNFailures) {
                break;
            }
            if (nFailures > 0) {
                neededForItem = this.getNeededToResolve({
                    componentIdx,
                    type,
                    stateVariable,
                    dependency,
                });
            }
            previousNFailures = nFailures;
            nFailures = 0;

            for (let blockerType in neededForItem) {
                if (blockerType === "determineDependencies") {
                    throw Error(
                        `Shouldn't have determine dependencies blocker after determining dependencies: ${componentIdx}, ${type}, ${stateVariable}, ${dependency}`,
                    );
                }

                // shallow copy, as items may be deleted as resolve items
                for (let code of [...neededForItem[blockerType]]) {
                    let [
                        blockerComponentIdx,
                        blockerStateVariable,
                        blockerDependency,
                    ] = typeof code === "string" ? code.split("|") : [code];

                    let result = await this.resolveItem({
                        componentIdx: blockerComponentIdx,
                        type: blockerType,
                        stateVariable: blockerStateVariable,
                        dependency: blockerDependency,
                        //force, //recurseUpstream
                        expandComposites,
                    });

                    if (!result.success) {
                        if (force) {
                            nFailures++;
                        } else {
                            // console.log(`${" ".repeat(this.resolveLevels - 1)}couldn't resolve ${componentIdx}, ${type}, ${stateVariable}, ${dependency}`)
                            // this.resolveLevels--;
                            return result;
                        }
                    }
                }
            }
        }

        if (nFailures > 0) {
            // if had failures and made it to here,
            // it means we are forcing.
            // Try one more time while passing force to resolveItem

            neededForItem = this.getNeededToResolve({
                componentIdx,
                type,
                stateVariable,
                dependency,
            });

            while (Object.keys(neededForItem).length > 0) {
                for (let blockerType in neededForItem) {
                    if (blockerType === "determineDependencies") {
                        throw Error(
                            `Shouldn't have determine dependencies blocker after determining dependencies: ${componentIdx}, ${type}, ${stateVariable}, ${dependency}`,
                        );
                    }

                    // shallow copy, as items may be deleted as resolve items
                    for (let code of [...neededForItem[blockerType]]) {
                        let [
                            blockerComponentIdx,
                            blockerStateVariable,
                            blockerDependency,
                        ] = typeof code === "string" ? code.split("|") : [code];

                        let result = await this.resolveItem({
                            componentIdx: blockerComponentIdx,
                            type: blockerType,
                            stateVariable: blockerStateVariable,
                            dependency: blockerDependency,
                            force, //recurseUpstream
                            expandComposites,
                        });

                        if (!result.success) {
                            // console.log(`${" ".repeat(this.resolveLevels - 1)}couldn't resolve ${componentIdx}, ${type}, ${stateVariable}, ${dependency}`)
                            // this.resolveLevels--;
                            return result;
                        }
                    }
                }
            }
        }

        if (stateVarObj) {
            stateVarObj.currentlyResolving = false;
        }

        // item is resolved
        let finalResult = await this.resolveIfReady({
            componentIdx,
            type,
            stateVariable,
            dependency,
            force,
            recurseUpstream,
            expandComposites,
        });

        if (!finalResult.success) {
            // after removing all blockers, we still can't resolve

            let stillNeededForItem = this.getNeededToResolve({
                componentIdx,
                type,
                stateVariable,
                dependency,
            });

            let numNeeded = Object.keys(stillNeededForItem).length;

            if (numNeeded > 0) {
                if (
                    numPreviouslyNeeded === undefined ||
                    numNeeded < numPreviouslyNeeded
                ) {
                    // if this is the first time or the number needed is decreasing
                    // then we can try again

                    finalResult = await this.resolveItem({
                        componentIdx,
                        type,
                        stateVariable,
                        dependency,
                        force,
                        recurseUpstream,
                        expandComposites,
                        numPreviouslyNeeded: numNeeded,
                    });
                }
            }
        }

        // console.log(`${" ".repeat(this.resolveLevels - 1)}${this.resolveLevels}. done resolving item ${componentIdx}, ${type}, ${stateVariable}, ${dependency}, ${expandComposites}, ${force}`)
        // this.resolveLevels--;

        return finalResult;
    }

    checkForCircularResolveBlocker({
        componentIdx,
        type,
        stateVariable,
        dependency,
        previouslyVisited = [],
    }) {
        let code = componentIdx.toString();
        if (stateVariable) {
            code += "|" + stateVariable;
            if (dependency) {
                code += "|" + dependency;
            }
        }

        let identifier = code + "|" + type;

        if (previouslyVisited.includes(identifier)) {
            // Found circular dependency
            // Create error message with list of component types and names involved

            console.log("found circular", identifier, previouslyVisited);

            let componentNameRe = /^([^|]*)\|/;

            let componentsInvolved = previouslyVisited.map(
                (x) => this.components[x.match(componentNameRe)[1]],
            );

            let message = this.getCircularDependencyMessage(componentsInvolved);

            throw Error(message);
        } else {
            // shallow copy so don't change original
            previouslyVisited = [...previouslyVisited, identifier];
        }

        if (!this.circularResolveBlockedCheckPassed[identifier]) {
            this.circularResolveBlockedCheckPassed[identifier] = true;

            let neededForItem = this.getNeededToResolve({
                componentIdx,
                type,
                stateVariable,
                dependency,
            });

            for (let blockerType in neededForItem) {
                for (let blockerCode of neededForItem[blockerType]) {
                    let [
                        blockerComponentIdx,
                        blockerStateVariable,
                        blockerDependency,
                    ] =
                        typeof blockerCode === "string"
                            ? blockerCode.split("|")
                            : [blockerCode];

                    this.checkForCircularResolveBlocker({
                        componentIdx: blockerComponentIdx,
                        type: blockerType,
                        stateVariable: blockerStateVariable,
                        dependency: blockerDependency,
                        previouslyVisited,
                    });
                }
            }
        }
    }

    getCircularDependencyMessage(componentsInvolved) {
        let uniqueComponentNames = [];
        let componentTypesForUniqueNames = [];
        let linesForUniqueNames = [];

        // remove internally created component names
        // and deduplicate while keeping order (so don't use Set)
        for (let comp of componentsInvolved) {
            let name = comp.componentIdx;
            let relativeName = name;
            if (relativeName) {
                // XXX: what do do for name here?
            } else {
                relativeName = comp.doenetAttributes?.prescribedName;
            }

            if (relativeName) {
                if (!uniqueComponentNames.includes(relativeName)) {
                    uniqueComponentNames.push(relativeName);
                    componentTypesForUniqueNames.push(comp.componentType);
                    let position = comp.position;
                    let addedLine = false;
                    if (position) {
                        if (
                            position.doenetMLId === 0 &&
                            position.start.line === undefined
                        ) {
                            Object.assign(
                                position,
                                getLineCharRange(
                                    position,
                                    this.core.doenetMLNewlines,
                                ),
                            );
                        }
                        let lineBegin = position.start.line;
                        if (lineBegin) {
                            addedLine = true;
                            let lineEnd = position.end.line;
                            if (lineEnd === lineBegin) {
                                linesForUniqueNames.push(`line ${lineBegin}`);
                            } else {
                                linesForUniqueNames.push(
                                    `lines ${lineBegin}–${lineEnd}`,
                                );
                            }
                        }
                    }
                    if (!addedLine) {
                        linesForUniqueNames.push(null);
                    }
                }
            }
        }

        // If had only internally created component names, just give first componentIdx
        if (uniqueComponentNames.length === 0) {
            let comp = componentsInvolved[0];
            let name = comp.componentIdx;
            let relativeName = name;
            if (relativeName) {
                // XXX: what about names?
            } else {
                relativeName = comp.doenetAttributes?.prescribedName;
            }
            uniqueComponentNames = [relativeName];
            // TODO: which of these two options to use or do we need to test for both?
            componentTypesForUniqueNames = [comp.componentType];
            // componentTypesForUniqueNames = [this.components[name].componentType];
        }

        let message = "";
        for (let [ind, cType] of componentTypesForUniqueNames.entries()) {
            if (message) {
                message += ", ";
            }
            message += `<${cType}>`;
            let lineRange = linesForUniqueNames[ind];
            if (lineRange) {
                message += ` (${lineRange})`;
            } else {
                let name = uniqueComponentNames[ind];
                if (name[0] !== "_") {
                    message += ` (named "${name}")`;
                }
            }
        }

        return `Circular dependency involving these components: ${message}.`;
    }

    resetCircularResolveBlockerCheckPassed({
        componentIdx,
        type,
        stateVariable,
        dependency,
    }) {
        let code = componentIdx.toString();
        if (stateVariable) {
            code += "|" + stateVariable;
            if (dependency) {
                code += "|" + dependency;
            }
        }

        let identifier = code + "|" + type;

        if (this.circularResolveBlockedCheckPassed[identifier]) {
            delete this.circularResolveBlockedCheckPassed[identifier];

            let resolveBlockedBy = this.getResolveBlockedBy({
                componentIdx,
                type,
                stateVariable,
                dependency,
            });

            for (let typeBlocked in resolveBlockedBy) {
                for (let codeBlocked of resolveBlockedBy[typeBlocked]) {
                    let [
                        componentIdxBlocked,
                        stateVariableBlocked,
                        dependencyBlocked,
                    ] =
                        typeof codeBlocked === "string"
                            ? codeBlocked.split("|")
                            : [codeBlocked];

                    this.resetCircularResolveBlockerCheckPassed({
                        componentIdx: componentIdxBlocked,
                        type: typeBlocked,
                        stateVariable: stateVariableBlocked,
                        dependency: dependencyBlocked,
                    });
                }
            }
        }
    }

    get components() {
        return this._components;
        // return new Proxy(this._components, readOnlyProxyHandler);
    }

    set components(value) {
        return null;
    }
}

class Dependency {
    constructor({
        component,
        stateVariable,
        allStateVariablesAffected,
        dependencyName,
        dependencyDefinition,
        dependencyHandler,
    }) {
        this.dependencyName = dependencyName;
        this.dependencyHandler = dependencyHandler;

        this.upstreamComponentIdx = component.componentIdx;
        this.upstreamVariableNames = allStateVariablesAffected;

        this.definition = Object.assign({}, dependencyDefinition);
        this.representativeStateVariable = stateVariable;

        if (dependencyDefinition.doNotProxy) {
            this.doNotProxy = true;
        }

        if (dependencyDefinition.variablesOptional) {
            this.variablesOptional = true;
        }

        if (dependencyDefinition.publicStateVariablesOnly) {
            this.publicStateVariablesOnly = true;
        }

        if (dependencyDefinition.caseInsensitiveVariableMatch) {
            this.caseInsensitiveVariableMatch = true;
        }

        if (dependencyDefinition.useMappedVariableNames) {
            this.useMappedVariableNames = true;
        }

        if (dependencyDefinition.propIndex) {
            if (dependencyDefinition.propIndex.every(Number.isFinite)) {
                this.propIndex = dependencyDefinition.propIndex.map(Math.round);
            } else {
                this.propIndex = [];
            }
        }

        // if returnSingleVariableValue, then
        // return just the value of the state variable when there is
        // exactly one (downstreamComponentIdx, downstreamVariableName)
        // and return null otherwise
        this.returnSingleVariableValue = false;

        // if returnSingleComponent, then
        // return just the component object (rather than an array) when there
        // is exactly one downstreamComponentIdx
        // and return null otherwise
        this.returnSingleComponent = false;

        this.originalDownstreamVariableNames = [];

        // this.checkForCircular();
    }

    static dependencyType = "_base";

    downstreamVariableNameIfNoVariables = "__identity";

    get dependencyType() {
        return this.constructor.dependencyType;
    }

    setUpParameters() {}

    async determineDownstreamComponents() {
        return {
            success: true,
            downstreamComponentIndices: [],
            downstreamComponentTypes: [],
        };
    }

    async initialize() {
        // 1. set up parameters
        // 2. determine downstream components
        // 3. add this dependency to the downstreamDependencies of the upstream component
        // 4. for each downstreamComponentIdx, add this dependency to upstreamDependencies
        // 5. map originalDownstreamVariableNames to mappedDownstreamVariableNamesByComponent
        // 6. possibly create array entry variables in downstream components if they don't exist
        // 7. keep track of any unresolved dependencies

        this.setUpParameters();

        // Note: determineDownstreamComponents has side effects
        // of setting class variables and adding to updateTrigger objects
        let downComponents = await this.determineDownstreamComponents();

        let downstreamComponentIndices =
            downComponents.downstreamComponentIndices;
        let downstreamComponentTypes = downComponents.downstreamComponentTypes;

        this.componentIdentitiesChanged = true;

        let upCompDownDeps =
            this.dependencyHandler.downstreamDependencies[
                this.upstreamComponentIdx
            ];
        if (!upCompDownDeps) {
            upCompDownDeps = this.dependencyHandler.downstreamDependencies[
                this.upstreamComponentIdx
            ] = {};
        }

        for (let varName of this.upstreamVariableNames) {
            if (!upCompDownDeps[varName]) {
                upCompDownDeps[varName] = {};
            }
            upCompDownDeps[varName][this.dependencyName] = this;
        }

        if (
            this.originalDownstreamVariableNames.length === 0 &&
            !this.originalVariablesByComponent
        ) {
            delete this.mappedDownstreamVariableNamesByComponent;
            delete this.upValuesChanged;
        } else {
            this.mappedDownstreamVariableNamesByComponent = [];
            this.valuesChanged = [];
        }

        this.downstreamComponentIndices = [];
        this.downstreamComponentTypes = [];

        for (let [
            index,
            downstreamComponentIdx,
        ] of downstreamComponentIndices.entries()) {
            await this.addDownstreamComponent({
                downstreamComponentIdx,
                downstreamComponentType: downstreamComponentTypes[index],
                index,
            });
        }
    }

    async addDownstreamComponent({
        downstreamComponentIdx,
        downstreamComponentType,
        index,
    }) {
        this.componentIdentitiesChanged = true;

        this.downstreamComponentIndices.splice(
            index,
            0,
            downstreamComponentIdx,
        );
        this.downstreamComponentTypes.splice(index, 0, downstreamComponentType);

        let downComponent =
            this.dependencyHandler._components[downstreamComponentIdx];

        if (downComponent) {
            let originalVarNames;

            if (this.originalVariablesByComponent) {
                originalVarNames =
                    this.originalDownstreamVariableNamesByComponent[index];
            } else {
                originalVarNames = this.originalDownstreamVariableNames;
            }

            if (this.caseInsensitiveVariableMatch) {
                originalVarNames =
                    this.dependencyHandler.core.findCaseInsensitiveMatches({
                        stateVariables: originalVarNames,
                        componentClass: downComponent.constructor,
                    });
            }

            if (this.publicStateVariablesOnly) {
                originalVarNames =
                    this.dependencyHandler.core.matchPublicStateVariables({
                        stateVariables: originalVarNames,
                        componentClass: downComponent.constructor,
                    });
            }

            let mappedVarNames = this.dependencyHandler.core.substituteAliases({
                stateVariables: originalVarNames,
                componentClass: downComponent.constructor,
            });

            if (this.constructor.convertToArraySize) {
                mappedVarNames = mappedVarNames.map(function (vName) {
                    let stateVarObj = downComponent.state[vName];
                    if (stateVarObj) {
                        if (stateVarObj.arraySizeStateVariable) {
                            return stateVarObj.arraySizeStateVariable;
                        } else {
                            return `__${vName}_is_not_an_array`;
                        }
                    }

                    // check if vName begins when an arrayEntry
                    if (downComponent.arrayEntryPrefixes) {
                        let arrayEntryPrefixesLongestToShortest = Object.keys(
                            downComponent.arrayEntryPrefixes,
                        ).sort((a, b) => b.length - a.length);
                        for (let arrayEntryPrefix of arrayEntryPrefixesLongestToShortest) {
                            if (
                                vName.substring(0, arrayEntryPrefix.length) ===
                                arrayEntryPrefix
                            ) {
                                let arrayVariableName =
                                    downComponent.arrayEntryPrefixes[
                                        arrayEntryPrefix
                                    ];
                                let arrayStateVarObj =
                                    downComponent.state[arrayVariableName];
                                let arrayKeys =
                                    arrayStateVarObj.getArrayKeysFromVarName({
                                        arrayEntryPrefix,
                                        varEnding: vName.substring(
                                            arrayEntryPrefix.length,
                                        ),
                                        numDimensions:
                                            arrayStateVarObj.numDimensions,
                                    });

                                if (arrayKeys.length > 0) {
                                    return downComponent.state[
                                        arrayVariableName
                                    ].arraySizeStateVariable;
                                }
                            }
                        }
                    }
                    return `__${vName}_is_not_an_array`;
                });
            }

            if (this.propIndex !== undefined) {
                mappedVarNames =
                    await this.dependencyHandler.core.arrayEntryNamesFromPropIndex(
                        {
                            stateVariables: mappedVarNames,
                            component: downComponent,
                            propIndex: this.propIndex,
                        },
                    );
            }

            // Note: mappedVarNames contains all original variables mapped with any aliases.
            // If variablesOptional, downVarNames may be filtered to just include
            // variables that exist in the component.
            // (If not variablesOptional and variable doesn't exist, will eventually get an error)
            let downVarNames = mappedVarNames;

            if (
                originalVarNames.length > 0 ||
                this.originalVariablesByComponent
            ) {
                this.mappedDownstreamVariableNamesByComponent.splice(
                    index,
                    0,
                    mappedVarNames,
                );

                let valsChanged = {};
                for (let downVar of mappedVarNames) {
                    valsChanged[downVar] = { changed: true };
                }
                this.valuesChanged.splice(index, 0, valsChanged);

                if (this.variablesOptional) {
                    // if variables are optional, then include variables in downVarNames
                    // only if the variable exists in the downstream component
                    // (or could be created as an array entry)
                    downVarNames = downVarNames.filter(
                        (downVar) =>
                            downVar in downComponent.state ||
                            this.dependencyHandler.core.checkIfArrayEntry({
                                stateVariable: downVar,
                                component: downComponent,
                            }).isArrayEntry,
                    );
                }

                for (let downVar of downVarNames) {
                    if (!downComponent.state[downVar]) {
                        await this.dependencyHandler.core.createFromArrayEntry({
                            component: downComponent,
                            stateVariable: downVar,
                        });
                    }

                    if (!downComponent.state[downVar].isResolved) {
                        for (let varName of this.upstreamVariableNames) {
                            await this.dependencyHandler.addBlocker({
                                blockerComponentIdx: downstreamComponentIdx,
                                blockerType: "stateVariable",
                                blockerStateVariable: downVar,
                                componentIdxBlocked: this.upstreamComponentIdx,
                                typeBlocked: "stateVariable",
                                stateVariableBlocked: varName,
                            });
                            if (
                                this.dependencyType === "determineDependencies"
                            ) {
                                await this.dependencyHandler.addBlocker({
                                    blockerComponentIdx: downstreamComponentIdx,
                                    blockerType: "stateVariable",
                                    blockerStateVariable: downVar,
                                    componentIdxBlocked:
                                        this.upstreamComponentIdx,
                                    typeBlocked: "determineDependencies",
                                    stateVariableBlocked: varName,
                                    dependencyBlocked: this.dependencyName,
                                });
                            }
                        }
                    }
                }
            }

            // if don't have any state variables,
            // then just record the upstream dependencies on the downstream component
            // under "__identity"
            if (downVarNames.length === 0) {
                downVarNames = [this.downstreamVariableNameIfNoVariables];
            }

            let downCompUpDeps =
                this.dependencyHandler.upstreamDependencies[
                    downstreamComponentIdx
                ];
            if (!downCompUpDeps) {
                downCompUpDeps = this.dependencyHandler.upstreamDependencies[
                    downstreamComponentIdx
                ] = {};
            }

            for (let varName of downVarNames) {
                if (downCompUpDeps[varName] === undefined) {
                    downCompUpDeps[varName] = [];
                }
                downCompUpDeps[varName].push(this);

                if (varName !== this.downstreamVariableNameIfNoVariables) {
                    for (let upstreamVarName of this.upstreamVariableNames) {
                        this.dependencyHandler.resetCircularCheckPassed(
                            this.upstreamComponentIdx,
                            upstreamVarName,
                        );
                    }
                }
            }
        }

        for (let upVarName of this.upstreamVariableNames) {
            if (
                this.dependencyHandler._components[this.upstreamComponentIdx]
                    .state[upVarName].initiallyResolved
            ) {
                await this.dependencyHandler.core.markStateVariableAndUpstreamDependentsStale(
                    {
                        component:
                            this.dependencyHandler.components[
                                this.upstreamComponentIdx
                            ],
                        varName: upVarName,
                    },
                );
            }
        }
    }

    async removeDownstreamComponent({ indexToRemove, recordChange = true }) {
        // console.log(`remove downstream ${indexToRemove}, ${this.downstreamComponentIndices[indexToRemove]} dependency: ${this.dependencyName}`)
        // console.log(this.upstreamComponentIdx, this.representativeStateVariable);

        // remove downstream component specified by indexToRemove from this dependency

        if (recordChange) {
            this.componentIdentitiesChanged = true;
        }

        let componentIdx = this.downstreamComponentIndices[indexToRemove];

        this.downstreamComponentIndices.splice(indexToRemove, 1);
        this.downstreamComponentTypes.splice(indexToRemove, 1);

        if (componentIdx in this.dependencyHandler._components) {
            let affectedDownstreamVariableNames;

            if (!this.mappedDownstreamVariableNamesByComponent) {
                affectedDownstreamVariableNames = [
                    this.downstreamVariableNameIfNoVariables,
                ];
            } else {
                affectedDownstreamVariableNames =
                    this.mappedDownstreamVariableNamesByComponent[
                        indexToRemove
                    ];
                this.mappedDownstreamVariableNamesByComponent.splice(
                    indexToRemove,
                    1,
                );
                this.valuesChanged.splice(indexToRemove, 1);

                if (this.variablesOptional) {
                    // if variables are optional, it's possble no variables were found
                    // so add placeholder variable name just in case
                    // (It doesn't matter if extra variables are included,
                    // as they will be skipped below.  And, since the component may have
                    // been deleted already, we don't want to check its state.)
                    affectedDownstreamVariableNames.push(
                        this.downstreamVariableNameIfNoVariables,
                    );
                }
            }

            // delete from upstream dependencies of downstream component
            for (let vName of affectedDownstreamVariableNames) {
                let downCompUpDeps =
                    this.dependencyHandler.upstreamDependencies[componentIdx][
                        vName
                    ];
                if (downCompUpDeps) {
                    let ind = downCompUpDeps.indexOf(this);
                    // if find an upstream dependency, delete
                    if (ind !== -1) {
                        if (downCompUpDeps.length === 1) {
                            delete this.dependencyHandler.upstreamDependencies[
                                componentIdx
                            ][vName];
                        } else {
                            downCompUpDeps.splice(ind, 1);
                        }
                    }
                }

                if (vName !== this.downstreamVariableNameIfNoVariables) {
                    for (let upstreamVarName of this.upstreamVariableNames) {
                        // TODO: check why have to do this when remove a component from a dependency
                        this.dependencyHandler.resetCircularCheckPassed(
                            this.upstreamComponentIdx,
                            upstreamVarName,
                        );
                    }
                }
            }
        }

        if (recordChange) {
            for (let upVarName of this.upstreamVariableNames) {
                if (
                    this.dependencyHandler._components[
                        this.upstreamComponentIdx
                    ].state[upVarName].initiallyResolved
                ) {
                    await this.dependencyHandler.core.markStateVariableAndUpstreamDependentsStale(
                        {
                            component:
                                this.dependencyHandler.components[
                                    this.upstreamComponentIdx
                                ],
                            varName: upVarName,
                        },
                    );
                }
            }
        }
    }

    async swapDownstreamComponents(index1, index2) {
        this.componentIdentitiesChanged = true;

        [
            this.downstreamComponentIndices[index1],
            this.downstreamComponentIndices[index2],
        ] = [
            this.downstreamComponentIndices[index2],
            this.downstreamComponentIndices[index1],
        ];

        [
            this.downstreamComponentTypes[index1],
            this.downstreamComponentTypes[index2],
        ] = [
            this.downstreamComponentTypes[index2],
            this.downstreamComponentTypes[index1],
        ];

        if (
            this.originalDownstreamVariableNames.length > 0 ||
            this.originalVariablesByComponent
        ) {
            [
                this.mappedDownstreamVariableNamesByComponent[index1],
                this.mappedDownstreamVariableNamesByComponent[index2],
            ] = [
                this.mappedDownstreamVariableNamesByComponent[index2],
                this.mappedDownstreamVariableNamesByComponent[index1],
            ];

            [this.valuesChanged[index1], this.valuesChanged[index2]] = [
                this.valuesChanged[index2],
                this.valuesChanged[index1],
            ];
        }

        for (let upVarName of this.upstreamVariableNames) {
            if (
                this.dependencyHandler._components[this.upstreamComponentIdx]
                    .state[upVarName].initiallyResolved
            ) {
                await this.dependencyHandler.core.markStateVariableAndUpstreamDependentsStale(
                    {
                        component:
                            this.dependencyHandler.components[
                                this.upstreamComponentIdx
                            ],
                        varName: upVarName,
                    },
                );
            }
        }
    }

    deleteDependency() {
        // console.log(`deleting dependency: ${this.dependencyName}`)
        // console.log(this.upstreamComponentIdx, this.representativeStateVariable);

        let affectedDownstreamVariableNamesByUpstreamComponent = [];

        if (!this.mappedDownstreamVariableNamesByComponent) {
            affectedDownstreamVariableNamesByUpstreamComponent = Array(
                this.downstreamComponentIndices.length,
            ).fill([this.downstreamVariableNameIfNoVariables]);
        } else {
            affectedDownstreamVariableNamesByUpstreamComponent =
                this.mappedDownstreamVariableNamesByComponent;
            if (this.variablesOptional) {
                let newVarNames = [];
                for (let [
                    ind,
                    cIdx,
                ] of this.downstreamComponentIndices.entries()) {
                    let varNamesForComponent = [];
                    for (let vName of affectedDownstreamVariableNamesByUpstreamComponent[
                        ind
                    ]) {
                        if (
                            this.dependencyHandler.components[cIdx].state[vName]
                        ) {
                            varNamesForComponent.push(vName);
                        }
                    }

                    // if variablesOptional, it is possible that no variables were found
                    if (varNamesForComponent.length > 0) {
                        newVarNames.push(varNamesForComponent);
                    } else {
                        newVarNames.push([
                            this.downstreamVariableNameIfNoVariables,
                        ]);
                    }
                }
                affectedDownstreamVariableNamesByUpstreamComponent =
                    newVarNames;
            }
        }

        // delete from upstream dependencies of downstream components
        for (let [
            cInd,
            downCompIdx,
        ] of this.downstreamComponentIndices.entries()) {
            for (let vName of affectedDownstreamVariableNamesByUpstreamComponent[
                cInd
            ]) {
                let downCompUpDeps =
                    this.dependencyHandler.upstreamDependencies[downCompIdx][
                        vName
                    ];
                if (downCompUpDeps) {
                    let ind = downCompUpDeps.indexOf(this);
                    // if find an upstream dependency, delete
                    if (ind !== -1) {
                        if (downCompUpDeps.length === 1) {
                            delete this.dependencyHandler.upstreamDependencies[
                                downCompIdx
                            ][vName];
                        } else {
                            downCompUpDeps.splice(ind, 1);
                        }
                    }
                }

                for (let upVar of this.upstreamVariableNames) {
                    this.dependencyHandler.deleteFromNeededToResolve({
                        componentIdxBlocked: this.upstreamComponentIdx,
                        typeBlocked: "stateVariable",
                        stateVariableBlocked: upVar,
                        blockerType: "stateVariable",
                        blockerCode: downCompIdx + "|" + vName,
                    });
                }

                if (vName !== this.downstreamVariableNameIfNoVariables) {
                    for (let upstreamVarName of this.upstreamVariableNames) {
                        // TODO: check why have to do this when delete a dependency
                        this.dependencyHandler.resetCircularCheckPassed(
                            this.upstreamComponentIdx,
                            upstreamVarName,
                        );
                    }
                }
            }
        }

        this.deleteFromUpdateTriggers();

        // delete from downstream dependencies of upstream components

        let upCompDownDeps =
            this.dependencyHandler.downstreamDependencies[
                this.upstreamComponentIdx
            ];

        for (let varName of this.upstreamVariableNames) {
            delete upCompDownDeps[varName][this.dependencyName];
        }
    }

    deleteFromUpdateTriggers() {}

    async getValue({ verbose = false, skipProxy = false } = {}) {
        let value = [];
        let changes = {};
        let usedDefault = [];

        if (this.componentIdentitiesChanged) {
            changes.componentIdentitiesChanged = true;
            this.componentIdentitiesChanged = false;
        }

        for (let [
            componentInd,
            componentIdx,
        ] of this.downstreamComponentIndices.entries()) {
            let depComponent = this.dependencyHandler._components[componentIdx];

            usedDefault[componentInd] = false;

            if (depComponent) {
                let componentObj = {
                    componentType: depComponent.componentType,
                };

                if (!this.skipComponentIndices) {
                    componentObj.componentIdx = componentIdx;
                }

                let originalVarNames;
                if (this.originalVariablesByComponent) {
                    originalVarNames =
                        this.originalDownstreamVariableNamesByComponent[
                            componentInd
                        ];
                } else {
                    originalVarNames = this.originalDownstreamVariableNames;
                }

                if (originalVarNames.length > 0) {
                    componentObj.stateValues = {};

                    let usedDefaultObj = {};
                    let foundOneUsedDefault = false;

                    for (let [
                        varInd,
                        originalVarName,
                    ] of originalVarNames.entries()) {
                        let mappedVarName =
                            this.mappedDownstreamVariableNamesByComponent[
                                componentInd
                            ][varInd];

                        let nameForOutput = this.useMappedVariableNames
                            ? mappedVarName
                            : originalVarName;

                        if (
                            !this.variablesOptional ||
                            mappedVarName in depComponent.state
                        ) {
                            let mappedStateVarObj =
                                depComponent.state[mappedVarName];
                            if (!mappedStateVarObj.deferred) {
                                componentObj.stateValues[nameForOutput] =
                                    await mappedStateVarObj.value;
                                if (
                                    this.valuesChanged[componentInd][
                                        mappedVarName
                                    ].changed
                                ) {
                                    if (!changes.valuesChanged) {
                                        changes.valuesChanged = {};
                                    }
                                    if (!changes.valuesChanged[componentInd]) {
                                        changes.valuesChanged[componentInd] =
                                            {};
                                    }
                                    changes.valuesChanged[componentInd][
                                        nameForOutput
                                    ] =
                                        this.valuesChanged[componentInd][
                                            mappedVarName
                                        ];
                                }
                                this.valuesChanged[componentInd][
                                    mappedVarName
                                ] = {};

                                if (mappedStateVarObj.usedDefault) {
                                    usedDefaultObj[nameForOutput] = true;
                                    foundOneUsedDefault = true;
                                } else if (
                                    mappedStateVarObj.isArrayEntry &&
                                    mappedStateVarObj.arrayKeys.length === 1
                                ) {
                                    // if have an array entry with just one arrayKey,
                                    // check if used default for that arrayKey
                                    let arrayStateVarObj =
                                        depComponent.state[
                                            mappedStateVarObj.arrayStateVariable
                                        ];
                                    if (
                                        arrayStateVarObj.usedDefaultByArrayKey[
                                            mappedStateVarObj.arrayKeys[0]
                                        ]
                                    ) {
                                        usedDefaultObj[nameForOutput] = true;
                                        foundOneUsedDefault = true;
                                    }
                                }
                            }
                        }
                    }

                    if (foundOneUsedDefault) {
                        usedDefault[componentInd] = usedDefaultObj;
                    }
                }

                value.push(componentObj);
            } else {
                // no component, which means skipComponentIndices must be true
                // and we have no variables
                value.push({
                    componentType: this.downstreamComponentTypes[componentInd],
                });
            }
        }

        if (!verbose) {
            if (this.returnSingleVariableValue) {
                if (value.length === 1) {
                    value = value[0];
                    if (changes.valuesChanged && changes.valuesChanged[0]) {
                        changes.valuesChanged = changes.valuesChanged[0];
                    } else {
                        delete changes.valuesChanged;
                    }
                    usedDefault = usedDefault[0];

                    let stateVariables = Object.keys(value.stateValues);
                    if (stateVariables.length === 1) {
                        let nameForOutput = stateVariables[0];
                        value = value.stateValues[nameForOutput];

                        if (
                            changes.valuesChanged &&
                            changes.valuesChanged[nameForOutput]
                        ) {
                            changes.valuesChanged =
                                changes.valuesChanged[nameForOutput];
                        }

                        if (usedDefault) {
                            usedDefault = usedDefault[nameForOutput];
                        }
                    } else {
                        value = null;
                        changes = {};
                        usedDefault = false;
                    }
                } else {
                    value = null;
                    changes = {};
                    usedDefault = false;
                }
            } else if (this.returnSingleComponent) {
                if (value.length === 1) {
                    value = value[0];
                    if (changes.valuesChanged && changes.valuesChanged[0]) {
                        changes.valuesChanged = changes.valuesChanged[0];
                    } else {
                        delete changes.valuesChanged;
                    }
                    usedDefault = usedDefault[0];
                } else {
                    value = null;
                    usedDefault = false;
                }
            }
        }

        // if (!this.doNotProxy && !skipProxy &&
        //   value !== null && typeof value === 'object'
        // ) {
        //   value = new Proxy(value, readOnlyProxyHandler)
        // }

        return { value, changes, usedDefault };
    }

    checkForCircular() {
        for (let varName of this.upstreamVariableNames) {
            this.dependencyHandler.resetCircularCheckPassed(
                this.upstreamComponentIdx,
                varName,
            );
        }
        for (let varName of this.upstreamVariableNames) {
            this.dependencyHandler.checkForCircularDependency({
                componentIdx: this.upstreamComponentIdx,
                varName,
            });
        }
    }

    async recalculateDownstreamComponents({ force = false } = {}) {
        // console.log(`recalc down of ${this.dependencyName} of ${this.representativeStateVariable} of ${this.upstreamComponentIdx}`)

        let newDownComponents = await this.determineDownstreamComponents({
            force,
        });

        // this.downstreamComponentIndices = newDownComponents.downstreamComponentIndices;
        // this.downstreamComponentTypes = newDownComponents.downstreamComponentTypes;

        let newComponentIndices = newDownComponents.downstreamComponentIndices;

        let foundChange =
            newComponentIndices.length !==
                this.downstreamComponentIndices.length ||
            this.downstreamComponentIndices.some(
                (v, i) => v != newComponentIndices[i],
            );

        if (foundChange) {
            this.componentIdentitiesChanged = true;

            // first remove any components that are no longer present

            let nRemoved = 0;
            for (let [ind, downCompIdx] of [
                ...this.downstreamComponentIndices,
            ].entries()) {
                if (!newComponentIndices.includes(downCompIdx)) {
                    await this.removeDownstreamComponent({
                        indexToRemove: ind - nRemoved,
                    });
                    nRemoved++;
                }
            }

            for (let [ind, downCompIdx] of newComponentIndices.entries()) {
                let oldInd =
                    this.downstreamComponentIndices.indexOf(downCompIdx);

                if (oldInd !== -1) {
                    if (oldInd !== ind) {
                        await this.swapDownstreamComponents(oldInd, ind);
                    }
                } else {
                    await this.addDownstreamComponent({
                        downstreamComponentIdx: downCompIdx,
                        downstreamComponentType:
                            newDownComponents.downstreamComponentTypes[ind],
                        index: ind,
                    });
                }
            }
        }

        if (this.originalVariablesByComponent) {
            for (let [ind, downCompIdx] of [
                ...this.downstreamComponentIndices,
            ].entries()) {
                if (
                    this.mappedDownstreamVariableNamesByComponent[ind]
                        .length !==
                        this.originalDownstreamVariableNamesByComponent[ind]
                            .length ||
                    this.mappedDownstreamVariableNamesByComponent[ind].some(
                        (v, i) =>
                            this.originalDownstreamVariableNamesByComponent[
                                ind
                            ][i] !== v,
                    )
                ) {
                    // remove and add back downstream component
                    // so that the variables are reinitialized

                    await this.removeDownstreamComponent({
                        indexToRemove: ind,
                    });

                    await this.addDownstreamComponent({
                        downstreamComponentIdx: downCompIdx,
                        downstreamComponentType:
                            newDownComponents.downstreamComponentTypes[ind],
                        index: ind,
                    });
                }
            }
        }

        return { success: newDownComponents.success };
    }

    /**
     * Add resolve blockers to this dependency due to the component with `componentIdx`
     * not existing as well as update triggers that will attempt to resolve
     * this dependency when the component is created.
     */
    async addBlockerUpdateTriggerForMissingComponent(componentIdx) {
        this.addUpdateTriggerForMissingComponent(componentIdx);

        for (const varName of this.upstreamVariableNames) {
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
    }

    /**
     * Add update triggers to the component with `componentIdx`
     * that will update this dependency when the component is created.
     */
    async addUpdateTriggerForMissingComponent(componentIdx) {
        let dependenciesMissingComponent =
            this.dependencyHandler.updateTriggers
                .dependenciesMissingComponentBySpecifiedName[componentIdx];
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

    /**
     * Delete any update triggers for this component based on `componentIdx` not yet existing
     */
    async deleteUpdateTriggerForMissingComponent(componentIdx) {
        const dependenciesMissingComponent =
            this.dependencyHandler.updateTriggers
                .dependenciesMissingComponentBySpecifiedName[componentIdx];
        if (dependenciesMissingComponent) {
            const ind = dependenciesMissingComponent.indexOf(this);
            if (ind !== -1) {
                dependenciesMissingComponent.splice(ind, 1);
            }
        }
    }

    /**
     * Add a resolve blocker to this dependency based on `varName` of `componentIdx`
     * not yet being resolved.
     */
    async addBlockerForUnresolvedStateVariable(componentIdx, varName) {
        for (const vName of this.upstreamVariableNames) {
            await this.dependencyHandler.addBlocker({
                blockerComponentIdx: componentIdx,
                blockerType: "stateVariable",
                blockerStateVariable: varName,
                componentIdxBlocked: this.upstreamComponentIdx,
                typeBlocked: "recalculateDownstreamComponents",
                stateVariableBlocked: vName,
                dependencyBlocked: this.dependencyName,
            });

            await this.dependencyHandler.addBlocker({
                blockerComponentIdx: this.upstreamComponentIdx,
                blockerType: "recalculateDownstreamComponents",
                blockerStateVariable: vName,
                blockerDependency: this.dependencyName,
                componentIdxBlocked: this.upstreamComponentIdx,
                typeBlocked: "stateVariable",
                stateVariableBlocked: vName,
            });
        }
    }

    /**
     * Add a resolve blocker to this dependency based on `composite`
     * not yet being expanded.
     */
    async addBlockerForUnexpandedComposite(composite) {
        for (const varName of this.upstreamVariableNames) {
            await this.dependencyHandler.addBlocker({
                blockerComponentIdx: this.upstreamComponentIdx,
                blockerType: "recalculateDownstreamComponents",
                blockerStateVariable: varName,
                blockerDependency: this.dependencyName,
                componentIdxBlocked: this.upstreamComponentIdx,
                typeBlocked: "stateVariable",
                stateVariableBlocked: varName,
            });

            await this.dependencyHandler.addBlocker({
                blockerComponentIdx: composite.componentIdx,
                blockerType: "expandComposite",
                componentIdxBlocked: this.upstreamComponentIdx,
                typeBlocked: "recalculateDownstreamComponents",
                stateVariableBlocked: varName,
                dependencyBlocked: this.dependencyName,
            });
        }

        if (!composite.state.readyToExpandWhenResolved.isResolved) {
            await this.dependencyHandler.addBlocker({
                blockerComponentIdx: composite.componentIdx,
                blockerType: "stateVariable",
                blockerStateVariable: "readyToExpandWhenResolved",
                componentIdxBlocked: composite.componentIdx,
                typeBlocked: "expandComposite",
            });
        }
    }

    /** Add an update trigger to this dependency that will update it
     * if the replacements of any composite in `composites` are changed. */
    addUpdateTriggersForCompositeReplacements(composites) {
        for (let cIdx of composites) {
            let replacementDependencies =
                this.dependencyHandler.updateTriggers
                    .replacementDependenciesByComposite[cIdx];
            if (!replacementDependencies) {
                replacementDependencies =
                    this.dependencyHandler.updateTriggers.replacementDependenciesByComposite[
                        cIdx
                    ] = [];
            }
            if (!replacementDependencies.includes(this)) {
                replacementDependencies.push(this);
            }
        }
    }

    /**
     * Delete any update triggers for this dependency based on the replacements of `composites`.
     */
    deleteUpdateTriggersForCompositeReplacements(composites) {
        for (let compositeIdx of composites) {
            let replacementDeps =
                this.dependencyHandler.updateTriggers
                    .replacementDependenciesByComposite[compositeIdx];
            if (replacementDeps) {
                let ind = replacementDeps.indexOf(this);
                if (ind !== -1) {
                    replacementDeps.splice(ind, 1);
                }
            }
        }
    }
}

class StateVariableDependency extends Dependency {
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

dependencyTypeArray.push(StateVariableDependency);

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
class StateVariableFromUnresolvedPathDependency extends Dependency {
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
            propIndex = nextPart.index.map((index_part) =>
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

            const stateVarInfo =
                this.dependencyHandler.componentInfoObjects
                    .publicStateVariableInfo[component.componentType]
                    .stateVariableDescriptions[variableName];

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

dependencyTypeArray.push(StateVariableFromUnresolvedPathDependency);

class MultipleStateVariablesDependency extends Dependency {
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

dependencyTypeArray.push(MultipleStateVariablesDependency);

class StateVariableComponentTypeDependency extends StateVariableDependency {
    static dependencyType = "stateVariableComponentType";

    async getValue({ verbose = false } = {}) {
        let value = [];
        let changes = {};

        if (this.staticValue) {
            value = [this.staticValue];
        } else {
            if (this.componentIdentitiesChanged) {
                changes.componentIdentitiesChanged = true;
                this.componentIdentitiesChanged = false;
            }

            if (this.downstreamComponentIndices.length === 1) {
                let componentIdx = this.downstreamComponentIndices[0];
                let depComponent =
                    this.dependencyHandler.components[componentIdx];

                let componentObj = {
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

                        if (this.valuesChanged[0][mappedVarName].changed) {
                            if (!changes.valuesChanged) {
                                changes.valuesChanged = {};
                            }
                            if (!changes.valuesChanged[0]) {
                                changes.valuesChanged[0] = {};
                            }
                            changes.valuesChanged[0][nameForOutput] =
                                this.valuesChanged[0][mappedVarName];
                        }
                        this.valuesChanged[0][mappedVarName] = {};

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

dependencyTypeArray.push(StateVariableComponentTypeDependency);

class StateVariableArraySizeDependency extends StateVariableDependency {
    static dependencyType = "stateVariableArraySize";

    static convertToArraySize = true;
}

dependencyTypeArray.push(StateVariableArraySizeDependency);

class RecursiveDependencyValuesDependency extends Dependency {
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
    }) {
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

    async getValue() {
        this.gettingValue = true;
        this.varsWithUpdatedDeps = {};

        let result;
        let accumulatedVarsWithUpdatedDeps = {};

        let foundNewUpdated = true;

        let changes = {};

        while (foundNewUpdated) {
            foundNewUpdated = false;
            result = await super.getValue();

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
                let compAccumulated = accumulatedVarsWithUpdatedDeps[cIdxStr];
                if (!compAccumulated) {
                    compAccumulated = accumulatedVarsWithUpdatedDeps[cIdxStr] =
                        [];
                }
                for (let vName of this.varsWithUpdatedDeps[cIdxStr]) {
                    if (!compAccumulated.includes(vName)) {
                        compAccumulated.push(vName);
                        foundNewUpdated = true;
                    }
                }
            }

            if (foundNewUpdated) {
                await this.recalculateDownstreamComponents();
            }
        }

        this.gettingValue = false;

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

dependencyTypeArray.push(RecursiveDependencyValuesDependency);

class ComponentIdentityDependency extends Dependency {
    static dependencyType = "componentIdentity";

    setUpParameters() {
        if (this.definition.componentIdx != undefined) {
            this.componentIdx = this.definition.componentIdx;
            this.specifiedComponentName = this.componentIdx;
        } else {
            this.componentIdx = this.upstreamComponentIdx;
        }

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

dependencyTypeArray.push(ComponentIdentityDependency);

class AttributeComponentDependency extends Dependency {
    static dependencyType = "attributeComponent";

    setUpParameters() {
        if (this.definition.parentIdx != undefined) {
            this.parentIdx = this.definition.parentIdx;
            this.specifiedComponentName = this.parentIdx;
        } else {
            this.parentIdx = this.upstreamComponentIdx;
        }

        if (this.definition.variableNames) {
            if (!Array.isArray(this.definition.variableNames)) {
                throw Error(
                    `Invalid state variable ${this.representativeStateVariable} of ${this.upstreamComponentIdx}, dependency ${this.dependencyName}: variableNames must be an array`,
                );
            }
            this.originalDownstreamVariableNames =
                this.definition.variableNames;
        } else {
            this.originalDownstreamVariableNames = [];
        }

        this.attributeName = this.definition.attributeName;

        this.returnSingleComponent = true;

        this.dontRecurseToShadows = this.definition.dontRecurseToShadows;
        this.dontRecurseToShadowsIfHaveAttribute =
            this.definition.dontRecurseToShadowsIfHaveAttribute;
    }

    async determineDownstreamComponents() {
        let parent = this.dependencyHandler._components[this.parentIdx];

        if (!parent) {
            let dependenciesMissingComponent =
                this.dependencyHandler.updateTriggers
                    .dependenciesMissingComponentBySpecifiedName[
                    this.parentIdx
                ];
            if (!dependenciesMissingComponent) {
                dependenciesMissingComponent =
                    this.dependencyHandler.updateTriggers.dependenciesMissingComponentBySpecifiedName[
                        this.parentIdx
                    ] = [];
            }
            if (!dependenciesMissingComponent.includes(this)) {
                dependenciesMissingComponent.push(this);
            }

            for (let varName of this.upstreamVariableNames) {
                await this.dependencyHandler.addBlocker({
                    blockerComponentIdx: this.parentIdx,
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

        let attribute = parent.attributes[this.attributeName];

        if (attribute?.component) {
            // have an attribute that is a component

            if (attribute.component.shadows) {
                if (this.dontRecurseToShadows) {
                    // The current attribute is a shadow
                    // so we don't use the current attribute
                    return {
                        success: true,
                        downstreamComponentIndices: [],
                        downstreamComponentTypes: [],
                    };
                } else if (this.dontRecurseToShadowsIfHaveAttribute) {
                    let otherAttribute =
                        parent.attributes[
                            this.dontRecurseToShadowsIfHaveAttribute
                        ];
                    if (
                        otherAttribute?.component &&
                        !otherAttribute.component.shadows
                    ) {
                        // The current attribute is a shadow
                        // but the dontRecurseToShadows attribute is not,
                        // so we don't use the current attribute
                        return {
                            success: true,
                            downstreamComponentIndices: [],
                            downstreamComponentTypes: [],
                        };
                    }
                }
            }
            return {
                success: true,
                downstreamComponentIndices: [attribute.component.componentIdx],
                downstreamComponentTypes: [attribute.component.componentType],
            };
        }

        // if don't have an attribute component,
        // check if shadows a component with that attribute component

        if (this.dontRecurseToShadows) {
            return {
                success: true,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }

        let comp = parent;

        while (comp.shadows) {
            let shadows = comp.shadows;
            let propVariable = comp.shadows.propVariable;
            let fromImplicitProp = comp.doenetAttributes.fromImplicitProp;

            if (
                this.dontRecurseToShadowsIfHaveAttribute &&
                comp.attributes[this.dontRecurseToShadowsIfHaveAttribute]
            ) {
                break;
            }

            comp = this.dependencyHandler._components[shadows.componentIdx];
            if (!comp) {
                break;
            }

            // if a prop variable was created from a plain copy that is marked as returning the same type
            // then treat it like a regular copy (as if there was no prop variable)
            // and shadow all attributes
            if (
                propVariable &&
                !(
                    fromImplicitProp &&
                    comp.constructor.implicitPropReturnsSameType
                )
            ) {
                if (
                    !(
                        comp.state[
                            propVariable
                        ]?.shadowingInstructions?.attributesToShadow?.includes(
                            this.attributeName,
                        ) ||
                        comp.constructor.createAttributesObject()[
                            this.attributeName
                        ]?.propagateToProps
                    )
                ) {
                    break;
                }
            }

            attribute = comp.attributes[this.attributeName];

            if (attribute?.component) {
                return {
                    success: true,
                    downstreamComponentIndices: [
                        attribute.component.componentIdx,
                    ],
                    downstreamComponentTypes: [
                        attribute.component.componentType,
                    ],
                };
            }
        }

        return {
            success: true,
            downstreamComponentIndices: [],
            downstreamComponentTypes: [],
        };
    }

    async getValue({ verbose } = {}) {
        let result = await super.getValue({ verbose, skipProxy: true });

        // if (!this.doNotProxy) {
        //   result.value = new Proxy(result.value, readOnlyProxyHandler)
        // }

        return result;
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

dependencyTypeArray.push(AttributeComponentDependency);

class ChildDependency extends Dependency {
    static dependencyType = "child";

    setUpParameters() {
        if (this.definition.parentIdx != undefined) {
            this.parentIdx = this.definition.parentIdx;
            this.specifiedComponentName = this.parentIdx;
        } else {
            this.parentIdx = this.upstreamComponentIdx;
        }

        if (this.definition.variableNames) {
            if (!Array.isArray(this.definition.variableNames)) {
                throw Error(
                    `Invalid state variable ${this.representativeStateVariable} of ${this.upstreamComponentIdx}, dependency ${this.dependencyName}: variableNames must be an array`,
                );
            }
            this.originalDownstreamVariableNames =
                this.definition.variableNames;
        } else {
            this.originalDownstreamVariableNames = [];
        }

        this.includeAllChildren = this.definition.includeAllChildren;
        this.childGroups = this.definition.childGroups;
        if (!this.includeAllChildren && !Array.isArray(this.childGroups)) {
            throw Error(
                `Invalid state variable ${this.representativeStateVariable} of ${this.upstreamComponentIdx}, dependency ${this.dependencyName}: childGroups must be an array`,
            );
        }

        if (this.definition.childIndices !== undefined) {
            this.childIndices = this.definition.childIndices.map((x) =>
                Number(x),
            );
        }

        this.skipComponentIndices = this.definition.skipComponentIndices;
        this.skipPlaceholders = this.definition.skipPlaceholders;

        this.proceedIfAllChildrenNotMatched =
            this.definition.proceedIfAllChildrenNotMatched;

        this.dontRecurseToShadows = this.definition.dontRecurseToShadows;
    }

    async determineDownstreamComponents() {
        // console.log(`determine downstream components of ${this.dependencyName} of ${this.representativeStateVariable} of ${this.upstreamComponentIdx}`)

        if (this.downstreamPrimitives) {
            this.previousDownstreamPrimitives = [...this.downstreamPrimitives];
        } else {
            this.previousDownstreamPrimitives = [];
        }

        this.downstreamPrimitives = [];

        let parent = this.dependencyHandler._components[this.parentIdx];

        if (!parent) {
            let dependenciesMissingComponent =
                this.dependencyHandler.updateTriggers
                    .dependenciesMissingComponentBySpecifiedName[
                    this.parentIdx
                ];
            if (!dependenciesMissingComponent) {
                dependenciesMissingComponent =
                    this.dependencyHandler.updateTriggers.dependenciesMissingComponentBySpecifiedName[
                        this.parentIdx
                    ] = [];
            }
            if (!dependenciesMissingComponent.includes(this)) {
                dependenciesMissingComponent.push(this);
            }

            for (let varName of this.upstreamVariableNames) {
                await this.dependencyHandler.addBlocker({
                    blockerComponentIdx: this.parentIdx,
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

        let childDependencies =
            this.dependencyHandler.updateTriggers.childDependenciesByParent[
                this.parentIdx
            ];
        if (!childDependencies) {
            childDependencies =
                this.dependencyHandler.updateTriggers.childDependenciesByParent[
                    this.parentIdx
                ] = [];
        }
        if (!childDependencies.includes(this)) {
            childDependencies.push(this);
        }

        let activeChildrenIndices = this.includeAllChildren
            ? [...parent.activeChildren.keys()]
            : parent.returnMatchedChildIndices(this.childGroups);
        if (activeChildrenIndices === undefined) {
            throw Error(
                `Invalid state variable ${this.representativeStateVariable} of ${this.upstreamComponentIdx}, dependency ${this.dependencyName}: childGroups ${this.childGroups} does not exist.`,
            );
        }

        // if childIndices specified, filter out just those indices
        // Note: indices are relative to the selected ones
        // (not actual index in activeChildren)
        // so filter uses the i argument, not the x argument
        if (this.childIndices) {
            activeChildrenIndices = activeChildrenIndices.filter((x, i) =>
                this.childIndices.includes(i),
            );
        }

        if (!parent.childrenMatched && !this.proceedIfAllChildrenNotMatched) {
            let canProceedWithPlaceholders = false;

            if (parent.childrenMatchedWithPlaceholders) {
                if (this.skipPlaceholders) {
                    activeChildrenIndices = activeChildrenIndices.filter(
                        (x) =>
                            !parent.placeholderActiveChildrenIndices.includes(
                                x,
                            ),
                    );
                }

                if (
                    this.skipComponentIndices &&
                    this.originalDownstreamVariableNames.length === 0
                ) {
                    // if skipping componentIdx and there are no variable names,
                    // then only information to get is componentTypes of children,
                    // which one can do even with placeholders
                    canProceedWithPlaceholders = true;
                } else {
                    // if need to include component indices or variables,
                    // then we can proceed only if we aren't asking for any placeholder children

                    canProceedWithPlaceholders = activeChildrenIndices.every(
                        (x) =>
                            !parent.placeholderActiveChildrenIndices.includes(
                                x,
                            ),
                    );
                }
            }

            if (!canProceedWithPlaceholders) {
                let haveCompositesNotReady =
                    parent.unexpandedCompositesNotReady.length > 0;

                if (
                    !haveCompositesNotReady &&
                    parent.unexpandedCompositesReady.length > 0
                ) {
                    // could make progress just by expanding composites and
                    // then recalculating the downstream components,
                    for (let varName of this.upstreamVariableNames) {
                        await this.dependencyHandler.addBlocker({
                            blockerComponentIdx: this.parentIdx,
                            blockerType: "childMatches",
                            blockerStateVariable: varName, // add so that can have different blockers of child logic
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

                if (haveCompositesNotReady) {
                    for (let varName of this.upstreamVariableNames) {
                        await this.dependencyHandler.addBlocker({
                            blockerComponentIdx: this.parentIdx,
                            blockerType: "childMatches",
                            blockerStateVariable: varName, // add so that can have different blockers of child logic
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

                    // mark that child logic is blocked by
                    // the readyToExpandWhenResolved state variable of the composites not ready

                    // Note: since unresolved composites that don't have a component type
                    // will prevent child logic from being satisfied with placeholders
                    // (as they don't get turned into placeholders)
                    // add blockers just to them, if they exist
                    // (This prevents adding circular dependencies that could
                    // be avoided once child logic is resolved with placeholders)

                    let compositesBlockingWithComponentType = [];
                    let compositesBlockingWithoutComponentType = [];

                    for (let compositeNotReady of parent.unexpandedCompositesNotReady) {
                        if (parent.childrenMatchedWithPlaceholders) {
                            // if child logic is satisifed with placeholders,
                            // then we don't need to expand any composites
                            // that don't overlap with the active children indices we need
                            let inds =
                                parent
                                    .placeholderActiveChildrenIndicesByComposite[
                                    compositeNotReady
                                ];
                            if (
                                inds.every(
                                    (x) => !activeChildrenIndices.includes(x),
                                )
                            ) {
                                continue;
                            }
                        }
                        let compositeComp =
                            this.dependencyHandler._components[
                                compositeNotReady
                            ];
                        if (
                            compositeComp.attributes.createComponentOfType
                                ?.primitive
                        ) {
                            compositesBlockingWithComponentType.push(
                                compositeNotReady,
                            );
                        } else {
                            compositesBlockingWithoutComponentType.push(
                                compositeNotReady,
                            );
                        }
                    }

                    let compositesToAddBlockers =
                        compositesBlockingWithoutComponentType;
                    if (compositesToAddBlockers.length === 0) {
                        compositesToAddBlockers =
                            compositesBlockingWithComponentType;
                    }

                    for (let compositeNotReady of compositesToAddBlockers) {
                        for (let varName of this.upstreamVariableNames) {
                            await this.dependencyHandler.addBlocker({
                                blockerComponentIdx: compositeNotReady,
                                blockerType: "stateVariable",
                                blockerStateVariable:
                                    "readyToExpandWhenResolved",
                                componentIdxBlocked: this.upstreamComponentIdx,
                                typeBlocked: "childMatches",
                                stateVariableBlocked: varName, // add to just block for this variable
                            });
                        }
                    }

                    return {
                        success: false,
                        downstreamComponentIndices: [],
                        downstreamComponentTypes: [],
                    };
                }
            }
        }

        let activeChildrenMatched = activeChildrenIndices.map(
            (x) => parent.activeChildren[x],
        );

        this.compositeReplacementRange = [];

        if (this.dontRecurseToShadows) {
            let allActiveChildrenMatched = activeChildrenMatched;
            let allActiveChildrenIndices = activeChildrenIndices;

            activeChildrenMatched = [];
            activeChildrenIndices = [];

            for (let [ind, child] of allActiveChildrenMatched.entries()) {
                if (
                    !(
                        child.shadows &&
                        child.shadows.compositeIdx ===
                            parent?.shadows?.compositeIdx
                    )
                ) {
                    activeChildrenMatched.push(child);
                    activeChildrenIndices.push(allActiveChildrenIndices[ind]);
                }
            }
        } else {
            // translate parent.compositeReplacementActiveRange
            // so that indices refer to index from activeChildrenMatched

            if (
                parent.compositeReplacementActiveRange &&
                activeChildrenMatched.length > 0
            ) {
                for (let compositeInfo of parent.compositeReplacementActiveRange) {
                    let translatedFirstInd, translatedLastInd;

                    let translatedPotentialListComponents = [];

                    for (let [
                        ind,
                        activeInd,
                    ] of activeChildrenIndices.entries()) {
                        if (compositeInfo.firstInd > activeInd) {
                            continue;
                        }
                        if (compositeInfo.lastInd < activeInd) {
                            // firstInd/lastInd as describing the interval with inclusive convention at both ends.
                            // Therefore if lastInd = firstInd-1, it means that there were no replacements for the composite.
                            // Since we still want to communicate the compositeReplacementRange in this case,
                            // we set the translated ind to be a interval of length 0 that corresponds to the composite's location.
                            if (
                                compositeInfo.lastInd ===
                                compositeInfo.firstInd - 1
                            ) {
                                translatedFirstInd = ind;
                                translatedLastInd = ind - 1;
                            }
                            break;
                        }

                        // activeInd is matched by compositeInfo

                        if (translatedFirstInd === undefined) {
                            // this is the first activeInd to match, so translate first ind
                            // to the index of activeInd
                            translatedFirstInd = ind;
                        }

                        // last one to match will be picked
                        translatedLastInd = ind;

                        translatedPotentialListComponents.push(
                            compositeInfo.potentialListComponents[
                                activeInd - compositeInfo.firstInd
                            ],
                        );
                    }

                    if (translatedLastInd !== undefined) {
                        this.compositeReplacementRange.push({
                            compositeIdx: compositeInfo.compositeIdx,
                            extendIdx: compositeInfo.extendIdx,
                            unresolvedPath: compositeInfo.unresolvedPath,
                            firstInd: translatedFirstInd,
                            lastInd: translatedLastInd,
                            asList: compositeInfo.asList,
                            potentialListComponents:
                                translatedPotentialListComponents,
                        });
                    }
                }
            }

            for (let child of activeChildrenMatched) {
                let childSource = child;
                let parentSource = parent;

                while (
                    childSource?.shadows &&
                    childSource.shadows.compositeIdx ===
                        parentSource?.shadows?.compositeIdx
                ) {
                    parentSource =
                        this.dependencyHandler._components[
                            parentSource.shadows.componentIdx
                        ];
                    childSource =
                        this.dependencyHandler._components[
                            childSource.shadows.componentIdx
                        ];
                }
            }
        }

        this.activeChildrenIndices = activeChildrenIndices;

        let downstreamComponentIndices = [];
        let downstreamComponentTypes = [];

        for (let [ind, child] of activeChildrenMatched.entries()) {
            if (typeof child !== "object") {
                this.downstreamPrimitives.push(child);
                continue;
            }

            this.downstreamPrimitives.push(null);

            downstreamComponentIndices.push(
                child.componentIdx
                    ? child.componentIdx
                    : `__placeholder_${ind}`,
            );
            downstreamComponentTypes.push(child.componentType);
        }

        if (
            this.originalDownstreamVariableNames.includes("hidden") &&
            this.downstreamPrimitives.find((x) => x !== null)
        ) {
            // We are asking for the hidden state variable and the result includes primitives.
            // Since primitives don't have a hidden state variable, we instead depend on the hidden state variable
            // of the composite.

            for (let compositeObj of this.compositeReplacementRange) {
                downstreamComponentIndices.push(compositeObj.compositeIdx);
                downstreamComponentTypes.push(
                    this.dependencyHandler._components[
                        compositeObj.compositeIdx
                    ].componentType,
                );

                this.addedCompositeHiddenDependency = true;
            }

            if (
                this.addedCompositeHiddenDependency &&
                this.originalDownstreamVariableNames.length > 1
            ) {
                // Added a composite hidden dependency but there are other variables that may not be on the composite.
                // Make variables optional so we don't cause an unexpected error.
                this.variablesOptional = true;
            }
        }

        return {
            success: true,
            downstreamComponentIndices,
            downstreamComponentTypes,
        };
    }

    async getValue({ verbose } = {}) {
        let result = await super.getValue({ verbose, skipProxy: true });

        // TODO: do we have to adjust anything else from result
        // if we add primitives to result.value?

        let compositeReplacementRange = this.compositeReplacementRange;

        if (this.addedCompositeHiddenDependency) {
            // We added composite hidden dependencies.
            // Delete them off the actual dependencies returned
            // and instead add them to the compositeReplacesRange object returned.

            let nDepsAdded = compositeReplacementRange.length;
            let extraDependencies = result.value.splice(
                result.value.length - nDepsAdded,
                nDepsAdded,
            );

            compositeReplacementRange = JSON.parse(
                JSON.stringify(compositeReplacementRange),
            );

            for (let [ind, range] of compositeReplacementRange.entries()) {
                range.hidden = extraDependencies[ind].stateValues.hidden;
            }
        }

        let resultValueWithPrimitives = [];
        let resultInd = 0;

        for (let primitiveOrNull of this.downstreamPrimitives) {
            if (primitiveOrNull === null) {
                resultValueWithPrimitives.push(result.value[resultInd]);
                resultInd++;
            } else {
                resultValueWithPrimitives.push(primitiveOrNull);
            }
        }

        resultValueWithPrimitives.compositeReplacementRange =
            compositeReplacementRange;

        result.value = resultValueWithPrimitives;

        if (
            this.downstreamPrimitives.length !==
                this.previousDownstreamPrimitives.length ||
            this.downstreamPrimitives.some(
                (v, i) => v !== this.previousDownstreamPrimitives[i],
            )
        ) {
            result.changes.componentIdentitiesChanged = true;
            this.previousDownstreamPrimitives = [...this.downstreamPrimitives];
        }

        // if (!this.doNotProxy) {
        //   result.value = new Proxy(result.value, readOnlyProxyHandler)
        // }

        return result;
    }

    deleteFromUpdateTriggers() {
        let childDeps =
            this.dependencyHandler.updateTriggers.childDependenciesByParent[
                this.parentIdx
            ];
        if (childDeps) {
            let ind = childDeps.indexOf(this);
            if (ind !== -1) {
                childDeps.splice(ind, 1);
            }
        }

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

dependencyTypeArray.push(ChildDependency);

class DescendantDependency extends Dependency {
    static dependencyType = "descendant";

    setUpParameters() {
        if (this.definition.ancestorIdx != undefined) {
            this.ancestorIdx = this.definition.ancestorIdx;
            this.specifiedComponentName = this.ancestorIdx;
        } else {
            this.ancestorIdx = this.upstreamComponentIdx;
        }

        if (this.definition.variableNames) {
            if (!Array.isArray(this.definition.variableNames)) {
                throw Error(
                    `Invalid state variable ${this.representativeStateVariable} of ${this.upstreamComponentIdx}, dependency ${this.dependencyName}: variableNames must be an array`,
                );
            }
            this.originalDownstreamVariableNames =
                this.definition.variableNames;
        } else {
            this.originalDownstreamVariableNames = [];
        }

        this.componentTypes = this.definition.componentTypes;
        this.recurseToMatchedChildren =
            this.definition.recurseToMatchedChildren;
        this.useReplacementsForComposites =
            this.definition.useReplacementsForComposites;
        this.includeNonActiveChildren =
            this.definition.includeNonActiveChildren;
        this.includeAttributeChildren =
            this.definition.includeAttributeChildren;
        this.skipOverAdapters = this.definition.skipOverAdapters;
        this.ignoreReplacementsOfMatchedComposites =
            this.definition.ignoreReplacementsOfMatchedComposites;

        // Note: ignoreReplacementsOfEncounteredComposites means ignore replacements
        // of all composites except copies of external content
        this.ignoreReplacementsOfEncounteredComposites =
            this.definition.ignoreReplacementsOfEncounteredComposites;

        if (
            this.definition.sourceIndex !== null &&
            this.definition.sourceIndex !== undefined
        ) {
            if (Number.isInteger(this.definition.sourceIndex)) {
                this.sourceIndex = this.definition.sourceIndex;
            } else {
                this.sourceIndex = NaN;
            }
        }
    }

    async determineDownstreamComponents() {
        // console.log(`deterine downstream components of descendancy dependency ${this.dependencyName} of ${this.representativeStateVariable} of ${this.upstreamComponentIdx}`)

        let ancestor = this.dependencyHandler._components[this.ancestorIdx];

        if (!ancestor) {
            let dependenciesMissingComponent =
                this.dependencyHandler.updateTriggers
                    .dependenciesMissingComponentBySpecifiedName[
                    this.ancestorIdx
                ];
            if (!dependenciesMissingComponent) {
                dependenciesMissingComponent =
                    this.dependencyHandler.updateTriggers.dependenciesMissingComponentBySpecifiedName[
                        this.ancestorIdx
                    ] = [];
            }
            if (!dependenciesMissingComponent.includes(this)) {
                dependenciesMissingComponent.push(this);
            }

            for (let varName of this.upstreamVariableNames) {
                await this.dependencyHandler.addBlocker({
                    blockerComponentIdx: this.ancestorIdx,
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

        let descendantDependencies =
            this.dependencyHandler.updateTriggers
                .descendantDependenciesByAncestor[this.ancestorIdx];
        if (!descendantDependencies) {
            descendantDependencies =
                this.dependencyHandler.updateTriggers.descendantDependenciesByAncestor[
                    this.ancestorIdx
                ] = [];
        }
        if (!descendantDependencies.includes(this)) {
            descendantDependencies.push(this);
        }

        let result = this.gatherUnexpandedComposites(ancestor);

        if (
            result.haveCompositesNotReady ||
            result.haveUnexpandedCompositeReady
        ) {
            for (let varName of this.upstreamVariableNames) {
                await this.dependencyHandler.addBlocker({
                    blockerComponentIdx: this.upstreamComponentIdx,
                    blockerType: "recalculateDownstreamComponents",
                    blockerStateVariable: varName,
                    blockerDependency: this.dependencyName,
                    componentIdxBlocked: this.upstreamComponentIdx,
                    typeBlocked: "stateVariable",
                    stateVariableBlocked: varName,
                });

                for (const parentIdxStr in result.unexpandedCompositesReadyByParentName) {
                    const parentIdx = Number(parentIdxStr);
                    await this.dependencyHandler.addBlocker({
                        blockerComponentIdx: parentIdx,
                        blockerType: "childMatches",
                        blockerStateVariable: varName,
                        componentIdxBlocked: this.upstreamComponentIdx,
                        typeBlocked: "recalculateDownstreamComponents",
                        stateVariableBlocked: varName,
                        dependencyBlocked: this.dependencyName,
                    });
                }

                for (const parentIdxStr in result.unexpandedCompositesNotReadyByParentName) {
                    const parentIdx = Number(parentIdxStr);
                    await this.dependencyHandler.addBlocker({
                        blockerComponentIdx: parentIdx,
                        blockerType: "childMatches",
                        blockerStateVariable: varName,
                        componentIdxBlocked: this.upstreamComponentIdx,
                        typeBlocked: "recalculateDownstreamComponents",
                        stateVariableBlocked: varName,
                        dependencyBlocked: this.dependencyName,
                    });

                    // TODO: when we have the composites block child logic,
                    // we can get circular dependencies.
                    // The solution of just removing these blockers seems to work,
                    // but not sure if it is the most efficient solution.
                    // Does this lead to unnecessary recalculations?

                    // for (let compositeNotReady of result.unexpandedCompositesNotReadyByParentName[parentIdx]) {
                    //   this.dependencyHandler.addBlocker({
                    //     blockerComponentIdx: compositeNotReady,
                    //     blockerType: "stateVariable",
                    //     blockerStateVariable: "readyToExpandWhenResolved",
                    //     componentIdxBlocked: this.upstreamComponentIdx,
                    //     typeBlocked: "childMatches",
                    //     stateVariableBlocked: varName,
                    //   });
                    // }
                }
            }

            return {
                success: false,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }

        // if reached this far, then we have expanded all composites
        // or have placeholders that don't impede

        let descendants = gatherDescendants({
            ancestor,
            descendantTypes: this.componentTypes,
            recurseToMatchedChildren: this.recurseToMatchedChildren,
            useReplacementsForComposites: this.useReplacementsForComposites,
            includeNonActiveChildren: this.includeNonActiveChildren,
            skipOverAdapters: this.skipOverAdapters,
            ignoreReplacementsOfMatchedComposites:
                this.ignoreReplacementsOfMatchedComposites,
            ignoreReplacementsOfEncounteredComposites:
                this.ignoreReplacementsOfEncounteredComposites,
            componentInfoObjects: this.dependencyHandler.componentInfoObjects,
        });

        if (this.sourceIndex !== undefined) {
            let theDescendant = descendants[this.sourceIndex - 1];
            if (theDescendant) {
                descendants = [theDescendant];
            } else {
                descendants = [];
            }
        }

        return {
            success: true,
            downstreamComponentIndices: descendants.map((x) => x.componentIdx),
            downstreamComponentTypes: descendants.map((x) => x.componentType),
        };
    }

    gatherUnexpandedComposites(component) {
        let unexpandedCompositesReadyByParentName = {};
        let unexpandedCompositesNotReadyByParentName = {};
        let haveUnexpandedCompositeReady = false;
        let haveCompositesNotReady = false;

        // if we don't need component indices or variables,
        // then gathering a placeholder descendant is fine
        let placeholdersOKForMatchedDescendants =
            this.skipComponentIndices &&
            this.originalDownstreamVariableNames.length === 0;

        if (!component.matchedCompositeChildren) {
            if (component.matchedCompositeChildrenWithPlaceholders) {
                if (component.unexpandedCompositesReady.length > 0) {
                    let unexpandedReady =
                        this.unexpandedCompositesAdjustedForPlacedholders(
                            component.unexpandedCompositesReady,
                            placeholdersOKForMatchedDescendants,
                        );
                    if (unexpandedReady.length > 0) {
                        unexpandedCompositesReadyByParentName[
                            component.componentIdx
                        ] = unexpandedReady;
                        haveUnexpandedCompositeReady = true;
                    }
                }
                if (component.unexpandedCompositesNotReady.length > 0) {
                    let unexpandedNotReady =
                        this.unexpandedCompositesAdjustedForPlacedholders(
                            component.unexpandedCompositesNotReady,
                            placeholdersOKForMatchedDescendants,
                        );
                    if (unexpandedNotReady.length > 0) {
                        unexpandedCompositesNotReadyByParentName[
                            component.componentIdx
                        ] = unexpandedNotReady;
                        haveCompositesNotReady = true;
                    }
                }
            } else {
                if (component.unexpandedCompositesReady.length > 0) {
                    unexpandedCompositesReadyByParentName[
                        component.componentIdx
                    ] = component.unexpandedCompositesReady;
                    haveUnexpandedCompositeReady = true;
                }
                if (component.unexpandedCompositesNotReady.length > 0) {
                    unexpandedCompositesNotReadyByParentName[
                        component.componentIdx
                    ] = component.unexpandedCompositesNotReady;
                    haveCompositesNotReady = true;
                }
            }
        }

        for (const childIdxStr in component.allChildren) {
            let child = component.allChildren[childIdxStr].component;
            if (typeof child === "object") {
                let result = this.gatherUnexpandedComposites(child);
                if (result.haveUnexpandedCompositeReady) {
                    Object.assign(
                        unexpandedCompositesReadyByParentName,
                        result.unexpandedCompositesReadyByParentName,
                    );
                    haveUnexpandedCompositeReady = true;
                }
                if (result.haveCompositesNotReady) {
                    Object.assign(
                        unexpandedCompositesNotReadyByParentName,
                        result.unexpandedCompositesNotReadyByParentName,
                    );
                    haveCompositesNotReady = true;
                }
            }
        }

        return {
            unexpandedCompositesReadyByParentName,
            haveUnexpandedCompositeReady,
            unexpandedCompositesNotReadyByParentName,
            haveCompositesNotReady,
        };
    }

    unexpandedCompositesAdjustedForPlacedholders(
        unexpandedComposites,
        placeholdersOKForMatchedDescendants,
    ) {
        let adjustedUnexpanded = [];
        for (let compositeIdx of unexpandedComposites) {
            let composite = this.dependencyHandler._components[compositeIdx];
            if (composite.attributes.createComponentOfType) {
                let placeholderType =
                    this.dependencyHandler.componentInfoObjects
                        .componentTypeLowerCaseMapping[
                        composite.attributes.createComponentOfType.primitive.value.toLowerCase()
                    ];

                let matches = this.componentTypes.some((ct) =>
                    this.dependencyHandler.componentInfoObjects.isInheritedComponentType(
                        {
                            inheritedComponentType: placeholderType,
                            baseComponentType: ct,
                        },
                    ),
                );

                if (matches) {
                    if (!placeholdersOKForMatchedDescendants) {
                        adjustedUnexpanded.push(compositeIdx);
                    }
                } else {
                    // Composite is a placeholder that is not matched by componentTypes.
                    // Could that placeholder later have a descendant that is matched by componentTypes?

                    adjustedUnexpanded.push(compositeIdx);
                }
            } else {
                // no componentType specified
                adjustedUnexpanded.push(compositeIdx);
            }
        }

        return adjustedUnexpanded;
    }

    deleteFromUpdateTriggers() {
        let descendantDeps =
            this.dependencyHandler.updateTriggers
                .descendantDependenciesByAncestor[this.ancestorIdx];
        if (descendantDeps) {
            let ind = descendantDeps.indexOf(this);
            if (ind !== -1) {
                descendantDeps.splice(ind, 1);
            }
        }

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

dependencyTypeArray.push(DescendantDependency);

class ParentDependency extends Dependency {
    static dependencyType = "parentStateVariable";

    setUpParameters() {
        if (this.definition.childIdx != undefined) {
            this.childIdx = this.definition.childIdx;
            this.specifiedComponentName = this.childIdx;
        } else {
            this.childIdx = this.upstreamComponentIdx;
        }

        if (!this.definition.variableName) {
            throw Error(
                `Invalid state variable ${this.representativeStateVariable} of ${this.upstreamComponentIdx}, dependency ${this.dependencyName}: must have a variableName`,
            );
        } else {
            this.originalDownstreamVariableNames = [
                this.definition.variableName,
            ];
        }

        if (this.definition.parentComponentType) {
            this.parentComponentType = this.definition.parentComponentType;
        }

        this.returnSingleVariableValue = true;

        // for parent state variable
        // always make variables optional so that don't get error
        // depending on parent (which a component can't control)
        this.variablesOptional = true;
    }

    async determineDownstreamComponents() {
        let child = this.dependencyHandler._components[this.childIdx];

        if (!child) {
            let dependenciesMissingComponent =
                this.dependencyHandler.updateTriggers
                    .dependenciesMissingComponentBySpecifiedName[this.childIdx];
            if (!dependenciesMissingComponent) {
                dependenciesMissingComponent =
                    this.dependencyHandler.updateTriggers.dependenciesMissingComponentBySpecifiedName[
                        this.childIdx
                    ] = [];
            }
            if (!dependenciesMissingComponent.includes(this)) {
                dependenciesMissingComponent.push(this);
            }

            for (let varName of this.upstreamVariableNames) {
                await this.dependencyHandler.addBlocker({
                    blockerComponentIdx: this.childIdx,
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

        if (child.parentIdx == undefined) {
            return {
                success: true,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }

        this.parentIdx = child.parentIdx;

        let parent = this.dependencyHandler._components[this.parentIdx];

        if (!parent) {
            // Note: since parent is created after children,
            // will typically hit this condition first time through
            let dependenciesMissingComponent =
                this.dependencyHandler.updateTriggers
                    .dependenciesMissingComponentBySpecifiedName[
                    this.parentIdx
                ];
            if (!dependenciesMissingComponent) {
                dependenciesMissingComponent =
                    this.dependencyHandler.updateTriggers.dependenciesMissingComponentBySpecifiedName[
                        this.parentIdx
                    ] = [];
            }
            if (!dependenciesMissingComponent.includes(this)) {
                dependenciesMissingComponent.push(this);
            }

            for (let varName of this.upstreamVariableNames) {
                await this.dependencyHandler.addBlocker({
                    blockerComponentIdx: this.parentIdx,
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

        if (
            this.parentComponentType &&
            !this.dependencyHandler.componentInfoObjects.isInheritedComponentType(
                {
                    inheritedComponentType: parent.componentType,
                    baseComponentType: this.parentComponentType,
                },
            )
        ) {
            // parent didn't match specified componentType
            // so don't include parent
            return {
                success: true,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }

        let parentDependencies =
            this.dependencyHandler.updateTriggers.parentDependenciesByParent[
                this.parentIdx
            ];
        if (!parentDependencies) {
            parentDependencies =
                this.dependencyHandler.updateTriggers.parentDependenciesByParent[
                    this.parentIdx
                ] = [];
        }
        if (!parentDependencies.includes(this)) {
            parentDependencies.push(this);
        }

        return {
            success: true,
            downstreamComponentIndices: [this.parentIdx],
            downstreamComponentTypes: [parent.componentType],
        };
    }

    deleteFromUpdateTriggers() {
        let parentDeps =
            this.dependencyHandler.updateTriggers.parentDependenciesByParent[
                this.parentIdx
            ];
        if (parentDeps) {
            let ind = parentDeps.indexOf(this);
            if (ind !== -1) {
                parentDeps.splice(ind, 1);
            }
        }

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

        let dependenciesMissingComponent =
            this.dependencyHandler.updateTriggers
                .dependenciesMissingComponentBySpecifiedName[this.parentIdx];
        if (dependenciesMissingComponent) {
            let ind = dependenciesMissingComponent.indexOf(this);
            if (ind !== -1) {
                dependenciesMissingComponent.splice(ind, 1);
            }
        }
    }
}

dependencyTypeArray.push(ParentDependency);

class ParentIdentityDependency extends Dependency {
    static dependencyType = "parentIdentity";

    setUpParameters() {
        if (this.definition.childIdx != undefined) {
            this.childIdx = this.definition.childIdx;
            this.specifiedComponentName = this.childIdx;
        } else {
            this.childIdx = this.upstreamComponentIdx;
        }

        if (this.definition.parentComponentType) {
            this.parentComponentType = this.definition.parentComponentType;
        }

        this.returnSingleComponent = true;
    }

    async determineDownstreamComponents() {
        let child = this.dependencyHandler._components[this.childIdx];

        if (!child) {
            let dependenciesMissingComponent =
                this.dependencyHandler.updateTriggers
                    .dependenciesMissingComponentBySpecifiedName[this.childIdx];
            if (!dependenciesMissingComponent) {
                dependenciesMissingComponent =
                    this.dependencyHandler.updateTriggers.dependenciesMissingComponentBySpecifiedName[
                        this.childIdx
                    ] = [];
            }
            if (!dependenciesMissingComponent.includes(this)) {
                dependenciesMissingComponent.push(this);
            }

            for (let varName of this.upstreamVariableNames) {
                await this.dependencyHandler.addBlocker({
                    blockerComponentIdx: this.childIdx,
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

        if (child.parentIdx == undefined) {
            return {
                success: true,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }

        this.parentIdx = child.parentIdx;

        let parent = this.dependencyHandler._components[this.parentIdx];

        if (!parent) {
            // Note: since parent is created after children,
            // will typically hit this condition first time through
            let dependenciesMissingComponent =
                this.dependencyHandler.updateTriggers
                    .dependenciesMissingComponentBySpecifiedName[
                    this.parentIdx
                ];
            if (!dependenciesMissingComponent) {
                dependenciesMissingComponent =
                    this.dependencyHandler.updateTriggers.dependenciesMissingComponentBySpecifiedName[
                        this.parentIdx
                    ] = [];
            }
            if (!dependenciesMissingComponent.includes(this)) {
                dependenciesMissingComponent.push(this);
            }

            for (let varName of this.upstreamVariableNames) {
                await this.dependencyHandler.addBlocker({
                    blockerComponentIdx: this.parentIdx,
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

        if (
            this.parentComponentType &&
            !this.dependencyHandler.componentInfoObjects.isInheritedComponentType(
                {
                    inheritedComponentType: parent.componentType,
                    baseComponentType: this.parentComponentType,
                },
            )
        ) {
            // parent didn't match specified componentType
            // so don't include parent
            return {
                success: true,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }

        let parentDependencies =
            this.dependencyHandler.updateTriggers.parentDependenciesByParent[
                this.parentIdx
            ];
        if (!parentDependencies) {
            parentDependencies =
                this.dependencyHandler.updateTriggers.parentDependenciesByParent[
                    this.parentIdx
                ] = [];
        }
        if (!parentDependencies.includes(this)) {
            parentDependencies.push(this);
        }

        return {
            success: true,
            downstreamComponentIndices: [this.parentIdx],
            downstreamComponentTypes: [parent.componentType],
        };
    }

    deleteFromUpdateTriggers() {
        let parentDeps =
            this.dependencyHandler.updateTriggers.parentDependenciesByParent[
                this.parentIdx
            ];
        if (parentDeps) {
            let ind = parentDeps.indexOf(this);
            if (ind !== -1) {
                parentDeps.splice(ind, 1);
            }
        }

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

        let dependenciesMissingComponent =
            this.dependencyHandler.updateTriggers
                .dependenciesMissingComponentBySpecifiedName[this.parentIdx];
        if (dependenciesMissingComponent) {
            let ind = dependenciesMissingComponent.indexOf(this);
            if (ind !== -1) {
                dependenciesMissingComponent.splice(ind, 1);
            }
        }
    }
}

dependencyTypeArray.push(ParentIdentityDependency);

class AncestorDependency extends Dependency {
    static dependencyType = "ancestor";

    setUpParameters() {
        if (this.definition.descendantIdx != undefined) {
            this.descendantIdx = this.definition.descendantIdx;
            this.specifiedComponentName = this.descendantIdx;
        } else {
            this.descendantIdx = this.upstreamComponentIdx;
        }

        if (this.definition.variableNames) {
            if (!Array.isArray(this.definition.variableNames)) {
                throw Error(
                    `Invalid state variable ${this.representativeStateVariable} of ${this.upstreamComponentIdx}, dependency ${this.dependencyName}: variableNames must be an array`,
                );
            }
            this.originalDownstreamVariableNames =
                this.definition.variableNames;
        } else {
            this.originalDownstreamVariableNames = [];
        }

        this.returnSingleComponent = true;

        if (this.definition.componentType) {
            this.componentType = this.definition.componentType;
        }
    }

    async determineDownstreamComponents() {
        let descendant = this.dependencyHandler._components[this.descendantIdx];

        if (!descendant) {
            let dependenciesMissingComponent =
                this.dependencyHandler.updateTriggers
                    .dependenciesMissingComponentBySpecifiedName[
                    this.descendantIdx
                ];
            if (!dependenciesMissingComponent) {
                dependenciesMissingComponent =
                    this.dependencyHandler.updateTriggers.dependenciesMissingComponentBySpecifiedName[
                        this.descendantIdx
                    ] = [];
            }
            if (!dependenciesMissingComponent.includes(this)) {
                dependenciesMissingComponent.push(this);
            }

            for (let varName of this.upstreamVariableNames) {
                await this.dependencyHandler.addBlocker({
                    blockerComponentIdx: this.descendantIdx,
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

        if (
            this.dependencyHandler._components[
                this.dependencyHandler.core.documentIdx
            ] == undefined
        ) {
            // if document hasn't been created yet, then don't match ancestors
            // until have created document

            for (let varName of this.upstreamVariableNames) {
                await this.dependencyHandler.addBlocker({
                    blockerComponentIdx: this.upstreamComponentIdx,
                    blockerType: "recalculateDownstreamComponents",
                    blockerStateVariable: varName,
                    blockerDependency: this.dependencyName,
                    componentIdxBlocked: this.upstreamComponentIdx,
                    typeBlocked: "stateVariable",
                    stateVariableBlocked: varName,
                });

                await this.dependencyHandler.addBlocker({
                    blockerComponentIdx:
                        this.dependencyHandler.core.documentIdx,
                    blockerType: "componentIdentity",
                    componentIdxBlocked: this.upstreamComponentIdx,
                    typeBlocked: "recalculateDownstreamComponents",
                    stateVariableBlocked: varName,
                    dependencyBlocked: this.dependencyName,
                });
            }

            return {
                success: false,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }

        let ancestorResults = this.findMatchingAncestor(descendant);

        if (ancestorResults.missingComponentName) {
            let dependenciesMissingComponent =
                this.dependencyHandler.updateTriggers
                    .dependenciesMissingComponentBySpecifiedName[
                    ancestorResults.missingComponentName
                ];
            if (!dependenciesMissingComponent) {
                dependenciesMissingComponent =
                    this.dependencyHandler.updateTriggers.dependenciesMissingComponentBySpecifiedName[
                        ancestorResults.missingComponentName
                    ] = [];
            }
            if (!dependenciesMissingComponent.includes(this)) {
                dependenciesMissingComponent.push(this);
            }

            for (let varName of this.upstreamVariableNames) {
                await this.dependencyHandler.addBlocker({
                    blockerComponentIdx: ancestorResults.missingComponentName,
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

        for (let ancestorIdx of ancestorResults.ancestorsExamined) {
            let ancestorDependencies =
                this.dependencyHandler.updateTriggers
                    .ancestorDependenciesByPotentialAncestor[ancestorIdx];
            if (!ancestorDependencies) {
                ancestorDependencies =
                    this.dependencyHandler.updateTriggers.ancestorDependenciesByPotentialAncestor[
                        ancestorIdx
                    ] = [];
            }
            if (!ancestorDependencies.includes(this)) {
                ancestorDependencies.push(this);
            }
        }
        this.ancestorResults = ancestorResults;

        if (ancestorResults.ancestorFound) {
            return {
                success: true,
                downstreamComponentIndices: [
                    ancestorResults.ancestorFound.componentIdx,
                ],
                downstreamComponentTypes: [
                    ancestorResults.ancestorFound.componentClass.componentType,
                ],
            };
        } else {
            return {
                success: true,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }
    }

    findMatchingAncestor(descendant) {
        let ancestorsExamined = [];

        if (this.componentType) {
            for (let ancestor of descendant.ancestors) {
                let ancestorComponent =
                    this.dependencyHandler._components[ancestor.componentIdx];
                if (!ancestorComponent) {
                    return { missingComponentName: ancestor.componentIdx };
                }

                ancestorsExamined.push(ancestor.componentIdx);

                if (
                    this.dependencyHandler.componentInfoObjects.isInheritedComponentType(
                        {
                            inheritedComponentType:
                                ancestorComponent.componentType,
                            baseComponentType: this.componentType,
                        },
                    )
                ) {
                    return {
                        ancestorsExamined,
                        ancestorFound: ancestor,
                    };
                }
            }

            return { ancestorsExamined };
        }

        if (this.originalDownstreamVariableNames.length === 0) {
            console.warn(
                `Invalid state variable ${this.representativeStateVariable} of ${this.upstreamComponentIdx}, dependency ${this.dependencyName}: must specify componentType or variableNames to find ancestor`,
            );
            return { ancestorsExamined };
        }

        // the state variable definition did not prescribe the component type
        // of the ancestor, but it did give the variableNames to match
        // Search all the state variables of the ancestors to find one
        // that has all the requisite state variables

        let variableNames = this.originalDownstreamVariableNames;

        for (let ancestor of descendant.ancestors) {
            let ancestorComponent =
                this.dependencyHandler._components[ancestor.componentIdx];
            if (!ancestorComponent) {
                return { missingComponentName: ancestor.componentIdx };
            }

            ancestorsExamined.push(ancestor.componentIdx);

            let foundAllVarNames = true;
            for (let vName of variableNames) {
                if (
                    !(
                        vName in ancestorComponent.state ||
                        this.dependencyHandler.core.checkIfArrayEntry({
                            stateVariable: vName,
                            component: ancestorComponent,
                        }).isArrayEntry
                    )
                ) {
                    foundAllVarNames = false;
                    break;
                }
            }
            if (foundAllVarNames) {
                return {
                    ancestorsExamined,
                    ancestorFound: ancestor,
                };
            }
        }

        return { ancestorsExamined };
    }

    deleteFromUpdateTriggers() {
        if (this.ancestorResults) {
            for (let ancestorIdx of this.ancestorResults.ancestorsExamined) {
                let ancestorDeps =
                    this.dependencyHandler.updateTriggers
                        .ancestorDependenciesByPotentialAncestor[ancestorIdx];
                if (ancestorDeps) {
                    let ind = ancestorDeps.indexOf(this);
                    if (ind !== -1) {
                        ancestorDeps.splice(ind, 1);
                    }
                }
            }
        }

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

        if (this.ancestorResults?.missingComponentName) {
            let dependenciesMissingComponent =
                this.dependencyHandler.updateTriggers
                    .dependenciesMissingComponentBySpecifiedName[
                    this.ancestorResults.missingComponentName
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

dependencyTypeArray.push(AncestorDependency);

class ReplacementDependency extends Dependency {
    static dependencyType = "replacement";

    setUpParameters() {
        if (this.definition.compositeIdx != undefined) {
            this.compositeIdx = this.definition.compositeIdx;
            this.specifiedComponentName = this.compositeIdx;
        } else {
            this.compositeIdx = this.upstreamComponentIdx;
        }

        if (this.definition.variableNames) {
            if (!Array.isArray(this.definition.variableNames)) {
                throw Error(
                    `Invalid state variable ${this.representativeStateVariable} of ${this.upstreamComponentIdx}, dependency ${this.dependencyName}: variableNames must be an array`,
                );
            }
            this.originalDownstreamVariableNames =
                this.definition.variableNames;
        } else {
            this.originalDownstreamVariableNames = [];
        }

        this.recursive = this.definition.recursive;

        this.recurseNonStandardComposites =
            this.definition.recurseNonStandardComposites;

        if (
            this.definition.sourceIndex !== null &&
            this.definition.sourceIndex !== undefined
        ) {
            if (Number.isInteger(this.definition.sourceIndex)) {
                this.sourceIndex = this.definition.sourceIndex;
            } else {
                this.sourceIndex = NaN;
            }
        }

        // If we encounter a composite that has a public state variable matching `stopIfHaveProp`
        // then we won't returns its replacements but instead return the composite itself.
        this.stopIfHaveProp = this.definition.stopIfHaveProp;

        this.includeWithheldReplacements =
            this.definition.includeWithheldReplacements;

        this.expandReplacements = true;
    }

    async determineDownstreamComponents() {
        if (this.replacementPrimitives) {
            this.previousReplacementPrimitives = [
                ...this.replacementPrimitives,
            ];
        } else {
            this.previousReplacementPrimitives = [];
        }

        this.replacementPrimitives = [];

        let composite = this.dependencyHandler._components[this.compositeIdx];

        if (!composite) {
            let dependenciesMissingComponent =
                this.dependencyHandler.updateTriggers
                    .dependenciesMissingComponentBySpecifiedName[
                    this.compositeIdx
                ];
            if (!dependenciesMissingComponent) {
                dependenciesMissingComponent =
                    this.dependencyHandler.updateTriggers.dependenciesMissingComponentBySpecifiedName[
                        this.compositeIdx
                    ] = [];
            }
            if (!dependenciesMissingComponent.includes(this)) {
                dependenciesMissingComponent.push(this);
            }

            for (let varName of this.upstreamVariableNames) {
                await this.dependencyHandler.addBlocker({
                    blockerComponentIdx: this.compositeIdx,
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

        if (this.stopIfHaveProp) {
            const checkForPublic =
                this.dependencyHandler.core.matchPublicStateVariables({
                    stateVariables: [this.stopIfHaveProp],
                    componentClass: composite.constructor,
                })[0];

            if (!checkForPublic.startsWith("__not_public_")) {
                // We found that the composite has a public state variable matching `stopIfHaveProp`.
                // Therefore, we treat the composite itself as the "replacement",
                // and don't even check if the composite is expanded or get its replacements.
                this.replacementPrimitives.push(null);

                return {
                    success: true,
                    downstreamComponentIndices: [composite.componentIdx],
                    downstreamComponentTypes: [composite.componentType],
                };
            }
        }

        if (!composite.isExpanded) {
            for (let varName of this.upstreamVariableNames) {
                await this.dependencyHandler.addBlocker({
                    blockerComponentIdx: this.upstreamComponentIdx,
                    blockerType: "recalculateDownstreamComponents",
                    blockerStateVariable: varName,
                    blockerDependency: this.dependencyName,
                    componentIdxBlocked: this.upstreamComponentIdx,
                    typeBlocked: "stateVariable",
                    stateVariableBlocked: varName,
                });

                await this.dependencyHandler.addBlocker({
                    blockerComponentIdx: this.compositeIdx,
                    blockerType: "expandComposite",
                    componentIdxBlocked: this.upstreamComponentIdx,
                    typeBlocked: "recalculateDownstreamComponents",
                    stateVariableBlocked: varName,
                    dependencyBlocked: this.dependencyName,
                });
            }

            if (!composite.state.readyToExpandWhenResolved.isResolved) {
                await this.dependencyHandler.addBlocker({
                    blockerComponentIdx: this.compositeIdx,
                    blockerType: "stateVariable",
                    blockerStateVariable: "readyToExpandWhenResolved",
                    componentIdxBlocked: this.compositeIdx,
                    typeBlocked: "expandComposite",
                });
            }

            return {
                success: false,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }

        this.compositesFound = [this.compositeIdx];
        let replacements = composite.replacements;
        if (
            !this.includeWithheldReplacements &&
            composite.replacementsToWithhold > 0
        ) {
            replacements = replacements.slice(
                0,
                -composite.replacementsToWithhold,
            );
        }

        if (this.recursive) {
            let result =
                this.dependencyHandler.core.recursivelyReplaceCompositesWithReplacements(
                    {
                        replacements,
                        recurseNonStandardComposites:
                            this.recurseNonStandardComposites,
                        includeWithheldReplacements:
                            this.includeWithheldReplacements,
                        stopIfHaveProp: this.stopIfHaveProp,
                    },
                );

            if (
                result.unexpandedCompositesNotReady.length > 0 ||
                result.unexpandedCompositesReady.length > 0
            ) {
                for (let varName of this.upstreamVariableNames) {
                    await this.dependencyHandler.addBlocker({
                        blockerComponentIdx: this.upstreamComponentIdx,
                        blockerType: "recalculateDownstreamComponents",
                        blockerStateVariable: varName,
                        blockerDependency: this.dependencyName,
                        componentIdxBlocked: this.upstreamComponentIdx,
                        typeBlocked: "stateVariable",
                        stateVariableBlocked: varName,
                    });

                    for (let compositeIdx of [
                        ...result.unexpandedCompositesReady,
                        ...result.unexpandedCompositesNotReady,
                    ]) {
                        await this.dependencyHandler.addBlocker({
                            blockerComponentIdx: compositeIdx,
                            blockerType: "expandComposite",
                            componentIdxBlocked: this.upstreamComponentIdx,
                            typeBlocked: "recalculateDownstreamComponents",
                            stateVariableBlocked: varName,
                            dependencyBlocked: this.dependencyName,
                        });
                    }
                }

                for (let compositeIdx of result.unexpandedCompositesNotReady) {
                    await this.dependencyHandler.addBlocker({
                        blockerComponentIdx: compositeIdx,
                        blockerType: "stateVariable",
                        blockerStateVariable: "readyToExpandWhenResolved",
                        componentIdxBlocked: compositeIdx,
                        typeBlocked: "expandComposite",
                    });
                }

                return {
                    success: false,
                    downstreamComponentIndices: [],
                    downstreamComponentTypes: [],
                };
            }

            replacements = result.newReplacements;
            this.compositesFound.push(...result.compositesFound);
        }

        for (let cIdx of this.compositesFound) {
            let replacementDependencies =
                this.dependencyHandler.updateTriggers
                    .replacementDependenciesByComposite[cIdx];
            if (!replacementDependencies) {
                replacementDependencies =
                    this.dependencyHandler.updateTriggers.replacementDependenciesByComposite[
                        cIdx
                    ] = [];
            }
            if (!replacementDependencies.includes(this)) {
                replacementDependencies.push(this);
            }
        }

        if (this.sourceIndex !== undefined) {
            // Note: strings that are not blank do take up a slot for source index.
            // However, this non-blank strings that do take up a slot
            // will not be returned as a replacement (instead the replacement will be empty).
            // Rationale: we do not have a mechanism for linking a string to its replacement source,
            // so returning the string would it unlinked and inconsistent with other cases.
            let nonBlankStringReplacements = replacements.filter(
                (x) => typeof x !== "string" || x.trim() !== "",
            );
            let theReplacement =
                nonBlankStringReplacements[this.sourceIndex - 1];
            if (theReplacement && typeof theReplacement !== "string") {
                replacements = [theReplacement];
            } else {
                replacements = [];
            }
        }

        let downstreamComponentIndices = [];
        let downstreamComponentTypes = [];

        for (let repl of replacements) {
            if (typeof repl !== "object") {
                this.replacementPrimitives.push(repl);
                continue;
            }

            this.replacementPrimitives.push(null);

            downstreamComponentIndices.push(repl.componentIdx);
            downstreamComponentTypes.push(repl.componentType);
        }

        return {
            success: true,
            downstreamComponentIndices,
            downstreamComponentTypes,
        };
    }

    async getValue({ verbose } = {}) {
        let result = await super.getValue({ verbose, skipProxy: true });

        // TODO: do we have to adjust anything else from result
        // if we add primitives to result.value?

        let resultValueWithPrimitives = [];
        let resultInd = 0;

        for (let primitiveOrNull of this.replacementPrimitives) {
            if (primitiveOrNull === null) {
                resultValueWithPrimitives.push(result.value[resultInd]);
                resultInd++;
            } else {
                resultValueWithPrimitives.push(primitiveOrNull);
            }
        }

        result.value = resultValueWithPrimitives;

        if (
            this.replacementPrimitives.length !==
                this.previousReplacementPrimitives.length ||
            this.replacementPrimitives.some(
                (v, i) => v !== this.previousReplacementPrimitives[i],
            )
        ) {
            result.changes.componentIdentitiesChanged = true;
            this.previousReplacementPrimitives = [
                ...this.replacementPrimitives,
            ];
        }

        // if (!this.doNotProxy) {
        //   result.value = new Proxy(result.value, readOnlyProxyHandler)
        // }

        return result;
    }

    deleteFromUpdateTriggers() {
        if (this.compositesFound) {
            for (let compositeIdx of this.compositesFound) {
                let replacementDeps =
                    this.dependencyHandler.updateTriggers
                        .replacementDependenciesByComposite[compositeIdx];
                if (replacementDeps) {
                    let ind = replacementDeps.indexOf(this);
                    if (ind !== -1) {
                        replacementDeps.splice(ind, 1);
                    }
                }
            }
        }

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

dependencyTypeArray.push(ReplacementDependency);

/**
 * A dependency that iterates through the unresolved path of a composite,
 * expands any composite encountered within an index,
 * and returns a list of all the component indices of the "integer" components
 * that are the indices of the unresolved path
 */
class RefResolutionIndexDependencies extends Dependency {
    static dependencyType = "refResolutionIndexDependencies";

    setUpParameters() {
        if (this.definition.compositeIdx != undefined) {
            this.compositeIdx = this.definition.compositeIdx;
            this.specifiedComponentName = this.compositeIdx;
        } else {
            this.compositeIdx = this.upstreamComponentIdx;
        }

        this.missingComponentBlockers = [];
    }

    async determineDownstreamComponents() {
        this.compositeReplacementDependencies = [];

        let composite = this.dependencyHandler._components[this.compositeIdx];

        if (!composite) {
            this.addBlockerUpdateTriggerForMissingComponent(this.compositeIdx);
            this.missingComponentBlockers.push(this.compositeIdx);

            return {
                success: false,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }

        this.componentList = [];

        const gatherResult = await this.gatherComponentsInPath(
            composite.refResolution.originalPath,
        );

        if (gatherResult.success) {
            this.componentList = gatherResult.componentList;
            return {
                success: true,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        } else {
            return {
                success: false,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }
    }

    // Iterate through the index of all parts of `originalPath`.
    // If encounter unexpanded composites, set up resolve blockers
    // so that this dependency will be resolved again once the composites are expanded.
    // Otherwise, gather all the component indices of the "integer" components into `componentList`.
    // If encountered unexpanded composites, return
    // - success: false
    // If successfully found all integer components return
    // - success: true,
    // - componentList: a list of the component indices of the "integer" components found in the unresolved path
    // Throw an error if an index of unresolved path does not contain either a string or a single integer component
    async gatherComponentsInPath(originalPath) {
        const componentList = [];
        let foundUnexpanded = false;
        for (const path_part of originalPath) {
            for (const index_part of path_part.index) {
                if (typeof index_part.value[0] !== "string") {
                    let indexComponent = index_part.value[0];

                    const haveComposite =
                        this.dependencyHandler.componentInfoObjects.isCompositeComponent(
                            {
                                componentType: indexComponent.componentType,
                                includeNonStandard: true,
                            },
                        );

                    if (haveComposite) {
                        if (!indexComponent.isExpanded) {
                            this.addBlockerForUnexpandedComposite(
                                indexComponent,
                            );

                            foundUnexpanded = true;
                        } else {
                            this.addUpdateTriggersForCompositeReplacements([
                                indexComponent.componentIdx,
                            ]);
                            this.compositeReplacementDependencies.push(
                                indexComponent.componentIdx,
                            );

                            if (indexComponent.replacements.length !== 1) {
                                throw Error(
                                    "Something went wrong as path index is not an integer",
                                );
                            }
                            indexComponent = indexComponent.replacements[0];
                        }
                    }

                    if (
                        !foundUnexpanded &&
                        indexComponent.componentType !== "integer"
                    ) {
                        throw Error(
                            "Something went wrong as path index is not an integer",
                        );
                    }

                    componentList.push(indexComponent.componentIdx);
                }
            }
        }

        if (foundUnexpanded) {
            return { success: false };
        } else {
            return {
                success: true,
                componentList,
            };
        }
    }

    async getValue() {
        const result = await super.getValue();

        result.value = this.componentList;

        // since value was not determined using actual `downstreamComponentIndices`
        // we need to manually mark it as changed each time it is computed.
        result.changes.componentIdentitiesChanged = true;

        return result;
    }

    deleteFromUpdateTriggers() {
        for (const componentIdx of this.missingComponentBlockers) {
            this.deleteUpdateTriggerForMissingComponent(componentIdx);
        }

        this.deleteUpdateTriggersForCompositeReplacements(
            this.compositeReplacementDependencies,
        );
    }
}

dependencyTypeArray.push(RefResolutionIndexDependencies);

/**
 * A dependency that attempts to resolve the `originalPath` of a `refResolution` on a composite component.
 *
 * If `refResolution.nodeIdx` has any composite descendants
 * or any indices of the path have composites, these composites are first expanded.
 * Then, the `originalPath` path is resolved using the first node of `refResolution.nodesInResolvedPath` as the origin;
 * `nodeIdx` is updated to the matched component, and `unresolvedPath` is updated to any remaining unresolved path.
 *
 * If an index is encountered (which halts the rust resolver), then
 * - if the current `nodeIdx` is a composite, then `nodeIdx` is set to the corresponding replacement of the composite
 *   and the algorithm recurses
 * - else, the algorithm terminates with the current `nodeIdx` and `unresolvedPath`.
 *
 * The dependency value returned is
 * - extendIdx: the resulting `nodeIdx`
 * - unresolvedPath: any remaining `unresolvedPath`
 * - originalPath: the original path
 */
class RefResolutionDependency extends Dependency {
    static dependencyType = "refResolution";

    setUpParameters() {
        if (this.definition.compositeIdx != undefined) {
            this.compositeIdx = this.definition.compositeIdx;
            this.specifiedComponentName = this.compositeIdx;
        } else {
            this.compositeIdx = this.upstreamComponentIdx;
        }

        this.indexDependencyValues = this.definition.indexDependencyValues;
        this.missingComponentBlockers = [];
    }

    async determineDownstreamComponents({ force = false } = {}) {
        this.compositeReplacementDependencies = [];

        let composite = this.dependencyHandler._components[this.compositeIdx];

        if (!composite) {
            this.addBlockerUpdateTriggerForMissingComponent(this.compositeIdx);
            this.missingComponentBlockers.push(this.compositeIdx);

            return {
                success: false,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }

        let nodeIdx = composite.refResolution.nodeIdx;

        // If `nodeIdx` is a component that was created via an `extend` or `copy` attribute,
        // then it was (or will be) created from a copy that has a `createComponentIdx` attribute
        // set to `nodeIdx`. In this case, we find that copy using the `createComponentIdxMapping`
        // and create blockers/triggers to potentially postpone creating this dependency
        // and update it when `nodeIdx` is created or updated.
        const componentCreatingExtendIdx =
            this.dependencyHandler.core.createComponentIdxMapping[nodeIdx];

        if (componentCreatingExtendIdx != null) {
            const compositeCreating =
                this.dependencyHandler._components[componentCreatingExtendIdx];

            if (!compositeCreating) {
                this.addUpdateTriggerForMissingComponent(
                    componentCreatingExtendIdx,
                );
                this.missingComponentBlockers.push(componentCreatingExtendIdx);

                return {
                    success: false,
                    downstreamComponentIndices: [],
                    downstreamComponentTypes: [],
                };
            }

            if (!compositeCreating.isExpanded) {
                this.addBlockerForUnexpandedComposite(compositeCreating);

                return {
                    success: false,
                    downstreamComponentIndices: [],
                    downstreamComponentTypes: [],
                };
            }

            this.compositeReplacementDependencies.push(
                compositeCreating.componentIdx,
            );
            this.addUpdateTriggersForCompositeReplacements([
                compositeCreating.componentIdx,
            ]);
        }

        // Resolve all components in the path indices to integer values
        const resolveComponentResult =
            await this.resolveComponentsInPathIndices(
                composite.refResolution.originalPath,
                force,
            );

        if (!resolveComponentResult.success) {
            return {
                success: false,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }

        this.originalPath = resolveComponentResult.path;

        const refComponent = this.dependencyHandler._components[nodeIdx];

        if (!refComponent) {
            this.addUpdateTriggerForMissingComponent(nodeIdx);
            this.missingComponentBlockers.push(nodeIdx);

            this.extendIdx = -1;
            this.unresolvedPath = this.originalPath;

            return {
                success: true,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }

        const haveComposite =
            this.dependencyHandler.componentInfoObjects.isCompositeComponent({
                componentType: refComponent.componentType,
                includeNonStandard: true,
            });

        if (haveComposite) {
            // make sure that the composite refComponent is expanded
            if (!refComponent.isExpanded) {
                this.addBlockerForUnexpandedComposite(refComponent);

                return {
                    success: false,
                    downstreamComponentIndices: [],
                    downstreamComponentTypes: [],
                };
            }

            this.compositeReplacementDependencies.push(
                refComponent.componentIdx,
            );
            this.addUpdateTriggersForCompositeReplacements([
                refComponent.componentIdx,
            ]);
        }

        let refResolution;

        /**
         * Given the ref resolution `composite.refResolution`
         * and the DoenetML string from `this.dependencyHandler.core.allDoenetMLs[0]`,
         * return the substring of DoenetML corresponding to the resolution's `originalPath`.
         */
        const getDoenetMLStringForReference = () => {
            const originalPath = composite.refResolution.originalPath;
            const startOffset = originalPath[0].position?.start.offset;
            const endOffset =
                originalPath[originalPath.length - 1].position?.end.offset;
            const sourceDoc = originalPath[0].sourceDoc ?? 0;

            let doenetMLString = "";
            if (startOffset != undefined && endOffset != undefined) {
                doenetMLString =
                    this.dependencyHandler.core.allDoenetMLs?.[
                        sourceDoc
                    ]?.substring(startOffset, endOffset) ?? "";
            }
            return doenetMLString;
        };

        // We skip parent search only if we start with no path,
        // which will happen from references to items created in a repeat
        const skip_parent_search = resolveComponentResult.path[0].name === "";

        // console.log(
        //     "resolve path",
        //     { path: resolveComponentResult.path },
        //     composite.refResolution.nodesInResolvedPath[0],
        //     skip_parent_search,
        // );

        try {
            refResolution = this.dependencyHandler.core.resolvePath(
                { path: resolveComponentResult.path },
                composite.refResolution.nodesInResolvedPath[0],
                skip_parent_search,
            );
        } catch (e) {
            // console.log("resolve error", e);
            if (e === "NonUniqueReferent" || e === "NoReferent") {
                const referenceText = getDoenetMLStringForReference();

                // TODO: these message match the messages from `format_error_message` of `ref_resolve.ts`.
                // Rather than duplicating code to make the messages,
                // we could make sure that `ref_resolve` formats the messages in this case, too.
                const message =
                    e === "NonUniqueReferent"
                        ? `Multiple referents found for reference: $${referenceText}`
                        : `No referent found for reference: $${referenceText}`;

                this.dependencyHandler.core.addErrorWarning({
                    type: "warning",
                    message,
                    position: composite.position,
                    sourceDoc: composite.sourceDoc,
                });

                this.extendIdx = -1;
                this.unresolvedPath = this.originalPath;
                return {
                    success: true,
                    downstreamComponentIndices: [],
                    downstreamComponentTypes: [],
                };
            } else {
                throw e;
            }
        }

        this.extendIdx = refResolution.nodeIdx;
        this.unresolvedPath = refResolution.unresolvedPath;

        // console.log({ refResolution });

        for (const idx of refResolution.nodesInResolvedPath) {
            const componentInvolved = this.dependencyHandler._components[idx];
            if (
                idx !== this.compositeIdx &&
                componentInvolved &&
                this.dependencyHandler.componentInfoObjects.isCompositeComponent(
                    {
                        componentType: componentInvolved.componentType,
                        includeNonStandard: true,
                    },
                )
            ) {
                this.compositeReplacementDependencies.push(
                    componentInvolved.componentIdx,
                );
                this.addUpdateTriggersForCompositeReplacements([
                    componentInvolved.componentIdx,
                ]);
            }
        }

        if (refResolution.unresolvedPath === null) {
            // No unresolved path left, so we're done

            return this.foundExtend();
        }

        if (refResolution.unresolvedPath[0].name !== "") {
            // We stopped matching on a name.
            // This name must match a prop.
            // Return the result

            return this.foundExtend();
        }

        // We stopped matching on an index of refResolution.nodeIdx
        nodeIdx = refResolution.nodeIdx;

        // Make sure the node we stopped on exists
        const newRefComponent = this.dependencyHandler._components[nodeIdx];

        if (!newRefComponent) {
            this.addUpdateTriggerForMissingComponent(nodeIdx);
            this.missingComponentBlockers.push(nodeIdx);

            return {
                success: true,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }

        if (
            this.dependencyHandler.componentInfoObjects.isCompositeComponent({
                componentType: newRefComponent.componentType,
                includeNonStandard: true,
            })
        ) {
            // We ended on a composite component with the next unresolved path being an index.
            // If the composite isn't expanded, that's the next blocker for resolving the reference.
            if (!newRefComponent.isExpanded) {
                this.addBlockerForUnexpandedComposite(newRefComponent);

                return {
                    success: false,
                    downstreamComponentIndices: [],
                    downstreamComponentTypes: [],
                };
            }

            // If the composite is expanded and yet the index did not match one of the composite's replacements,
            // then there is no replacement at that index, and we obtained no referent for the reference.
            const referenceText = getDoenetMLStringForReference();

            this.dependencyHandler.core.addErrorWarning({
                type: "warning",
                message: `No referent found for reference: $${referenceText}`,
                position: composite.position,
                sourceDoc: composite.sourceDoc,
            });

            this.compositeReplacementDependencies.push(
                newRefComponent.componentIdx,
            );
            this.addUpdateTriggersForCompositeReplacements([
                newRefComponent.componentIdx,
            ]);
        }

        return this.foundExtend();
    }

    /**
     * Given that we've successfully resolved the reference
     * and set `this.extendIdx` to the resulting node,
     * finish the determination of downstream components by
     * - checking if the component `this.extendIdx` exist and setting up a blocker if it doesn't,
     * - setting the downstream component data to that component if it does exist.
     */

    foundExtend() {
        let extendedComponent =
            this.dependencyHandler._components[this.extendIdx];

        if (!extendedComponent) {
            this.addUpdateTriggerForMissingComponent(this.extendIdx);
            this.missingComponentBlockers.push(this.extendIdx);

            return {
                success: true,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }

        if (extendedComponent.constructor.resolveToParent) {
            // replace the extended component with its parent
            this.extendIdx = extendedComponent.parentIdx;

            extendedComponent =
                this.dependencyHandler._components[this.extendIdx];

            if (!extendedComponent) {
                this.addUpdateTriggerForMissingComponent(this.extendIdx);
                this.missingComponentBlockers.push(this.extendIdx);

                return {
                    success: true,
                    downstreamComponentIndices: [],
                    downstreamComponentTypes: [],
                };
            }
        }

        return {
            success: true,
            downstreamComponentIndices: [this.extendIdx],
            downstreamComponentTypes: [extendedComponent.componentType],
        };
    }

    /**
     * Iterate through the index of all parts of `path`.
     * If any component is found, it must be an "integer".
     * Resolve its `value` state variable, which should be an integer,
     * and use its string value instead of the component.
     *
     * Note: we use strings rather than numbers for the literal indices
     * so that the unresolved path follows the `FlatPathPart` assumed by the resolver.
     */
    async resolveComponentsInPathIndices(path) {
        const pathWithResolvedIndexComponents = [];
        for (const path_part of path) {
            let index = [];
            for (const index_part of path_part.index) {
                if (typeof index_part.value[0] === "string") {
                    index.push(index_part);
                } else {
                    let indexComponent = index_part.value[0];

                    const haveComposite =
                        this.dependencyHandler.componentInfoObjects.isCompositeComponent(
                            {
                                componentType: indexComponent.componentType,
                                includeNonStandard: true,
                            },
                        );

                    if (haveComposite) {
                        if (!indexComponent.isExpanded) {
                            this.addBlockerForUnexpandedComposite(
                                indexComponent,
                            );

                            return {
                                success: false,
                            };
                        }

                        this.addUpdateTriggersForCompositeReplacements([
                            indexComponent.componentIdx,
                        ]);
                        this.compositeReplacementDependencies.push(
                            indexComponent.componentIdx,
                        );

                        if (indexComponent.replacements.length !== 1) {
                            throw Error(
                                "Something went wrong as path index is not an integer",
                            );
                        }
                        indexComponent = indexComponent.replacements[0];
                    }

                    if (indexComponent.componentType !== "integer") {
                        throw Error(
                            "Something went wrong as path index is not an integer",
                        );
                    }

                    // save index as a literal string
                    index.push({
                        value: [
                            this.indexDependencyValues[
                                indexComponent.componentIdx
                            ].toString(),
                        ],
                        position: index_part.position,
                        sourceDoc: index_part.sourceDoc,
                    });
                }
            }

            pathWithResolvedIndexComponents.push({
                name: path_part.name,
                index,
                position: path_part.position,
                sourceDoc: path_part.sourceDoc,
            });
        }

        return {
            success: true,
            path: pathWithResolvedIndexComponents,
        };
    }

    async getValue() {
        const result = await super.getValue();

        result.value = {
            extendIdx: this.extendIdx ?? -1,
            unresolvedPath: this.unresolvedPath,
            originalPath: this.originalPath,
        };

        return result;
    }

    deleteFromUpdateTriggers() {
        for (const componentIdx of this.missingComponentBlockers) {
            this.deleteUpdateTriggerForMissingComponent(componentIdx);
        }

        this.deleteUpdateTriggersForCompositeReplacements(
            this.compositeReplacementDependencies,
        );
    }
}

dependencyTypeArray.push(RefResolutionDependency);

/**
 * A dependency that gives the resolutions of references from an attribute
 * that was marked `createReferences: true`.
 *
 * Any plain strings in the attribute are ignored. Returns an array
 * with an entry for each reference, such as `$x`, found in the attribute.
 * Each entry has the fields:
 * - componentIdx: the index of the component that the reference resolved to,
 *   or `undefined` if no referent was found
 * - unresolvedPath: any unresolved path remaining after `componentIdx` was resolved
 * - originalPath: the original path corresponding to the given reference
 */
class AttributeRefResolutions extends Dependency {
    static dependencyType = "attributeRefResolutions";

    setUpParameters() {
        if (this.definition.parentIdx != undefined) {
            this.parentIdx = this.definition.parentIdx;
            this.specifiedComponentName = this.parentIdx;
        } else {
            this.parentIdx = this.upstreamComponentIdx;
        }

        this.attributeName = this.definition.attributeName;

        this.originalDownstreamVariableNames = [
            "extendIdx",
            "unresolvedPath",
            "originalPath",
        ];

        this.missingComponentBlockers = [];

        this.extendIndicesResolved = [];
    }

    async determineDownstreamComponents() {
        let parent = this.dependencyHandler._components[this.parentIdx];

        if (!parent) {
            this.addBlockerUpdateTriggerForMissingComponent(this.parentIdx);
            this.missingComponentBlockers.push(this.parentIdx);

            return {
                success: false,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }

        let attribute = parent.attributes[this.attributeName];

        if (attribute?.references) {
            this.foundAttribute = true;
            return {
                success: true,
                downstreamComponentIndices: attribute.references.map(
                    (comp) => comp.componentIdx,
                ),
                downstreamComponentTypes: attribute.references.map(
                    (comp) => comp.componentType,
                ),
            };
        } else {
            this.foundAttribute = false;
            return {
                success: true,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }
    }
    async getValue() {
        const result = await super.getValue();

        const newValue = [];

        for (const comp of result.value) {
            const extendIdx = comp.stateValues.extendIdx;

            newValue.push({
                componentIdx: extendIdx,
                unresolvedPath: comp.stateValues.unresolvedPath,
                originalPath: comp.stateValues.originalPath,
            });

            if (extendIdx !== -1) {
                if (!this.extendIndicesResolved.includes(extendIdx)) {
                    this.extendIndicesResolved.push(extendIdx);

                    // add this dependency to the list of attributeRefResolution dependencies
                    // for the referenced component
                    let attributeRefResolutionDeps =
                        this.dependencyHandler
                            .attributeRefResolutionDependenciesByReferenced[
                            extendIdx
                        ];
                    if (!attributeRefResolutionDeps) {
                        attributeRefResolutionDeps =
                            this.dependencyHandler.attributeRefResolutionDependenciesByReferenced[
                                extendIdx
                            ] = [];
                    }
                    attributeRefResolutionDeps.push({
                        dependency: this,
                        composite: comp,
                    });
                }

                // if any componentsReferencingAttribute dependencies exist for this extendIdx,
                // then add blockers to recalculate them
                if (
                    this.dependencyHandler.updateTriggers
                        .componentsReferencingAttributeByReferenced[extendIdx]
                ) {
                    for (let dep of this.dependencyHandler.updateTriggers
                        .componentsReferencingAttributeByReferenced[
                        extendIdx
                    ]) {
                        for (let varName of dep.upstreamVariableNames) {
                            await this.dependencyHandler.addBlocker({
                                blockerComponentIdx: dep.upstreamComponentIdx,
                                blockerType: "recalculateDownstreamComponents",
                                blockerStateVariable: varName,
                                blockerDependency: dep.dependencyName,
                                componentIdxBlocked: dep.upstreamComponentIdx,
                                typeBlocked: "stateVariable",
                                stateVariableBlocked: varName,
                            });
                        }
                        await this.dependencyHandler.addBlockersFromChangedStateVariableDependencies(
                            {
                                componentIdx: dep.upstreamComponentIdx,
                                stateVariables: dep.upstreamVariableNames,
                            },
                        );
                    }
                }
            }
        }

        result.value = newValue;
        result.usedDefault = !this.foundAttribute;

        return result;
    }

    deleteFromUpdateTriggers() {
        for (const componentIdx of this.missingComponentBlockers) {
            this.deleteUpdateTriggerForMissingComponent(componentIdx);
        }

        // delete this dependency from the list of attributeRefResolution dependencies
        // for each referenced component
        for (const extendIdx of this.extendIndicesResolved) {
            let attributeRefResolutionDeps =
                this.dependencyHandler
                    .attributeRefResolutionDependenciesByReferenced[extendIdx];
            if (attributeRefResolutionDeps) {
                let ind = attributeRefResolutionDeps.findIndex(
                    (entry) => entry.dependency === this,
                );
                if (ind !== -1) {
                    attributeRefResolutionDeps.splice(ind, 1);
                }
            }
        }
    }
}

dependencyTypeArray.push(AttributeRefResolutions);

/**
 * A dependency that gives the list of components that reference
 * a given component via an attribute that was marked `createReferences: true`.
 *
 * Any plain strings in the attribute are ignored. Returns an array
 * with an entry for each component that references the given component.
 */
class ComponentsReferencingAttributeDependency extends Dependency {
    static dependencyType = "componentsReferencingAttribute";

    setUpParameters() {
        if (this.definition.referencedIdx != undefined) {
            this.referencedIdx = this.definition.referencedIdx;
            this.specifiedComponentName = this.referencedIdx;
        } else {
            this.referencedIdx = this.upstreamComponentIdx;
        }

        this.attributeName = this.definition.attributeName;

        this.allowUnresolvedPath = this.definition.allowUnresolvedPath || false;

        this.missingComponentBlockers = [];
    }

    async determineDownstreamComponents() {
        let referencedComponent =
            this.dependencyHandler._components[this.referencedIdx];

        if (!referencedComponent) {
            this.addBlockerUpdateTriggerForMissingComponent(this.referencedIdx);
            this.missingComponentBlockers.push(this.referencedIdx);

            return {
                success: false,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }

        let attributeRefResolutionDeps =
            this.dependencyHandler
                .attributeRefResolutionDependenciesByReferenced[
                this.referencedIdx
            ];

        if (
            !this.dependencyHandler.updateTriggers
                .componentsReferencingAttributeByReferenced[this.referencedIdx]
        ) {
            this.dependencyHandler.updateTriggers.componentsReferencingAttributeByReferenced[
                this.referencedIdx
            ] = [];
        }
        this.dependencyHandler.updateTriggers.componentsReferencingAttributeByReferenced[
            this.referencedIdx
        ].push(this);

        if (attributeRefResolutionDeps) {
            if (!this.allowUnresolvedPath) {
                attributeRefResolutionDeps = attributeRefResolutionDeps.filter(
                    (entry) =>
                        entry.composite.stateValues.unresolvedPath === null,
                );
            }

            if (this.attributeName) {
                attributeRefResolutionDeps = attributeRefResolutionDeps.filter(
                    (entry) =>
                        entry.dependency.attributeName === this.attributeName,
                );
            }

            const downstreamComponentIndices = [];
            const downstreamComponentTypes = [];

            for (const entry of attributeRefResolutionDeps) {
                const parentIdx = entry.dependency.parentIdx;
                const parent = this.dependencyHandler._components[parentIdx];
                if (parent) {
                    downstreamComponentIndices.push(parentIdx);
                    downstreamComponentTypes.push(parent.componentType);
                }
            }

            return {
                success: true,
                downstreamComponentIndices: downstreamComponentIndices,
                downstreamComponentTypes: downstreamComponentTypes,
            };
        }

        return {
            success: false,
            downstreamComponentIndices: [],
            downstreamComponentTypes: [],
        };
    }

    deleteFromUpdateTriggers() {
        for (const componentIdx of this.missingComponentBlockers) {
            this.deleteUpdateTriggerForMissingComponent(componentIdx);
        }
    }
}

dependencyTypeArray.push(ComponentsReferencingAttributeDependency);

/**
 * A dependency that gives the (non-blank) strings from an attribute
 * that was marked `createReferences: true`.
 *
 * Such a attribute is generally used to extract references such as `$x`.
 * However, in some cases, one may want to use the same attribute for references
 * or for other string content. For such a case, this `StringsFromReferenceAttribute`
 * will give the strings that were added to the attribute, ignoring any references.
 */
class StringsFromReferenceAttribute extends Dependency {
    static dependencyType = "stringsFromReferenceAttribute";

    setUpParameters() {
        if (this.definition.parentIdx != undefined) {
            this.parentIdx = this.definition.parentIdx;
            this.specifiedComponentName = this.parentIdx;
        } else {
            this.parentIdx = this.upstreamComponentIdx;
        }

        this.attributeName = this.definition.attributeName;

        this.missingComponentBlockers = [];
    }

    async determineDownstreamComponents() {
        let parent = this.dependencyHandler._components[this.parentIdx];

        if (!parent) {
            this.addBlockerUpdateTriggerForMissingComponent(this.parentIdx);
            this.missingComponentBlockers.push(this.parentIdx);

            return {
                success: false,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }

        let attribute = parent.attributes[this.attributeName];

        if (attribute?.references) {
            this.attributeStrings = [...attribute.stringChildren];
        } else {
            this.attributeStrings = null;
        }
        return {
            success: true,
            downstreamComponentIndices: [],
            downstreamComponentTypes: [],
        };
    }

    async getValue() {
        return {
            value: this.attributeStrings,
            changes: {},
        };
    }

    deleteFromUpdateTriggers() {
        for (const componentIdx of this.missingComponentBlockers) {
            this.deleteUpdateTriggerForMissingComponent(componentIdx);
        }
    }
}

dependencyTypeArray.push(StringsFromReferenceAttribute);

/**
 * A dependency that gives the `rendererId` of the specified component,
 * where `rendererId` is the `rootName` of the component, if it exists,
 * else "_id_" followed by the `componentIdx` as a string.
 *
 * The `rootName` is the simplest unique reference to the component
 * when the document root is the origin. As `rootName` is designed to be
 * a HTML id, indices are represented with `:`. For example,
 * if `$a.b[2][3].c` is the simplest reference to a component from the root,
 * then its root name will be `a.b:2:3.c`.
 *
 * If a component was adapted from another component,
 * then the `renderedId` of the original component is used instead,
 * as that corresponds to the component that was authored.
 */
class RendererId extends Dependency {
    static dependencyType = "rendererId";

    setUpParameters() {
        this.componentIdx = this.definition.componentIdx;
        this.specifiedComponentName = this.componentIdx;

        this.missingComponentBlockers = [];
    }

    async determineDownstreamComponents() {
        this.component = this.dependencyHandler._components[this.componentIdx];

        if (!this.component) {
            this.addBlockerUpdateTriggerForMissingComponent(this.componentIdx);
            this.missingComponentBlockers.push(this.componentIdx);

            return {
                success: false,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }

        return {
            success: true,
            downstreamComponentIndices: [],
            downstreamComponentTypes: [],
        };
    }

    async getValue() {
        if (this.component) {
            return {
                value: this.dependencyHandler.core.getRendererId(
                    this.component,
                ),
                changes: {},
            };
        } else {
            return {
                value: "",
                changes: {},
            };
        }
    }

    deleteFromUpdateTriggers() {
        for (const componentIdx of this.missingComponentBlockers) {
            this.deleteUpdateTriggerForMissingComponent(componentIdx);
        }
    }
}

dependencyTypeArray.push(RendererId);

class SourceCompositeStateVariableDependency extends Dependency {
    static dependencyType = "sourceCompositeStateVariable";

    setUpParameters() {
        if (this.definition.replacementIdx != undefined) {
            this.replacementIdx = this.definition.replacementIdx;
            this.specifiedComponentName = this.replacementIdx;
        } else {
            this.replacementIdx = this.upstreamComponentIdx;
        }

        if (!this.definition.variableName) {
            throw Error(
                `Invalid state variable ${this.representativeStateVariable} of ${this.upstreamComponentIdx}, dependency ${this.dependencyName}: must have a variableName`,
            );
        } else {
            this.originalDownstreamVariableNames = [
                this.definition.variableName,
            ];
        }

        if (this.definition.compositeComponentType) {
            this.compositeComponentType =
                this.definition.compositeComponentType;
        }

        // If `skipCopies` is set, then if the sourceComposite is a `_copy`,
        // instead use the component that the source composite extends.
        // If that component is not a composite, then don't return anything.
        if (this.definition.skipCopies) {
            this.skipCopies = this.definition.skipCopies;
        }

        this.returnSingleVariableValue = true;

        // for source composite state variable
        // always make variables optional so that don't get error
        // depending on source composite (which a component can't control)
        this.variablesOptional = true;
    }

    async determineDownstreamComponents() {
        let replacement =
            this.dependencyHandler._components[this.replacementIdx];

        if (!replacement) {
            let dependenciesMissingComponent =
                this.dependencyHandler.updateTriggers
                    .dependenciesMissingComponentBySpecifiedName[
                    this.replacementIdx
                ];
            if (!dependenciesMissingComponent) {
                dependenciesMissingComponent =
                    this.dependencyHandler.updateTriggers.dependenciesMissingComponentBySpecifiedName[
                        this.replacementIdx
                    ] = [];
            }
            if (!dependenciesMissingComponent.includes(this)) {
                dependenciesMissingComponent.push(this);
            }

            for (let varName of this.upstreamVariableNames) {
                await this.dependencyHandler.addBlocker({
                    blockerComponentIdx: this.replacementIdx,
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

        if (!replacement.replacementOf) {
            return {
                success: true,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }

        let sourceComposite = replacement.replacementOf;

        if (this.compositeComponentType) {
            while (
                !this.dependencyHandler.componentInfoObjects.isInheritedComponentType(
                    {
                        inheritedComponentType: sourceComposite.componentType,
                        baseComponentType: this.compositeComponentType,
                    },
                )
            ) {
                if (sourceComposite.replacementOf) {
                    sourceComposite = sourceComposite.replacementOf;
                } else {
                    return {
                        success: true,
                        downstreamComponentIndices: [],
                        downstreamComponentTypes: [],
                    };
                }
            }
        } else if (this.skipCopies) {
            while (sourceComposite.componentType === "_copy") {
                const extendedComponent =
                    await sourceComposite.stateValues.extendedComponent;
                if (
                    extendedComponent &&
                    this.dependencyHandler.componentInfoObjects.isCompositeComponent(
                        { componentType: extendedComponent.componentType },
                    )
                ) {
                    sourceComposite =
                        this.dependencyHandler.components[
                            extendedComponent.componentIdx
                        ];
                } else {
                    return {
                        success: true,
                        downstreamComponentIndices: [],
                        downstreamComponentTypes: [],
                    };
                }
            }
        }

        return {
            success: true,
            downstreamComponentIndices: [sourceComposite.componentIdx],
            downstreamComponentTypes: [sourceComposite.componentType],
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

dependencyTypeArray.push(SourceCompositeStateVariableDependency);

class SourceCompositeIdentityDependency extends Dependency {
    static dependencyType = "sourceCompositeIdentity";

    setUpParameters() {
        if (this.definition.replacementIdx != undefined) {
            this.replacementIdx = this.definition.replacementIdx;
            this.specifiedComponentName = this.replacementIdx;
        } else {
            this.replacementIdx = this.upstreamComponentIdx;
        }

        this.returnSingleComponent = true;
    }

    async determineDownstreamComponents() {
        let replacement =
            this.dependencyHandler._components[this.replacementIdx];

        if (!replacement) {
            let dependenciesMissingComponent =
                this.dependencyHandler.updateTriggers
                    .dependenciesMissingComponentBySpecifiedName[
                    this.replacementIdx
                ];
            if (!dependenciesMissingComponent) {
                dependenciesMissingComponent =
                    this.dependencyHandler.updateTriggers.dependenciesMissingComponentBySpecifiedName[
                        this.replacementIdx
                    ] = [];
            }
            if (!dependenciesMissingComponent.includes(this)) {
                dependenciesMissingComponent.push(this);
            }

            for (let varName of this.upstreamVariableNames) {
                await this.dependencyHandler.addBlocker({
                    blockerComponentIdx: this.replacementIdx,
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

        if (!replacement.replacementOf) {
            return {
                success: true,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }

        let sourceComposite = replacement.replacementOf;

        return {
            success: true,
            downstreamComponentIndices: [sourceComposite.componentIdx],
            downstreamComponentTypes: [sourceComposite.componentType],
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

dependencyTypeArray.push(SourceCompositeIdentityDependency);

class ShadowSourceStateVariableDependency extends Dependency {
    static dependencyType = "shadowSourceStateVariable";

    setUpParameters() {
        if (this.definition.componentIdx != undefined) {
            this.componentIdx = this.definition.componentIdx;
            this.specifiedComponentName = this.componentIdx;
        } else {
            this.componentIdx = this.upstreamComponentIdx;
        }

        if (!this.definition.variableName) {
            throw Error(
                `Invalid state variable ${this.representativeStateVariable} of ${this.upstreamComponentIdx}, dependency ${this.dependencyName}: must have a variableName`,
            );
        } else {
            this.originalDownstreamVariableNames = [
                this.definition.variableName,
            ];
        }

        this.returnSingleVariableValue = true;

        // for shadow source
        // always make variables optional so that don't get error
        // depending on shadow source (which a component can't control)
        this.variablesOptional = true;
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

        if (!component.shadows) {
            return {
                success: true,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }

        let shadowSourceComponentIdx = component.shadows.componentIdx;
        let shadowSource =
            this.dependencyHandler._components[shadowSourceComponentIdx];

        if (!shadowSource) {
            return {
                success: true,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }

        return {
            success: true,
            downstreamComponentIndices: [shadowSource.componentIdx],
            downstreamComponentTypes: [shadowSource.componentType],
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

dependencyTypeArray.push(ShadowSourceStateVariableDependency);

class ShadowSourceDependency extends Dependency {
    static dependencyType = "shadowSource";

    setUpParameters() {
        if (this.definition.componentIdx != undefined) {
            this.componentIdx = this.definition.componentIdx;
            this.specifiedComponentName = this.componentIdx;
        } else {
            this.componentIdx = this.upstreamComponentIdx;
        }

        if (this.definition.variableNames) {
            if (!Array.isArray(this.definition.variableNames)) {
                throw Error(
                    `Invalid state variable ${this.representativeStateVariable} of ${this.upstreamComponentIdx}, dependency ${this.dependencyName}: variableNames must be an array`,
                );
            }
            this.originalDownstreamVariableNames =
                this.definition.variableNames;
        } else {
            this.originalDownstreamVariableNames = [];
        }

        this.returnSingleComponent = true;

        // for shadow source
        // always make variables optional so that don't get error
        // depending on shadow source (which a component can't control)
        this.variablesOptional = true;

        this.givePropVariableValue = this.definition.givePropVariableValue;
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

        if (!component.shadows) {
            return {
                success: true,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }

        if (
            component.shadows.propVariable &&
            !component.shadows.fromImplicitProp
        ) {
            if (!this.givePropVariableValue) {
                // If `givePropVariableValue` not specified,
                // only get sources that are shadowed without propVariable
                // unless from implicit prop
                return {
                    success: true,
                    downstreamComponentIndices: [],
                    downstreamComponentTypes: [],
                };
            } else {
                // if `givePropVariableValue` is specified,
                // then add prop variable to variable names
                if (
                    !this.originalDownstreamVariableNames.includes(
                        component.shadows.propVariable,
                    )
                ) {
                    this.originalDownstreamVariableNames.push(
                        component.shadows.propVariable,
                    );
                }
            }
        }

        let shadowSourceComponentIdx = component.shadows.componentIdx;
        let shadowSource =
            this.dependencyHandler._components[shadowSourceComponentIdx];

        if (!shadowSource) {
            return {
                success: true,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }

        return {
            success: true,
            downstreamComponentIndices: [shadowSource.componentIdx],
            downstreamComponentTypes: [shadowSource.componentType],
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

dependencyTypeArray.push(ShadowSourceDependency);

class UnlinkedCopySourceDependency extends Dependency {
    static dependencyType = "unlinkedCopySource";

    setUpParameters() {
        if (this.definition.componentIdx != undefined) {
            this.componentIdx = this.definition.componentIdx;
            this.specifiedComponentName = this.componentIdx;
        } else {
            this.componentIdx = this.upstreamComponentIdx;
        }

        if (this.definition.variableNames) {
            if (!Array.isArray(this.definition.variableNames)) {
                throw Error(
                    `Invalid state variable ${this.representativeStateVariable} of ${this.upstreamComponentIdx}, dependency ${this.dependencyName}: variableNames must be an array`,
                );
            }
            this.originalDownstreamVariableNames =
                this.definition.variableNames;
        } else {
            this.originalDownstreamVariableNames = [];
        }

        this.returnSingleComponent = true;

        // for shadow source
        // always make variables optional so that don't get error
        // depending on shadow source (which a component can't control)
        this.variablesOptional = true;
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

        if (!component.unlinkedCopySource) {
            return {
                success: true,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }

        let unlinkedCopySourceComponentIdx = component.unlinkedCopySource;
        let unlinkedCopySource =
            this.dependencyHandler._components[unlinkedCopySourceComponentIdx];

        if (!unlinkedCopySource) {
            return {
                success: true,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }

        return {
            success: true,
            downstreamComponentIndices: [unlinkedCopySource.componentIdx],
            downstreamComponentTypes: [unlinkedCopySource.componentType],
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

dependencyTypeArray.push(UnlinkedCopySourceDependency);

class PrimaryShadowDependency extends Dependency {
    static dependencyType = "primaryShadow";

    setUpParameters() {
        if (this.definition.componentIdx != undefined) {
            this.componentIdx = this.definition.componentIdx;
            this.specifiedComponentName = this.componentIdx;
        } else {
            this.componentIdx = this.upstreamComponentIdx;
        }

        if (this.definition.variableNames) {
            if (!Array.isArray(this.definition.variableNames)) {
                throw Error(
                    `Invalid state variable ${this.representativeStateVariable} of ${this.upstreamComponentIdx}, dependency ${this.dependencyName}: variableNames must be an array`,
                );
            }
            this.originalDownstreamVariableNames =
                this.definition.variableNames;
        } else {
            this.originalDownstreamVariableNames = [];
        }

        this.returnSingleComponent = true;

        // for primary shadow
        // always make variables optional so that don't get error
        // depending on primary shadow (which a component can't control)
        this.variablesOptional = true;
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

        let primaryShadowDependencies =
            this.dependencyHandler.updateTriggers.primaryShadowDependencies[
                this.componentIdx
            ];
        if (!primaryShadowDependencies) {
            primaryShadowDependencies =
                this.dependencyHandler.updateTriggers.primaryShadowDependencies[
                    this.componentIdx
                ] = [];
        }
        if (!primaryShadowDependencies.includes(this)) {
            primaryShadowDependencies.push(this);
        }

        if (!component.primaryShadow) {
            return {
                success: true,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }

        let primaryShadowComponentIdx = component.primaryShadow;
        let primaryShadow =
            this.dependencyHandler._components[primaryShadowComponentIdx];

        if (!primaryShadow) {
            return {
                success: true,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }

        return {
            success: true,
            downstreamComponentIndices: [primaryShadow.componentIdx],
            downstreamComponentTypes: [primaryShadow.componentType],
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

dependencyTypeArray.push(PrimaryShadowDependency);

class AdapterSourceStateVariableDependency extends Dependency {
    static dependencyType = "adapterSourceStateVariable";

    setUpParameters() {
        if (this.definition.componentIdx != undefined) {
            this.componentIdx = this.definition.componentIdx;
            this.specifiedComponentName = this.componentIdx;
        } else {
            this.componentIdx = this.upstreamComponentIdx;
        }

        if (!this.definition.variableName) {
            throw Error(
                `Invalid state variable ${this.representativeStateVariable} of ${this.upstreamComponentIdx}, dependency ${this.dependencyName}: must have a variableName`,
            );
        } else {
            this.originalDownstreamVariableNames = [
                this.definition.variableName,
            ];
        }

        this.returnSingleVariableValue = true;

        // for adaptor source state variable
        // always make variables optional so that don't get error
        // depending on adaptor source (which a component can't control)
        this.variablesOptional = true;
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

        if (!component.adaptedFrom) {
            return {
                success: true,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }

        let sourceComposite = component.adaptedFrom;

        return {
            success: true,
            downstreamComponentIndices: [sourceComposite.componentIdx],
            downstreamComponentTypes: [sourceComposite.componentType],
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

dependencyTypeArray.push(AdapterSourceStateVariableDependency);

class AdapterSourceDependency extends Dependency {
    static dependencyType = "adapterSource";

    setUpParameters() {
        if (this.definition.componentIdx != undefined) {
            this.componentIdx = this.definition.componentIdx;
            this.specifiedComponentName = this.componentIdx;
        } else {
            this.componentIdx = this.upstreamComponentIdx;
        }

        if (this.definition.variableNames) {
            if (!Array.isArray(this.definition.variableNames)) {
                throw Error(
                    `Invalid state variable ${this.representativeStateVariable} of ${this.upstreamComponentIdx}, dependency ${this.dependencyName}: variableNames must be an array`,
                );
            }
            this.originalDownstreamVariableNames =
                this.definition.variableNames;
        } else {
            this.originalDownstreamVariableNames = [];
        }

        this.returnSingleComponent = true;

        // for adaptor source state variable
        // always make variables optional so that don't get error
        // depending on adaptor source (which a component can't control)
        this.variablesOptional = true;
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

        if (!component.adaptedFrom) {
            return {
                success: true,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }

        let sourceComposite = component.adaptedFrom;

        return {
            success: true,
            downstreamComponentIndices: [sourceComposite.componentIdx],
            downstreamComponentTypes: [sourceComposite.componentType],
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

dependencyTypeArray.push(AdapterSourceDependency);

class CountAmongSiblingsDependency extends Dependency {
    static dependencyType = "countAmongSiblings";

    setUpParameters() {
        if (this.definition.componentIdx != undefined) {
            this.componentIdx = this.definition.componentIdx;
            this.specifiedComponentName = this.componentIdx;
        } else {
            this.componentIdx = this.upstreamComponentIdx;
        }
        if (this.definition.componentType) {
            this.componentType = this.definition.componentType;
        } else if (this.definition.sameType) {
            this.sameType = true;
        }

        this.includeInheritedComponentTypes = Boolean(
            this.definition.includeInheritedComponentTypes,
        );
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

        if (component.parentIdx == undefined) {
            console.warn(
                `component ${this.componentIdx} does not have a parent for state variable ${this.representativeStateVariable} of ${this.upstreamComponentIdx}, dependency ${this.dependencyName}.`,
            );
            return {
                success: true,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }

        this.parentIdx = component.parentIdx;
        let parent = this.dependencyHandler._components[this.parentIdx];

        if (!parent) {
            // Note: since parent is created after children,
            // will typically hit this condition first time through
            let dependenciesMissingComponent =
                this.dependencyHandler.updateTriggers
                    .dependenciesMissingComponentBySpecifiedName[
                    this.parentIdx
                ];
            if (!dependenciesMissingComponent) {
                dependenciesMissingComponent =
                    this.dependencyHandler.updateTriggers.dependenciesMissingComponentBySpecifiedName[
                        this.parentIdx
                    ] = [];
            }
            if (!dependenciesMissingComponent.includes(this)) {
                dependenciesMissingComponent.push(this);
            }

            for (let varName of this.upstreamVariableNames) {
                await this.dependencyHandler.addBlocker({
                    blockerComponentIdx: this.parentIdx,
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

        let childDependencies =
            this.dependencyHandler.updateTriggers.childDependenciesByParent[
                this.parentIdx
            ];
        if (!childDependencies) {
            childDependencies =
                this.dependencyHandler.updateTriggers.childDependenciesByParent[
                    this.parentIdx
                ] = [];
        }
        if (!childDependencies.includes(this)) {
            childDependencies.push(this);
        }

        if (!parent.childrenMatched) {
            let canProceedWithPlaceholders =
                parent.childrenMatchedWithPlaceholders;

            if (!canProceedWithPlaceholders) {
                let haveCompositesNotReady =
                    parent.unexpandedCompositesNotReady.length > 0;

                if (
                    !haveCompositesNotReady &&
                    parent.unexpandedCompositesReady.length > 0
                ) {
                    // could make progress just by expanding composites and
                    // then recalculating the downstream components
                    for (let varName of this.upstreamVariableNames) {
                        await this.dependencyHandler.addBlocker({
                            blockerComponentIdx: this.parentIdx,
                            blockerType: "childMatches",
                            blockerStateVariable: varName, // add so that can have different blockers of child logic
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

                if (haveCompositesNotReady) {
                    for (let varName of this.upstreamVariableNames) {
                        await this.dependencyHandler.addBlocker({
                            blockerComponentIdx: this.parentIdx,
                            blockerType: "childMatches",
                            blockerStateVariable: varName, // add so that can have different blockers of child logic
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

                    // mark that child logic is blocked by
                    // the readyToExpandWhenResolved state variable of the composites not ready

                    for (let compositeNotReady of parent.unexpandedCompositesNotReady) {
                        for (let varName of this.upstreamVariableNames) {
                            await this.dependencyHandler.addBlocker({
                                blockerComponentIdx: compositeNotReady,
                                blockerType: "stateVariable",
                                blockerStateVariable:
                                    "readyToExpandWhenResolved",
                                componentIdxBlocked: this.upstreamComponentIdx,
                                typeBlocked: "childMatches",
                                stateVariableBlocked: varName, // add to just block for this variable
                            });
                        }
                    }

                    return {
                        success: false,
                        downstreamComponentIndices: [],
                        downstreamComponentTypes: [],
                    };
                }
            }
        }

        // TODO: do we need this to actually depend on siblings?
        // Or is the update trigger enough to handle all needed updates?
        // Removed dependence on siblings so works even if they are placeholders
        return {
            success: true,
            // downstreamComponentIndices: parent.activeChildren.map(x => x.componentIdx),
            // downstreamComponentTypes: parent.activeChildren.map(x => x.componentType),
            downstreamComponentIndices: [],
            downstreamComponentTypes: [],
        };
    }

    deleteFromUpdateTriggers() {
        let childDeps =
            this.dependencyHandler.updateTriggers.childDependenciesByParent[
                this.parentIdx
            ];
        if (childDeps) {
            let ind = childDeps.indexOf(this);
            if (ind !== -1) {
                childDeps.splice(ind, 1);
            }
        }

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

        let dependenciesMissingComponent =
            this.dependencyHandler.updateTriggers
                .dependenciesMissingComponentBySpecifiedName[this.parentIdx];
        if (dependenciesMissingComponent) {
            let ind = dependenciesMissingComponent.indexOf(this);
            if (ind !== -1) {
                dependenciesMissingComponent.splice(ind, 1);
            }
        }
    }

    async getValue() {
        let childComponentType;
        if (this.componentType) {
            childComponentType = this.componentType;
        } else if (this.sameType) {
            childComponentType =
                this.dependencyHandler.components[this.upstreamComponentIdx]
                    .componentType;
        }

        let children =
            this.dependencyHandler.components[this.parentIdx].activeChildren;
        if (childComponentType) {
            if (this.includeInheritedComponentTypes) {
                children = children.filter((x) =>
                    this.dependencyHandler.componentInfoObjects.isInheritedComponentType(
                        {
                            inheritedComponentType: x.componentType,
                            baseComponentType: childComponentType,
                        },
                    ),
                );
            } else {
                children = children.filter(
                    (x) => x.componentType === childComponentType,
                );
            }
        }

        // This could be 0 if the component doesn't match the specified componentType
        let value =
            children
                .map((x) => x.componentIdx)
                .indexOf(this.upstreamComponentIdx) + 1;

        // if `initializeCounters` was passed into core with a key that matches the component type
        // then increment `value` so that the first instance would yield that initial counter.
        if (this.parentIdx === this.dependencyHandler.core.documentIdx) {
            let initializeCounters =
                this.dependencyHandler.core.initializeCounters;

            if (this.includeInheritedComponentTypes) {
                // if we are including inherited component types,
                // then just use the first counter found and skip any additional counters
                // (where the order encountered is arbitrary)
                for (let cType in initializeCounters) {
                    if (
                        this.dependencyHandler.componentInfoObjects.isInheritedComponentType(
                            {
                                inheritedComponentType: cType,
                                baseComponentType: childComponentType,
                            },
                        )
                    ) {
                        value += initializeCounters[cType] - 1;
                        break;
                    }
                }
            } else {
                let initialCounter = initializeCounters[childComponentType];
                if (initialCounter) {
                    value += initialCounter - 1;
                }
            }
        }

        // don't need changes, as it is changed directly from core
        // and then upstream variables are marked as changed
        return { value, changes: {} };
    }
}

dependencyTypeArray.push(CountAmongSiblingsDependency);

class ValueDependency extends Dependency {
    static dependencyType = "value";

    setUpParameters() {
        this.value = this.definition.value;
    }

    async getValue() {
        return {
            value: this.value,
            changes: {},
        };
    }
}

dependencyTypeArray.push(ValueDependency);

class FlagDependency extends ValueDependency {
    static dependencyType = "flag";

    setUpParameters() {
        this.flagName = this.definition.flagName;
        this.value = this.dependencyHandler.core.flags[this.flagName];
    }
}

dependencyTypeArray.push(FlagDependency);

class DoenetAttributeDependency extends StateVariableDependency {
    static dependencyType = "doenetAttribute";

    setUpParameters() {
        this.attributeName = this.definition.attributeName;

        if (this.definition.componentIdx != undefined) {
            this.componentIdx = this.definition.componentIdx;
            this.specifiedComponentName = this.componentIdx;
        } else {
            this.componentIdx = this.upstreamComponentIdx;
        }
    }

    async getValue() {
        let value = null;
        let changes = {};

        if (this.componentIdentitiesChanged) {
            changes.componentIdentitiesChanged = true;
            this.componentIdentitiesChanged = false;
        }

        if (this.downstreamComponentIndices.length === 1) {
            let depComponent =
                this.dependencyHandler.components[
                    this.downstreamComponentIndices[0]
                ];

            value = depComponent.doenetAttributes[this.attributeName];
        }

        // if (!this.doNotProxy && value !== null && typeof value === 'object') {
        //   value = new Proxy(value, readOnlyProxyHandler)
        // }

        return { value, changes };
    }
}

dependencyTypeArray.push(DoenetAttributeDependency);

// TODO: added this dependency but then didn't use it.
// Delete if don't end up using it.
class ExtendingDependency extends StateVariableDependency {
    static dependencyType = "extending";

    setUpParameters() {
        if (this.definition.componentIdx != undefined) {
            this.componentIdx = this.definition.componentIdx;
            this.specifiedComponentName = this.componentIdx;
        } else {
            this.componentIdx = this.upstreamComponentIdx;
        }
    }

    async getValue() {
        let value = null;
        let changes = {};

        if (this.componentIdentitiesChanged) {
            changes.componentIdentitiesChanged = true;
            this.componentIdentitiesChanged = false;
        }

        if (this.downstreamComponentIndices.length === 1) {
            let depComponent =
                this.dependencyHandler.components[
                    this.downstreamComponentIndices[0]
                ];

            value = depComponent.extending;
        }

        return { value, changes };
    }
}

dependencyTypeArray.push(ExtendingDependency);

class AttributePrimitiveDependency extends StateVariableDependency {
    static dependencyType = "attributePrimitive";

    setUpParameters() {
        this.attributeName = this.definition.attributeName;

        if (this.definition.parentIdx != undefined) {
            this.componentIdx = this.definition.parentIdx;
            this.specifiedComponentName = this.componentIdx;
        } else {
            this.componentIdx = this.upstreamComponentIdx;
        }
    }

    async getValue() {
        let value = null;
        let changes = {};

        if (this.componentIdentitiesChanged) {
            changes.componentIdentitiesChanged = true;
            this.componentIdentitiesChanged = false;
        }

        if (this.downstreamComponentIndices.length === 1) {
            let parent = this.dependencyHandler.components[this.componentIdx];

            if (parent) {
                value = parent.attributes[this.attributeName];
                if (value && value.type === "primitive") {
                    value = value.primitive.value;
                } else {
                    value = null;
                }
            }
        }

        // if (!this.doNotProxy && value !== null && typeof value === 'object') {
        //   value = new Proxy(value, readOnlyProxyHandler)
        // }

        return { value, changes };
    }
}

dependencyTypeArray.push(AttributePrimitiveDependency);

class SerializedChildrenDependency extends Dependency {
    static dependencyType = "serializedChildren";

    setUpParameters() {
        if (this.definition.parentIdx != undefined) {
            this.parentIdx = this.definition.parentIdx;
            this.specifiedComponentName = this.parentIdx;
        } else {
            this.parentIdx = this.upstreamComponentIdx;
        }
    }

    async determineDownstreamComponents() {
        let parent = this.dependencyHandler._components[this.parentIdx];

        if (!parent) {
            let dependenciesMissingComponent =
                this.dependencyHandler.updateTriggers
                    .dependenciesMissingComponentBySpecifiedName[
                    this.parentIdx
                ];
            if (!dependenciesMissingComponent) {
                dependenciesMissingComponent =
                    this.dependencyHandler.updateTriggers.dependenciesMissingComponentBySpecifiedName[
                        this.parentIdx
                    ] = [];
            }
            if (!dependenciesMissingComponent.includes(this)) {
                dependenciesMissingComponent.push(this);
            }

            for (let varName of this.upstreamVariableNames) {
                await this.dependencyHandler.addBlocker({
                    blockerComponentIdx: this.parentIdx,
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
            downstreamComponentIndices: [this.parentIdx],
            downstreamComponentTypes: [parent.componentType],
        };
    }

    async getValue() {
        let parent = this.dependencyHandler._components[this.parentIdx];

        return {
            value: parent.serializedChildren,
            changes: {},
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

dependencyTypeArray.push(SerializedChildrenDependency);

class DoenetMLDependency extends Dependency {
    static dependencyType = "doenetML";

    setUpParameters() {
        if (this.definition.componentIdx != undefined) {
            this.componentIdx = this.definition.componentIdx;
            this.specifiedComponentName = this.componentIdx;
        } else {
            this.componentIdx = this.upstreamComponentIdx;
        }

        this.displayOnlyChildren = this.definition.displayOnlyChildren;
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

    async getValue() {
        let doenetML = this.dependencyHandler.core.requestComponentDoenetML(
            this.componentIdx,
            this.displayOnlyChildren,
        );

        return {
            value: doenetML,
            changes: {},
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

dependencyTypeArray.push(DoenetMLDependency);

class DoenetMLRangeDependency extends Dependency {
    static dependencyType = "position";

    setUpParameters() {
        if (this.definition.componentIdx != undefined) {
            this.componentIdx = this.definition.componentIdx;
            this.specifiedComponentName = this.componentIdx;
        } else {
            this.componentIdx = this.upstreamComponentIdx;
        }
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

    async getValue() {
        let component = this.dependencyHandler._components[this.componentIdx];

        // TODO: address doenetmlId

        return {
            value: component.position ?? null,
            changes: {},
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

dependencyTypeArray.push(DoenetMLRangeDependency);

class VariantsDependency extends Dependency {
    static dependencyType = "variants";

    setUpParameters() {
        if (this.definition.componentIdx != undefined) {
            this.componentIdx = this.definition.componentIdx;
            this.specifiedComponentName = this.componentIdx;
        } else {
            this.componentIdx = this.upstreamComponentIdx;
        }
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

    async getValue() {
        let component = this.dependencyHandler._components[this.componentIdx];

        return {
            value: component.variants,
            changes: {},
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

dependencyTypeArray.push(VariantsDependency);

class CounterDependency extends Dependency {
    static dependencyType = "counter";

    setUpParameters() {
        this.counterName = this.definition.counterName;

        this.componentIdx = this.upstreamComponentIdx;
    }

    async determineDownstreamComponents() {
        let component = this.dependencyHandler._components[this.componentIdx];

        let counters = component.counters[this.counterName];
        if (!counters) {
            counters = component.counters[this.counterName] = {
                dependencies: [],
                componentList: [],
                value: null,
            };
        }

        if (!counters.dependencies.includes(this)) {
            counters.dependencies.push(this);
        }

        await this.dependencyHandler.collateCountersAndPropagateToAncestors(
            component,
        );

        return {
            success: true,
            downstreamComponentIndices: [],
            downstreamComponentTypes: [],
        };
    }

    async getValue() {
        let component = this.dependencyHandler._components[this.componentIdx];

        return {
            value: component.counters[this.counterName].value,
            changes: {},
        };
    }
}

dependencyTypeArray.push(CounterDependency);

class DetermineDependenciesDependency extends Dependency {
    static dependencyType = "determineDependencies";

    setUpParameters() {
        if (this.definition.componentIdx != undefined) {
            this.componentIdx = this.definition.componentIdx;
        } else {
            this.componentIdx = this.upstreamComponentIdx;
        }

        if (this.definition.variableNames === undefined) {
            throw Error(
                `Invalid state variable ${this.representativeStateVariable} of ${this.upstreamComponentIdx}, dependency ${this.dependencyName}: variableNames is not defined`,
            );
        }
        this.originalDownstreamVariableNames = this.definition.variableNames;

        this.returnSingleComponent = true;
    }

    async determineDownstreamComponents() {
        // console.log(`determine downstream components of determine deps dependency ${this.dependencyName} of ${this.representativeStateVariable} of ${this.upstreamComponentIdx}`)

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

        for (let varName of this.upstreamVariableNames) {
            await this.dependencyHandler.addBlocker({
                blockerComponentIdx: this.upstreamComponentIdx,
                blockerType: "determineDependencies",
                blockerStateVariable: varName,
                blockerDependency: this.dependencyName,
                componentIdxBlocked: this.upstreamComponentIdx,
                typeBlocked: "stateVariable",
                stateVariableBlocked: varName,
            });
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

    async markStale() {
        let component =
            this.dependencyHandler._components[this.upstreamComponentIdx];

        for (let varName of this.upstreamVariableNames) {
            if (
                !(
                    component &&
                    component.state[varName] &&
                    component.state[varName].currentlyResolving
                )
            ) {
                await this.dependencyHandler.addBlocker({
                    blockerComponentIdx: this.upstreamComponentIdx,
                    blockerType: "determineDependencies",
                    blockerStateVariable: varName,
                    blockerDependency: this.dependencyName,
                    componentIdxBlocked: this.upstreamComponentIdx,
                    typeBlocked: "stateVariable",
                    stateVariableBlocked: varName,
                });

                // add a blocker to recalculating the downstream dependencies of all
                // the dependencies of varName
                for (let depName in this.dependencyHandler
                    .downstreamDependencies[this.upstreamComponentIdx][
                    varName
                ]) {
                    let dep =
                        this.dependencyHandler.downstreamDependencies[
                            this.upstreamComponentIdx
                        ][varName][depName];
                    if (dep.dependencyType !== "determineDependencies") {
                        await this.dependencyHandler.addBlocker({
                            blockerComponentIdx: this.upstreamComponentIdx,
                            blockerType: "determineDependencies",
                            blockerStateVariable: varName,
                            blockerDependency: this.dependencyName,
                            componentIdxBlocked: this.upstreamComponentIdx,
                            typeBlocked: "recalculateDownstreamComponents",
                            stateVariableBlocked: varName,
                            dependencyBlocked: depName,
                        });
                    }
                }
            }
        }
    }
}

dependencyTypeArray.push(DetermineDependenciesDependency);

class FileDependency extends Dependency {
    static dependencyType = "file";

    setUpParameters() {
        this.cid = this.definition.cid;
        this.uri = this.definition.uri;
        this.fileType = this.definition.fileType;
    }

    async getValue() {
        let extension;

        if (this.cid) {
            if (this.fileType.toLowerCase() === "csv") {
                extension = "csv";
            } else {
                return {
                    value: null,
                    changes: {},
                };
            }

            let fileContents = await retrieveTextFileForCid(
                this.cid,
                extension,
            );

            return {
                value: fileContents,
                changes: {},
            };
        } else {
            // no cid.  Try to find from uri
            let response = await fetch(this.uri);

            if (response.ok) {
                let fileContents = await response.text();
                return {
                    value: fileContents,
                    changes: {},
                };
            } else {
                return {
                    value: null,
                    changes: {},
                };
            }
        }
    }
}

dependencyTypeArray.push(FileDependency);

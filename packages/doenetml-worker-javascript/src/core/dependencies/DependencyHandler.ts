// `DependencyHandler` was extracted from the original ~10k-line
// `Dependencies.js`. The body is still loosely typed (most internal bags
// are `any` / `Record<string, any>`); the field declarations and method
// signatures below capture the surface that callers — today
// `Core.ts` plus the other extracted managers — depend on.

import type Core from "../../Core";
import type { ComponentInstance } from "../../types/componentInstance";
import type { ComponentInfoObjects } from "../../utils/componentInfoObjects";
import type { ComponentIdx } from "@doenet/utils";
import { deepClone, deepCompare, getLineCharRange } from "@doenet/utils";
import { deriveChildResultsFromDefiningChildren } from "../ChildMatcher";
import {
    expandCompositeComponent,
    recursivelyReplaceCompositesWithReplacements,
} from "../CompositeExpander";
import { arrayEntryNamesFromPropIndex } from "../StateVariableInitializer";
import {
    ancestorsIncludingComposites,
    gatherDescendants,
} from "../../utils/descendants";
import { dependencyTypeClasses } from "./registry";

/**
 * The 9 trigger tables that `DependencyHandler` exposes for cross-component
 * change propagation. Each is an index over component identifiers or names
 * pointing at the dependent dependency records; the records themselves are
 * still loosely typed.
 */
export interface DependencyUpdateTriggers {
    descendantDependenciesByAncestor: Record<ComponentIdx, any>;
    ancestorDependenciesByPotentialAncestor: Record<ComponentIdx, any>;
    replacementDependenciesByComposite: Record<ComponentIdx, any>;
    childDependenciesByParent: Record<ComponentIdx, any>;
    parentDependenciesByParent: Record<ComponentIdx, any>;
    dependenciesMissingComponentBySpecifiedName: Record<string, any>;
    dependenciesBasedOnDependenciesOfStateVariables: Record<ComponentIdx, any>;
    primaryShadowDependencies: Record<ComponentIdx, any>;
    componentsReferencingAttributeByReferenced: Record<ComponentIdx, any>;
}

/**
 * Constructor argument for `DependencyHandler`. `_components` and
 * `componentInfoObjects` are sourced from the owning `Core`; the
 * three-arg shape preserves what the JavaScript constructor used and lets
 * the back-references be re-bound separately during tests.
 */
export interface DependencyHandlerOptions {
    _components: ComponentInstance[];
    componentInfoObjects: ComponentInfoObjects;
    core: Core;
}

export class DependencyHandler {
    /** Index signature: subclass dependencies set arbitrary fields on the
     * handler during graph walks, and the bodies below still mirror that
     * dynamic JS pattern. Declared fields below take precedence at the
     * type level. */
    [key: string]: any;

    /** Read-only snapshot of every component the dependency graph knows
     * about; same array reference Core holds in `_components`. */
    _components: ComponentInstance[];
    /** Component-class metadata table provided by Core. */
    componentInfoObjects: ComponentInfoObjects;
    /** Back-reference to the owning Core instance. */
    core: Core;

    /** `upstreamDependencies[componentIdx][stateVariable]` → upstream entries. */
    upstreamDependencies: Record<ComponentIdx, Record<string, any>>;
    /** `downstreamDependencies[componentIdx][stateVariable]` → downstream entries. */
    downstreamDependencies: Record<ComponentIdx, Record<string, any>>;
    switchDependencies: Record<string, any>;

    circularCheckPassed: Record<string, boolean>;
    circularResolveBlockedCheckPassed: Record<string, boolean>;

    dependencyTypes: Record<string, any>;
    updateTriggers: DependencyUpdateTriggers;
    resolveBlockers: {
        neededToResolve: Record<string, any>;
        resolveBlockedBy: Record<string, any>;
    };
    attributeRefResolutionDependenciesByReferenced: Record<ComponentIdx, any>;

    constructor({
        _components,
        componentInfoObjects,
        core,
    }: DependencyHandlerOptions) {
        this.upstreamDependencies = {};
        this.downstreamDependencies = {};
        this.switchDependencies = {};

        this.circularCheckPassed = {};
        this.circularResolveBlockedCheckPassed = {};

        this.dependencyTypes = {};
        dependencyTypeClasses.forEach(
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

    async setUpComponentDependencies(component: ComponentInstance) {
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

        let stateVariablesToProccess: string[] = [];
        let additionalStateVariablesThatWillBeProcessed: string[] = [];
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
    }: any) {
        let stateVarObj = component.state[stateVariable];
        let dependencies;

        if (stateVarObj.stateVariablesDeterminingDependencies) {
            dependencies = {} as Record<string, any>;

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

    deleteAllDownstreamDependencies({
        component,
        stateVariables = "__all__",
    }: any) {
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
    }: any) {
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
    }: any) {
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

    async addBlockersFromChangedActiveChildren({ parent }: any) {
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

    async resolveBlockersFromChangedActiveChildren(parent: any, force = false) {
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

    async addDescendantBlockersToAncestor(ancestorIdx: ComponentIdx) {
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

    async resolveDescendantBlockersToAncestor(
        ancestorIdx: ComponentIdx,
        force = false,
    ) {
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

    async addBlockersFromChangedReplacements(composite: any) {
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
    }: any) {
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
                (x: string) =>
                    this.components[
                        x.match(componentNameRe)![1] as unknown as number
                    ],
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

    resetCircularCheckPassed(componentIdx: ComponentIdx, varName: string) {
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

    async updateDependencies({ componentIdx, stateVariable, dependency }: any) {
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
                            let result: any = await this.resolveItem({
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
        } as Record<string, any>;

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
    }: any) {
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

    async checkForDependenciesOnNewComponent(componentIdx: ComponentIdx) {
        // console.log(`check for dependencies on new component ${componentIdx}`)

        let variablesChanged: any[] = [];

        let variablesJustResolved: Record<string, any> = {};

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

    /**
     * Get dependency values for a state variable.
     * By default this consumes dependency change flags; set consumeChanges to false
     * to inspect dependencies without clearing pending change markers.
     */
    async getStateVariableDependencyValues({
        component,
        stateVariable,
        consumeChanges = true,
    }: any): Promise<any> {
        let dependencyValues: Record<string, any> = {};
        let dependencyChanges: Record<string, any> = {};
        let dependencyUsedDefault: Record<string, any> = {};

        let downDeps =
            this.downstreamDependencies[component.componentIdx][stateVariable];

        for (let dependencyName in downDeps) {
            let dep = downDeps[dependencyName];

            if (dep.onlyToSetInInverseDefinition) {
                continue;
            }

            let { value, changes, usedDefault } = await dep.getValue({
                consumeChanges,
            });

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

    recordActualChangeInUpstreamDependencies({
        component,
        varName,
        changes,
    }: any) {
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
                                    // @ts-expect-error see "Note (dated July 20, 2023)" above:
                                    // `upValuesChangedSub` is undefined; keeping the
                                    // reference verbatim so behavior matches the JS source.
                                    alias in upValuesChangedSub
                                ) {
                                    upValuesChanged =
                                        // @ts-expect-error same as above
                                        upValuesChangedSub[alias];
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
                        upValuesChanged =
                            // @ts-expect-error same as above
                            upValuesChangedSub[varName] = { changed: {} };
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

    async collateCountersAndPropagateToAncestors(component: any): Promise<any> {
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
                counters.componentList.some(
                    (v: any, i: number) => v != componentList[i],
                )
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

    getNeededToResolve({ componentIdx, type, stateVariable, dependency }: any) {
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
    }: any) {
        // console.log(`delete from needed to resolve ${componentIdxBlocked}, ${typeBlocked}, ${stateVariableBlocked}, ${dependencyBlocked}, ${blockerType}, ${blockerCode}`)
        // console.log(JSON.parse(JSON.stringify(this.resolveBlockers)))

        let codeBlocked = componentIdxBlocked.toString();
        if (stateVariableBlocked) {
            codeBlocked += "|" + stateVariableBlocked;
            if (dependencyBlocked) {
                codeBlocked += "|" + dependencyBlocked;
            }
        }

        // Arrow function so `this` resolves to the surrounding class
        // instance (the original JS authored these as `function`
        // expressions; the calls inside use `this.deleteFromResolveBlockedBy`,
        // so the lexical-`this` form matches the runtime behavior the
        // tests already exercise).
        let deleteBlockerTypeAndCode = (neededObj: any) => {
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
        };

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
    }: any) {
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

    getResolveBlockedBy({
        componentIdx,
        type,
        stateVariable,
        dependency,
    }: any) {
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
    }: any) {
        // console.log(`delete from resolve blocked by ${blockerComponentIdx}, ${blockerType}, ${blockerStateVariable}, ${blockerDependency}, ${typeBlocked}, ${codeBlocked}`)
        // console.log(JSON.parse(JSON.stringify(this.resolveBlockers)))

        let blockerCode = blockerComponentIdx.toString();
        if (blockerStateVariable) {
            blockerCode += "|" + blockerStateVariable;
            if (blockerDependency) {
                blockerCode += "|" + blockerDependency;
            }
        }

        // Arrow form for the same reason as `deleteBlockerTypeAndCode`
        // above — the body uses `this.<method>` so it must lexically
        // capture the surrounding class instance.
        let deleteTypeAndCodeBlocked = (neededObj: any) => {
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
        };

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
    }: any) {
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
    }: any) {
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
                            await deriveChildResultsFromDefiningChildren({
                                core: this.core,
                                parent: component,
                                expandComposites,
                                forceExpandComposites: force,
                            });

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

                    await expandCompositeComponent({
                        core: this.core,
                        component: this._components[componentIdxNewlyResolved],
                    });
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

    async resolveStateVariablesIfReady({ component, stateVariables }: any) {
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
    }: any) {
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
    }: any): Promise<any> {
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

                let result: any = await this.resolveItem({
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

                    let result: any = await this.resolveItem({
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

                        let result: any = await this.resolveItem({
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
    }: any) {
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
                (x: string) =>
                    this.components[
                        x.match(componentNameRe)![1] as unknown as number
                    ],
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

    getCircularDependencyMessage(componentsInvolved: any[]) {
        let uniqueComponentNames: any[] = [];
        let componentTypesForUniqueNames: any[] = [];
        let linesForUniqueNames: any[] = [];

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
    }: any) {
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

    set components(_value: any) {
        // intentional no-op — `components` is read-only by design but the
        // setter exists to match the historical API surface.
    }
}

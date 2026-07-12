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
 * Shared result for `peekNeededToResolve` / `peekResolveBlockedBy` when no
 * entry exists. Frozen: peek callers only read, and a write to this object
 * would corrupt every other caller.
 */
const EMPTY_BLOCKERS: Record<string, any> = Object.freeze({});

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

    /**
     * Interned (deduplicated, frozen) lists of downstream variable names.
     * Most dependencies map the same few variable-name lists (e.g.
     * `["value"]`), so sharing one frozen array per distinct list saves a
     * separate array per (dependency, downstream component). Frozen so an
     * accidental in-place mutation throws instead of corrupting the other
     * dependencies sharing the list.
     */
    _internedVariableNameLists: Map<string, readonly string[]>;

    /**
     * Interned lists for the per-dependency parallel arrays
     * (`downstreamComponentIndices`, `downstreamComponentTypes`, and the
     * outer array of `mappedDownstreamVariableNamesByComponent`). Most
     * dependencies have exactly one downstream component, and all the
     * dependencies of one component point at the same few targets, so these
     * mostly-length-1 arrays repeat heavily across dependencies.
     * `Dependency.initialize` interns them once the downstream set is built;
     * the base-class mutators (`addDownstreamComponent` /
     * `removeDownstreamComponent` / `swapDownstreamComponents`) thaw (copy)
     * before mutating.
     */
    _internedComponentIndexLists: Map<string, readonly number[]>;
    _internedComponentTypeLists: Map<string, readonly string[]>;
    _internedNameListArrays: Map<string, readonly (readonly string[])[]>;
    /**
     * Identity ids for the interned inner structures — name lists (from
     * `internVariableNameList`) and `valuesChanged` records (from
     * `internInitialValuesChangedRecord` and `emptyValuesChangedRecord`).
     * Used to key the interned outer arrays that contain them
     * (`internNameListArray` / `internValuesChangedArray`) and, for a name
     * list, its interned initial change record.
     */
    _internedListIds: WeakMap<object, number>;
    _nextInternedListId: number;

    /**
     * Interned initial `valuesChanged` records (every variable name mapped
     * to the shared initial change record), keyed by the interned-list id of
     * the variable-name list they cover. A new dependency's change state is
     * fully determined by its (interned) variable-name list, so all such
     * dependencies can share one frozen record until first written.
     */
    _internedValuesChangedRecords: Map<number, Record<string, any>>;
    /**
     * Interned `valuesChanged` outer arrays, keyed by the joined ids of
     * their (interned) per-component records. Covers both the initial state
     * and the fully-consumed state (`emptyValuesChangedRecord` entries), so
     * dependencies whose changes were consumed converge back to shared
     * structures instead of retaining a mutable array + empty record each.
     */
    _internedValuesChangedArrays: Map<string, Record<string, any>[]>;
    /** Shared frozen record for a fully-consumed `valuesChanged` entry. */
    emptyValuesChangedRecord: Record<string, any>;

    /**
     * Number of state-variable groups whose dependencies have been built
     * (on demand). Diagnostic counter for the lazy-materialization work.
     */
    numDependencySetups: number;

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

        this.numDependencySetups = 0;

        this.attributeRefResolutionDependenciesByReferenced = {};

        this._internedVariableNameLists = new Map();
        this._internedComponentIndexLists = new Map();
        this._internedComponentTypeLists = new Map();
        this._internedNameListArrays = new Map();
        this._internedListIds = new WeakMap();
        this._nextInternedListId = 1;
        this._internedValuesChangedRecords = new Map();
        this._internedValuesChangedArrays = new Map();
        this.emptyValuesChangedRecord = Object.freeze({});
        this._internedListIds.set(
            this.emptyValuesChangedRecord,
            this._nextInternedListId,
        );
        this._nextInternedListId++;
    }

    internComponentIndexList(indices: number[]): number[] {
        const key = indices.join(",");
        let interned = this._internedComponentIndexLists.get(key);
        if (!interned) {
            interned = Object.freeze(indices);
            this._internedComponentIndexLists.set(key, interned);
        }
        return interned as number[];
    }

    internComponentTypeList(types: string[]): string[] {
        // component types are identifiers, so "\n" cannot appear in one
        const key = types.join("\n");
        let interned = this._internedComponentTypeLists.get(key);
        if (!interned) {
            interned = Object.freeze(types);
            this._internedComponentTypeLists.set(key, interned);
        }
        return interned as string[];
    }

    /**
     * Intern an array whose elements are already-interned name lists
     * (from `internVariableNameList`), keyed by the identity of those
     * elements. Elements that are not interned lists (no assigned id) make
     * the array non-internable; it is returned unchanged.
     */
    internNameListArray(outer: string[][]): string[][] {
        const ids: number[] = [];
        for (const inner of outer) {
            const id =
                typeof inner === "object" && inner !== null
                    ? this._internedListIds.get(inner)
                    : undefined;
            if (id === undefined) {
                return outer;
            }
            ids.push(id);
        }
        const key = ids.join(",");
        let interned = this._internedNameListArrays.get(key);
        if (!interned) {
            interned = Object.freeze(outer);
            this._internedNameListArrays.set(key, interned);
        }
        return interned as string[][];
    }

    internVariableNameList(names: string[]): string[] {
        // Newline is a safe list separator: state variable names are
        // identifiers or numeric-ending array entries, and author-supplied
        // reference names are restricted to the parser grammar's `nameChar`
        // (letters/digits/`-`/`.`/combining marks — never whitespace), so no
        // name can contain a "\n" that would collide two distinct lists.
        const key = names.join("\n");
        let interned = this._internedVariableNameLists.get(key);
        if (!interned) {
            interned = Object.freeze(names);
            this._internedVariableNameLists.set(key, interned);
            this._internedListIds.set(interned, this._nextInternedListId);
            this._nextInternedListId++;
        }
        return interned as string[];
    }

    /**
     * Like `internVariableNameList`, but never freezes the caller's array:
     * on a cache miss the interned entry is a frozen copy. For dependency
     * fields that alias arrays owned elsewhere (state-variable definitions,
     * constructor arguments), which must stay mutable for their owners.
     */
    internVariableNameListByCopy(names: readonly string[]): string[] {
        const key = names.join("\n");
        const interned = this._internedVariableNameLists.get(key);
        if (interned) {
            return interned as string[];
        }
        return this.internVariableNameList([...names]);
    }

    /**
     * Return the shared frozen initial `valuesChanged` record (every
     * variable mapped to the shared initial change record) for the given
     * interned variable-name list. Falls back to a fresh mutable record if
     * `names` was not interned. Writers must thaw/replace before mutating;
     * see `Dependency.thawValuesChangedRecord` and
     * `Dependency.consumeChangeRecord`.
     */
    internInitialValuesChangedRecord(
        names: readonly string[],
        initialChangeRecord: Record<string, any>,
    ): Record<string, any> {
        const listId = this._internedListIds.get(names as string[]);
        if (listId === undefined) {
            const record: Record<string, any> = {};
            for (const name of names) {
                record[name] = initialChangeRecord;
            }
            return record;
        }
        let record = this._internedValuesChangedRecords.get(listId);
        if (!record) {
            record = {};
            for (const name of names) {
                record[name] = initialChangeRecord;
            }
            Object.freeze(record);
            this._internedValuesChangedRecords.set(listId, record);
            this._internedListIds.set(record, this._nextInternedListId);
            this._nextInternedListId++;
        }
        return record;
    }

    /**
     * Intern a `valuesChanged` outer array whose entries are all interned
     * records (from `internInitialValuesChangedRecord` or
     * `emptyValuesChangedRecord`), keyed by the identity of those entries.
     * Any non-interned (hence mutable) entry makes the array non-internable;
     * it is returned unchanged.
     */
    internValuesChangedArray(
        outer: Record<string, any>[],
    ): Record<string, any>[] {
        const ids: number[] = [];
        for (const record of outer) {
            const id =
                typeof record === "object" && record !== null
                    ? this._internedListIds.get(record)
                    : undefined;
            if (id === undefined) {
                return outer;
            }
            ids.push(id);
        }
        const key = ids.join(",");
        let interned = this._internedValuesChangedArrays.get(key);
        if (!interned) {
            interned = Object.freeze(outer) as Record<string, any>[];
            this._internedValuesChangedArrays.set(key, interned);
        }
        return interned;
    }

    /**
     * Create the per-component entries in the two dependency maps.
     *
     * The maps are indexed unconditionally by component elsewhere
     * (e.g. `markUpstreamDependentsStale`, `resetCircularCheckPassed`),
     * so every component needs its slots at construction even though the
     * per-state-variable dependencies are now built on demand by
     * `ensureStateVariableDependenciesSetUp`.
     */
    createComponentDependencySlots(component: ComponentInstance) {
        // if component already has downstream dependencies
        // delete them, and the corresponding upstream dependencies
        if (this.downstreamDependencies[component.componentIdx]) {
            this.deleteAllDownstreamDependencies({ component });
        }

        this.downstreamDependencies[component.componentIdx] = {};
        if (!this.upstreamDependencies[component.componentIdx]) {
            this.upstreamDependencies[component.componentIdx] = {};
        }
    }

    /**
     * Build the dependencies of `stateVariable` (and the rest of its
     * `additionalStateVariablesDefined` group) if they have not been built
     * yet. Dependencies are created on demand at the first resolution
     * attempt (`resolveItem`/`resolveIfReady`) rather than at component
     * construction, so state variables that are never demanded never pay
     * for their dependency structures.
     *
     * The marker for "already set up" is the existence of the variable's
     * slot in `downstreamDependencies` — slots are deleted only by
     * whole-component teardown.
     */
    async ensureStateVariableDependenciesSetUp(
        componentIdx: ComponentIdx,
        stateVariable: string,
    ) {
        const component = this._components[componentIdx];
        if (!component) {
            return;
        }
        const stateVarObj = component.state[stateVariable];
        if (!stateVarObj) {
            // array entries that don't exist yet are created through
            // `createFromArrayEntry`, which sets up dependencies itself
            return;
        }

        const downDepsForComponent =
            this.downstreamDependencies[component.componentIdx];
        if (
            !downDepsForComponent ||
            downDepsForComponent[stateVariable] !== undefined
        ) {
            return;
        }

        // Every member of an `additionalStateVariablesDefined` group lists
        // its siblings (see `returnNormalizedStateVariableDefinitions`),
        // so the full group is recoverable from whichever member is
        // demanded first.
        const allStateVariablesAffected = [stateVariable];
        if (stateVarObj.additionalStateVariablesDefined) {
            allStateVariablesAffected.push(
                ...stateVarObj.additionalStateVariablesDefined,
            );
        }

        // Pre-create empty slots for the whole group before the async
        // setup: variables whose `returnDependencies` yields no
        // dependencies still need the slot to record they were set up, and
        // `returnDependencies` can await other state variables, re-entering
        // resolution for this same group.
        for (const varName of allStateVariablesAffected) {
            if (!downDepsForComponent[varName]) {
                downDepsForComponent[varName] = {};
            }
        }

        this.numDependencySetups++;

        await this.setUpStateVariableDependencies({
            component,
            stateVariable,
            allStateVariablesAffected,
        });
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

    /**
     * Drop the circular-check memo records. They are pure caches ("this
     * state variable already passed the check"), so clearing costs only
     * re-verification when a later dependency change re-triggers a check.
     * Called once initial document construction finishes: at that point the
     * memos cover every state variable created during the load (one record
     * entry per state variable), but they regrow only for the typically few
     * components involved in subsequent updates.
     */
    clearCircularCheckMemos() {
        this.circularCheckPassed = {};
        this.circularResolveBlockedCheckPassed = {};
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

        if (!(
            changeResult.changedDependency || returnDepArgs.changedDependency
        )) {
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
                        if (!(
                            variablesJustResolved[dep.upstreamComponentIdx] &&
                            variablesJustResolved[dep.upstreamComponentIdx][
                                varName
                            ]
                        )) {
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
                    // the interned (frozen, shared) structures must be
                    // replaced with mutable copies before recording
                    upDep.thawValuesChangedRecord(ind);
                    let upValuesChanged = upDep.valuesChanged[ind][varName];

                    if (!upValuesChanged) {
                        // The change record was consumed (deleted) by a
                        // previous getValue, or the original change was
                        // recorded in the array state variable rather than
                        // this array entry. Recreate it.
                        // (This replaced dead code that referenced an
                        // undefined `upValuesChangedSub` and threw for
                        // non-array-entry variables; change records are now
                        // deleted on consumption, so absence is normal.)
                        upValuesChanged = upDep.valuesChanged[ind][varName] =
                            {};
                    } else if (Object.isFrozen(upValuesChanged)) {
                        // the shared initial change record — replace it
                        // before recording metadata on it
                        upValuesChanged = upDep.valuesChanged[ind][varName] = {
                            changed: upValuesChanged.changed,
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
        if (!(
            parent && parent.allChildrenOrdered.includes(component.componentIdx)
        )) {
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

    /**
     * Non-creating variant of `getNeededToResolve`: returns the nested entry
     * if it exists, else `EMPTY_BLOCKERS`, without materializing intermediate
     * levels. `getNeededToResolve` creates the whole nested chain on every
     * lookup, and read-only callers used to leave tens of thousands of empty
     * `{cIdx: {type: {stateVariable: {}}}}` chains behind — the bulk of
     * `resolveBlockers`' retained memory.
     */
    peekNeededToResolve({
        componentIdx,
        type,
        stateVariable,
        dependency,
    }: any) {
        let neededToResolve =
            this.resolveBlockers.neededToResolve[componentIdx]?.[type];
        if (neededToResolve && stateVariable) {
            neededToResolve = neededToResolve[stateVariable];
            if (neededToResolve && dependency) {
                neededToResolve = neededToResolve[dependency];
            }
        }
        return neededToResolve ?? EMPTY_BLOCKERS;
    }

    /** Non-creating variant of `getResolveBlockedBy`; see `peekNeededToResolve`. */
    peekResolveBlockedBy({
        componentIdx,
        type,
        stateVariable,
        dependency,
    }: any) {
        let resolveBlockedBy =
            this.resolveBlockers.resolveBlockedBy[componentIdx]?.[type];
        if (resolveBlockedBy && stateVariable) {
            resolveBlockedBy = resolveBlockedBy[stateVariable];
            if (resolveBlockedBy && dependency) {
                resolveBlockedBy = resolveBlockedBy[dependency];
            }
        }
        return resolveBlockedBy ?? EMPTY_BLOCKERS;
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
            // exact capacity: three quarters of blocker lists only ever hold
            // one code, while a push-grown array reserves ≥16 element slots
            neededForBlocked[blockerType] = [blockerCode];
        } else if (neededToResolveBlocked.includes(blockerCode)) {
            // blocker is already recorded, so nothing to do
            return;
        } else {
            neededToResolveBlocked.push(blockerCode);
        }

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
            // exact capacity, as for `neededToResolveBlocked` above
            resolvedBlockedByBlocker[typeBlocked] = [codeBlocked];
        } else if (!blockedByBlocker.includes(codeBlocked)) {
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
                    let neededForItem = this.peekNeededToResolve({
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

        let resolveBlockedByNewlyResolved = this.peekResolveBlockedBy({
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

        if (type === "stateVariable") {
            // Dependencies are set up lazily, so an empty blocker ledger
            // alone doesn't mean the variable is resolvable: its
            // dependencies (whose creation records the blockers) must have
            // been built first. This gate is what makes
            // `processNewlyResolved` (reached only through here) safe.
            await this.ensureStateVariableDependenciesSetUp(
                componentIdx,
                stateVariable,
            );
        }

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

        if (type === "stateVariable") {
            // Set up this variable's dependencies now (if not yet built) so
            // the peek below sees the real blockers — including the
            // `__determine_dependencies` blocker consumed by the pre-pass —
            // instead of discovering them through the retry loop.
            await this.ensureStateVariableDependenciesSetUp(
                componentIdx,
                stateVariable,
            );
        }

        let neededForItem = this.peekNeededToResolve({
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
                neededForItem = this.peekNeededToResolve({
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

            neededForItem = this.peekNeededToResolve({
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

            let stillNeededForItem = this.peekNeededToResolve({
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

            let neededForItem = this.peekNeededToResolve({
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

            let resolveBlockedBy = this.peekResolveBlockedBy({
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

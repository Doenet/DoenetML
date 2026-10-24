import type Core from "../Core";
import {
    deregisterComponent,
    processNewDefiningChildren,
} from "./ComponentLifecycle";
import { removeComponentsFromResolver } from "./ResolverAdapter";
import {
    serializedComponentsReplacer,
    serializedComponentsReviver,
} from "@doenet/utils";
/**
 * Deletes components from the live tree. The bulk of the work is the
 * two-phase walk:
 *
 *   1. `determineComponentsToDelete` collects the full set of components
 *      that must go (children, attribute components, adapters, shadows,
 *      replacements) when an upstream dependent is deleted.
 *   2. `deleteComponents` then unlinks parents, splices replacements out
 *      of composite sources, deletes dependency edges, removes nodes from
 *      the resolver, deregisters from `core._components`, and clears
 *      `updateInfo` queues for the deleted ids.
 *
 * Stateless. `deleteComponents` takes a back-reference to Core to read
 * `_components`, `dependencies`, `updateInfo`, `unmatchedChildren`,
 * `cumulativeStateVariableChanges`, `stateVariableChangeTriggers`, and to
 * invoke `processNewDefiningChildren`, `removeComponentsFromResolver`, and
 * `deregisterComponent`. `determineComponentsToDelete` only reads
 * `core._components`.
 */

/**
 * Delete `components` (and, when `deleteUpstreamDependencies`,
 * everything that shadows or depends on them) from the live tree.
 *
 * Two-phase walk:
 *  1. `determineComponentsToDelete` collects the full transitive set
 *     (children, attribute components, adapters, shadows, replacements).
 *  2. The body below removes them: detach from composite replacements,
 *     splice out of parent `definingChildren` and re-derive child
 *     results, tear down dependency edges (downstream and upstream),
 *     remove from the resolver, and deregister from `_components`.
 *
 * Pass `skipProcessingChildrenOfParents` for parents whose child
 * results are about to be re-derived by a different code path, so we
 * don't pay for two redundant passes.
 *
 * Pass `keepSavedStateFor`, the composite whose replacements `components`
 * are, when they can be made again from the same DoenetML, with the same
 * `stateId`s, as the case of a `<conditionalContent>` can: what a reader did
 * to them is kept, saved as before, and applied when they are made again, as
 * a reload would. What is kept is forgotten when the composite itself is
 * deleted without `keepSavedStateFor`: the composite remembers what it kept,
 * and a `<conditionalContent>` also names what a reload kept for it
 * (`stateIdsOfPossibleReplacements`).
 */
export async function deleteComponents({
    core,
    components,
    deleteUpstreamDependencies = true,
    skipProcessingChildrenOfParents = [],
    keepSavedStateFor,
}: {
    core: Core;
    components: any | any[];
    deleteUpstreamDependencies?: boolean;
    skipProcessingChildrenOfParents?: number[];
    keepSavedStateFor?: any;
}): Promise<any> {
    if (!Array.isArray(components)) {
        components = [components];
    }

    // TODO: if delete a shadow directly it should be an error
    // (though it will be OK to delete them through other side effects)

    // step 1. Determine which components to delete
    const componentsToDelete: Record<number, any> = {};
    determineComponentsToDelete({
        core,
        components,
        deleteUpstreamDependencies,
        componentsToDelete,
    });

    // Only the components made from the DoenetML of `components` are made
    // again with their `stateId`s. A shadow elsewhere, such as an `extend` of
    // a component in a case, is made again as a shadow of whatever it then
    // refers to, which can be another case's component.
    const componentsToKeepStateOf: Record<number, any> = {};
    if (keepSavedStateFor) {
        determineComponentsToDelete({
            core,
            components,
            deleteUpstreamDependencies,
            componentsToDelete: componentsToKeepStateOf,
            followShadows: false,
        });
    }

    //Calculate parent set
    const parentsOfPotentiallyDeleted: Record<
        number,
        { parent: any; childNamesToBeDeleted: Set<number> }
    > = {};
    for (const componentIdxStr in componentsToDelete) {
        const componentIdx = Number(componentIdxStr);
        let component = componentsToDelete[componentIdx];
        let parent = core._components[component.parentIdx];

        // only add parent if it is not in componentsToDelete itself
        if (parent === undefined || parent.componentIdx in componentsToDelete) {
            continue;
        }
        let parentObj = parentsOfPotentiallyDeleted[component.parentIdx];
        if (parentObj === undefined) {
            parentObj = {
                parent: core._components[component.parentIdx],
                childNamesToBeDeleted: new Set(),
            };
            parentsOfPotentiallyDeleted[component.parentIdx] = parentObj;
        }
        parentObj.childNamesToBeDeleted.add(componentIdx);
    }

    // if component is a replacement of another component,
    // need to delete component from the replacement
    // so that it isn't added back as a child of its parent
    // Also keep track of which ones deleted so can add back to replacements
    // if the deletion is unsuccessful
    let replacementsDeletedFromComposites: number[] = [];

    for (const componentIdxStr in componentsToDelete) {
        const componentIdx = Number(componentIdxStr);
        let component = core._components[componentIdx];
        if (component.replacementOf) {
            let composite = component.replacementOf;

            let replacementNames = composite.replacements.map(
                (x: any) => x.componentIdx,
            );

            let replacementInd = replacementNames.indexOf(componentIdx);
            if (replacementInd !== -1) {
                composite.replacements.splice(replacementInd, 1);
                if (
                    !replacementsDeletedFromComposites.includes(
                        composite.componentIdx,
                    )
                ) {
                    replacementsDeletedFromComposites.push(
                        composite.componentIdx,
                    );
                }
            }
        }
    }

    for (const compositeIdx of replacementsDeletedFromComposites) {
        if (!(compositeIdx in componentsToDelete)) {
            await core.dependencies.addBlockersFromChangedReplacements(
                core._components[compositeIdx],
            );
        }
    }

    // delete component from parent's defining children
    // and record parents
    const allParents: any[] = [];
    for (const parentIdxStr in parentsOfPotentiallyDeleted) {
        const parentObj = parentsOfPotentiallyDeleted[parentIdxStr];
        const parent = parentObj.parent;
        allParents.push(parent);

        for (let ind = parent.definingChildren.length - 1; ind >= 0; ind--) {
            const child = parent.definingChildren[ind];
            if (parentObj.childNamesToBeDeleted.has(child.componentIdx)) {
                parent.definingChildren.splice(ind, 1); // delete from array
            }
        }

        if (!skipProcessingChildrenOfParents.includes(parent.componentIdx)) {
            await processNewDefiningChildren({
                core,
                parent,
                expandComposites: false,
            });
        }
    }

    for (const componentIdxStr in componentsToDelete) {
        const componentIdx = Number(componentIdxStr);
        const component = core._components[componentIdx];

        if (component.shadows) {
            const shadowedComponent =
                core._components[component.shadows.componentIdx];
            if (shadowedComponent.shadowedBy.length === 1) {
                delete shadowedComponent.shadowedBy;
            } else {
                shadowedComponent.shadowedBy.splice(
                    shadowedComponent.shadowedBy.indexOf(component),
                    1,
                );
            }
        }

        core.dependencies.deleteAllDownstreamDependencies({
            component,
        });

        // record any upstream dependencies that depend directly on componentIdx
        // (componentIdentity, componentStateVariable*)

        for (let varName in core.dependencies.upstreamDependencies[
            component.componentIdx
        ]) {
            let upDeps =
                core.dependencies.upstreamDependencies[component.componentIdx][
                    varName
                ];
            for (let upDep of upDeps) {
                if (
                    upDep.specifiedComponentName &&
                    upDep.specifiedComponentName in componentsToDelete
                ) {
                    let dependenciesMissingComponent =
                        core.dependencies.updateTriggers
                            .dependenciesMissingComponentBySpecifiedName[
                            upDep.specifiedComponentName
                        ];
                    if (!dependenciesMissingComponent) {
                        dependenciesMissingComponent =
                            core.dependencies.updateTriggers.dependenciesMissingComponentBySpecifiedName[
                                upDep.specifiedComponentName
                            ] = [];
                    }
                    if (!dependenciesMissingComponent.includes(upDep)) {
                        dependenciesMissingComponent.push(upDep);
                    }
                }
            }
        }

        await core.dependencies.deleteAllUpstreamDependencies({
            component,
        });

        if (!core.updateInfo.deletedStateVariables[component.componentIdx]) {
            core.updateInfo.deletedStateVariables[component.componentIdx] = [];
        }
        core.updateInfo.deletedStateVariables[component.componentIdx].push(
            ...Object.keys(component.state),
        );

        core.updateInfo.deletedComponents[component.componentIdx] = true;
        delete core.unmatchedChildren[component.componentIdx];

        delete core.stateVariableChangeTriggers[component.componentIdx];
    }

    const componentsToRemoveFromResolver: any[] = [];

    for (const componentIdxStr in componentsToDelete) {
        const componentIdx = Number(componentIdxStr);
        let component = core._components[componentIdx];

        if (component.replacementOf) {
            const compositeSource = component.replacementOf;

            if (
                compositeSource.attributes.createComponentIdx?.primitive
                    ?.value == component.componentIdx
            ) {
                // If the component's index is being created from a composite,
                // check if there is a source of that composite index that is not being deleted.
                // In that case, we should not remove the component from the resolver.
                let compositeCreatingComponentIdx = compositeSource;

                let foundUndeletedSourceOfComponentIdx = false;
                while (true) {
                    if (
                        !(
                            compositeCreatingComponentIdx.componentIdx in
                            componentsToDelete
                        )
                    ) {
                        foundUndeletedSourceOfComponentIdx = true;
                        break;
                    }

                    if (
                        compositeCreatingComponentIdx.replacementOf?.attributes
                            .createComponentIdx?.primitive?.value ===
                        component.componentIdx
                    ) {
                        compositeCreatingComponentIdx =
                            compositeCreatingComponentIdx.replacementOf;
                    } else {
                        break;
                    }
                }

                if (foundUndeletedSourceOfComponentIdx) {
                    // We determined that the source of the component's component index
                    // is not being deleted, so don't remove the component from the resolver
                    continue;
                }
            }

            if (
                !(compositeSource.componentIdx in componentsToDelete) &&
                compositeSource.constructor.replacementsAlreadyInResolver
            ) {
                // don't remove from resolver, as non-deleted composite source
                // already has replacements in the resolver,
                // so the component was not added to the resolver when it was created
                continue;
            }
        }

        componentsToRemoveFromResolver.push(component);
    }

    removeComponentsFromResolver({
        core,
        componentsToRemove: componentsToRemoveFromResolver,
    });

    const stateIdsToForget: string[] = [];

    for (const componentIdxStr in componentsToDelete) {
        const componentIdx = Number(componentIdxStr);
        let component = core._components[componentIdx];

        if (componentIdx in componentsToKeepStateOf) {
            keepSavedStateForRecreation(core, component);
            const kept = (keepSavedStateFor.stateIdsKeptForRecreation ??=
                new Set<string>());
            kept.add(component.stateId);
            // what a composite in the case kept is now kept with the case
            for (const stateId of component.stateIdsKeptForRecreation ?? []) {
                kept.add(stateId);
            }
        } else {
            deleteSavedState(core, component.stateId);
            stateIdsToForget.push(
                ...(component.stateIdsKeptForRecreation ?? []),
                ...(component.constructor.stateIdsOfPossibleReplacements?.(
                    component,
                ) ?? []),
            );
        }

        // don't use recursive form since all children should already be included
        deregisterComponent({ core, component, recursive: false });

        // remove deleted components from this.updateInfo sets
        core.updateInfo.componentsToUpdateRenderers.delete(componentIdx);
        core.updateInfo.compositesToUpdateReplacements.delete(componentIdx);
        core.updateInfo.inactiveCompositesToUpdateReplacements.delete(
            componentIdx,
        );
    }

    // Forget what was kept for components that will not be made again, other
    // than those that are live, such as the active case's
    for (const stateId of stateIdsToForget) {
        const componentIdx = core.componentIdxByStateId[stateId];
        if (core._components[componentIdx]?.stateId !== stateId) {
            deleteSavedState(core, stateId);
            delete core.updateInfo.stateVariableUpdatesForMissingComponents[
                stateId
            ];
        }
    }

    return {
        success: true,
        deletedComponents: componentsToDelete,
        parentsOfDeleted: allParents,
    };
}

/**
 * Recursively populate `componentsToDelete` with the transitive
 * deletion set rooted at `components`: each component's
 * `allChildren`, attribute components/references, any copies created
 * to resolve reference-path indices (`refResolution.originalPath`),
 * the source of any adapter, and (when `deleteUpstreamDependencies`)
 * shadows, the adapter the component itself produced, and any
 * replacements. With `followShadows` false, shadows are left out, which
 * leaves the components made from the DoenetML of `components`.
 */
export function determineComponentsToDelete({
    core,
    components,
    deleteUpstreamDependencies,
    componentsToDelete,
    followShadows = true,
}: {
    core: Core;
    components: any[];
    deleteUpstreamDependencies: boolean;
    componentsToDelete: Record<number, any>;
    followShadows?: boolean;
}): void {
    for (let component of components) {
        if (typeof component !== "object") {
            continue;
        }

        if (component.componentIdx in componentsToDelete) {
            continue;
        }

        // add unproxied component
        componentsToDelete[component.componentIdx] =
            core._components[component.componentIdx];

        // recurse on allChildren and attributes
        let componentsToRecurse = Object.values(
            component.allChildren as Record<string, any>,
        ).map((x) => x.component);

        for (let attrName in component.attributes) {
            let comp = component.attributes[attrName].component;
            if (comp) {
                componentsToRecurse.push(comp);
            } else {
                let references = component.attributes[attrName].references;
                if (references) {
                    componentsToRecurse.push(...references);
                }
            }
        }

        // recurse on components created for reference-path indices,
        // e.g. the copy resolving `$oldIndex` in `$p[$oldIndex]`. These live
        // in the component's `refResolution` rather than in its children or
        // attributes, so they would otherwise leak when the component is
        // deleted (and their reserved component indices could then collide
        // with those of a recreated replacement).
        if (component.refResolution?.originalPath) {
            for (let pathPart of component.refResolution.originalPath) {
                for (let indexPiece of pathPart.index) {
                    for (let valueComp of indexPiece.value) {
                        if (typeof valueComp === "object") {
                            componentsToRecurse.push(valueComp);
                        }
                    }
                }
            }
        }

        // if delete an adapter, also delete component it is adapting
        if (component.adaptedFrom !== undefined) {
            componentsToRecurse.push(component.adaptedFrom);
        }

        if (deleteUpstreamDependencies === true) {
            // TODO: recurse on copy of the component (other composites?)

            // recurse on components that shadow
            if (followShadows && component.shadowedBy) {
                componentsToRecurse.push(...component.shadowedBy);
            }

            // recurse on replacements and adapters
            if (component.adapterUsed) {
                componentsToRecurse.push(component.adapterUsed);
            }
            if (component.replacements) {
                componentsToRecurse.push(...component.replacements);
            }
        }

        determineComponentsToDelete({
            core,
            components: componentsToRecurse,
            deleteUpstreamDependencies,
            componentsToDelete,
            followShadows,
        });
    }
}

/**
 * Forget what was saved of the component with `stateId`: its entry in
 * `cumulativeStateVariableChanges`, and the snapshot a save held of it as an
 * unlinked copy, with the key once it holds none (a save with no unlinked
 * copies left does not reach `recordCopySnapshots` to remove it).
 */
function deleteSavedState(core: Core, stateId: string) {
    delete core.cumulativeStateVariableChanges[stateId];
    const copySnapshots = core.cumulativeStateVariableChanges.__copySnapshots;
    if (copySnapshots) {
        delete copySnapshots[stateId];
        if (Object.keys(copySnapshots).length === 0) {
            delete core.cumulativeStateVariableChanges.__copySnapshots;
        }
    }
    core.readerTouchedStateIds.delete(stateId);
    core.definitionSetStateIds.delete(stateId);
}

/**
 * Keep what was saved of `component`, and queue it to be applied to a
 * component made later with its `stateId`, as a reload queues what it
 * restores. An unlinked copy also keeps the snapshot of what it made: a save
 * holds one only while a copy made again would differ, and it is not known
 * here whether a save has looked, so it is held until the next save after
 * the copy is made again (`recordCopySnapshots`).
 */
function keepSavedStateForRecreation(core: Core, component: any) {
    const stateId = component.stateId;
    if (component.unlinkedSnapshot) {
        core.cumulativeStateVariableChanges.__copySnapshots = {
            ...core.cumulativeStateVariableChanges.__copySnapshots,
            [stateId]: component.unlinkedSnapshot,
        };
    }
    queueSavedStateForRecreation(core, stateId);
}

/**
 * Queue a copy of what is saved for `stateId` to be applied to the component
 * made later with that `stateId`, replacing anything queued for it before.
 * With nothing saved yet, the entry is empty, which still marks what is kept:
 * a write later in the same update is added to it (`performUpdate`).
 */
export function queueSavedStateForRecreation(core: Core, stateId: string) {
    const entry = core.cumulativeStateVariableChanges[stateId];
    core.updateInfo.stateVariableUpdatesForMissingComponents[stateId] =
        entry === undefined
            ? {}
            : JSON.parse(
                  JSON.stringify(entry, serializedComponentsReplacer),
                  serializedComponentsReviver,
              );
}

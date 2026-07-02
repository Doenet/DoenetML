import type Core from "../Core";
import {
    deregisterComponent,
    processNewDefiningChildren,
} from "./ComponentLifecycle";
import { removeComponentsFromResolver } from "./ResolverAdapter";
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
 */
export async function deleteComponents({
    core,
    components,
    deleteUpstreamDependencies = true,
    skipProcessingChildrenOfParents = [],
}: {
    core: Core;
    components: any | any[];
    deleteUpstreamDependencies?: boolean;
    skipProcessingChildrenOfParents?: number[];
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

    for (const componentIdxStr in componentsToDelete) {
        const componentIdx = Number(componentIdxStr);
        let component = core._components[componentIdx];

        // delete from cumulativeStateVariableChanges
        delete core.cumulativeStateVariableChanges[component.stateId];

        // don't use recursive form since all children should already be included
        deregisterComponent({ core, component, recursive: false });

        // remove deleted components from this.updateInfo sets
        core.updateInfo.componentsToUpdateRenderers.delete(componentIdx);
        core.updateInfo.compositesToUpdateReplacements.delete(componentIdx);
        core.updateInfo.inactiveCompositesToUpdateReplacements.delete(
            componentIdx,
        );
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
 * `allChildren`, attribute components/references, the source of any
 * adapter, and (when `deleteUpstreamDependencies`) shadows, the
 * adapter the component itself produced, and any replacements.
 */
export function determineComponentsToDelete({
    core,
    components,
    deleteUpstreamDependencies,
    componentsToDelete,
}: {
    core: Core;
    components: any[];
    deleteUpstreamDependencies: boolean;
    componentsToDelete: Record<number, any>;
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

        // if delete an adapter, also delete component it is adapting
        if (component.adaptedFrom !== undefined) {
            componentsToRecurse.push(component.adaptedFrom);
        }

        if (deleteUpstreamDependencies === true) {
            // TODO: recurse on copy of the component (other composites?)

            // recurse on components that shadow
            if (component.shadowedBy) {
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
        });
    }
}

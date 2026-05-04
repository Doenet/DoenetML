import type Core from "./Core";
import { deriveChildResultsFromDefiningChildren } from "./ChildMatcher";
import { createIsolatedComponents } from "./ComponentBuilder";
import { postProcessCopy } from "./utils/copy";
import { createNewComponentIndices } from "./utils/componentIndices";

/**
 * Bookkeeping for component objects in the live tree:
 *
 * - `registerComponent` / `deregisterComponent` add and remove components
 *   from `core._components` (the canonical registry).
 * - `setAncestors` walks the tree to keep each component's `ancestors`
 *   chain in sync with its parent.
 * - `spliceChildren`, `addChildrenAndRecurseToShadows`,
 *   `processNewDefiningChildren` orchestrate insertion of new defining
 *   children into a parent and propagation to any composites that
 *   shadow that parent.
 *
 * Stateless — most functions take a back-reference to Core to read
 * `_components`, `parameterStack`, and to invoke
 * `deriveChildResultsFromDefiningChildren` and `createIsolatedComponents`.
 * (`spliceChildren` operates on a parent component only and takes no `core`.)
 */

/**
 * Add `component` to the canonical `_components` registry. Throws if
 * the index is already taken — duplicate indices indicate a bug in the
 * caller, so we fail loudly rather than silently overwriting.
 */
export function registerComponent({
    core,
    component,
}: {
    core: Core;
    component: any;
}): void {
    if (core._components[component.componentIdx] !== undefined) {
        throw Error(`Duplicate component index: ${component.componentIdx}`);
    }
    core._components[component.componentIdx] = component;
}

/**
 * Remove `component` (and, by default, all its `allChildren`) from
 * the registry. Pass `recursive: false` when the caller has already
 * walked the subtree and is deregistering each entry itself, e.g.
 * the `DeletionEngine` two-phase delete.
 */
export function deregisterComponent({
    core,
    component,
    recursive = true,
}: {
    core: Core;
    component: any;
    recursive?: boolean;
}): void {
    if (recursive) {
        for (let childIdxStr in component.allChildren) {
            deregisterComponent({
                core,
                component: component.allChildren[childIdxStr].component,
            });
        }
    }

    delete core._components[component.componentIdx];
}

export function setAncestors({
    core,
    component,
    ancestors = [],
}: {
    core: Core;
    component: any;
    ancestors?: any[];
}): void {
    // set ancestors based on allChildren and attribute components
    // so that all components get ancestors
    // even if not activeChildren or definingChildren

    component.ancestors = ancestors;

    let ancestorsForChildren = [
        {
            componentIdx: component.componentIdx,
            componentClass: component.constructor,
        },
        ...component.ancestors,
    ];

    for (const childIdxStr in component.allChildren) {
        let unproxiedChild = core._components[Number(childIdxStr)];
        // Note: when add and deleting replacements of shadowed composites,
        // it is possible that we end up processing the defining children of ancestors of the composite
        // while we were delaying processing the defining children of the composite's parent,
        // which could lead to an attempt to set the ancestors of that composite's parent's children
        // while the booking variable allChildren is in an inconsistent state.
        // To avoid an error, we don't set ancestors in the case
        // (See test "references to internal and external components, inconsistent new namespaces"
        // from conditionalcontent.cy.js for an example that triggered the need for this check.)
        // TODO: can we avoid the need for this check by preventing the algorithm from
        // attempting to set ancestors in this case?
        if (unproxiedChild) {
            setAncestors({
                core,
                component: unproxiedChild,
                ancestors: ancestorsForChildren,
            });
        }
    }

    for (let attrName in component.attributes) {
        let comp = component.attributes[attrName].component;
        if (comp) {
            setAncestors({
                core,
                component: comp,
                ancestors: ancestorsForChildren,
            });
        }
    }
}

/**
 * Splice `newChildren` into `parent.definingChildren` at the given
 * index, derive child results, and propagate the same insertion to
 * every composite that shadows `parent` (recursively). Returns the
 * cumulative `addedComponents` / `deletedComponents` from `parent`
 * and all shadowing parents.
 */
export async function addChildrenAndRecurseToShadows({
    core,
    parent,
    indexOfDefiningChildren,
    newChildren,
}: {
    core: Core;
    parent: any;
    indexOfDefiningChildren: number;
    newChildren: any[];
}): Promise<any> {
    spliceChildren({ parent, indexOfDefiningChildren, newChildren });

    let newChildrenResult = await processNewDefiningChildren({
        core,
        parent,
    });

    let addedComponents: Record<number, any> = {};
    let deletedComponents: Record<number, any> = {};

    if (!newChildrenResult.success) {
        // try again, this time force expanding composites before giving up
        newChildrenResult = await processNewDefiningChildren({
            core,
            parent,
            forceExpandComposites: true,
        });

        if (!newChildrenResult.success) {
            return newChildrenResult;
        }
    }

    for (let child of newChildren) {
        if (typeof child === "object") {
            addedComponents[child.componentIdx] = child;
        }
    }

    if (parent.shadowedBy) {
        for (let shadowingParent of parent.shadowedBy) {
            if (
                shadowingParent.shadows.propVariable ||
                shadowingParent.constructor.doNotExpandAsShadowed
            ) {
                continue;
            }

            let shadowingSerializeChildren: any[] = [];
            let nComponents = core._components.length;

            for (let child of newChildren) {
                if (typeof child === "object") {
                    const serializedComponent = await child.serialize();

                    const res = createNewComponentIndices(
                        [serializedComponent],
                        nComponents,
                    );
                    nComponents = res.nComponents;

                    shadowingSerializeChildren.push(...res.components);
                } else {
                    shadowingSerializeChildren.push(child);
                }
            }

            if (nComponents > core._components.length) {
                core._components[nComponents - 1] = undefined;
            }

            shadowingSerializeChildren = postProcessCopy({
                serializedComponents: shadowingSerializeChildren,
                componentIdx: shadowingParent.shadows.compositeIdx,
            });

            let unproxiedShadowingParent =
                core._components[shadowingParent.componentIdx];
            core.parameterStack.push(
                unproxiedShadowingParent.sharedParameters,
                false,
            );

            let createResult = await createIsolatedComponents({
                core,
                serializedComponents: shadowingSerializeChildren,
                ancestors: shadowingParent.ancestors,
            });

            core.parameterStack.pop();

            let shadowResult = await addChildrenAndRecurseToShadows({
                core,
                parent: unproxiedShadowingParent,
                indexOfDefiningChildren,
                newChildren: createResult.components,
            });

            if (!shadowResult.success) {
                throw Error(
                    `was able to add components to parent but not shadows!`,
                );
            }

            Object.assign(addedComponents, shadowResult.addedComponents);
        }
    }

    return {
        success: true,
        deletedComponents,
        addedComponents,
    };
}

/**
 * Run child-group matching for `parent` after its `definingChildren`
 * have been mutated. Pushes/pops `sharedParameters` around the call
 * and re-syncs `ancestors` for every entry in `allChildren` (the
 * matched/adapted set may differ from `definingChildren`).
 */
export async function processNewDefiningChildren({
    core,
    parent,
    expandComposites = true,
    forceExpandComposites = false,
}: {
    core: Core;
    parent: any;
    expandComposites?: boolean;
    forceExpandComposites?: boolean;
}): Promise<any> {
    core.parameterStack.push(parent.sharedParameters, false);
    let childResult = await deriveChildResultsFromDefiningChildren({
        core,
        parent,
        expandComposites,
        forceExpandComposites,
    });
    core.parameterStack.pop();

    let ancestorsForChildren = [
        {
            componentIdx: parent.componentIdx,
            componentClass: parent.constructor,
        },
        ...parent.ancestors,
    ];

    // set ancestors for allChildren of parent
    // since could replace newChildren by adapters or via composites
    for (const childIdxStr in parent.allChildren) {
        let unproxiedChild = core._components[Number(childIdxStr)];
        setAncestors({
            core,
            component: unproxiedChild,
            ancestors: ancestorsForChildren,
        });
    }

    return childResult;
}

export function spliceChildren({
    parent,
    indexOfDefiningChildren,
    newChildren,
}: {
    parent: any;
    indexOfDefiningChildren: number;
    newChildren: any[];
}): void {
    // splice newChildren into parent.definingChildren
    // definingChildrenNumber is the index of parent.definingChildren
    // before which to splice the newChildren (set to array length to add at end)

    let numDefiningChildren = parent.definingChildren.length;

    if (
        !Number.isInteger(indexOfDefiningChildren) ||
        indexOfDefiningChildren > numDefiningChildren ||
        indexOfDefiningChildren < 0
    ) {
        throw Error(
            "Can't add children at index " +
                indexOfDefiningChildren +
                ". Invalid index.",
        );
    }

    // perform the actual splicing into children
    parent.definingChildren.splice(indexOfDefiningChildren, 0, ...newChildren);
}

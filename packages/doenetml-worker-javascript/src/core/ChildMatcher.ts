import type Core from "../Core";
import { assignDoenetMLRange } from "@doenet/utils";
import { createIsolatedComponents } from "./ComponentBuilder";
import {
    expandCompositeOfDefiningChildren,
    replaceCompositeChildren,
} from "./CompositeExpander";

/**
 * Resolves a parent's defining children into matched, adapted, ordered
 * `activeChildren` and bookkeeping in `allChildren` / `allChildrenOrdered`,
 * including substituting adapters when a child cannot be matched directly
 * to a parent's child group, and computing which active children should
 * actually be rendered.
 *
 * Stateless apart from the module-level `derivingChildResultsInProgress`
 * recursion guard (a `WeakMap<Core, Set<number>>`). Each function takes a
 * back-reference
 * to Core to read `_components`, `componentInfoObjects`, `dependencies`,
 * `updateInfo`, and to invoke expansion methods
 * (`expandCompositeOfDefiningChildren`, `replaceCompositeChildren`,
 * `createIsolatedComponents`) and append to `unmatchedChildren`.
 */

/**
 * Re-entrancy guard: parents currently inside
 * `deriveChildResultsFromDefiningChildren`. Composite expansion can
 * call back into the same parent indirectly; on re-entry we return
 * `{ success: false, skipping: true }` so the outer call finishes first.
 *
 * Keyed by Core instance so multiple Core objects in the same JS context
 * (e.g. simultaneous vitest suites) cannot collide on a shared componentIdx.
 * WeakMap also ensures entries are GC'd when a Core is dropped.
 */
const derivingChildResultsInProgress: WeakMap<
    Core,
    Set<number>
> = new WeakMap();

/**
 * Build `parent.activeChildren`, `parent.allChildren`, and
 * `parent.allChildrenOrdered` from `parent.definingChildren`:
 * expand any composites that aren't directly matchable, substitute
 * adapters for unmatched children, and run child-group matching.
 * On a successful pass, appends blockers to dependency tracking and
 * marks the parent for re-render if its rendered child set changed.
 */
export async function deriveChildResultsFromDefiningChildren({
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
    let inProgress = derivingChildResultsInProgress.get(core);
    if (!inProgress) {
        inProgress = new Set();
        derivingChildResultsInProgress.set(core, inProgress);
    }
    if (inProgress.has(parent.componentIdx)) {
        return { success: false, skipping: true };
    }
    inProgress.add(parent.componentIdx);

    try {
        // create allChildren and activeChildren from defining children
        // apply child logic and substitute adapters to modify activeChildren

        // attempt to expand composites before modifying active children
        let result = await expandCompositeOfDefiningChildren({
            core,
            parent,
            children: parent.definingChildren,
            expandComposites,
            forceExpandComposites,
        });
        parent.unexpandedCompositesReady = result.unexpandedCompositesReady;
        parent.unexpandedCompositesNotReady =
            result.unexpandedCompositesNotReady;

        let previousActiveChildren: any[] | undefined;

        if (parent.activeChildren) {
            previousActiveChildren = parent.activeChildren.map((child: any) =>
                child.componentIdx ? child.componentIdx : child,
            );
        }

        parent.activeChildren = parent.definingChildren.slice(); // shallow copy

        // allChildren include activeChildren, definingChildren,
        // and possibly some children that are neither
        // (which could occur when a composite is expanded and the result is adapted)
        // ignores string and number primitive children
        parent.allChildren = {};

        // allChildrenOrdered contains same children as allChildren,
        // but retaining an order that we can use for counters.
        // If defining children are replaced my composite replacements or adapters,
        // those children will come immediately after the corresponding defining child
        parent.allChildrenOrdered = [];

        for (let ind = 0; ind < parent.activeChildren.length; ind++) {
            let child = parent.activeChildren[ind];
            let childIdx;
            if (typeof child !== "object") {
                continue;
            }

            childIdx = child.componentIdx;

            parent.allChildren[childIdx] = {
                activeChildrenIndex: ind,
                definingChildrenIndex: ind,
                component: child,
            };

            parent.allChildrenOrdered.push(childIdx);
        }

        // if any of activeChildren are expanded compositeComponents
        // replace with new components given by the composite component
        await replaceCompositeChildren({ core, parent });

        const childGroupResults = await matchChildrenToChildGroups({
            core,
            parent,
        });

        if (childGroupResults.success) {
            delete core.unmatchedChildren[parent.componentIdx];
            parent.childrenMatchedWithPlaceholders = true;
            parent.matchedCompositeChildrenWithPlaceholders = true;
        } else {
            parent.childrenMatchedWithPlaceholders = false;
            parent.matchedCompositeChildrenWithPlaceholders = true;

            let unmatchedChildrenTypes: string[] = [];
            for (let child of childGroupResults.unmatchedChildren) {
                if (typeof child === "string") {
                    unmatchedChildrenTypes.push("string");
                } else {
                    unmatchedChildrenTypes.push(
                        "`<" + child.componentType + ">`",
                    );
                    if (
                        core.componentInfoObjects.isInheritedComponentType({
                            inheritedComponentType: child.componentType,
                            baseComponentType: "_composite",
                        })
                    ) {
                        parent.matchedCompositeChildrenWithPlaceholders = false;
                    }
                }
            }

            if (parent.doenetAttributes.isAttributeChildFor) {
                let attributeForComponentType =
                    parent.ancestors[0].componentClass.componentType;
                core.unmatchedChildren[parent.componentIdx] = {
                    message: `Invalid format for attribute ${parent.doenetAttributes.isAttributeChildFor} of \`<${attributeForComponentType}>\`.`,
                };
            } else {
                core.unmatchedChildren[parent.componentIdx] = {
                    message: `Invalid children for \`<${
                        parent.componentType
                    }>\`: Found invalid children: ${unmatchedChildrenTypes.join(
                        ", ",
                    )}`,
                };
            }
        }

        await core.dependencies.addBlockersFromChangedActiveChildren({
            parent,
        });

        if (parent.constructor.renderChildren) {
            let childrenUnchanged =
                previousActiveChildren &&
                previousActiveChildren.length == parent.activeChildren.length &&
                parent.activeChildren.every((child: any, ind: number) =>
                    child.componentIdx
                        ? child.componentIdx === previousActiveChildren![ind]
                        : child === previousActiveChildren![ind],
                );
            if (!childrenUnchanged) {
                core.componentsWithChangedChildrenToRender.add(
                    parent.componentIdx,
                );
            }
        }

        return childGroupResults;
    } finally {
        inProgress.delete(parent.componentIdx);
    }
}

/**
 * For each `activeChild` of `parent`, find the parent class's child
 * group that accepts the child's component type, substituting an
 * adapter if a direct match isn't available. Populates
 * `parent.childMatchesByGroup`. Returns `{ success, unmatchedChildren }`
 * where `success` is false iff any child could not be matched.
 */
export async function matchChildrenToChildGroups({
    core,
    parent,
}: {
    core: Core;
    parent: any;
}): Promise<any> {
    parent.childMatchesByGroup = {};

    for (let groupName in parent.constructor.childGroupIndsByName) {
        parent.childMatchesByGroup[groupName] = [];
    }

    let success = true;

    let unmatchedChildren: any[] = [];

    for (let [ind, child] of parent.activeChildren.entries() as Iterable<
        [number, any]
    >) {
        let childType =
            typeof child !== "object" ? typeof child : child.componentType;

        if (childType === undefined) {
            success = false;
            unmatchedChildren.push(child);
            continue;
        }

        let result = findChildGroup({
            core,
            childType,
            parentClass: parent.constructor,
        });

        if (result.success) {
            parent.childMatchesByGroup[result.group!].push(ind);

            if (result.adapterIndUsed !== undefined) {
                await substituteAdapter({
                    core,
                    parent,
                    childInd: ind,
                    adapterIndUsed: result.adapterIndUsed,
                });
            }
        } else {
            success = false;
            unmatchedChildren.push(child);
        }
    }

    return { success, unmatchedChildren };
}

/**
 * Try to match `childType` directly against `parentClass`'s child
 * groups; if no match, walk the child class's adapter list and try
 * each adapter component type in turn; finally retry with
 * `afterAdapters: true` for groups that opt into late matching.
 * Returns the matching `group` and (if applicable) `adapterIndUsed`.
 */
export function findChildGroup({
    core,
    childType,
    parentClass,
}: {
    core: Core;
    childType: string;
    parentClass: any;
}): {
    success: boolean;
    group?: string;
    adapterIndUsed?: number;
} {
    let result = findChildGroupNoAdapters({
        core,
        componentType: childType,
        parentClass,
    });

    if (result.success) {
        return result;
    } else if (childType === "string") {
        return { success: false };
    }

    // check if can match with adapters
    let childClass = core.componentInfoObjects.allComponentClasses[childType];

    // if didn't match child, attempt to match with child's adapters
    let numAdapters = childClass.numAdapters;

    for (let n = 0; n < numAdapters; n++) {
        let adapterComponentType = childClass.getAdapterComponentType(
            n,
            core.componentInfoObjects.publicStateVariableInfo,
        );

        result = findChildGroupNoAdapters({
            core,
            componentType: adapterComponentType,
            parentClass,
        });

        if (result.success) {
            (result as any).adapterIndUsed = n;
            return result;
        }
    }

    // lastly try to match with afterAdapters set to true
    return findChildGroupNoAdapters({
        core,
        componentType: childType,
        parentClass,
        afterAdapters: true,
    });
}

export function findChildGroupNoAdapters({
    core,
    componentType,
    parentClass,
    afterAdapters = false,
}: {
    core: Core;
    componentType: string;
    parentClass: any;
    afterAdapters?: boolean;
}): { success: boolean; group?: string } {
    if (parentClass.childGroupOfComponentType[componentType]) {
        return {
            success: true,
            group: parentClass.childGroupOfComponentType[componentType],
        };
    }

    for (let group of parentClass.childGroups) {
        for (let typeFromGroup of group.componentTypes) {
            if (
                core.componentInfoObjects.isInheritedComponentType({
                    inheritedComponentType: componentType,
                    baseComponentType: typeFromGroup,
                })
            ) {
                if (group.matchAfterAdapters && !afterAdapters) {
                    continue;
                }
                // don't match composites to the base component
                // so that they will expand
                if (!(
                    typeFromGroup === "_base" &&
                    core.componentInfoObjects.isInheritedComponentType({
                        inheritedComponentType: componentType,
                        baseComponentType: "_composite",
                    })
                )) {
                    parentClass.childGroupOfComponentType[componentType] =
                        group.group;

                    return {
                        success: true,
                        group: group.group,
                    };
                }
            }
        }
    }

    return { success: false };
}

/**
 * Compute which entries of `component.activeChildren` should actually
 * be passed to the renderer. Honors `numChildrenToRender`,
 * `childIndicesToRender`, per-child `hidden`, and propagates
 * `hidden` from any composite that produced a primitive child.
 */
export async function returnActiveChildrenIndicesToRender({
    core,
    component,
}: {
    core: Core;
    component: any;
}): Promise<number[]> {
    let indicesToRender: number[] = [];
    let numChildrenToRender = Infinity;
    if ("numChildrenToRender" in component.state) {
        numChildrenToRender = await component.stateValues.numChildrenToRender;
    }
    let childIndicesToRender: number[] | null = null;
    if ("childIndicesToRender" in component.state) {
        childIndicesToRender = await component.stateValues.childIndicesToRender;
    }

    for (let [ind, child] of component.activeChildren.entries() as Iterable<
        [number, any]
    >) {
        if (ind >= numChildrenToRender) {
            break;
        }

        if (childIndicesToRender && !childIndicesToRender.includes(ind)) {
            continue;
        }

        if (typeof child === "object") {
            if (
                child.constructor.sendToRendererEvenIfHidden ||
                !(await child.stateValues.hidden)
            ) {
                indicesToRender.push(ind);
            }
        } else {
            // if have a primitive,
            // will be hidden if a composite source is hidden
            let hidden = false;
            if (component.compositeReplacementActiveRange) {
                for (let compositeInfo of component.compositeReplacementActiveRange) {
                    let composite =
                        core._components[compositeInfo.compositeIdx];
                    if (await composite.stateValues.hidden) {
                        if (
                            compositeInfo.firstInd <= ind &&
                            compositeInfo.lastInd >= ind
                        ) {
                            hidden = true;
                            break;
                        }
                    }
                }
            }
            if (!hidden) {
                indicesToRender.push(ind);
            }
        }
    }

    return indicesToRender;
}

/**
 * Replace `parent.activeChildren[childInd]` with the adapter selected
 * by `adapterIndUsed`, creating the adapter component if it doesn't
 * already exist or doesn't match the desired component type.
 * Updates `allChildren` and `allChildrenOrdered` to reflect the swap
 * (the adapter is placed immediately after the original child in the
 * order so counters stay stable).
 */
export async function substituteAdapter({
    core,
    parent,
    childInd,
    adapterIndUsed,
}: {
    core: Core;
    parent: any;
    childInd: number;
    adapterIndUsed: number;
}): Promise<void> {
    let originalChild = parent.activeChildren[childInd];

    let newSerializedChild: any;
    if (originalChild.componentIdx != undefined) {
        newSerializedChild = originalChild.getAdapter(adapterIndUsed);
        newSerializedChild.componentIdx = core._components.length;
        core._components[core._components.length] = undefined;
    } else {
        // XXX: how does this work with the new componentIdx approach?

        // child isn't a component, just an object with a componentType
        // Create an object that is just the componentType of the adapter
        newSerializedChild = {
            componentType: core.componentInfoObjects.allComponentClasses[
                originalChild.componentType
            ].getAdapterComponentType(
                adapterIndUsed,
                core.componentInfoObjects.publicStateVariableInfo,
            ),
            placeholderInd: originalChild.placeholderInd + "adapt",
        };
    }

    let adapter = originalChild.adapterUsed;

    if (
        adapter === undefined ||
        adapter.componentType !== newSerializedChild.componentType
    ) {
        if (originalChild.componentIdx != undefined) {
            newSerializedChild.adaptedFrom = originalChild.componentIdx;
            assignDoenetMLRange(
                [newSerializedChild],
                originalChild.position,
                originalChild.sourceDoc,
            );
            let newChildrenResult = await createIsolatedComponents({
                core,
                serializedComponents: [newSerializedChild],
                shadow: true,
                ancestors: originalChild.ancestors,
            });

            adapter = newChildrenResult.components[0];
        } else {
            // XXX: how does this work with the new componentIdx approach?

            // didn't have a component for the original child, just a componentType
            // Adapter will also just be the componentType returned from childmatches
            newSerializedChild.adaptedFrom = originalChild;
            adapter = newSerializedChild;
        }
    }

    // Replace originalChild with its adapter in activeChildren
    parent.activeChildren.splice(childInd, 1, adapter);

    // TODO: if originalChild is a placeholder, we lose track of it
    // (other than through adaptedFrom of adapted)
    // once we splice it out of activeChildren.  Is that a problem?

    // Update allChildren to show that originalChild is no longer active
    // and that adapter is now an active child
    if (originalChild.componentIdx != undefined) {
        // ignore placeholder active children
        delete parent.allChildren[originalChild.componentIdx]
            .activeChildrenIndex;
        parent.allChildren[adapter.componentIdx] = {
            activeChildrenIndex: childInd,
            component: adapter,
        };
    }

    // find index of originalChild in allChildrenOrdered
    // and place adapter immediately afterward
    if (originalChild.componentIdx != undefined) {
        let originalInd = parent.allChildrenOrdered.indexOf(
            originalChild.componentIdx,
        );
        parent.allChildrenOrdered.splice(
            originalInd + 1,
            0,
            adapter.componentIdx,
        );
    } else {
        // adapter of placeholder
        let originalInd = parent.allChildrenOrdered.indexOf(
            originalChild.placeholderInd,
        );
        parent.allChildrenOrdered.splice(
            originalInd + 1,
            0,
            adapter.placeholderInd,
        );
    }
}

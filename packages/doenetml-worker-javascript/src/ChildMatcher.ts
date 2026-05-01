import { assignDoenetMLRange } from "@doenet/utils";

/**
 * Resolves a parent's defining children into matched, adapted, ordered
 * `activeChildren` and bookkeeping in `allChildren` / `allChildrenOrdered`,
 * including substituting adapters when a child cannot be matched directly
 * to a parent's child group, and computing which active children should
 * actually be rendered.
 *
 * Stateless apart from a recursion guard (`derivingChildResultsInProgress`).
 * Holds a back-reference to Core to read `_components`,
 * `componentInfoObjects`, `dependencies`, `updateInfo`, and to invoke
 * Phase-3 expansion methods (`expandCompositeOfDefiningChildren`,
 * `replaceCompositeChildren`, `expandCompositeComponent`,
 * `createIsolatedComponents`) and append to `unmatchedChildren`.
 */
export class ChildMatcher {
    core: any;
    derivingChildResultsInProgress: number[];

    constructor({ core }: { core: any }) {
        this.core = core;
        this.derivingChildResultsInProgress = [];
    }

    async deriveChildResultsFromDefiningChildren({
        parent,
        expandComposites = true,
        forceExpandComposites = false,
    }: {
        parent: any;
        expandComposites?: boolean;
        forceExpandComposites?: boolean;
    }): Promise<any> {
        if (
            this.derivingChildResultsInProgress.includes(parent.componentIdx)
        ) {
            return { success: false, skipping: true };
        }
        this.derivingChildResultsInProgress.push(parent.componentIdx);

        // create allChildren and activeChildren from defining children
        // apply child logic and substitute adapters to modify activeChildren

        // attempt to expand composites before modifying active children
        let result = await this.core.expandCompositeOfDefiningChildren(
            parent,
            parent.definingChildren,
            expandComposites,
            forceExpandComposites,
        );
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
        await this.core.replaceCompositeChildren(parent);

        let childGroupResults = await this.matchChildrenToChildGroups(parent);

        if (childGroupResults.success) {
            delete this.core.unmatchedChildren[parent.componentIdx];
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
                        this.core.componentInfoObjects.isInheritedComponentType(
                            {
                                inheritedComponentType: child.componentType,
                                baseComponentType: "_composite",
                            },
                        )
                    ) {
                        parent.matchedCompositeChildrenWithPlaceholders = false;
                    }
                }
            }

            if (parent.doenetAttributes.isAttributeChildFor) {
                let attributeForComponentType =
                    parent.ancestors[0].componentClass.componentType;
                this.core.unmatchedChildren[parent.componentIdx] = {
                    message: `Invalid format for attribute ${parent.doenetAttributes.isAttributeChildFor} of \`<${attributeForComponentType}>\`.`,
                };
            } else {
                this.core.unmatchedChildren[parent.componentIdx] = {
                    message: `Invalid children for \`<${
                        parent.componentType
                    }>\`: Found invalid children: ${unmatchedChildrenTypes.join(
                        ", ",
                    )}`,
                };
            }
        }

        await this.core.dependencies.addBlockersFromChangedActiveChildren({
            parent,
        });

        let ind = this.derivingChildResultsInProgress.indexOf(
            parent.componentIdx,
        );

        this.derivingChildResultsInProgress.splice(ind, 1);

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
                this.core.componentsWithChangedChildrenToRender.add(
                    parent.componentIdx,
                );
            }
        }

        return childGroupResults;
    }

    async matchChildrenToChildGroups(parent: any): Promise<any> {
        parent.childMatchesByGroup = {};

        for (let groupName in parent.constructor.childGroupIndsByName) {
            parent.childMatchesByGroup[groupName] = [];
        }

        let success = true;

        let unmatchedChildren: any[] = [];

        for (let [ind, child] of (
            parent.activeChildren.entries() as Iterable<[number, any]>
        )) {
            let childType =
                typeof child !== "object" ? typeof child : child.componentType;

            if (childType === undefined) {
                success = false;
                unmatchedChildren.push(child);
                continue;
            }

            let result = this.findChildGroup(childType, parent.constructor);

            if (result.success) {
                parent.childMatchesByGroup[result.group!].push(ind);

                if (result.adapterIndUsed !== undefined) {
                    await this.substituteAdapter({
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

    findChildGroup(
        childType: string,
        parentClass: any,
    ): {
        success: boolean;
        group?: string;
        adapterIndUsed?: number;
    } {
        let result = this.findChildGroupNoAdapters(childType, parentClass);

        if (result.success) {
            return result;
        } else if (childType === "string") {
            return { success: false };
        }

        // check if can match with adapters
        let childClass =
            this.core.componentInfoObjects.allComponentClasses[childType];

        // if didn't match child, attempt to match with child's adapters
        let numAdapters = childClass.numAdapters;

        for (let n = 0; n < numAdapters; n++) {
            let adapterComponentType = childClass.getAdapterComponentType(
                n,
                this.core.componentInfoObjects.publicStateVariableInfo,
            );

            result = this.findChildGroupNoAdapters(
                adapterComponentType,
                parentClass,
            );

            if (result.success) {
                (result as any).adapterIndUsed = n;
                return result;
            }
        }

        // lastly try to match with afterAdapters set to true
        return this.findChildGroupNoAdapters(childType, parentClass, true);
    }

    findChildGroupNoAdapters(
        componentType: string,
        parentClass: any,
        afterAdapters: boolean = false,
    ): { success: boolean; group?: string } {
        if (parentClass.childGroupOfComponentType[componentType]) {
            return {
                success: true,
                group: parentClass.childGroupOfComponentType[componentType],
            };
        }

        for (let group of parentClass.childGroups) {
            for (let typeFromGroup of group.componentTypes) {
                if (
                    this.core.componentInfoObjects.isInheritedComponentType({
                        inheritedComponentType: componentType,
                        baseComponentType: typeFromGroup,
                    })
                ) {
                    if (group.matchAfterAdapters && !afterAdapters) {
                        continue;
                    }
                    // don't match composites to the base component
                    // so that they will expand
                    if (
                        !(
                            typeFromGroup === "_base" &&
                            this.core.componentInfoObjects.isInheritedComponentType(
                                {
                                    inheritedComponentType: componentType,
                                    baseComponentType: "_composite",
                                },
                            )
                        )
                    ) {
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

    async returnActiveChildrenIndicesToRender(component: any): Promise<number[]> {
        let indicesToRender: number[] = [];
        let numChildrenToRender = Infinity;
        if ("numChildrenToRender" in component.state) {
            numChildrenToRender =
                await component.stateValues.numChildrenToRender;
        }
        let childIndicesToRender: number[] | null = null;
        if ("childIndicesToRender" in component.state) {
            childIndicesToRender =
                await component.stateValues.childIndicesToRender;
        }

        for (let [ind, child] of (
            component.activeChildren.entries() as Iterable<[number, any]>
        )) {
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
                            this.core._components[compositeInfo.compositeIdx];
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

    async substituteAdapter({
        parent,
        childInd,
        adapterIndUsed,
    }: {
        parent: any;
        childInd: number;
        adapterIndUsed: number;
    }): Promise<void> {
        // replace activeChildren with their adapters

        let originalChild = parent.activeChildren[childInd];

        let newSerializedChild: any;
        if (originalChild.componentIdx != undefined) {
            newSerializedChild = originalChild.getAdapter(adapterIndUsed);
            newSerializedChild.componentIdx = this.core._components.length;
            this.core._components[this.core._components.length] = undefined;
        } else {
            // XXX: how does this work with the new componentIdx approach?

            // child isn't a component, just an object with a componentType
            // Create an object that is just the componentType of the adapter
            newSerializedChild = {
                componentType:
                    this.core.componentInfoObjects.allComponentClasses[
                        originalChild.componentType
                    ].getAdapterComponentType(
                        adapterIndUsed,
                        this.core.componentInfoObjects.publicStateVariableInfo,
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
                let newChildrenResult =
                    await this.core.createIsolatedComponents({
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
}

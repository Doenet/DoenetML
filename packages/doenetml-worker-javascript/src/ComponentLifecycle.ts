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
 * Stateless — holds a back-reference to Core to read `_components`,
 * `parameterStack`, and to invoke `deriveChildResultsFromDefiningChildren`
 * and `createIsolatedComponents` (the latter still on Core through Phase 3).
 */
export class ComponentLifecycle {
    core: any;

    constructor({ core }: { core: any }) {
        this.core = core;
    }

    registerComponent(component: any): void {
        if (this.core._components[component.componentIdx] !== undefined) {
            throw Error(`Duplicate component index: ${component.componentIdx}`);
        }
        this.core._components[component.componentIdx] = component;
    }

    deregisterComponent(component: any, recursive: boolean = true): void {
        if (recursive === true) {
            for (let childIdxStr in component.allChildren) {
                this.deregisterComponent(
                    component.allChildren[childIdxStr].component,
                );
            }
        }

        delete this.core._components[component.componentIdx];
    }

    setAncestors(component: any, ancestors: any[] = []): void {
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
            let unproxiedChild = this.core._components[childIdxStr];
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
                this.setAncestors(unproxiedChild, ancestorsForChildren);
            }
        }

        for (let attrName in component.attributes) {
            let comp = component.attributes[attrName].component;
            if (comp) {
                this.setAncestors(comp, ancestorsForChildren);
            }
        }
    }

    async addChildrenAndRecurseToShadows({
        parent,
        indexOfDefiningChildren,
        newChildren,
    }: {
        parent: any;
        indexOfDefiningChildren: number;
        newChildren: any[];
    }): Promise<any> {
        this.spliceChildren(parent, indexOfDefiningChildren, newChildren);

        let newChildrenResult = await this.processNewDefiningChildren({
            parent,
            expandComposites: true,
        });

        let addedComponents: Record<number, any> = {};
        let deletedComponents: Record<number, any> = {};

        if (!newChildrenResult.success) {
            // try again, this time force expanding composites before giving up
            newChildrenResult = await this.processNewDefiningChildren({
                parent,
                expandComposites: true,
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
                let nComponents = this.core._components.length;

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

                if (nComponents > this.core.components.length) {
                    this.core._components[nComponents - 1] = undefined;
                }

                shadowingSerializeChildren = postProcessCopy({
                    serializedComponents: shadowingSerializeChildren,
                    componentIdx: shadowingParent.shadows.compositeIdx,
                });

                let unproxiedShadowingParent =
                    this.core._components[shadowingParent.componentIdx];
                this.core.parameterStack.push(
                    unproxiedShadowingParent.sharedParameters,
                    false,
                );

                let createResult = await this.core.createIsolatedComponents({
                    serializedComponents: shadowingSerializeChildren,
                    ancestors: shadowingParent.ancestors,
                });

                this.core.parameterStack.pop();

                let shadowResult = await this.addChildrenAndRecurseToShadows({
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

    async processNewDefiningChildren({
        parent,
        expandComposites = true,
        forceExpandComposites = false,
    }: {
        parent: any;
        expandComposites?: boolean;
        forceExpandComposites?: boolean;
    }): Promise<any> {
        this.core.parameterStack.push(parent.sharedParameters, false);
        let childResult =
            await this.core.deriveChildResultsFromDefiningChildren({
                parent,
                expandComposites,
                forceExpandComposites,
            });
        this.core.parameterStack.pop();

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
            let unproxiedChild = this.core._components[childIdxStr];
            this.setAncestors(unproxiedChild, ancestorsForChildren);
        }

        return childResult;
    }

    spliceChildren(
        parent: any,
        indexOfDefiningChildren: number,
        newChildren: any[],
    ): void {
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
        parent.definingChildren.splice(
            indexOfDefiningChildren,
            0,
            ...newChildren,
        );
    }
}

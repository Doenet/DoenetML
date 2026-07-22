/**
 * Shared helpers implementing the `addChildren`/`deleteChildren` actions for any
 * component that opts in to dynamically-added children.
 *
 * Such a component must have a `<_dynamicChildren>` defining child appended during
 * normalization (see `COMPONENTS_WITH_DYNAMIC_CHILDREN` in the parser's
 * `component-sugar/dynamicChildren`). These helpers locate that internal composite
 * child and delegate to its own `addChildren`/`deleteChildren` actions.
 *
 * To opt a component in:
 *   1. Add its component type to `COMPONENTS_WITH_DYNAMIC_CHILDREN` in the parser.
 *   2. In the component's constructor, register the actions, e.g.:
 *        Object.assign(this.actions, {
 *            addChildren: this.addChildren.bind(this),
 *            deleteChildren: this.deleteChildren.bind(this),
 *        });
 *      and define `addChildren`/`deleteChildren` methods that call these helpers.
 */

function findDynamicChildren(component) {
    return component.definingChildren?.findLast(
        (child) => child.componentType === "_dynamicChildren",
    );
}

/**
 * Add children to `component` by delegating to its `<_dynamicChildren>` child.
 * No-ops (returns undefined) if the component has no such child.
 */
export async function addChildrenToDynamicChild(component, args) {
    const dynamicChildren = findDynamicChildren(component);

    if (!dynamicChildren) {
        return undefined;
    }

    return await dynamicChildren.addChildren(args);
}

/**
 * Delete children from `component` by delegating to its `<_dynamicChildren>` child.
 * No-ops (returns undefined) if the component has no such child.
 */
export async function deleteChildrenFromDynamicChild(component, args) {
    const dynamicChildren = findDynamicChildren(component);

    if (!dynamicChildren) {
        return undefined;
    }

    return await dynamicChildren.deleteChildren(args);
}

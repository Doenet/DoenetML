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

/**
 * The `<_dynamicChildren>` of `component` that takes added children: its own,
 * which normalization appends last. With `useSource`, it is instead the first
 * one, which on an extend is the shadow of the source's `<_dynamicChildren>`,
 * so what is added goes to the source and shows in it and in every extend.
 */
function findDynamicChildren(component, { useSource = false } = {}) {
    const isDynamicChildren = (child) =>
        child.componentType === "_dynamicChildren";
    return useSource
        ? component.definingChildren?.find(isDynamicChildren)
        : component.definingChildren?.findLast(isDynamicChildren);
}

/**
 * Add children to `component` by delegating to its `<_dynamicChildren>` child.
 * No-ops (returns undefined) if the component has no such child.
 * `options.useSource`: see `findDynamicChildren`.
 */
export async function addChildrenToDynamicChild(component, args, options) {
    const dynamicChildren = findDynamicChildren(component, options);

    if (!dynamicChildren) {
        return undefined;
    }

    return await dynamicChildren.addChildren(args);
}

/**
 * Delete children from `component` by delegating to its `<_dynamicChildren>` child.
 * No-ops (returns undefined) if the component has no such child.
 * `options.useSource`: see `findDynamicChildren`.
 */
export async function deleteChildrenFromDynamicChild(component, args, options) {
    const dynamicChildren = findDynamicChildren(component, options);

    if (!dynamicChildren) {
        return undefined;
    }

    return await dynamicChildren.deleteChildren(args);
}

import { DastElement } from "../../types";

/**
 * The set of component types that support adding children dynamically (via an
 * `addChildren` action). For each such component, a `<_dynamicChildren>` element
 * is appended to its children during normalization so that additional children
 * can be added at runtime.
 *
 * To opt a new component in to the `addChildren`/`deleteChildren` actions:
 *   1. Add its component type to this set.
 *   2. Register the shared `addChildren`/`deleteChildren` actions on the
 *      component class in the worker (see `utils/dynamicChildren` in
 *      `doenetml-worker-javascript`).
 *
 * Note: sectioning components such as `<section>` are expanded to
 * `<division type="section">` before sugar runs, so this set lists the
 * post-expansion `type` (e.g. `section`), and `nodeSupportsDynamicChildren`
 * resolves a `<division>`'s effective type from its `type` attribute.
 */
export const COMPONENTS_WITH_DYNAMIC_CHILDREN = new Set([
    "graph",
    "stickyGroup",
    "section",
    "subsection",
    "subsubsection",
    "paragraphs",
]);

/**
 * Return the effective component type used to decide whether a node supports
 * dynamic children. For a `<division>` (the expansion target of sectioning
 * components), this is the value of its `type` attribute; otherwise it is the
 * node's own name.
 */
function effectiveComponentType(node: DastElement): string {
    if (node.name === "division") {
        const typeAttr = node.attributes.type;
        const child = typeAttr?.children?.[0];
        if (child && child.type === "text") {
            return child.value;
        }
    }
    return node.name;
}

/**
 * Whether the given node should have a `<_dynamicChildren>` appended so that
 * children can be added to it dynamically via an `addChildren` action.
 */
export function nodeSupportsDynamicChildren(node: DastElement): boolean {
    return COMPONENTS_WITH_DYNAMIC_CHILDREN.has(effectiveComponentType(node));
}

/**
 * Add a `<_dynamicChildren>` to the children so additional children can be added
 * via an addChildren action.
 */
export function addDynamicChildrenSugar(node: DastElement) {
    node.children.push({
        type: "element",
        name: "_dynamicChildren",
        children: [],
        attributes: {},
        source_doc: node.source_doc,
    });
}

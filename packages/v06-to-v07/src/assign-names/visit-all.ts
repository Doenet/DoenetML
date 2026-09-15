import {
    DastElement,
    DastFunctionMacro,
    DastMacro,
    DastNodes,
    isDastElement,
} from "@doenet/parser";

/**
 * `parents` is the chain of enclosing elements, nearest first, as `visit` from
 * `@doenet/parser` reports it.
 *
 * `attributeOwner` is the element in whose *attribute* the node sits, when it does. A
 * node among an element's children has none, and descending into an element's children
 * clears it, so it always names the nearest element the node is written *on* rather than
 * merely inside.
 */
type Visitor = (
    node: DastNodes,
    parents: DastElement[],
    attributeOwner?: DastElement,
) => void;

/**
 * Like `visit` from `@doenet/parser`, but it *also* descends into places that `visit`
 * ignores:
 *  - `element.attributes[name].children`
 *  - `macro.attributes[name].children`
 *  - `macro.path[i].index[j].value` (including macros nested in indices)
 *  - `functionMacro.input[i][j]`
 *
 * Macro and function-macro nodes are visited **after** their own nested content, so a
 * visitor that rewrites `macro.path` cannot invalidate an in-progress walk of the macros
 * that live inside that path's indices.
 *
 * Note that, unlike `visit`, there is no way to skip or stop the traversal. This function
 * is meant for whole-tree rewrites.
 */
export function visitAll(tree: DastNodes, visitor: Visitor) {
    walk(tree, [], undefined);

    function walk(
        node: DastNodes,
        parents: DastElement[],
        attributeOwner: DastElement | undefined,
    ) {
        // Macros are visited post-order; everything else pre-order.
        const isMacro = node.type === "macro" || node.type === "function";
        if (!isMacro) {
            visitor(node, parents, attributeOwner);
        }
        const innerParents = isDastElement(node) ? [node, ...parents] : parents;

        if (isDastElement(node)) {
            for (const attr of Object.values(node.attributes)) {
                // Everything under here is written *on* `node`.
                walkArray(attr.children as DastNodes[], innerParents, node);
            }
        }

        if (node.type === "macro") {
            walkMacroAttributes(node, innerParents, attributeOwner);
            walkMacroPath(node, innerParents, attributeOwner);
            // v0.6 macros chain their props rather than flattening them into `path`.
            const accessedProp = (node as any).accessedProp;
            if (accessedProp) {
                walk(accessedProp as DastNodes, innerParents, attributeOwner);
            }
        }

        if (node.type === "function") {
            // A v0.6 function macro wraps a macro instead of carrying a `path`.
            const inner = (node as any).macro;
            if (inner) {
                walk(inner as DastNodes, innerParents, attributeOwner);
            }
            walkMacroPath(node, innerParents, attributeOwner);
            for (const inputPart of node.input || []) {
                walkArray(
                    inputPart as DastNodes[],
                    innerParents,
                    attributeOwner,
                );
            }
        }

        if ("children" in node && Array.isArray(node.children)) {
            // A child is inside the element, not written on it, so ownership stops here.
            walkArray(
                node.children as DastNodes[],
                innerParents,
                isDastElement(node) ? undefined : attributeOwner,
            );
        }

        if (isMacro) {
            visitor(node, parents, attributeOwner);
        }
    }

    function walkMacroAttributes(
        node: DastMacro,
        parents: DastElement[],
        attributeOwner: DastElement | undefined,
    ) {
        // v0.6 macros store attributes in an array, v0.7 in a record.
        const attrs: { children: unknown }[] = Array.isArray(node.attributes)
            ? (node.attributes as any)
            : Object.values(node.attributes);
        for (const attr of attrs) {
            walkArray(attr.children as DastNodes[], parents, attributeOwner);
        }
    }

    function walkMacroPath(
        node: DastMacro | DastFunctionMacro,
        parents: DastElement[],
        attributeOwner: DastElement | undefined,
    ) {
        for (const part of node.path || []) {
            for (const index of part.index) {
                walkArray(index.value as DastNodes[], parents, attributeOwner);
            }
        }
    }

    function walkArray(
        nodes: DastNodes[],
        parents: DastElement[],
        attributeOwner: DastElement | undefined,
    ) {
        // The array may be mutated in place while we traverse, so index rather than
        // caching the length.
        for (let i = 0; i < nodes.length; i++) {
            walk(nodes[i], parents, attributeOwner);
        }
    }
}

/**
 * Call `visitor` on every macro and function macro anywhere in `tree`, including macros
 * that appear inside attribute values, inside path indices, and inside function-macro
 * arguments. Macros are visited innermost-first.
 */
export function visitAllMacros(
    tree: DastNodes,
    visitor: (
        node: DastMacro | DastFunctionMacro,
        parents: DastElement[],
        attributeOwner?: DastElement,
    ) => void,
) {
    visitAll(tree, (node, parents, attributeOwner) => {
        if (node.type !== "macro" && node.type !== "function") {
            return;
        }
        // A v0.6 function macro wraps its macro instead of carrying a `path`. It should
        // already have been converted by `upgradePathSlashesToDots`, but if one survives,
        // its inner macro is visited on its own, so skipping the wrapper loses nothing and
        // saves the callback from a node it has no way to handle.
        if (!Array.isArray((node as { path?: unknown }).path)) {
            return;
        }
        visitor(node, parents, attributeOwner);
    });
}

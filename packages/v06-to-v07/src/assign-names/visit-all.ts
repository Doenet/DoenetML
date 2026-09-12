import {
    DastFunctionMacro,
    DastMacro,
    DastNodes,
    isDastElement,
} from "@doenet/parser";

/**
 * How a node was reached by {@link visitAll}.
 */
export type VisitAllInfo = {
    via: "root" | "children" | "attribute" | "index" | "input";
    /**
     * The attribute name, when `via` is `"attribute"`.
     */
    attrName?: string;
};

type Visitor = (node: DastNodes, info: VisitAllInfo) => void;

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
    walk(tree, { via: "root" });

    function walk(node: DastNodes, info: VisitAllInfo) {
        // Macros are visited post-order; everything else pre-order.
        const isMacro = node.type === "macro" || node.type === "function";
        if (!isMacro) {
            visitor(node, info);
        }

        if (isDastElement(node)) {
            for (const [attrName, attr] of Object.entries(node.attributes)) {
                walkArray(attr.children as DastNodes[], {
                    via: "attribute",
                    attrName,
                });
            }
        }

        if (node.type === "macro") {
            walkMacroAttributes(node);
            walkMacroPath(node);
            // v0.6 macros chain their props rather than flattening them into `path`.
            const accessedProp = (node as any).accessedProp;
            if (accessedProp) {
                walk(accessedProp as DastNodes, info);
            }
        }

        if (node.type === "function") {
            // A v0.6 function macro wraps a macro instead of carrying a `path`.
            const inner = (node as any).macro;
            if (inner) {
                walk(inner as DastNodes, info);
            }
            walkMacroPath(node);
            for (const inputPart of node.input || []) {
                walkArray(inputPart as DastNodes[], { via: "input" });
            }
        }

        if ("children" in node && Array.isArray(node.children)) {
            walkArray(node.children as DastNodes[], { via: "children" });
        }

        if (isMacro) {
            visitor(node, info);
        }
    }

    function walkMacroAttributes(node: DastMacro) {
        // v0.6 macros store attributes in an array, v0.7 in a record.
        const attrs: { children: unknown }[] = Array.isArray(node.attributes)
            ? (node.attributes as any)
            : Object.values(node.attributes);
        for (const attr of attrs) {
            walkArray(attr.children as DastNodes[], { via: "attribute" });
        }
    }

    function walkMacroPath(node: DastMacro | DastFunctionMacro) {
        for (const part of node.path || []) {
            for (const index of part.index) {
                walkArray(index.value as DastNodes[], { via: "index" });
            }
        }
    }

    function walkArray(nodes: DastNodes[], info: VisitAllInfo) {
        // The array may be mutated in place while we traverse, so index rather than
        // caching the length.
        for (let i = 0; i < nodes.length; i++) {
            walk(nodes[i], info);
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
    visitor: (node: DastMacro | DastFunctionMacro, info: VisitAllInfo) => void,
) {
    visitAll(tree, (node, info) => {
        if (node.type === "macro" || node.type === "function") {
            visitor(node, info);
        }
    });
}

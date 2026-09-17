import { DastError, DastNodes, DastNodesV6 } from "./types";

/**
 * Get a flat list of all errors in a DAST tree.
 */
export function extractDastErrors(
    nodes: DastNodes | DastNodes[] | DastNodesV6 | DastNodesV6[],
): DastError[] {
    if (Array.isArray(nodes)) {
        return nodes.flatMap(extractDastErrors);
    }
    if (nodes.type === "error") {
        return [nodes];
    }
    if (nodes.type === "root" || nodes.type === "element") {
        return extractDastErrors(nodes.children);
    }
    if (
        (nodes.type === "macro" || nodes.type === "function") &&
        // A v0.6 function reference stores its path under `macro` instead.
        "path" in nodes
    ) {
        // What is written between a reference's index brackets, and — for a
        // function reference — what is written as its arguments. Both hold
        // elements that no `children` array contains, so normalization can put an
        // error in either, and an error nothing collects is an error nobody sees.
        const inPath = nodes.path.flatMap((pathPart) =>
            pathPart.index.flatMap((propIndex) =>
                extractDastErrors(propIndex.value),
            ),
        );
        const inInput =
            nodes.type === "function" && nodes.input
                ? nodes.input.flatMap((argument) => extractDastErrors(argument))
                : [];
        return [...inPath, ...inInput];
    }
    return [];
}

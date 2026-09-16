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
        // A v0.6 function macro keeps its path under `macro` instead.
        "path" in nodes
    ) {
        // What is written between a reference's index brackets. Normalization can
        // now put an error in there, because an element can now be written there
        // (#1909) — and an error nothing collects is an error nobody sees.
        return nodes.path.flatMap((pathPart) =>
            pathPart.index.flatMap((propIndex) =>
                extractDastErrors(propIndex.value),
            ),
        );
    }
    return [];
}

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
    return [];
}

import { stringifyEntitiesLight } from "stringify-entities";
import { DastNodes } from "../types";

/**
 * Escape a string.
 */
export function escape(
    value: string,
    subset: string[],
    unsafe?: RegExp | null | undefined,
): string {
    const result = clean(value);

    return unsafe ? result.replace(unsafe, encode) : encode(result);

    /**
     * Actually escape characters.
     */
    function encode(value: string): string {
        return (
            stringifyEntitiesLight(value, { subset })
                // We want fancy named versions of these two escaped characters
                .replace(/&#x3C;/g, "&lt;")
                .replace(/&#x26;/g, "&amp;")
        );
    }
}

const nonCharacter = /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g;
/**
 * Remove non-characters.
 */
export function clean(value: string) {
    return String(value || "").replace(nonCharacter, "");
}

/**
 * Encode a node name.
 */
export function name(value: string) {
    const subset = ["\t", "\n", " ", '"', "&", "'", "/", "<", "=", ">"];
    return escape(value, subset);
}

/**
 * Merge adjacent text nodes in an array
 */
export function mergeAdjacentTextInArray(nodes: DastNodes[]): DastNodes[] {
    const needsMerging = nodes.some(
        (n, i) => n.type === "text" && nodes[i + 1]?.type === "text",
    );
    if (!needsMerging) {
        return nodes;
    }
    const ret: DastNodes[] = [];
    for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i];
        let nextNode = nodes[i + 1];
        if (!nextNode) {
            ret.push(node);
            continue;
        }
        if (node.type === "text" && nextNode.type === "text") {
            node = { ...node };
            ret.push(node);
            while (nextNode?.type === "text") {
                node.value += nextNode.value;
                if (node.position && nextNode.position) {
                    node.position.end = nextNode.position.end;
                }
                i++;
                nextNode = nodes[i + 1];
            }
        } else {
            ret.push(node);
        }
    }

    return ret;
}

/**
 * Recursively remove position info from a DAST tree.
 *
 * **Note**: this mutates the tree.
 */
export function filterPositionInfo(
    nodes: DastNodes | DastNodes[],
): DastNodes | DastNodes[] {
    if (typeof nodes !== "object" || nodes === null) {
        return nodes;
    }
    if (Array.isArray(nodes)) {
        return nodes.flatMap(filterPositionInfo);
    }
    if (nodes && typeof nodes === "object" && "position" in nodes) {
        delete nodes.position;
    }
    for (const value of Object.values(nodes)) {
        filterPositionInfo(value);
    }
    return nodes;
}

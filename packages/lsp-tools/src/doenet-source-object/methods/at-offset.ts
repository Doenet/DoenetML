import { CursorPosition, DoenetSourceObject, RowCol } from "../index";
import {
    DastElement,
    DastNodes,
    DastNodesV6,
    DastRoot,
    LezerSyntaxNodeName,
} from "@doenet/parser";

/**
 * Return the node that contains the current offset and is furthest down the tree.
 * E.g. `<a><b>x</b></a>` at offset equal to the position of `x` return a text node.
 *
 * If `side === "left"`, the node to the immediate left of the offset is returned.
 * If `side === "right"`, the node to the immediate right of the offset is returned.
 *
 * If `type` is passed in, then `nodeAtOffset` will walk up the parent tree until it finds
 * a node of that type. It returns `null` if no such node can be found.
 */
export function nodeAtOffset<const T extends DastNodes["type"]>(
    this: DoenetSourceObject,
    offset: number | RowCol,
    options?: { type?: T; side?: "left" | "right" },
): Extract<DastNodesV6, { type: T }> | null {
    let { type, side = "right" } = options || {};
    if (typeof offset !== "number") {
        offset = this.rowColToOffset(offset);
    }

    // Handle out of bounds cases
    if (offset < 0 || offset > this.source.length) {
        return null;
    }
    if (offset > 0 && offset === this.source.length && side === "left") {
        // If we ask for a node at the "end" of the file, we probably want
        // the last node, not null; walk back one character.
        side = "right"
        offset -= 1;
    }

    // Lookup the node at the offset
    const offsetToNodeMap =
        side === "right"
            ? this._offsetToNodeMapRight()
            : this._offsetToNodeMapLeft();
    let ret = offsetToNodeMap[offset] || null;
    if (type != null) {
        while (ret && ret.type !== "root" && ret.type !== type) {
            ret = this.getParent(ret);
        }
        if (ret && ret.type !== type) {
            return null;
        }
    }

    return ret as any;
}

export function elementAtOffset(
    this: DoenetSourceObject,
    offset: number | RowCol,
    options?: { side?: "left" | "right" },
) {
    const { side = "right" } = options || {};
    if (typeof offset !== "number") {
        offset = this.rowColToOffset(offset);
    }

    return this.nodeAtOffset(offset, { type: "element", side });
}

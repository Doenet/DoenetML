import {
    DastElement,
    DastNodes,
    DastRoot,
    stringToLezer,
    lezerToDast,
    toXml,
    visit,
} from "@doenet/parser";
import type { TreeCursor } from "@lezer/common";
import { DoenetSourceObject, OffsetToPositionMap } from "./index";

export function initOffsetToRowCache(this: DoenetSourceObject) {
    return createOffsetToPositionMap(this.source);
}

export function initRowToOffsetCache(this: DoenetSourceObject) {
    const source = this.source || "";
    const numLines = (String(source).match(/\n/g) || "").length + 1;
    const rowToOffset = new Uint32Array(numLines);
    const len = source.length;

    let currentRow = 0;
    rowToOffset[0] = 0;
    for (let i = 0; i < len; i++) {
        if (source.charAt(i) === "\n") {
            currentRow += 1;
            rowToOffset[currentRow] = i + 1;
        }
    }
    return rowToOffset;
}

export function initLezer(this: DoenetSourceObject) {
    return stringToLezer(this.source || "");
}

export function initLezerCursor(this: DoenetSourceObject): TreeCursor {
    const lezer = this._lezer();
    return lezer.cursor();
}

export function initDast(this: DoenetSourceObject) {
    return lezerToDast(this._lezer(), this.source);
}

export function initParentMap(this: DoenetSourceObject) {
    const parentMap = new Map<DastNodes, DastElement | DastRoot>();
    for (const node of this.dast.children) {
        parentMap.set(node, this.dast);
    }
    visit(this.dast, (_node) => {
        const node = _node as DastNodes;
        if (node.type === "element") {
            for (const child of node.children) {
                parentMap.set(child, node);
            }
        }
    });
    return parentMap;
}

/**
 * Create an array the same length as `source.length` whose entries point to the node furthest
 * down the tree that contains the character at that position. This array prefers the right-most node.
 * So `<a /><b />` at position 5 returns `<b />`.
 */
export function initOffsetToNodeMapRight(this: DoenetSourceObject) {
    const dast = this.dast;
    const offsetToNodeMap: (DastNodes | null)[] = new Array(
        this.source.length,
    ).fill(null);
    visit(dast, (_node) => {
        const node = _node as DastNodes;
        if (node.type === "error") {
            return;
        }
        if (!node.position) {
            return;
        }
        const { start, end } = node.position;
        if (start.offset == null || end.offset == null) {
            return;
        }

        for (let i = start.offset; i < end.offset; i++) {
            offsetToNodeMap[i] = node;
        }
    });
    return offsetToNodeMap;
}

/**
 * Create an array the same length as `source.length` whose entries point to the node furthest
 * down the tree that contains the character at that position. This array prefers the right-most node.
 * So `<a /><b />` at position 5 returns `<a />`.
 */
export function initOffsetToNodeMapLeft(this: DoenetSourceObject) {
    // The left map is the same as the right map except index 0 should return the root.
    const dast = this.dast;
    const offsetToNodeMap = [dast, ...this._offsetToNodeMapRight()];
    offsetToNodeMap.pop();

    return offsetToNodeMap;
}

/**
 * Create a mapping from character offsets to Rust-compatible root/element indices.
 *
 * Indices are assigned to the root and element nodes only, in depth-first order.
 * When an offset lands on a non-element node (text/macro/function/etc.), the index
 * of the nearest containing element is returned, or root when no containing element
 * exists. This keeps index space aligned with Rust's element-oriented flat DAST.
 *
 * Returns array where `map[offset]` = root/element index or `null` if no node.
 */
export function initOffsetToNodeIndexMap(this: DoenetSourceObject) {
    const nodeToIndexMap = new Map<DastRoot | DastElement, number>();
    const containingElementMap = new Map<DastNodes, DastRoot | DastElement>();
    const dast = this.dast;
    let nextIndex = 0;

    // Build root/element -> index mapping and record containing element for each node.
    const assignIndices = (
        node: DastNodes,
        containingElement: DastRoot | DastElement,
    ) => {
        const nextContaining =
            node.type === "element" ? node : containingElement;
        containingElementMap.set(node, nextContaining);

        if (node.type === "element") {
            nodeToIndexMap.set(node, nextIndex++);
            for (const child of node.children) {
                assignIndices(child as DastNodes, node);
            }
        }
    };

    nodeToIndexMap.set(dast, nextIndex++);
    for (const child of dast.children) {
        assignIndices(child as DastNodes, dast);
    }

    // Map offsets to indices using existing right-biased offset→node map.
    const offsetToNodeMap = this._offsetToNodeMapRight();
    const offsetToIndexMap: (number | null)[] = offsetToNodeMap.map((node) => {
        if (!node) {
            return null;
        }
        const target =
            node.type === "element"
                ? node
                : (containingElementMap.get(node) ?? dast);
        return nodeToIndexMap.get(target) ?? null;
    });

    return offsetToIndexMap;
}

export type AccessList = { name: string; element: DastElement }[];
export function initDescendantNamesMap(this: DoenetSourceObject) {
    const dast = this.dast;
    const namesInScope: Map<DastElement | DastRoot, AccessList> = new Map();
    const rootAccessList: AccessList = [];
    namesInScope.set(dast, rootAccessList);
    visit(dast, (_node, info) => {
        const node = _node as DastNodes;
        if (!(node.type === "element")) {
            return;
        }
        if (!namesInScope.has(node)) {
            namesInScope.set(node, []);
        }
        const nameAttr = node.attributes["name"];
        if (!nameAttr) {
            return;
        }
        const name = toXml(nameAttr.children);
        // We have a name. Push our name to all of our parents.
        for (const _parent of info.parents) {
            const parent = _parent as DastElement | DastRoot;
            if (!namesInScope.has(parent)) {
                namesInScope.set(parent, []);
            }
            const accessList = namesInScope.get(parent)!;
            accessList.push({ name, element: node });
        }
        // Make sure our name is also viewable from the root element.
        rootAccessList.push({ name, element: node });
    });
    return namesInScope;
}

/**
 * Creates a map from source position to the row/column offset. To retrieve the row/col
 * index at an offset `pos`, use `[ rowMap[pos], columnMap[pos] ]`.
 */
export function createOffsetToPositionMap(
    source: string | null,
): OffsetToPositionMap {
    if (!source) {
        source = "";
    }
    const rowMap = new Uint32Array(source.length + 1);
    const columnMap = new Uint32Array(source.length + 1);
    const len = source.length;

    let currentRow = 0;
    let currentColumn = 0;
    for (let i = 0; i < len; i++) {
        rowMap[i] = currentRow;
        columnMap[i] = currentColumn;
        if (source.charAt(i) === "\n") {
            currentRow += 1;
            currentColumn = 0;
        } else {
            currentColumn += 1;
        }
    }
    rowMap[len] = currentRow;
    columnMap[len] = currentColumn;
    return { rowMap, columnMap };
}

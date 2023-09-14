import {
    DastElement,
    DastNodes,
    DastRoot,
    lezerToDast,
    stringToLezer,
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
    return lezer.cursor;
}

export function initDast(this: DoenetSourceObject) {
    return lezerToDast(this._lezer(), this.source);
}

export function initParentMap(this: DoenetSourceObject) {
    const parentMap = new Map<DastNodes, DastElement>();
    visit(this.dast, (node) => {
        if (node.type === "element") {
            for (const child of node.children) {
                parentMap.set(child, node);
            }
        }
    });
    return parentMap;
}

export function initOffsetToNodeMap(this: DoenetSourceObject) {
    const dast = this.dast;
    const offsetToNodeMap: (DastNodes | null)[] = Array.from(this.source).map(
        () => null,
    );
    visit(dast, (node) => {
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

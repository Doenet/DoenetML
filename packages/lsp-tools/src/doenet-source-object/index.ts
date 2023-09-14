import {
    DastElement,
    DastNodes,
    DastRoot,
    LezerSyntaxNodeName,
    toXml,
} from "../dast/parser";
import { SyntaxNode, TreeCursor } from "@lezer/common";
import {
    initDast,
    initLezer,
    initLezerCursor,
    initOffsetToNodeMap,
    initOffsetToRowCache,
    initParentMap,
    initRowToOffsetCache,
} from "./initializers";
import { LazyDataObject } from "./lazy-data";
import { elementAtOffset } from "./element-at-offset";

/**
 * A row/column position. All values are 1-indexed. This is compatible with UnifiedJs's
 * position objects as well as Language Server Protocol's position objects.
 */
export type RowCol =
    | { line: number; character: number }
    | { line: number; column: number }
    | { row: number; col: number };

export type CursorPosition =
    | "unknown"
    | "body"
    | "openTagName"
    | "closeTagName"
    | "openTag"
    | "attributeName"
    | "attributeValue";

/**
 * Keeps track of DoenetML source code, allowing you to run various queries.
 */
export class DoenetSourceObject extends LazyDataObject {
    source: string = "";

    // Set up the lazy data objects
    // These will be initialized the first time they are used
    _lezer = this._lazyDataGetter<SyntaxNode, typeof this>(initLezer);
    _lezerCursor = this._lazyDataGetter<TreeCursor, typeof this>(
        initLezerCursor,
    );
    _dast = this._lazyDataGetter<DastRoot, typeof this>(initDast);
    _offsetToRowCache = this._lazyDataGetter<OffsetToPositionMap, typeof this>(
        initOffsetToRowCache,
    );
    _rowToOffsetCache = this._lazyDataGetter<Uint32Array, typeof this>(
        initRowToOffsetCache,
    );
    _parentMap = this._lazyDataGetter<Map<DastNodes, DastElement>, typeof this>(
        initParentMap,
    );
    _offsetToNodeMap = this._lazyDataGetter<(DastNodes | null)[], typeof this>(
        initOffsetToNodeMap,
    );

    constructor(source?: string) {
        super();
        if (source != null) {
            this.setSource(source);
        }
    }

    /**
     * Set the DoenetML source string. All future queries will be run on this source.
     */
    setSource(source: string) {
        if (this.source === source) {
            return this;
        }
        this._clearLazyData();
        this.source = source;
        return this;
    }

    /**
     * Given a 0-index offset into the source string, return the 1-index line and column.
     */
    offsetToRowCol(offset: number): { line: number; column: number } {
        const offsetToRowCache = this._offsetToRowCache();
        return {
            line: offsetToRowCache.rowMap[offset] + 1,
            column: offsetToRowCache.columnMap[offset] + 1,
        };
    }

    /**
     * Given a 1-index line and column, return the 0-index offset into the source string.
     */
    rowColToOffset(rowCol: RowCol): number {
        const _rowToOffsetCache = this._rowToOffsetCache();
        // 0-indexed row and columns
        const row = ("row" in rowCol ? rowCol.row : rowCol.line) - 1;
        const col =
            ("col" in rowCol
                ? rowCol.col
                : "column" in rowCol
                ? rowCol.column
                : rowCol.character) - 1;

        return _rowToOffsetCache[row] + col;
    }

    /**
     * Return the node that contains the current offset and is furthest down the tree.
     * E.g. `<a><b>x</b></a>` at offset equal to the position of `x` return a text node.
     */
    nodeAtOffset(offset: number | RowCol): DastNodes | null {
        if (typeof offset !== "number") {
            offset = this.rowColToOffset(offset);
        }
        if (offset < 0 || offset > this.source.length) {
            return null;
        }
        if (offset > 0 && offset === this.source.length) {
            // If we ask for a node at the "end" of the file, we probably want
            // the last node, not null; walk back one character.
            offset -= 1;
        }
        const offsetToNodeMap = this._offsetToNodeMap();
        return offsetToNodeMap[offset] || null;
    }

    /**
     * Get the element containing the position `offset`. `null` is returned if the position is not
     * contained in an element.
     *
     * Details about the `offset` position within the element are also returned, e.g., if `offset` is in
     * the open tag, etc..
     */
    elementAtOffset = elementAtOffset;

    /**
     * Get the element attribute at `offset`, if it exists.
     */
    attributeAtOffset(offset: number | RowCol) {
        if (typeof offset !== "number") {
            offset = this.rowColToOffset(offset);
        }
        const containingElm = this.elementAtOffset(offset);
        if (
            !containingElm.node ||
            (containingElm.cursorPosition !== "attributeName" &&
                containingElm.cursorPosition !== "attributeValue")
        ) {
            return null;
        }

        // Find the attribute whose range contains the cursor
        const attribute = containingElm.node.attributes.find(
            (a) =>
                a.position &&
                a.position.start.offset! <= offset &&
                a.position.end.offset! >= offset,
        );
        return attribute || null;
    }

    /**
     * Returns whether `node` is a complete element (`true`) or
     * partially complete (`false`). Complete elements are valid xml.
     * Incomplete elements are `<abc` or `<abc>`.
     */
    isCompleteElement(node: DastElement): {
        tagComplete: boolean;
        closed: boolean;
    } {
        if (node.type !== "element") {
            throw new Error(
                `Node ${toXml(
                    node,
                )} is not an element. Only elements maybe passed to this function.`,
            );
        }
        if (!node.position || node.position.start.offset == null) {
            throw new Error(
                `Node ${JSON.stringify(node)} is missing position information`,
            );
        }
        const cursor = this._lezerCursor();
        cursor.moveTo(node.position.start.offset + 1, 0);
        const lezerNode = cursor.node;
        const lezerNodeParent = lezerNode.parent;
        const nodeName = lezerNode.type.name as LezerSyntaxNodeName;

        let tagComplete = true;
        let closed = true;

        switch (nodeName) {
            case "OpenTag": {
                // An open tag must have an EndTag (`>`) otherwise it is incomplete
                if (!lezerNode.getChild("EndTag")) {
                    tagComplete = false;
                }
                if (!lezerNodeParent?.getChild("CloseTag")) {
                    closed = false;
                }
                break;
            }
            case "SelfClosingTag": {
                // An self closing tag must have an SelfCloseEndTag (`/>`) otherwise it is incomplete
                if (!lezerNode.getChild("SelfCloseEndTag")) {
                    tagComplete = false;
                }
                break;
            }
            default:
                console.warn(
                    "Could not find OpenTag or SelfClosingTag for node",
                    node,
                );
        }

        return { tagComplete, closed };
    }

    /**
     * Get the parent of `node`. Node must be in `this.dast`.
     */
    getParent(node: DastNodes): DastElement | null {
        const parentMap = this._parentMap();
        return parentMap.get(node) || null;
    }

    /**
     * The DAST representation of `source`.
     */
    get dast(): DastRoot {
        return this._dast();
    }

    /**
     * The Lezer TreeCursor for the parsed version of `source`.
     */
    get lezerCursor() {
        return this._lezerCursor();
    }
}

export type OffsetToPositionMap = {
    rowMap: Uint32Array;
    columnMap: Uint32Array;
};

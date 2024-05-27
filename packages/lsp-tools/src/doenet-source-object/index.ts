import {
    DastElementV6,
    DastFunctionMacroV6,
    DastMacroV6,
    DastNodesV6,
    DastRootV6,
    LezerSyntaxNodeName,
    Position,
    toXml,
} from "@doenet/parser";
import {
    initDast,
    initLezer,
    initLezerCursor,
    initDescendentNamesMap,
    initOffsetToNodeMapRight,
    initOffsetToRowCache,
    initParentMap,
    initRowToOffsetCache,
    initOffsetToNodeMapLeft,
} from "./initializers";
import { LazyDataObject } from "./lazy-data";
import { elementAtOffsetWithContext } from "./methods/element-at-offset";
import {
    getAddressableNamesAtOffset,
    getMacroReferentAtOffset,
} from "./methods/macro-resolvers";
import { DastMacro } from "@doenet/parser";
import type {
    Position as LSPPosition,
    Range as LSPRange,
} from "vscode-languageserver";
import { elementAtOffset, nodeAtOffset } from "./methods/at-offset";

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
    _lezer = this._lazyDataGetter(initLezer);
    _lezerCursor = this._lazyDataGetter(initLezerCursor);
    _dast = this._lazyDataGetter(initDast);
    _offsetToRowCache = this._lazyDataGetter(initOffsetToRowCache);
    _rowToOffsetCache = this._lazyDataGetter(initRowToOffsetCache);
    _parentMap = this._lazyDataGetter(initParentMap);
    _offsetToNodeMapRight = this._lazyDataGetter(initOffsetToNodeMapRight);
    _offsetToNodeMapLeft = this._lazyDataGetter(initOffsetToNodeMapLeft);
    _descendentNamesMap = this._lazyDataGetter(initDescendentNamesMap);

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
     * Given a 0-index offset into the source string, return an LSP position.
     */
    offsetToLSPPosition(offset: number): LSPPosition {
        const offsetToRowCache = this._offsetToRowCache();
        return {
            line: offsetToRowCache.rowMap[offset],
            character: offsetToRowCache.columnMap[offset],
        };
    }

    /**
     * Given a 1-index line and column, return the 0-index offset into the source string.
     */
    rowColToOffset(rowCol: RowCol): number {
        const _rowToOffsetCache = this._rowToOffsetCache();
        // 0-indexed row and columns
        let row = ("row" in rowCol ? rowCol.row : rowCol.line) - 1;
        let col =
            ("col" in rowCol
                ? rowCol.col
                : "column" in rowCol
                  ? rowCol.column
                  : rowCol.character) - 1;
        // If `character` is in `rowCol`, then we are using the LSP format
        // which is zero-indexed already. Apply an "unfix".
        if ("character" in rowCol) {
            row += 1;
            col += 1;
        }

        return _rowToOffsetCache[row] + col;
    }

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
    nodeAtOffset = nodeAtOffset;

    /**
     * Get the element containing the position `offset`. `null` is returned if the position is not
     * contained in an element.
     *
     * Details about the `offset` position within the element are also returned, e.g., if `offset` is in
     * the open tag, etc..
     */
    elementAtOffsetWithContext = elementAtOffsetWithContext;
    elementAtOffset = elementAtOffset;

    /**
     * Get the element attribute at `offset`, if it exists.
     */
    attributeAtOffset(offset: number | RowCol) {
        if (typeof offset !== "number") {
            offset = this.rowColToOffset(offset);
        }
        const _offset = offset;
        const containingElm = this.elementAtOffsetWithContext(offset);
        if (
            !containingElm.node ||
            (containingElm.cursorPosition !== "attributeName" &&
                containingElm.cursorPosition !== "attributeValue")
        ) {
            return null;
        }

        // Find the attribute whose range contains the cursor
        const attribute = Object.values(containingElm.node.attributes).find(
            (a) =>
                a.position &&
                a.position.start.offset! <= _offset &&
                a.position.end.offset! >= _offset,
        );
        return attribute || null;
    }

    /**
     * Returns whether `node` is a complete element (`true`) or
     * partially complete (`false`). Complete elements are valid xml.
     * Incomplete elements are `<abc` or `<abc>`.
     */
    isCompleteElement(node: DastElementV6): {
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
     * Get the offset ranges for the tag(s) of `node`. (I.e., just the part
     * in the angle brackets without the children.) If the tag is incomplete or
     * is a self-closing tag, only one range will be returned.
     *
     * Note: these values are given as **offsets**.
     */
    getElementTagRanges(node: DastElementV6): { start: number; end: number }[] {
        const start = node.position?.start?.offset || 0;
        const end = node.position?.end?.offset || 0;
        const childrenStart = node.children[0]?.position?.start?.offset;
        const childrenEnd =
            node.children[node.children.length - 1]?.position?.end?.offset;
        if (childrenStart == null || childrenEnd == null) {
            return [{ start, end }];
        }
        return [
            { start, end: childrenStart },
            { start: childrenEnd, end },
        ];
    }

    /**
     * Get the parent of `node`. Node must be in `this.dast`.
     */
    getParent(node: DastNodesV6): DastElementV6 | DastRootV6 | null {
        const parentMap = this._parentMap();
        return parentMap.get(node) || null;
    }

    /**
     * Get all parents of `node`. The first element in the array is the immediate parent followed
     * by more distant ancestors.
     *
     * Node must be in `this.dast`.
     */
    getParents(node: DastNodesV6): (DastElementV6 | DastRootV6)[] {
        const ret: (DastElementV6 | DastRootV6)[] = [];

        let parent = this.getParent(node);
        while (parent && parent.type !== "root") {
            ret.push(parent);
            parent = this.getParent(parent);
        }
        ret.push(this.dast);
        return ret;
    }

    /**
     * Get the unique descendent of `node` with name `name`.
     */
    getNamedDescendent(
        node: DastElementV6 | DastRootV6 | undefined | null,
        name: string,
    ) {
        if (!node) {
            return null;
        }
        const descendentNamesMap = this._descendentNamesMap();
        const accessibleNames = (descendentNamesMap.get(node) || []).filter(
            (e) => e.name === name,
        );
        if (accessibleNames.length === 1) {
            return accessibleNames[0].element;
        }
        return null;
    }

    /**
     * Get the unique item with name `name` resolved from position `offset`.
     */
    getReferentAtOffset(offset: number | RowCol, name: string) {
        const { node } = this.elementAtOffsetWithContext(offset);
        let parent: DastElementV6 | DastRootV6 | undefined | null = node;
        let referent = this.getNamedDescendent(parent, name);
        while (parent && parent.type !== "root" && !referent) {
            parent = this._parentMap().get(parent);
            referent = this.getNamedDescendent(parent, name);
        }
        if (!parent && !referent) {
            // We need to search the root!
            referent = this.getNamedDescendent(this.dast, name);
        }
        return referent || null;
    }

    /**
     * Get the element that `macro` is referring to at position `offset`.
     * Because a macro may end in attribute access, the algorithm searches
     * for the largest matching initial segment and returns any unmatched parts
     * of the macro.
     */
    getMacroReferentAtOffset = getMacroReferentAtOffset;

    /**
     * Get a list of all names that can be addressed from `offset`. These names can be used
     * in a macro path.
     */
    getAddressableNamesAtOffset = getAddressableNamesAtOffset;

    /**
     * Return the smallest range that contains all of the nodes in `nodes`.
     */
    getNodeRange<Style extends "default" | "lsp">(
        nodes: DastNodesV6 | DastNodesV6[],
        style?: Style,
    ): Style extends "lsp" ? LSPRange : Position {
        if (!Array.isArray(nodes)) {
            nodes = [nodes];
        }
        let start = Math.min(
            Infinity,
            ...nodes.map((n) => n.position?.start?.offset || 0),
        );
        if (start === Infinity) {
            start = 0;
        }
        const end = Math.max(
            0,
            ...nodes.map((n) => n.position?.end?.offset || 0),
        );

        if (style === "lsp") {
            return {
                start: this.offsetToLSPPosition(start),
                end: this.offsetToLSPPosition(end),
            } as any;
        }

        return {
            start: this.offsetToRowCol(start),
            end: this.offsetToRowCol(end),
        } as any;
    }

    /**
     * The DAST representation of `source`.
     */
    get dast(): DastRootV6 {
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

/**
 * Returns `true` if the macro is an "old-style" macro with slashes
 * in its path.
 */
export function isOldMacro(
    macro: DastMacro | DastFunctionMacroV6 | DastMacroV6 | DastFunctionMacroV6,
): boolean {
    if (!("version" in macro) || macro.version !== "0.6") {
        return false;
    }
    switch (macro.type) {
        case "macro": {
            if (macro.path.length !== 1) {
                return true;
            }
            if ("accessedProp" in macro && macro.accessedProp) {
                return isOldMacro(macro.accessedProp);
            }
            return false;
        }
        case "function": {
            return "macro" in macro && isOldMacro(macro.macro);
        }
    }
}

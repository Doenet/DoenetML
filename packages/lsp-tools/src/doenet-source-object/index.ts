import {
    DastElement,
    DastFunctionMacro,
    DastNodes,
    DastRoot,
    LezerSyntaxNodeName,
    toXml,
} from "@doenet/parser";
import {
    initDast,
    initLezer,
    initLezerCursor,
    initDescendentNamesMap,
    initOffsetToNodeMap,
    initOffsetToRowCache,
    initParentMap,
    initRowToOffsetCache,
} from "./initializers";
import { LazyDataObject } from "./lazy-data";
import { elementAtOffset } from "./element-at-offset";
import { DastMacro } from "@doenet/parser";

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
    _offsetToNodeMap = this._lazyDataGetter(initOffsetToNodeMap);
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
    offsetToLSPPosition(offset: number): { line: number; character: number } {
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
     * If `type` is passed in, then `nodeAtOffset` will walk up the parent tree until it finds
     * a node of that type. It returns `null` if no such node can be found.
     */
    nodeAtOffset(
        offset: number | RowCol,
        type?: DastNodes["type"],
    ): DastNodes | null {
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
        let ret = offsetToNodeMap[offset] || null;
        if (type != null) {
            while (ret && ret.type !== type) {
                ret = this.getParent(ret);
            }
        }

        return ret;
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
        const _offset = offset;
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
     * Get the unique descendent of `node` with name `name`.
     */
    getNamedChild(
        node: DastElement | DastRoot | undefined | null,
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
        const { node } = this.elementAtOffset(offset);
        let parent: DastElement | undefined | null = node;
        let referent = this.getNamedChild(parent, name);
        while (parent && !referent) {
            parent = this._parentMap().get(parent);
            referent = this.getNamedChild(parent, name);
        }
        if (!parent && !referent) {
            // We need to search the root!
            referent = this.getNamedChild(this.dast, name);
        }
        return referent || null;
    }

    /**
     * Get the element that `macro` is referring to at position `offset`.
     * Because a macro may end in attribute access, the algorithm searches
     * for the largest matching initial segment and returns any unmatched parts
     * of the macro.
     */
    getMacroReferentAtOffset(offset: number | RowCol, macro: DastMacro) {
        if (isOldMacro(macro)) {
            throw new Error(
                `Cannot resolve v0.6 style macro "${toXml(macro)}"`,
            );
        }
        let pathPart = macro.path[0];
        if (pathPart.index.length > 0) {
            throw new Error(
                `The first part of a macro path must be just a name without an index. Failed to resolve "${toXml(
                    macro,
                )}"`,
            );
        }
        // If we made it here, we are just a name, so proceed with the lookup!
        let referent = this.getReferentAtOffset(offset, pathPart.name);
        if (!referent) {
            return null;
        }
        // If there are no ".foo" accesses, the referent gets returned.
        if (!macro.accessedProp) {
            return {
                node: referent,
                accessedProp: null,
            };
        }
        // Otherwise, we walk down the tree trying to
        // resolve whatever `accessedProp` refers to until we find something
        // that doesn't exist.
        let prop: DastMacro | null = macro.accessedProp;
        let propReferent: DastElement | null = referent;
        while (prop) {
            if (prop.path[0].index.length > 0) {
                // Indexing can only be used on synthetic nodes.
                return {
                    node: referent,
                    accessedProp: prop,
                };
            }
            propReferent = this.getNamedChild(referent, prop.path[0].name);
            if (!propReferent) {
                return {
                    node: referent,
                    accessedProp: prop,
                };
            }
            // Step down one level
            referent = propReferent;
            prop = prop.accessedProp;
        }
        return {
            node: referent,
            accessedProp: null,
        };
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

/**
 * Returns `true` if the macro is an "old-style" macro with slashes
 * in its path.
 */
export function isOldMacro(macro: DastMacro | DastFunctionMacro): boolean {
    switch (macro.type) {
        case "macro": {
            if (macro.path.length !== 1) {
                return true;
            }
            if (macro.accessedProp) {
                return isOldMacro(macro.accessedProp);
            }
            return false;
        }
        case "function": {
            return isOldMacro(macro.macro);
        }
    }
}

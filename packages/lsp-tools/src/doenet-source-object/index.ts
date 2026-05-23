import {
    DastElement,
    DastNodes,
    DastRoot,
    LezerSyntaxNodeName,
    Position,
    toXml,
} from "@doenet/parser";
import {
    initDast,
    initLezer,
    initLezerCursor,
    initDescendantNamesMap,
    initOffsetToNodeMapRight,
    initOffsetToRowCache,
    initParentMap,
    initRowToOffsetCache,
    initOffsetToNodeMapLeft,
    initOffsetToNodeIndexMap,
} from "./initializers";
import { LazyDataObject } from "./lazy-data";
import { elementAtOffsetWithContext } from "./methods/element-at-offset";
import {
    getAddressableNamesAtOffset,
    getMacroReferentAtOffset,
} from "./methods/macro-resolvers";
import type {
    Position as LSPPosition,
    Range as LSPRange,
} from "vscode-languageserver";
import type { SyntaxNode } from "@lezer/common";
import { elementAtOffset, nodeAtOffset } from "./methods/at-offset";
import {
    findAttributeContainingOffset,
    findPrecedingEqualsForBareValue,
} from "./methods/attribute-helpers";

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
    _offsetToNodeIndexMap = this._lazyDataGetter(initOffsetToNodeIndexMap);
    _descendantNamesMap = this._lazyDataGetter(initDescendantNamesMap);

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
     * Get a Rust-compatible root/element index at the given offset.
     * Returns the index of the nearest containing element (or root),
     * or `null` if no node exists at that position.
     *
     * Offsets are cursor positions, so `offset === source.length` is valid
     * (cursor at end-of-file). For that case we use left-of-cursor semantics
     * and return the same index as `source.length - 1` when the source is
     * non-empty.
     *
     * This mapping is used for Rust resolver integration to identify nodes by stable indices
     * rather than object references.
     *
     * @param offset The 0-based character offset into the source string
     * @returns The root/element index, or null if no node at offset
     */
    getNodeIndexAtOffset(offset: number): number | null {
        const offsetToIndexMap = this._offsetToNodeIndexMap();
        if (offset < 0 || offset > this.source.length) {
            return null;
        }
        if (offset === this.source.length) {
            if (this.source.length === 0) {
                return null;
            }
            return offsetToIndexMap[this.source.length - 1] ?? null;
        }
        return offsetToIndexMap[offset] ?? null;
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
     *
     * Accepts cursors reported as `attributeName` or `attributeValue` as well
     * as the boundary cases `openTag` (e.g. cursor right after the opening
     * quote of a value) and `unknown` (e.g. cursor right after `=` on a
     * partial attribute, before the value is opened). In all cases the result
     * is restricted to a real attribute range, so cursors that aren't inside
     * any attribute (between attrs, on the tag name, on body text) return
     * `null`.
     *
     * Also applies an unquoted-value spillover heuristic: when the cursor
     * lands in a bogus attribute that the parser produced for the unquoted
     * value of a preceding attribute (e.g. the `full` in `<math simplify=full`
     * or `<math simplify= full`), returns the preceding attribute so callers
     * follow the user's intent rather than the parser's tokenization.
     *
     * Finally, when no attribute range contains the cursor at all, a
     * bare-value-after-`=` fallback walks back over value chars and
     * whitespace; if `=` precedes them, the attribute whose range contains
     * that `=` is returned. This mirrors the fallback in
     * `AutoCompleter.getCompletionItems` for parser states where typed
     * value chars don't yet land inside any attribute's range.
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
                containingElm.cursorPosition !== "attributeValue" &&
                // `openTag` is reported once the cursor sits past an attribute
                // name on the equals/quote boundary in some cases, and
                // `unknown` is reported in others (e.g. cursor right after `=`
                // on a partial attribute, before the value is opened). The
                // position-containment check below still restricts the result
                // to a real attribute range, so cursors between attrs
                // (`<math foo |bar`) or on the tag name return null naturally.
                containingElm.cursorPosition !== "openTag" &&
                containingElm.cursorPosition !== "unknown")
        ) {
            return null;
        }

        // Find the attribute whose range contains the cursor
        const attributes = Object.values(containingElm.node.attributes);
        const attribute = findAttributeContainingOffset(attributes, _offset);
        if (!attribute) {
            // Bare-value-after-`=` fallback: in some parser states the typed
            // value chars don't fall inside any attribute's position range
            // (mirrored in `AutoCompleter.getCompletionItems`). Walk back
            // over value chars + whitespace; if we land on `=`, return the
            // attribute whose range contains the `=`.
            const equalsOffset = findPrecedingEqualsForBareValue(
                this.source,
                _offset,
            );
            if (equalsOffset != null) {
                return findAttributeContainingOffset(attributes, equalsOffset, {
                    endInclusive: false,
                });
            }
            return null;
        }

        // Unquoted value spillover: `<math simplify=full>` parses as TWO
        // attributes — `simplify` (with the `=` baked into its range) and
        // `full` (a bogus attribute with no value). When the cursor lands
        // in the bogus one and the chars between it and the preceding
        // attribute are just `=` plus optional whitespace, the user is
        // mid-typing a value for the preceding attribute. Walk back over
        // whitespace to also catch `<math simplify= full>` (space after `=`)
        // — the parser absorbs the whitespace into `simplify`'s range, so
        // the preceding attribute is the one whose source range *contains*
        // the `=` position.
        const startOffset = attribute.position?.start.offset;
        if (startOffset != null && startOffset > 0) {
            const equalsOffset = findPrecedingEqualsForBareValue(
                this.source,
                startOffset,
            );
            if (equalsOffset != null) {
                const preceding = findAttributeContainingOffset(
                    attributes,
                    equalsOffset,
                    { endInclusive: false, exclude: attribute },
                );
                if (preceding) return preceding;
            }
        }
        return attribute;
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
                } else if (
                    this._isCloseTagStolenFromAncestor(lezerNodeParent)
                ) {
                    // The parser found a CloseTag for us, but its stack-based
                    // matching has likely "stolen" what the user intended as
                    // an ancestor's close tag for this inner element
                    // (issue #1117). Treat as unclosed so callers (auto-close
                    // and `</` completion) insert / suggest a fresh close tag.
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
     * Walk up the contiguous chain of same-name ancestor `Element` nodes
     * starting from `elementNode`'s parent. Returns true if any of those
     * same-name ancestors is missing its `CloseTag` — meaning the parser's
     * stack-based matching has shifted close tags down a level and the
     * close tag the parser attributed to `elementNode` was, from the user's
     * perspective, "stolen" from an ancestor (issue #1117).
     *
     * Stops at the first ancestor with a different tag name (or at the
     * root): the stealing pattern only happens through a same-name chain,
     * because that's the only configuration where the parser stack can
     * shuffle close tags. For example, `<p><div><p></p></div>` does NOT
     * trigger — `<div>` breaks the chain and the inner `</p>` is
     * genuinely the inner `<p>`'s own.
     *
     * Comparison is case-sensitive to match XML/DoenetML semantics.
     */
    _isCloseTagStolenFromAncestor(elementNode: SyntaxNode): boolean {
        const openTag = elementNode.getChild("OpenTag");
        const tagNameNode = openTag?.getChild("TagName");
        if (!tagNameNode) {
            return false;
        }
        const tagName = this.source.slice(tagNameNode.from, tagNameNode.to);
        if (!tagName) {
            return false;
        }

        let ancestor = elementNode.parent;
        while (ancestor) {
            if (ancestor.type.name !== "Element") {
                return false;
            }
            const ancestorOpenTag = ancestor.getChild("OpenTag");
            const ancestorTagNameNode = ancestorOpenTag?.getChild("TagName");
            if (!ancestorTagNameNode) {
                return false;
            }
            const ancestorName = this.source.slice(
                ancestorTagNameNode.from,
                ancestorTagNameNode.to,
            );
            if (ancestorName !== tagName) {
                return false;
            }
            if (!ancestor.getChild("CloseTag")) {
                return true;
            }
            ancestor = ancestor.parent;
        }
        return false;
    }

    /**
     * Get the offset ranges for the tag(s) of `node`. (I.e., just the part
     * in the angle brackets without the children.) If the tag is incomplete or
     * is a self-closing tag, only one range will be returned.
     *
     * Note: these values are given as **offsets**.
     */
    getElementTagRanges(node: DastElement): { start: number; end: number }[] {
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
    getParent(node: DastNodes): DastElement | DastRoot | null {
        const parentMap = this._parentMap();
        return parentMap.get(node) || null;
    }

    /**
     * Get all parents of `node`. The first element in the array is the immediate parent followed
     * by more distant ancestors.
     *
     * Node must be in `this.dast`.
     */
    getParents(node: DastNodes): (DastElement | DastRoot)[] {
        const ret: (DastElement | DastRoot)[] = [];

        let parent = this.getParent(node);
        while (parent && parent.type !== "root") {
            ret.push(parent);
            parent = this.getParent(parent);
        }
        ret.push(this.dast);
        return ret;
    }

    /**
     * Get the unique descendant of `node` with name `name`.
     */
    getNamedDescendant(
        node: DastElement | DastRoot | undefined | null,
        name: string,
    ) {
        if (!node) {
            return null;
        }
        const descendantNamesMap = this._descendantNamesMap();
        const accessibleNames = (descendantNamesMap.get(node) || []).filter(
            (e) => e.name === name,
        );
        if (accessibleNames.length === 1) {
            return accessibleNames[0].element;
        }
        return null;
    }

    /**
     * Get all descendant names directly addressable from `node`.
     */
    getDescendantNamesForNode(
        node: DastElement | DastRoot | undefined | null,
    ): string[] {
        if (!node) {
            return [];
        }
        return (this._descendantNamesMap().get(node) || []).map(
            ({ name }) => name,
        );
    }

    /**
     * Get descendant names that are uniquely addressable from `node`.
     *
     * This mirrors `getNamedDescendant` semantics: names that occur more than
     * once under the same node are excluded.
     */
    getUniqueDescendantNamesForNode(
        node: DastElement | DastRoot | undefined | null,
    ): string[] {
        const names = this.getDescendantNamesForNode(node);
        const counts = new Map<string, number>();
        for (const name of names) {
            counts.set(name, (counts.get(name) || 0) + 1);
        }
        return names.filter((name) => counts.get(name) === 1);
    }

    /**
     * Get the unique item with name `name` resolved from position `offset`.
     */
    getReferentAtOffset(offset: number | RowCol, name: string) {
        const { node } = this.elementAtOffsetWithContext(offset);
        let parent: DastElement | DastRoot | undefined | null = node;
        let referent = this.getNamedDescendant(parent, name);
        while (parent && parent.type !== "root" && !referent) {
            parent = this._parentMap().get(parent);
            referent = this.getNamedDescendant(parent, name);
        }
        if (!parent && !referent) {
            // We need to search the root!
            referent = this.getNamedDescendant(this.dast, name);
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
        nodes: DastNodes | DastNodes[],
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

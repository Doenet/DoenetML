import {
    DastAbstractNode,
    DastNodes,
    LezerSyntaxNodeName,
    Position,
} from "../types";
import { SyntaxNode } from "@lezer/common";
import { entityStringToRawString } from "./entity-to-string";
import { Root } from "xast";

export type OffsetToPositionMap = {
    rowMap: Uint32Array;
    columnMap: Uint32Array;
};

/**
 * Convert an `EntityReference` to a string.
 */
export function entityToString(node: SyntaxNode, source: string): string {
    switch (node.name) {
        case "CharacterReference":
        case "EntityReference": {
            const entity = extractContent(node, source);
            const converted = entityStringToRawString(entity);
            // Special care must be taken for things like `$dollar;` which
            // convert to `$`. If they are followed by [a-zA-Z_], then converting
            // `&dollar;` to `$` will insert a macro reference where there was previously none.
            if (converted === "$" && /[a-zA-Z_]/.test(source.charAt(node.to))) {
                // If the next character is a letter, add a zero-width space afterward.
                return converted + "\u200B";
            }
            return converted;
        }
    }
    throw new Error(
        `Cannot use entityToString to convert a node of type ${node.name}`,
    );
}

/**
 * Remove quotation marks from a string if they are present
 */
function removeQuotes(str: string): string {
    if (str.startsWith("'") || str.startsWith('"')) {
        str = str.slice(1);
    }
    if (str.endsWith("'") || str.endsWith('"')) {
        str = str.slice(0, str.length - 1);
    }
    return str;
}

/**
 * Converts all `EntityReference` children into their unescaped
 * equivalents.
 */
function unescapeEntities(node: SyntaxNode, source: string): string {
    const rawValue = extractContent(node, source);
    // We need to replace any entities present with their raw text.
    const entities = node.getChildren("EntityReference");
    if (entities.length === 0) {
        // No entities means no escaping needed.
        return rawValue;
    }
    let i = 0;
    let ret = "";
    // We assume that the `EntityNode`s come in order.
    for (const entity of entities) {
        ret += rawValue.slice(i, entity.from - node.from);
        ret += entityToString(entity, source);
        i = entity.to - node.from;
    }
    ret += rawValue.slice(i);
    return ret;
}

export function textNodeToText(node: SyntaxNode, source: string): string {
    if (node.name !== "Text") {
        throw new Error(
            `Can only convert node of type "Text", not the passed-in type of "${node.name}"`,
        );
    }
    return unescapeEntities(node, source);
}

/**
 * Convert an `AttributeValue` to a string
 */
export function attributeValueText(node: SyntaxNode, source: string): string {
    if (node.name !== "AttributeValue") {
        throw new Error(
            `Can only get the text of an "AttributeValue" type node, not "${node.name}"`,
        );
    }
    return removeQuotes(unescapeEntities(node, source));
}

/**
 * Compute a `xast` position node from a `lezer` node. A map from
 * offsets to line/column information needs to be provided.
 * If `adjustForQuotes` is true, then the position will be adjusted
 * to be inside the quotes of an attribute value.
 */
export function lezerNodeToPosition(
    node: SyntaxNode,
    offsetToPositionMap: OffsetToPositionMap,
    adjustForQuotes = false,
): Position & {
    start: { offset: number };
    end: { offset: number };
} {
    const { rowMap, columnMap } = offsetToPositionMap;
    let { from, to } = node;
    if (adjustForQuotes) {
        from += 1;
        to -= 1;
    }
    return {
        start: {
            line: rowMap[from] + 1,
            column: columnMap[from] + 1,
            offset: from,
        },
        end: { line: rowMap[to] + 1, column: columnMap[to] + 1, offset: to },
    };
}

/**
 * Extract the actual string contents of `node`.
 */
export function extractContent(node: SyntaxNode, source: string): string {
    return source.slice(node.from, node.to);
}

/**
 * Creates a map from an offset char in the source to the row/column offset.
 */
export function createOffsetToPositionMap(source: string): OffsetToPositionMap {
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

/**
 * Extract information from a doctype string. Doctypes may look like
 * ```
 * <!DOCTYPE HTML PUBLIC '-//W3C//DTD HTML 4.0 Transitional//EN' 'http://www.w3.org/TR/REC-html40/loose.dtd'>
 * ```
 * ```
 * <!DOCTYPE HTML SYSTEM 'http://www.w3.org/TR/REC-html40/loose.dtd'>
 * ```
 * ```
 * <!DOCTYPE HTML PUBLIC '-//W3C//DTD HTML 4.0 Transitional//EN'>
 * ```
 * This function assumes the `<!DOCTYPE` has been trimmed of the front and that `>` has been trimmed off the end.
 */
export function extractDoctypeInfo(rawDoctype: string): {
    name: string;
    system?: string;
    public?: string;
} {
    if (rawDoctype.startsWith("<!DOCTYPE")) {
        rawDoctype = rawDoctype.slice(10);
    }
    if (rawDoctype.endsWith(">")) {
        rawDoctype = rawDoctype.slice(0, rawDoctype.length - 1);
    }
    rawDoctype = rawDoctype.trim();

    const match = rawDoctype.match(/^[\w-]*/);
    const name = match?.[0] || "";
    if (name) {
        rawDoctype = rawDoctype.slice(name.length).trim();
    }
    // The types say that `public` and `system` must be a string or undefined.
    // However, xast's `fromXml` leaves them as `null` instead of undefined,
    // so we copy that behavior.
    let _public: string | undefined = null as unknown as undefined;
    let system: string | undefined = null as unknown as undefined;
    if (rawDoctype.startsWith("PUBLIC")) {
        rawDoctype = rawDoctype.slice(6);
        // Find all the quoted strings
        const match = rawDoctype.match(/(["'])(.*?)\1/g);
        if (match) {
            if (match[0]) {
                _public = match[0].slice(1, match[0].length - 1);
            }
            if (match[1]) {
                system = match[1].slice(1, match[1].length - 1);
            }
        }
    }
    if (rawDoctype.startsWith("SYSTEM")) {
        rawDoctype = rawDoctype.slice(6);
        // Find all the quoted strings
        const match = rawDoctype.match(/(["'])(.*?)\1/g);
        if (match && match[0]) {
            system = match[0].slice(1, match[0].length - 1);
        }
    }

    return { name, public: _public, system };
}

export function mergeAdjacentTextNodes(
    nodes: Root["children"],
): Root["children"] {
    const ret: Root["children"] = [];

    let lastNode: (typeof nodes)[number] | null = null;
    for (const node of nodes) {
        if (!lastNode) {
            lastNode = node;
            ret.push(node);
            continue;
        }
        if (node.type === "text" && lastNode.type === "text") {
            lastNode.value += node.value;
            if (lastNode.position && node.position) {
                // Assume that adjacent text elements are cover an adjacent range.
                lastNode.position.end = node.position.end;
            }
        } else {
            ret.push(node);
        }
    }
    return ret;
}

/**
 * Finds the first error node (type === "⚠") in the subtree rooted at `node`.
 */
export function findFirstErrorInChild(node: SyntaxNode): SyntaxNode | null {
    if (node.type.name === "⚠") {
        return node;
    }
    let child = node.firstChild;
    while (child) {
        const error = findFirstErrorInChild(child);
        if (error) {
            return error;
        }
        child = child.nextSibling;
    }
    return null;
}

/**
 * Finds the first child of `node` that matches `type`. This will also match the node
 * itself.
 */
export function findFirstOfType(
    node: SyntaxNode,
    type: LezerSyntaxNodeName | number,
): SyntaxNode | null {
    if (
        (typeof type === "string" && node.type.name === type) ||
        node.type.id === type
    ) {
        return node;
    }
    let child = node.firstChild;
    while (child) {
        const error = findFirstErrorInChild(child);
        if (error) {
            return error;
        }
        child = child.nextSibling;
    }
    return null;
}

/**
 * Returns all the children of `node`.
 */
export function getLezerChildren(node: SyntaxNode) {
    const ret: SyntaxNode[] = [];
    let child = node.firstChild;
    while (child) {
        ret.push(child);
        child = child.nextSibling;
    }
    return ret;
}

/**
 * Update the `.position` attribute of `nodeToUpdate` based on `referenceNode`.
 * The resulting `.position` should be the same as if the data was located at
 * `referenceNode.position.start`.
 *
 * **Note**: this function mutates `nodeToUpdate`.
 */
export function updateNodePositionData(
    nodeToUpdate: DastAbstractNode,
    referenceNode: DastAbstractNode,
    offsetToPositionMap: OffsetToPositionMap,
) {
    if (!nodeToUpdate.position || !referenceNode.position) {
        return;
    }

    const offset = referenceNode.position.start.offset;
    if (nodeToUpdate.position.start.offset != null && offset != null) {
        nodeToUpdate.position.start.offset += offset;
    }
    if (nodeToUpdate.position.end.offset != null && offset != null) {
        nodeToUpdate.position.end.offset += offset;
    }

    const startOffset = nodeToUpdate.position.start.offset;
    const endOffset = nodeToUpdate.position.end.offset;
    if (startOffset != null && endOffset != null) {
        // It's too difficult to directly compute the new row/column offsets,
        // so we look them up in the offset map.
        nodeToUpdate.position.start.line =
            offsetToPositionMap.rowMap[startOffset] + 1;
        nodeToUpdate.position.start.column =
            offsetToPositionMap.columnMap[startOffset] + 1;
        nodeToUpdate.position.end.line =
            offsetToPositionMap.rowMap[endOffset] + 1;
        nodeToUpdate.position.end.column =
            offsetToPositionMap.columnMap[endOffset] + 1;
    }
}

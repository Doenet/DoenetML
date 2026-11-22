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
/**
 * The first few characters of `source` from `offset`, with a character or
 * entity reference among them decoded (`&#40;x` is `(x`), enough to tell
 * whether a `$` before them would start a macro.
 */
function decodedAfter(offset: number, source: string): string {
    let decoded = "";
    let i = offset;
    while (decoded.length < 2 && i < source.length) {
        const reference =
            /^&(#x[0-9a-fA-F]+|#[0-9]+|[a-zA-Z][a-zA-Z0-9]*);/.exec(
                source.slice(i, i + 40),
            );
        if (reference) {
            decoded += entityStringToRawString(reference[0]);
            i += reference[0].length;
        } else {
            decoded += source.charAt(i);
            i++;
        }
    }
    return decoded;
}

export function entityToString(node: SyntaxNode, source: string): string {
    switch (node.name) {
        case "CharacterReference":
        case "EntityReference": {
            const entity = extractContent(node, source);
            const converted = entityStringToRawString(entity);
            // Special care must be taken for things like `&dollar;` which
            // convert to `$`. Followed by a letter, `_` or `(`, or by `$` and
            // one of those (`&#36;$f`), converting it to `$` would insert a
            // macro where there was none, and print back as one (`toXml`).
            // A zero-width space after the `$` keeps it text, as the
            // attribute path does (`unescapeEntitiesWithOffsets`); the
            // worker removes it when it reads the value.
            if (
                converted === "$" &&
                /^\$?[a-zA-Z_(]/.test(decodedAfter(node.to, source))
            ) {
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
 * Converts all `EntityReference` (`&amp;`) and `CharacterReference`
 * (`&#x33;`, `&#51;`) children into their unescaped equivalents.
 */
function unescapeEntities(node: SyntaxNode, source: string): string {
    return unescapeEntitiesWithOffsets(node, source).text;
}

/**
 * `unescapeEntities`, with where each position of the decoded text was
 * written: `sourceOffsets[k]` is the offset, from `node.from`, of the source
 * before the `k`th character of `text`, and `sourceOffsets[text.length]` the
 * offset of the end. A position inside a decoded reference, or before a
 * zero-width space added after one, is the reference's end.
 *
 * A reference is shorter decoded than written (`&lt;` is one character), so
 * an offset into the decoded text is not an offset into the source. The
 * macros read from an attribute's decoded value are located through this
 * (#2637 item 2).
 */
function unescapeEntitiesWithOffsets(
    node: SyntaxNode,
    source: string,
): { text: string; sourceOffsets: number[] } {
    const rawValue = extractContent(node, source);
    // We need to replace any entities present with their raw text, in the
    // order they are written.
    const entities = [
        ...node.getChildren("EntityReference"),
        ...node.getChildren("CharacterReference"),
    ].sort((a, b) => a.from - b.from);
    if (entities.length === 0) {
        // No entities means no escaping needed.
        return {
            text: rawValue,
            sourceOffsets: Array.from(
                { length: rawValue.length + 1 },
                (_, k) => k,
            ),
        };
    }
    const pieces: {
        text: string;
        isEntity: boolean;
        from: number;
        to: number;
    }[] = [];
    let i = 0;
    for (const entity of entities) {
        pieces.push({
            text: rawValue.slice(i, entity.from - node.from),
            isEntity: false,
            from: i,
            to: entity.from - node.from,
        });
        pieces.push({
            text: entityToString(entity, source),
            isEntity: true,
            from: entity.from - node.from,
            to: entity.to - node.from,
        });
        i = entity.to - node.from;
    }
    pieces.push({
        text: rawValue.slice(i),
        isEntity: false,
        from: i,
        to: rawValue.length,
    });

    // An attribute's value is read for macros once decoded, so a `$`
    // written as a reference (`&#36;`, `&dollar;`) must not start one with
    // what follows it, written out or decoded: `&#36;(x)`, `&#36;&#40;x)` and
    // `&#36;$f` are text before `(x)` or `$f`, not a reference. A zero-width
    // space after the `$` keeps it text, as `entityToString` already does
    // before a letter written out. In text a reference is its own node,
    // never read for macros. The worker removes the space when it reads the
    // value (`decodeXMLEntities`).
    let ret = "";
    const sourceOffsets: number[] = [];
    pieces.forEach((piece, idx) => {
        for (let k = 0; k < piece.text.length; k++) {
            sourceOffsets.push(
                piece.isEntity
                    ? k === 0
                        ? piece.from
                        : piece.to
                    : piece.from + k,
            );
        }
        ret += piece.text;
        if (piece.isEntity && piece.text === "$") {
            const rest = pieces
                .slice(idx + 1)
                .map((p) => p.text)
                .join("");
            if (/^\$?[a-zA-Z_(]/.test(rest)) {
                ret += "\u200B";
                sourceOffsets.push(piece.to);
            }
        }
    });
    sourceOffsets.push(rawValue.length);
    return { text: ret, sourceOffsets };
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
    return attributeValueTextWithOffsets(node, source).text;
}

/**
 * `attributeValueText`, with where each position of the text was written:
 * `sourceOffsets[k]` is the offset of the source before the `k`th character
 * of `text` from the start of the value inside its quotes, where
 * `lezerNodeToPosition` with `adjustForQuotes` places the value
 * (`unescapeEntitiesWithOffsets`).
 */
export function attributeValueTextWithOffsets(
    node: SyntaxNode,
    source: string,
): { text: string; sourceOffsets: number[] } {
    if (node.name !== "AttributeValue") {
        throw new Error(
            `Can only get the text of an "AttributeValue" type node, not "${node.name}"`,
        );
    }
    let { text, sourceOffsets } = unescapeEntitiesWithOffsets(node, source);
    // Remove the quotation marks, keeping the offsets beside the text.
    if (text.startsWith("'") || text.startsWith('"')) {
        text = text.slice(1);
        sourceOffsets = sourceOffsets.slice(1);
    }
    if (text.endsWith("'") || text.endsWith('"')) {
        text = text.slice(0, text.length - 1);
        sourceOffsets = sourceOffsets.slice(0, sourceOffsets.length - 1);
    }
    return {
        text,
        sourceOffsets: sourceOffsets.map((offset) => offset - 1),
    };
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

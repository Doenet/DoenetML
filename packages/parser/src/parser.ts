import type { SyntaxNode, TreeCursor } from "@lezer/common";
import { parser } from "./generated-assets/lezer-doenet";

// Re-export parser for CodeMirror instances
export { parser };

type AttrRange = Record<
    string,
    { attrBegin: number; attrEnd: number; begin: number; end: number }
>;
export type Element = {
    componentType: string;
    props: Record<string, string | boolean>;
    children: Node[];
    attributeRanges?: AttrRange;
    state?: { message: string };
    position?: {
        begin?: number;
        end?: number;
        openBegin?: number;
        openEnd?: number;
        closeBegin?: number;
        closeEnd?: number;
        selfCloseBegin?: number;
        selfCloseEnd?: number;
    };
    doenetAttributes?: {
        createNameFromComponentType: string;
    };
};

type DummyElement = {
    componentType: string;
    state: { text: string };
    position: { begin: number; end: number };
};

export type Node = Element | DummyElement | string;

/**
 *  takes in a string an outputs a TreeCursor
 * @param {string} inText
 * @returns {TreeCursor}
 */
export function parse(inText: string) {
    return parser.parse(inText).cursor();
}

/**
 * pretty-print the tree pointed to by a tree-cursor.
 * Intended for demonstration/debugging
 * @param {TreeCursor} cursor
 * @returns {string}
 */
export function showCursor(cursor: TreeCursor) {
    return showNode(cursor.node);
}

export function showNode(node: SyntaxNode) {
    let str = node.name;
    if (node.firstChild !== null) {
        str += "(" + showNode(node.firstChild) + ")";
    }
    if (node.nextSibling !== null) {
        str += "," + showNode(node.nextSibling);
    }
    return str;
}

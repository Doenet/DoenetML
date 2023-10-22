import { Doc, ParserOptions, Printer } from "prettier";
import { builders, utils } from "prettier/doc";
import { nodesToXml, quote, toXml } from "../dast-to-xml/dast-util-to-xml";
import { escape, name } from "../dast-to-xml/utils";
import { DastElement, DastNodes, DastRoot, PrintOptions } from "../types";
import {
    ALWAYS_BREAK_ELEMENTS,
    BREAK_AROUND_ELEMENTS,
    CHILDREN_ON_OWN_LINE_ELEMENTS,
    PAR_ELEMENTS,
    PRE_ELEMENTS,
} from "./normalize/special-nodes";
import { isElement } from "./normalize/utils/testers";

const { line, indent, softline, join, fill, group, hardline, breakParent } =
    builders;

export const print: Printer<DastNodes>["print"] = function print(
    path,
    _options,
    print,
) {
    const options = _options as ParserOptions<DastNodes> &
        PrintOptions & { nodeMap?: NodeMap };
    const node = path.node;
    const nodeMap = options.nodeMap;
    switch (node.type) {
        case "root": {
            // There is only one root and it is encountered first.
            // So it's a good place to build the node map.
            options.nodeMap = new NodeMap(node);
            const doc = fill(path.map(print, "children").flat());
            return doc;
        }
        case "cdata": {
            const unsafe = /]]>/g;
            const subset = [">"];
            return ["<![CDATA[", escape(node.value, subset, unsafe), "]]>"];
        }
        case "comment":
            return ["<!--", node.value, "-->"];
        case "doctype": {
            const nodeName = name(node.name);
            const pub = node.public;
            const sys = node.system;
            let result = ["<!DOCTYPE"];

            if (nodeName !== "") {
                result.push(" ", nodeName);
            }

            if (pub) {
                result.push(" ", "PUBLIC", " ", quote(pub));
            } else if (sys) {
                result.push(" ", "SYSTEM");
            }

            if (sys) {
                result.push(" ", quote(sys));
            }

            result.push(">");
            return result;
        }
        case "element": {
            const nodeName = name(node.name);
            const openingTag: Doc[] = ["<", nodeName];
            const closingTag: Doc[] = [];
            const attributes = node.attributes || [];
            const printedAttrs: Doc[] = [];
            for (const attr of attributes) {
                const attrName = name(attr.name);
                // No fancy formatting goes on for quoted attributes
                if (attr.children.length === 0) {
                    // Doenet syntax allows JSX style attributes without values assigned to them
                    if (options.doenetSyntax) {
                        printedAttrs.push(line, attrName);
                    } else {
                        printedAttrs.push(line, attrName, "=", '"true"');
                    }
                } else {
                    printedAttrs.push(
                        line,
                        attrName,
                        "=",
                        quote(nodesToXml(attr.children, options)),
                    );
                }
            }
            if (printedAttrs.length > 0) {
                openingTag.push(indent(printedAttrs));
            }
            if (node.children.length === 0) {
                // Always self-closing if there are no children
                // The closing slash will always be on the same line if there are no attributes
                openingTag.push(printedAttrs.length > 0 ? line : " ", "/>");
            } else {
                openingTag.push(printedAttrs.length > 0 ? softline : "", ">");
                closingTag.push("</", nodeName, ">");
            }

            // Compute whether a break must be inserted before or after the node
            const leadingBreak: Doc[] = [];
            const closingBreak: Doc[] = [];
            // Some elements always have breaks before or after.
            // But we only add them if they won't be inserted from text nodes directly
            if (BREAK_AROUND_ELEMENTS.has(node.name)) {
                const prevSibling = nodeMap?.prevSiblingOf(node);
                const nextSibling = nodeMap?.nextSiblingOf(node);
                if (
                    !nodeMap?.hasLineBreakBefore(node) &&
                    prevSibling &&
                    !(
                        isElement(prevSibling) &&
                        BREAK_AROUND_ELEMENTS.has(prevSibling.name)
                    )
                ) {
                    leadingBreak.push(hardline);
                }
                if (
                    nextSibling &&
                    (!nodeMap?.hasLineBreakAfter(node) ||
                        (isElement(nextSibling) &&
                            BREAK_AROUND_ELEMENTS.has(nextSibling.name)))
                ) {
                    closingBreak.push(hardline);
                }
            }

            // PRE elements have children printed verbatim.
            if (PRE_ELEMENTS.has(node.name)) {
                return [
                    ...leadingBreak,
                    group(openingTag),
                    toXml(node.children, options),
                    group(closingTag),
                    ...closingBreak,
                ];
            }

            let children = path
                .map(print, "children")
                .flat()
                .filter((x) => !isEmptyGroup(x) && x !== "");
            if (node.children.length > 0) {
                if (CHILDREN_ON_OWN_LINE_ELEMENTS.has(node.name)) {
                    children = [
                        indent([softline, joinWithSoftline(children)]),
                        softline,
                    ];
                    children.push(breakParent);
                } else {
                    children = [indent([softline, fill(children)]), softline];
                }
                if (ALWAYS_BREAK_ELEMENTS.has(node.name)) {
                    children.push(breakParent);
                }
            }
            return [
                ...leadingBreak,
                group([group(openingTag), group(children), group(closingTag)]),
                ...closingBreak,
            ];
        }
        case "error":
            return "";
        case "instruction": {
            const unsafe = /\?>/g;
            const subset = [">"];
            const nodeName = name(node.name);
            const result = escape(node.value, subset, unsafe);
            return ["<?", nodeName, result ? " " + result : "", "?>"];
        }
        case "text": {
            let escapedText = escape(node.value, ["&", "<"]);
            if (options.doenetSyntax) {
                // A < symbols that are followed by whitespace is safe
                escapedText = escapedText.replace(/&lt;(?=\s|=)/g, "<");

                // We can replace &amp; with & except in the case where it would
                // accidentally make a character entity. For example `&amp;amp;` or `&amp;#x24;`
                escapedText = escapedText.replace(/&amp;(?!\S*;)/g, "&");
            }
            // Double newlines are preserved
            return join(
                [hardline, hardline],
                escapedText
                    .split(/\n\n+/)
                    .map((str) => join(line, str.split(/\s+/))),
            ).flat();
        }
        case "macro":
        case "function":
            return toXml(node, options);

        default: {
            const unhandledType: never = node;
            console.warn(
                `Unhandled node type when pretty-printing: ${unhandledType}`,
            );
        }
    }
    return "";
};

class NodeMap {
    _parents: Map<DastNodes, DastElement | DastRoot>;
    _prevSiblings: Map<DastNodes, DastNodes | null>;
    _nextSiblings: Map<DastNodes, DastNodes | null>;
    constructor(root: DastNodes) {
        this._parents = new Map();
        this._prevSiblings = new Map();
        this._nextSiblings = new Map();
        this._init(root);
    }
    /**
     * Build a map of all parents/siblings.
     */
    _init(node: DastNodes, parent: DastNodes | null = null) {
        if (isElement(parent) || parent?.type === "root") {
            this._parents.set(node, parent);
        }
        if (isElement(node) || node?.type === "root") {
            const children = node.children;
            let prevNode: DastNodes | null = null;
            for (const n of children) {
                this._prevSiblings.set(n, prevNode);
                if (prevNode) {
                    this._nextSiblings.set(prevNode, n);
                }
                prevNode = n;
                this._init(n, node);
            }
        }
    }
    parentOf(node: DastNodes): DastElement | DastRoot | null {
        return this._parents.get(node) || null;
    }
    prevSiblingOf(node: DastNodes): DastNodes | null {
        return this._prevSiblings.get(node) || null;
    }
    nextSiblingOf(node: DastNodes): DastNodes | null {
        return this._nextSiblings.get(node) || null;
    }
    hasLineBreakBefore(node: DastNodes): boolean {
        const prevSibling = this.prevSiblingOf(node);
        if (prevSibling?.type === "text") {
            return prevSibling.value.endsWith("\n");
        }
        return false;
    }
    hasLineBreakAfter(node: DastNodes): boolean {
        const nextSibling = this.nextSiblingOf(node);
        if (nextSibling?.type === "text") {
            return nextSibling.value.endsWith("\n");
        }
        return false;
    }
}

/**
 * Returns whether the object is `type === "group"`
 */
function isGroup(doc: Doc): doc is Doc & { type: "group" } {
    if (typeof doc !== "object") {
        return false;
    }
    if (Array.isArray(doc)) {
        return false;
    }
    return doc.type === "group";
}

function isEmptyGroup(doc: Doc): boolean {
    return (
        isGroup(doc) && Array.isArray(doc.contents) && doc.contents.length === 0
    );
}

/**
 * Join with a softline between each element, but only if there isn't already a line between the elements.
 */
function joinWithSoftline(doc: Doc[]): Doc[] {
    if (doc.length === 0) {
        return doc;
    }
    const ret: Doc[] = [];
    for (let i = 0; i < doc.length; i++) {
        const curr = doc[i];
        const next = doc[i + 1];
        ret.push(curr);
        if (next && !isLine(next) && !isLine(curr)) {
            ret.push(softline);
        }
    }
    return ret;
}

function isLine(doc: Doc): boolean {
    if (doc === line || doc === softline || doc === hardline) {
        return true;
    }
    if (typeof doc !== "object") {
        return false;
    }
    if (Array.isArray(doc)) {
        // Could be an array containing a line and a break-parent
        return isLine(doc[0]);
    } else {
        return doc.type === "line";
    }
    return false;
}

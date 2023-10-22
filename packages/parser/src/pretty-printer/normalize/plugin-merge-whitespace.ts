import { Plugin } from "unified";
import { DastRoot } from "../../types";
import { INDENTABLE_PRE_ELEMENTS, PRE_ELEMENTS } from "./special-nodes";
import { isElement, isText } from "./utils/testers";
import { SKIP, visit } from "./utils/visit";

/**
 * Unifiedjs plugin that converts sequences of whitespace to a single space character.
 */
export const mergeWhitespacePlugin: Plugin<void[], DastRoot, DastRoot> =
    function () {
        return (root: DastRoot) => {
            visit(root, (node, info) => {
                if (
                    isElement(node) &&
                    (PRE_ELEMENTS.has(node.name) ||
                        INDENTABLE_PRE_ELEMENTS.has(node.name))
                ) {
                    // Don't mangle whitespace inside of pre elements
                    return SKIP;
                }
                if (!isText(node)) {
                    // Only text nodes have whitespace to merge
                    return;
                }
                node.value = normalizeWhitespace(node.value);
            });
        };
    };

/**
 * Normalize whitespace in a string:
 *  - Lines that are only whitespace are are turned into single `\n` characters
 *  - Multiple whitespace characters in a row are turned into a single space character
 *  - Single newlines, but not double new lines, are turned into spaces
 */
export function normalizeWhitespace(str: string): string {
    // `[^\S\r\n]` matches all whitespace except for newlines

    // Make sure whitespace-only lines are turned into single newlines
    str = str.replace(/[^\S\r\n]*\n[^\S\r\n]*/g, "\n");

    let parts = str.split(/\n\n+/);
    parts = parts.map((part) => part.replace(/([^\S\r\n]|\n(?!\n))+/g, " "));

    // Make sure multiple whitespace characters in a row are turned into a single space
    // but do not replace two newlines in a row
    str = parts.join("\n\n");

    return str;
}

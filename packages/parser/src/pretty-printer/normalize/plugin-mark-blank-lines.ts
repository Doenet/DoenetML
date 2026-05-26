import { Plugin } from "unified";
import { DastNodes, DastRoot } from "../../types";
import { isElement, isText } from "./utils/testers";
import { visit } from "./utils/visit";

/**
 * Records, in a shared `WeakSet`, every child node whose immediately
 * preceding sibling was a whitespace-only text node containing a blank
 * line (i.e. `\n\n` or more). The printer reads this set in block mode to
 * emit an extra `hardline` (yielding a single blank line) before the
 * child, preserving authorial visual grouping.
 *
 * Cap is binary: any number of blank lines in source collapses to one
 * blank line in output.
 *
 * Must run BEFORE `removeInternodeWhitespacePlugin`, which deletes the
 * pure-whitespace text nodes this plugin inspects.
 */
const _blankLineBefore = new WeakSet<DastNodes>();

export function hasBlankLineBefore(
    node: DastNodes | null | undefined,
): boolean {
    return !!node && _blankLineBefore.has(node);
}

export const markBlankLinesPlugin: Plugin<void[], DastRoot, DastRoot> =
    function () {
        return (root: DastRoot) => {
            visit(root, (node) => {
                if (!isElement(node) && node.type !== "root") {
                    return;
                }
                const children = (node as { children: DastNodes[] }).children;
                if (!children) return;
                for (let i = 1; i < children.length; i++) {
                    const prev = children[i - 1];
                    if (
                        isText(prev) &&
                        prev.value.trim().length === 0 &&
                        /\n[^\S\n]*\n/.test(prev.value)
                    ) {
                        _blankLineBefore.add(children[i]);
                    }
                }
            });
        };
    };

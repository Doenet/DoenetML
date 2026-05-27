import { Plugin } from "unified";
import { DastNodes, DastRoot } from "../../types";
import { isBlock } from "./layout-categories";
import { isElement, isText } from "./utils/testers";
import { visit } from "./utils/visit";

/**
 * Sets `node.data.prettyBlankLineBefore = true` on every child node that
 * should be preceded by exactly one blank line in the output. The printer
 * reads this flag in block mode and emits `[hardline, hardline]` before
 * the marked child.
 *
 * Three patterns mark a child:
 *
 *  1. The previous sibling is a whitespace-only text node containing a
 *     blank line (`\n\n` or more). The text gets removed downstream by
 *     `removeInternodeWhitespacePlugin`.
 *
 *  2. The previous sibling is a *content-bearing* text whose value ends
 *     with a blank line, and the current node is a block element. The
 *     trailing blank line is stripped from the text so the text printer
 *     doesn't also emit `[hardline, hardline]` — which would stack with
 *     the parent's separator hardline and produce two blank lines instead
 *     of one.
 *
 *  3. The previous sibling is a block element and the current node is a
 *     content-bearing text whose value starts with a blank line. Same
 *     reasoning as (2), mirrored.
 *
 * Cap is binary: any number of blank lines in source collapses to one
 * blank line in output. Blank lines *inside* a content text run (not at a
 * boundary with a block sibling) are left in the text and handled by the
 * text printer's own `\n\n+` split — that's the right thing in inline
 * contexts like `<p>foo\n\nbar</p>`.
 *
 * Must run BEFORE `removeInternodeWhitespacePlugin` (which deletes
 * whitespace-only text nodes between blocks).
 */

export function hasBlankLineBefore(
    node: DastNodes | null | undefined,
): boolean {
    return !!node?.data?.prettyBlankLineBefore;
}

function mark(node: DastNodes) {
    (node.data ??= {}).prettyBlankLineBefore = true;
}

const TRAILING_BLANK_LINE = /\n[^\S\n]*\n[^\S\n]*$/;
const LEADING_BLANK_LINE = /^[^\S\n]*\n[^\S\n]*\n/;

/**
 * Exposed for unit tests — the `[^\S\n]` (whitespace that isn't a newline)
 * character class is easy to miscopy as `\s` or `[^\n]` in a future edit
 * and would silently change which boundaries get marked.
 */
export const _testOnly = { TRAILING_BLANK_LINE, LEADING_BLANK_LINE };

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
                    const curr = children[i];

                    if (
                        isText(prev) &&
                        prev.value.trim().length === 0 &&
                        /\n[^\S\n]*\n/.test(prev.value)
                    ) {
                        mark(curr);
                        continue;
                    }

                    if (
                        isText(prev) &&
                        prev.value.trim().length > 0 &&
                        isElement(curr) &&
                        isBlock(curr.name) &&
                        TRAILING_BLANK_LINE.test(prev.value)
                    ) {
                        mark(curr);
                        prev.value = prev.value.replace(
                            TRAILING_BLANK_LINE,
                            "",
                        );
                        continue;
                    }

                    if (
                        isText(curr) &&
                        curr.value.trim().length > 0 &&
                        isElement(prev) &&
                        isBlock(prev.name) &&
                        LEADING_BLANK_LINE.test(curr.value)
                    ) {
                        mark(curr);
                        curr.value = curr.value.replace(LEADING_BLANK_LINE, "");
                        continue;
                    }
                }
            });
        };
    };

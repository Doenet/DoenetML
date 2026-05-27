import { Doc, ParserOptions, Printer } from "prettier";
import { builders } from "prettier/doc";
import { nodesToXml, quote, toXml } from "../dast-to-xml/dast-util-to-xml";
import { escape, name } from "../dast-to-xml/utils";
import { DastElement, DastNodes, PrintOptions } from "../types";
import {
    isAlwaysBreakParent,
    isBlock,
    isDefinitionalContainer,
} from "./normalize/layout-categories";
import { hasBlankLineBefore } from "./normalize/plugin-mark-blank-lines";
import { PRE_ELEMENTS } from "./normalize/special-nodes";

const { line, indent, softline, join, fill, group, hardline, breakParent } =
    builders;

type ContentMode = "pre" | "empty" | "inline" | "block";

/**
 * Classify how an element's children should be laid out.
 *
 * - `"pre"`: children are emitted verbatim (no whitespace touched).
 * - `"empty"`: no children — self-closing tag.
 * - `"block"`: at least one child is a block element. Block children go
 *   on their own line; consecutive non-block children (text + macros +
 *   inline elements) form an inline run rendered with `fill()`.
 * - `"inline"`: only text/macro/inline-element children. Rendered with
 *   `fill()` inside a `group()` so the whole element collapses to one
 *   line when it fits in `printWidth`.
 */
function classifyContentMode(node: DastElement): ContentMode {
    if (PRE_ELEMENTS.has(node.name)) return "pre";
    if (node.children.length === 0) return "empty";
    if (isAlwaysBreakParent(node.name)) return "block";
    return node.children.some(isBlockChildNode) ? "block" : "inline";
}

/**
 * Whether a child node should be treated as "block" content for the
 * purposes of laying out a parent's children. Block elements qualify by
 * name; comment / cdata / doctype / instruction nodes are always
 * block-like (each sits on its own line). Used by both
 * `classifyContentMode` (to decide a parent's content mode) and
 * `printChildSequenceAsBlock` (to decide where inline runs break).
 */
function isBlockChildNode(node: DastNodes): boolean {
    switch (node.type) {
        case "element":
            return isBlock(node.name);
        case "comment":
        case "cdata":
        case "doctype":
        case "instruction":
            return true;
        default:
            return false;
    }
}

export const print: Printer<DastNodes>["print"] = function print(
    path,
    _options,
    print,
) {
    const options = _options as ParserOptions<DastNodes> & PrintOptions;
    const node = path.node;
    switch (node.type) {
        case "root": {
            const printedRootChildren = path.map(print, "children");
            return printChildSequenceAsBlock(
                node.children,
                printedRootChildren,
            );
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
            const attributes = node.attributes || [];
            const printedAttrs: Doc[] = [];
            for (const attr of Object.values(attributes)) {
                const attrName = name(attr.name);
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

            const mode = classifyContentMode(node);

            if (mode === "empty") {
                openingTag.push(printedAttrs.length > 0 ? line : " ", "/>");
                return group(openingTag);
            }

            // For all non-empty elements the opening tag ends with `>`.
            openingTag.push(printedAttrs.length > 0 ? softline : "", ">");
            const closingTag: Doc[] = ["</", nodeName, ">"];

            if (mode === "pre") {
                return [
                    group(openingTag),
                    toXml(node.children, options),
                    closingTag,
                ];
            }

            if (mode === "inline") {
                // Render as a single group: collapses to one line when it
                // fits in printWidth, otherwise breaks and indents children.
                const children = flattenForFill(path.map(print, "children"));
                return group([
                    group(openingTag),
                    indent([softline, fill(children)]),
                    softline,
                    closingTag,
                ]);
            }

            // mode === "block": children laid out vertically; consecutive
            // non-block children form inline runs rendered with fill().
            // Inside <setup> / <moduleAttributes>, every direct element
            // child gets its own line — these are definitional containers
            // with no prose semantics, so sibling tags should never share
            // a line. The rule does NOT recurse: each child element
            // formats its own contents normally (e.g. a <p name="myPara">
            // inside <setup> still gets prose-flow rules).
            const treatAllElementsAsBlock = isDefinitionalContainer(node.name);
            const printedBlockChildren = path.map(print, "children");
            const blockBody = printChildSequenceAsBlock(
                node.children,
                printedBlockChildren,
                treatAllElementsAsBlock,
            );
            return [
                group(openingTag),
                indent([hardline, blockBody]),
                hardline,
                closingTag,
                breakParent,
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
            // Double newlines inside the text value are preserved as a
            // single blank line. Boundary blank lines (those adjacent to a
            // block sibling) are stripped upstream by
            // `markBlankLinesPlugin`, so the parent's block separator is
            // the single source of truth for inter-sibling spacing; if you
            // remove that stripping, this `\n\n+` split will stack with
            // the separator hardline and produce two blank lines.
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

/**
 * Render a child sequence in block layout — each block child on its own
 * line, consecutive non-block (text + macros + inline elements) children
 * grouped into an inline run rendered with `fill()`. Blank lines from
 * source (recorded by `plugin-mark-blank-lines`) are emitted as a single
 * extra hardline before the affected child.
 *
 * Used by the root and by elements whose `classifyContentMode` returned
 * `"block"`. The returned Doc carries no leading or trailing hardline —
 * the caller is responsible for surrounding indent/hardlines.
 *
 * When `treatAllElementsAsBlock` is set, every element child gets its own
 * line regardless of its inline/block classification. Used for the
 * definitional containers (`<setup>`, `<moduleAttributes>`), whose direct
 * children are a list of definitions with no prose flow.
 */
function printChildSequenceAsBlock(
    children: DastNodes[],
    printedChildren: Doc[],
    treatAllElementsAsBlock: boolean = false,
): Doc {
    // Group consecutive non-block children into inline runs. Inline runs
    // get their fill-content pre-computed so empty ones (e.g. a lone
    // whitespace text between two elements promoted to block by
    // `treatAllElementsAsBlock`) can be dropped before we start emitting
    // separators — otherwise the separator hardlines stack into spurious
    // blank lines and break idempotence on the next format pass.
    type Run =
        | { kind: "block"; firstNode: DastNodes; printed: Doc }
        | { kind: "inline"; firstNode: DastNodes; fillContent: Doc[] };
    const runs: Run[] = [];
    let inlineBuf: { firstNode: DastNodes; printed: Doc[] } | null = null;
    function flushInline() {
        if (!inlineBuf) return;
        const fillContent = flattenForFill(inlineBuf.printed);
        if (fillContent.length > 0) {
            runs.push({
                kind: "inline",
                firstNode: inlineBuf.firstNode,
                fillContent,
            });
        }
        inlineBuf = null;
    }
    for (let i = 0; i < children.length; i++) {
        const child = children[i];
        const printed = printedChildren[i];
        const childIsBlock =
            isBlockChildNode(child) ||
            (treatAllElementsAsBlock && child.type === "element");
        if (childIsBlock) {
            flushInline();
            runs.push({ kind: "block", firstNode: child, printed });
        } else {
            if (!inlineBuf) inlineBuf = { firstNode: child, printed: [] };
            inlineBuf.printed.push(printed);
        }
    }
    flushInline();

    const parts: Doc[] = [];
    for (let r = 0; r < runs.length; r++) {
        const run = runs[r];
        if (r > 0) {
            parts.push(
                hasBlankLineBefore(run.firstNode)
                    ? [hardline, hardline]
                    : hardline,
            );
        }
        parts.push(run.kind === "block" ? run.printed : fill(run.fillContent));
    }
    return parts;
}

/**
 * Prepare a sequence of printed child Docs for `fill()`. `fill` requires
 * strict alternation of content / line-separator entries; interleaved
 * empty strings (which our `text` printer emits around `line` separators)
 * confuse fill's break-decision heuristic and produce the
 * "second-element-breaks-internally" layout bug.
 *
 * This walks the children, flattens any nested arrays, drops empty
 * strings, and collapses runs of multiple `line`-typed separators down
 * to one. The result is suitable to pass directly to `fill`.
 */
function flattenForFill(children: Doc[]): Doc[] {
    const flat: Doc[] = [];
    for (const item of children) {
        if (Array.isArray(item)) {
            for (const sub of item) flat.push(sub);
        } else {
            flat.push(item);
        }
    }
    // Filter empty strings — these are the artifacts of text-node printing
    // around `line` separators that confuse fill's break heuristic.
    // Preserve hardline runs as-is (double hardlines encode blank lines
    // from source) but coalesce adjacent soft `line` separators and drop a
    // leading or trailing one (fill requires content/separator alternation).
    const result: Doc[] = [];
    for (const item of flat) {
        if (item === "") continue;
        if (isSoftLine(item)) {
            const last = result[result.length - 1];
            if (result.length === 0 || isSoftLine(last)) continue;
        }
        result.push(item);
    }
    while (result.length > 0 && isSoftLine(result[result.length - 1])) {
        result.pop();
    }
    return result;
}

function isSoftLine(item: Doc): boolean {
    return item === line || item === softline;
}

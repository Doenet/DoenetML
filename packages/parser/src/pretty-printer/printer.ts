import { Doc, ParserOptions, Printer } from "prettier";
import { builders } from "prettier/doc";
import { nodesToXml, quote, toXml } from "../dast-to-xml/dast-util-to-xml";
import { escape, name } from "../dast-to-xml/utils";
import { DastElement, DastNodes, PrintOptions } from "../types";
import { isAlwaysBreakParent, isBlock } from "./normalize/layout-categories";
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
    const hasBlockChild = node.children.some(
        (c) => c.type === "element" && isBlock(c.name),
    );
    return hasBlockChild ? "block" : "inline";
}

/**
 * Whether a printed child Doc should be treated as "block" content for
 * purposes of laying out the parent's children — used by the root and
 * block-mode element branches. A child is block when it is an element
 * whose name is block, plus comment / cdata / doctype / instruction
 * nodes (these are always laid out as their own line).
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
            const printedBlockChildren = path.map(print, "children");
            const blockBody = printChildSequenceAsBlock(
                node.children,
                printedBlockChildren,
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
 */
function printChildSequenceAsBlock(
    children: DastNodes[],
    printedChildren: Doc[],
): Doc {
    // Group consecutive non-block children into inline runs.
    type Run =
        | { kind: "block"; node: DastNodes; printed: Doc }
        | { kind: "inline"; nodes: DastNodes[]; printed: Doc[] };
    const runs: Run[] = [];
    let inlineBuf: { nodes: DastNodes[]; printed: Doc[] } | null = null;
    for (let i = 0; i < children.length; i++) {
        const child = children[i];
        const printed = printedChildren[i];
        if (isBlockChildNode(child)) {
            if (inlineBuf) {
                runs.push({ kind: "inline", ...inlineBuf });
                inlineBuf = null;
            }
            runs.push({ kind: "block", node: child, printed });
        } else {
            if (!inlineBuf) inlineBuf = { nodes: [], printed: [] };
            inlineBuf.nodes.push(child);
            inlineBuf.printed.push(printed);
        }
    }
    if (inlineBuf) runs.push({ kind: "inline", ...inlineBuf });

    const parts: Doc[] = [];
    for (let r = 0; r < runs.length; r++) {
        const run = runs[r];
        const isFirstRun = r === 0;
        const firstNodeOfRun = run.kind === "block" ? run.node : run.nodes[0];
        const wantsBlankLineBefore =
            !isFirstRun && hasBlankLineBefore(firstNodeOfRun);

        if (!isFirstRun) {
            parts.push(wantsBlankLineBefore ? [hardline, hardline] : hardline);
        }

        if (run.kind === "block") {
            parts.push(run.printed);
        } else {
            // A run of inline content wraps as prose. Pass the children
            // through `flattenForFill` — Prettier's `fill` expects strict
            // alternation of content and line separator, and breaks at
            // poor positions when interleaved empty strings violate that
            // invariant.
            const fillContent = flattenForFill(run.printed);
            if (fillContent.length === 0) continue;
            parts.push(fill(fillContent));
        }
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
    // from source) but coalesce adjacent soft `line` separators.
    const result: Doc[] = [];
    let lastWasSoftLine = false;
    for (const item of flat) {
        if (item === "") continue;
        if (item === line || item === softline) {
            if (result.length === 0) continue;
            if (lastWasSoftLine) continue;
            result.push(item);
            lastWasSoftLine = true;
        } else {
            result.push(item);
            lastWasSoftLine = false;
        }
    }
    // Drop trailing soft separator
    while (result.length > 0) {
        const last = result[result.length - 1];
        if (last === line || last === softline) {
            result.pop();
        } else {
            break;
        }
    }
    return result;
}

// Code modified from xast-util-to-xml MIT License https://github.com/syntax-tree/xast-util-to-xml
import { ccount } from "ccount";
import {
    DastAttribute,
    DastElement,
    DastNodes,
    DastMacroFullPath,
    DastFunctionMacro,
    DastMacro,
    DastMacroPathPart,
    PrintOptions,
    DastNodesV6,
    DastMacroV6,
    DastFunctionMacroV6,
} from "../types";
import { escape, mergeAdjacentTextInArray, name } from "./utils";
import { macroToString as macroToStringV6 } from "../macros-v6/macro-to-string";
import { parseMacroTail } from "../macros";

/**
 * Serialize a xast tree to XML.
 */
export function toXml(
    tree?:
        | DastNodes[]
        | DastNodes
        | DastNodesV6[]
        | DastNodesV6
        | DastMacroPathPart
        | DastMacroFullPath
        | null,
    options?: PrintOptions,
) {
    options = options || {};
    if (!tree) {
        return "";
    }
    const node = (
        Array.isArray(tree) ? { type: "root", children: tree } : tree
    ) as DastNodes;

    return nodesToXml(node, options);
}

/**
 * Serialize a node.
 */
export function nodesToXml(
    node:
        | DastNodes
        | DastNodes[]
        | DastAttribute
        | DastMacroPathPart
        | DastMacroFullPath,
    options: PrintOptions,
    /**
     * Set when the caller knows the character that will follow this node would otherwise
     * be absorbed into it. Only meaningful for macros.
     */
    forceParens = false,
): string {
    if (Array.isArray(node)) {
        if (!node.some((n) => n.type === "pathPart")) {
            const children = mergeAdjacentTextInArray(node as DastNodes[]);
            const parts = children.map((child) => nodesToXml(child, options));
            // A reference written `$(x)` can only be printed bare when nothing that
            // follows it would be read as part of it. Walk the rendered siblings from
            // the right, and reprint any reference that would absorb the one after it
            // in its `$(...)` form. Comparing the rendered strings (rather than the
            // nodes) means escaping and siblings that print nothing take care of
            // themselves.
            let following = "";
            for (let i = parts.length - 1; i >= 0; i--) {
                const child = children[i];
                if (
                    (child.type === "macro" || child.type === "function") &&
                    referenceWouldAbsorb(parts[i], following)
                ) {
                    parts[i] = nodesToXml(child, options, true);
                }
                if (parts[i]) {
                    following = parts[i];
                }
            }
            return parts.join("");
        } else {
            // If the node is an array of macro path parts, we need to convert it to a string
            return (node as DastMacroPathPart[])
                .map((part) => nodesToXml(part, options))
                .join(".");
        }
    }

    const type = node && node.type;
    switch (node?.type) {
        case "root":
            return nodesToXml(node.children, options);
        case "cdata": {
            const unsafe = /]]>/g;
            const subset = [">"];
            return "<![CDATA[" + escape(node.value, subset, unsafe) + "]]>";
        }
        case "comment":
            return "<!--" + escape(node.value, ["-"]) + "-->";
        case "doctype": {
            const nodeName = name(node.name);
            const pub = node.public;
            const sys = node.system;
            let result = "<!DOCTYPE";

            if (nodeName !== "") {
                result += " " + nodeName;
            }

            if (pub) {
                result += " PUBLIC " + quote(pub);
            } else if (sys) {
                result += " SYSTEM";
            }

            if (sys) {
                result += " " + quote(sys);
            }

            return result + ">";
        }
        case "attribute": {
            return attrToString(node, options);
        }
        case "element": {
            const nodeName = name(node.name);
            const content = nodesToXml(node.children, options);
            const attributes = node.attributes || [];

            const attrs = Object.values(attributes).map((attr) =>
                attrToString(attr, options),
            );
            const printedAttrs =
                (attrs.length > 0 ? " " : "") + attrs.join(" ");

            if (
                node.children.length === 0 ||
                (!options.inlineErrors &&
                    node.children.every((c) => c.type === "error"))
            ) {
                return `<${nodeName}${printedAttrs} />`;
            }
            return `<${nodeName}${printedAttrs}>${content}</${nodeName}>`;
        }
        case "instruction": {
            const unsafe = /\?>/g;
            const subset = [">"];
            const nodeName = name(node.name);
            const result = escape(node.value, subset, unsafe);
            return "<?" + nodeName + (result ? " " + result : "") + "?>";
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
            return escapedText;
        }
        case "error": {
            if (options.inlineErrors) {
                const errorElement: DastElement = {
                    type: "element",
                    name: "_error",
                    attributes: {
                        message: {
                            type: "attribute",
                            name: "message",
                            children: [{ type: "text", value: node.message }],
                        },
                    },
                    children: [{ type: "text", value: node.message }],
                };
                return nodesToXml(errorElement, options);
            }
            return "";
        }
        case "macro": {
            if ((node as unknown as DastMacroV6).version === "0.6") {
                return macroToStringV6(node as any, forceParens);
            }
            const macro = unwrappedMacroToString(node, options);

            let start = "$";
            let end = "";
            if (macroNeedsParens(node) || forceParens) {
                start += "(";
                end += ")";
            }
            return start + macro + end;
        }
        case "function": {
            if ((node as unknown as DastMacroV6).version === "0.6") {
                return macroToStringV6(node as any, forceParens);
            }
            const macro = unwrappedMacroToString(node, options);

            let start = "$$";
            let end = "";
            if (macroNeedsParens(node) || forceParens) {
                start += "(";
                end += ")";
            }
            const args = node.input
                ? `(${node.input
                      .map((a) => nodesToXml(a, options))
                      .join(", ")})`
                : "";
            return start + macro + end + args;
        }
        case "pathPart": {
            return (
                node.name +
                node.index
                    .map((ind) => `[${nodesToXml(ind.value, options)}]`)
                    .join("")
            );
        }
        default: {
            // Typescript exhaustiveness check
            const unusedType: void = node;
        }
    }

    if (!type) {
        throw new Error("Expected node, not `" + node + "`");
    }

    throw new Error("Cannot compile unknown node `" + type + "`");
}

/**
 * Serialize an attribute value.
 */
export function quote(value: string) {
    const result = String(value);
    let quoteMark = '"';

    const other = quoteMark === '"' ? "'" : '"';

    if (ccount(result, quoteMark) > ccount(result, other)) {
        quoteMark = other;
    }

    return quoteMark + escape(result, ["<", quoteMark]) + quoteMark;
}

/**
 * Convert a macro to a string, but do not wrap it in parens or add a `$` prefix.
 */
function unwrappedMacroToString(
    nodes: DastMacro | DastFunctionMacro,
    options: PrintOptions,
): string {
    const path = macroPathToString(nodes.path, options);
    let attrsStr = "";
    if (nodes.type === "macro") {
        const attrs = Object.values(nodes.attributes || {})
            .map((a) => attrToString(a, options))
            .join(" ");
        attrsStr = attrs.length > 0 ? `{${attrs}}` : "";
    }
    let propAccess = "";
    return path + attrsStr + propAccess;
}

function macroPathToString(
    path: DastMacroFullPath,
    options: PrintOptions,
): string {
    return path.map((part) => macroPathPartToString(part, options)).join(".");
}

function macroPathPartToString(
    pathPart: DastMacroPathPart,
    options: PrintOptions,
): string {
    return (
        pathPart.name +
        pathPart.index
            .map((part) => `[${nodesToXml(part.value, options)}]`)
            .join("")
    );
}

function attrToString(attr: DastAttribute, options: PrintOptions): string {
    if (attr.children.length === 0) {
        // Doenet syntax allows JSX style attributes without values assigned to them
        if (options.doenetSyntax) {
            return name(attr.name);
        }
        return `${name(attr.name)}="true"`;
    }
    return `${name(attr.name)}=${quote(nodesToXml(attr.children, options))}`;
}

function macroNeedsParens(macro: DastMacro | DastFunctionMacro): boolean {
    // We also might need wrapping if the path contains a `-` character
    return macro.path.some((part) => part.name.includes("-"));
}

/**
 * Whether a reference that printed as `printed` would absorb the start of `following`,
 * so that printing it bare says something the author did not write.
 *
 * A name runs on through `[a-zA-Z0-9_]`, so `$x` printed directly before the text
 * `_0` re-parses as one reference named `x_0`. Beyond that, a reference whose path is
 * still open takes an index, a property access or a brace block written against it:
 * `$(x)[1]` is a reference followed by the literal text `[1]`, while a bare `$x[1]` is
 * a reference *with an index*, resolving to something else entirely.
 *
 * Which of those the grammar would actually claim is a question only the grammar can
 * answer, so `parseMacroTail` — the entry point `gobblePropIndices` uses to pick a
 * reference's path up again — answers it. That keeps the rule from wrapping text a
 * path could not have taken: `$x.5` stays bare, because a path part's name cannot
 * start with a digit, and so does `$x{fixed=` from a brace block whose value was
 * written without quotes, which is not a brace block at all.
 *
 * A leading `[` is the one case `parseMacroTail` cannot see, because an index holding
 * an element is split across siblings and all it is given is the `[`.
 *
 * "Still open" is readable straight off the printed form, and it lines up with the
 * three reasons `whatClosedThePath` gives in `gobble-prop-indices.ts`: a printed
 * reference ending in `)` was parenthesized or carried an argument list, and one
 * ending in `}` carried a brace block. Both are closed, which is why `$x{z}[5]` and
 * `$$f(1)[2]` need no parentheses to keep their trailing text literal. One ending in
 * `]` is *not* closed — an index hangs off a path part, so `$a[1][2]` and `$a[1].y`
 * re-parse as a single reference.
 */
export function referenceWouldAbsorb(
    printed: string,
    following: string,
): boolean {
    if (isNameChar(following[0]) && isNameChar(printed.slice(-1))) {
        return true;
    }
    const pathIsClosed = printed.endsWith(")") || printed.endsWith("}");
    if (pathIsClosed) {
        return false;
    }
    // A path holding an element has no parenthesized spelling to fall back on.
    // `$(…)` is read by the string macro parser, which never sees an element —
    // that is the whole reason `gobblePropIndices` exists — so `$(a[<n />])`
    // is not a reference at all, and printing one loses what it was: the four
    // nodes `$(a[`, `<n />`, `])` come back with no reference among them.
    // Declining here leaves `$a[<n />]` bare, which is what it was written as
    // and what it parses back to.
    //
    // A raw `<` in the printed form means exactly that case. Anything else an
    // index can hold is escaped on the way out — a text index of `<` prints as
    // `&lt;` — and the two other places an element can appear, a function
    // reference's arguments and a brace block's value, have closed the path
    // above before we get here.
    if (printed.includes("<")) {
        return false;
    }
    if (following.startsWith("[")) {
        return true;
    }
    // A path continues with `.`, `[` or `{` and with nothing else, so anything
    // else is settled without asking the grammar. Worth the line: `following`
    // is however much prose comes after the reference, and `MacroTail` captures
    // all of it as its remainder.
    if (!following.startsWith(".") && !following.startsWith("{")) {
        return false;
    }
    return parseMacroTail(following).remainder !== following;
}

/**
 * Whether `char` can appear in the middle of a reference's name.
 */
function isNameChar(char: string): boolean {
    return /^[a-zA-Z0-9_]$/.test(char);
}

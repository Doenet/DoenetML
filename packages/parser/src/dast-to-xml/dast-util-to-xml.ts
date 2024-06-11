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

/**
 * Serialize a xast tree to XML.
 */
export function toXml(
    tree?: DastNodes[] | DastNodes | DastNodesV6[] | DastNodesV6 | null,
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
    node: DastNodes | DastNodes[],
    options: PrintOptions,
): string {
    if (Array.isArray(node)) {
        return mergeAdjacentTextInArray(node)
            .map((child) => nodesToXml(child, options))
            .join("");
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
                    attributes: {},
                    children: [{ type: "text", value: node.message }],
                };
                return nodesToXml(errorElement, options);
            }
            return "";
        }
        case "macro": {
            if ((node as unknown as DastMacroV6).version === "0.6") {
                return macroToStringV6(node as any);
            }
            const macro = unwrappedMacroToString(node, options);

            let start = "$";
            let end = "";
            if (macroNeedsParens(node)) {
                start += "(";
                end += ")";
            }
            return start + macro + end;
        }
        case "function": {
            if ((node as unknown as DastMacroV6).version === "0.6") {
                return macroToStringV6(node as any);
            }
            const macro = unwrappedMacroToString(node, options);

            let start = "$$";
            let end = "";
            if (macroNeedsParens(node)) {
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

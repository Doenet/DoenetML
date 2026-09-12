import { quote, toXml } from "../dast-to-xml/dast-util-to-xml";
import {
    Attr,
    FullPath,
    FunctionMacro,
    Macro,
    PropAccess,
    ScopedPathPart,
    Text,
} from "./types";

type Node = Macro | FunctionMacro | Text | PropAccess;

/**
 * Convert a "pure" macro to a string. I.e., a macro that was parsed directly from the peggy grammar.
 * **Note**: This function is probably not what you want. You probably want `toXml`, since this function
 * cannot print function macros that have XML nodes as children.
 */
export function macroToString(
    node: Node | Node[],
    /**
     * Set when the text that will follow would otherwise be absorbed into the macro. See
     * `followingTextWouldBeAbsorbed` in `dast-util-to-xml.ts`.
     */
    forceParens = false,
): string {
    if (Array.isArray(node)) {
        return node.map((n) => macroToString(n)).join("");
    }
    switch (node.type) {
        case "macro": {
            const macro = unwrappedMacroToString(node);

            let start = "$";
            let end = "";
            if (macroNeedsParens(node) || forceParens) {
                start += "(";
                end += ")";
            }
            return start + macro + end;
        }
        case "function": {
            const macro = unwrappedMacroToString(node.macro);

            let start = "$$";
            let end = "";
            if (macroNeedsParens(node) || forceParens) {
                start += "(";
                end += ")";
            }
            const args = node.input
                ? `(${node.input.map((arg) => macroToString(arg)).join(", ")})`
                : "";
            return start + macro + end + args;
        }
        case "text":
            return toXml(node);

        default:
            const _exhaustiveCheck: never = node;
            console.warn("Unhandled node type", node);
    }
    return "$ERROR";
}

/**
 * Convert a macro to a string, but do not wrap it in parens or add a `$` prefix.
 */
function unwrappedMacroToString(nodes: Macro): string {
    const path = macroPathToString(nodes.path);
    const attrs = Object.values(nodes.attributes || {})
        .map(attrToString)
        .join(" ");
    let attrsStr = attrs.length > 0 ? `{${attrs}}` : "";
    let propAccess = "";
    if (nodes.accessedProp) {
        propAccess = "." + unwrappedMacroToString(nodes.accessedProp);
    }
    return path + attrsStr + propAccess;
}

function macroPathToString(path: FullPath): string {
    return path.map(macroPathPartToString).join("/");
}

function macroPathPartToString(pathPart: ScopedPathPart): string {
    return (
        pathPart.name +
        pathPart.index.map((part) => `[${macroToString(part.value)}]`).join("")
    );
}

function attrToString(attr: Attr): string {
    const name = attr.name;
    if (attr.children.length === 0) {
        return name;
    }
    const value = attr.children.map((c) => macroToString(c)).join("");
    return `${name}=${quote(value)}`;
}

function macroNeedsParens(macro: Macro | PropAccess | FunctionMacro): boolean {
    if (macro.type === "function") {
        return macroNeedsParens(macro.macro);
    }
    // Paths are separated by slashes. They always need wrapping.
    if (macro.path.length > 1) {
        return true;
    }
    // We also might need wrapping if the path contains a `-` character
    return (
        macro.path.some((part) => part.name.includes("-")) ||
        (macro.accessedProp != null && macroNeedsParens(macro.accessedProp))
    );
}

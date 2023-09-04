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

export function macroToString(nodes: Node | Node[]): string {
    if (Array.isArray(nodes)) {
        return nodes.map((n) => macroToString(n)).join("");
    }
    switch (nodes.type) {
        case "propAccess":
        case "macro": {
            const path = pathToString(nodes.path);
            const attrs = (nodes.attributes || []).map(attrToString).join(" ");
            let attrsStr = attrs.length > 0 ? `{${attrs}}` : "";
            let propAccess = "";
            if (nodes.accessedProp) {
                propAccess = "." + macroToString(nodes.accessedProp);
            }
            const accessor = path + attrsStr + propAccess;
            if (nodes.type === "propAccess") {
                return accessor;
            }

            let start = "$";
            let end = "";
            if (needsParens(nodes)) {
                start += "(";
                end += ")";
            }
            return start + accessor + end;
        }
        case "function": {
            const path = pathToString(nodes.path);

            let start = "$$";
            let end = "";
            if (needsParens(nodes)) {
                start += "(";
                end += ")";
            }
            const args = nodes.input
                ? `(${nodes.input.map(macroToString).join(", ")})`
                : "";
            return start + path + end + args;
        }
        case "text":
            return toXml(nodes);

        default:
            const _exhaustiveCheck: never = nodes;
            console.warn("Unhandled node type", nodes);
    }
    return "$ERROR";
}

function pathToString(path: FullPath): string {
    return path.map(pathPartToString).join("/");
}

function pathPartToString(pathPart: ScopedPathPart): string {
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
    const value = attr.children.map(macroToString).join("");
    return `${name}=${quote(value)}`;
}

function needsParens(macro: Macro | PropAccess | FunctionMacro): boolean {
    // Paths are separated by slashes. They always need wrapping.
    if (macro.path.length > 1) {
        return true;
    }
    // We also might need wrapping if the path contains a `-` character
    return (
        macro.path.some((part) => part.name.includes("-")) ||
        (macro.type !== "function" &&
            macro.accessedProp != null &&
            needsParens(macro.accessedProp))
    );
}

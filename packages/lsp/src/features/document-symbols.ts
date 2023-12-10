import {
    Connection,
    DocumentSymbol,
    SymbolKind,
} from "vscode-languageserver/browser";
import { DastNodesV6, toXml } from "@doenet/parser";
import { DocumentInfo } from "../globals";
import { DoenetSourceObject } from "@doenet/lsp-tools";

export function addDocumentSymbolsSupport(
    connection: Connection,
    documentInfo: DocumentInfo,
) {
    connection.onDocumentSymbol((params) => {
        const info = documentInfo.get(params.textDocument.uri);
        if (!info) {
            return [];
        }
        const ret: DocumentSymbol[] = [];
        const sourceObj = info.autoCompleter.sourceObj;
        ret.push(...getChildrenSymbols(sourceObj.dast, sourceObj));

        return ret;
    });
}

/**
 * Get a document symbol for the given node.
 */
function nodeToSymbol(
    node: DastNodesV6,
    sourceObj: DoenetSourceObject,
): DocumentSymbol | undefined {
    switch (node.type) {
        case "element": {
            const attrs = node.attributes;
            const elmName = node.name;
            for (const attr of Object.values(attrs)) {
                if (attr.name === "name") {
                    // A name attribute defines a new symbol.
                    const name = toXml(attr.children);
                    if (!name) {
                        // If we encounter an empty name, the user may be actively typing.
                        // Gracefully ignore this.
                        continue;
                    }
                    const range = sourceObj.getNodeRange(attr.children, "lsp");
                    if (elmName === "function") {
                        return {
                            name,
                            kind: SymbolKind.Function,
                            range,
                            selectionRange: range,
                            detail: `${name}(...)`,
                        };
                    } else {
                        return {
                            name,
                            kind: SymbolKind.Namespace,
                            range,
                            selectionRange: range,
                            detail: `<${elmName}>`,
                        };
                    }
                }
            }
            break;
        }
    }
}

/**
 * Recursively get all symbols for the given node's children.
 */
function getChildrenSymbols(
    node: DastNodesV6,
    sourceObj: DoenetSourceObject,
): DocumentSymbol[] {
    const ret: DocumentSymbol[] = [];
    if (node.type !== "element" && node.type !== "root") {
        return ret;
    }

    for (const child of node.children) {
        const symbol = nodeToSymbol(child, sourceObj);
        const childSymbols = getChildrenSymbols(child, sourceObj);
        if (symbol) {
            ret.push(symbol);
            if (childSymbols.length > 0) {
                symbol.children = childSymbols;
            }
        } else {
            ret.push(...childSymbols);
        }
    }
    return ret;
}

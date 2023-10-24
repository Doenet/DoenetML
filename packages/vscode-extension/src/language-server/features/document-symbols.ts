import {
    Connection,
    DocumentSymbol,
    SymbolKind,
} from "vscode-languageserver/browser";
import { toXml, visit } from "@doenet/parser";
import { DocumentInfo } from "../globals";

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
        visit(sourceObj.dast, (node) => {
            switch (node.type) {
                case "element": {
                    const elmName = node.name;
                    const attrs = node.attributes;
                    for (const attr of attrs) {
                        if (attr.name === "name") {
                            // A name attribute defines a new symbol.
                            const name = toXml(attr.children);
                            if (!name) {
                                // If we encounter an empty name, the user may be actively typing.
                                // Gracefully ignore this.
                                continue;
                            }
                            const range = sourceObj.getNodeRange(
                                attr.children,
                                "lsp",
                            );
                            ret.push({
                                name,
                                kind:
                                    elmName === "function"
                                        ? SymbolKind.Function
                                        : SymbolKind.Variable,
                                range,
                                selectionRange: range,
                                detail:
                                    elmName === "function"
                                        ? "(Function)"
                                        : "(Variable)",
                            });
                        }
                    }
                    break;
                }
            }
        });

        return ret;
    });
}

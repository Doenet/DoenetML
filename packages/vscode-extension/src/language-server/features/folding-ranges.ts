import {
    Connection,
    FoldingRange,
    FoldingRangeKind,
} from "vscode-languageserver/browser";
import { visit } from "@doenet/parser";
import { DocumentInfo } from "../globals";

export function addFoldingRangeSupport(
    connection: Connection,
    documentInfo: DocumentInfo,
) {
    connection.onFoldingRanges((params) => {
        const info = documentInfo.get(params.textDocument.uri);
        if (!info) {
            return [];
        }

        const ret: FoldingRange[] = [];
        visit(info.autoCompleter.sourceObj.dast, (node) => {
            switch (node.type) {
                case "comment": {
                    ret.push({
                        startLine: node.position.start.line - 1,
                        endLine: node.position.end.line - 1,
                        startCharacter: node.position.start.column - 1,
                        endCharacter: node.position.end.column - 1,
                        kind: FoldingRangeKind.Comment,
                    });
                    break;
                }
                case "element": {
                    // Every element that spans multiple lines and has children is a folding range
                    if (node.children.length === 0) {
                        return;
                    }
                    const start = node.position.start.line;
                    const end = node.position.end.line;
                    if (start === end) {
                        return;
                    }
                    ret.push({
                        startLine: start - 1,
                        endLine: end - 1,
                        startCharacter: node.position.start.column - 1,
                        endCharacter: node.position.end.column - 1,
                        kind: FoldingRangeKind.Region,
                    });
                    break;
                }
            }
        });

        return ret;
    });
}

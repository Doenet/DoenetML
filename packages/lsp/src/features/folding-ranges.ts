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
            const position = node.position ?? {
                start: { line: 1, column: 1 },
                end: { line: 1, column: 1 },
            };
            switch (node.type) {
                case "comment": {
                    ret.push({
                        startLine: position.start.line - 1,
                        endLine: position.end.line - 1,
                        startCharacter: position.start.column - 1,
                        endCharacter: position.end.column - 1,
                        kind: FoldingRangeKind.Comment,
                    });
                    break;
                }
                case "element": {
                    // Every element that spans multiple lines and has children is a folding range
                    if (node.children.length === 0) {
                        return;
                    }
                    const start = position.start.line;
                    const end = position.end.line;
                    if (start === end) {
                        return;
                    }
                    ret.push({
                        startLine: start - 1,
                        endLine: end - 1,
                        startCharacter: position.start.column - 1,
                        endCharacter: position.end.column - 1,
                        kind: FoldingRangeKind.Region,
                    });
                    break;
                }
            }
        });

        return ret;
    });
}

import { Range as LSPRange } from "vscode-languageserver-textdocument";
import * as vscode from "vscode";

/**
 * Convert an LSP range to a VSCode range.
 */
export function lspRangeToVscodeRange(range: LSPRange): vscode.Range {
    return new vscode.Range(
        new vscode.Position(range.start.line, range.start.character),
        new vscode.Position(range.end.line, range.end.character),
    );
}

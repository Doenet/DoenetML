import type { Diagnostic } from "vscode-languageserver-protocol/browser";
import type { VFile } from "vfile";

/**
 * Convert a VFile message to a LSP Diagnostic.
 */
export function vfileMessageToLSPDiagnostic(
    message: VFile["messages"][number],
    severity: Diagnostic["severity"] = 1,
): Diagnostic {
    let pos = message.place;
    const range: Diagnostic["range"] = {
        start: {
            line: 0,
            character: 0,
        },
        end: {
            line: 0,
            character: 0,
        },
    };
    if (pos && "line" in pos && "column" in pos) {
        // Line and column information means there isn't a range, just a position. We highlight the whole line
        range.start.line = pos.line - 1; // Convert to 0-indexed
        range.start.character = pos.column - 1; // Convert to 0-indexed
        range.end.line = pos.line - 1 + 1;
        range.end.character = 0;
    }
    if (pos && "start" in pos && "end" in pos) {
        range.start.line = pos.start.line - 1;
        range.start.character = pos.start.column - 1;
        range.end.line = pos.end.line - 1;
        range.end.character = pos.end.column - 1;
    }

    const ret: Diagnostic = {
        message: message.message,
        range,
        severity,
    };

    return ret;
}

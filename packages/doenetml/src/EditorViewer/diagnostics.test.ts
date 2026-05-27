import { describe, expect, it } from "vitest";
import { DiagnosticSeverity } from "vscode-languageserver-protocol/browser";
import type {
    DiagnosticRecord,
    ErrorRecord,
    WarningRecord,
} from "@doenet/utils";

import { toAdditionalDiagnosticsForLsp } from "./diagnostics";

const dastPos = (
    sLine: number,
    sCol: number,
    eLine: number,
    eCol: number,
    sOffset?: number,
    eOffset?: number,
) => ({
    start: { line: sLine, column: sCol, offset: sOffset },
    end: { line: eLine, column: eCol, offset: eOffset },
});

describe("toAdditionalDiagnosticsForLsp", () => {
    it("converts DAST position (1-indexed line/column) to LSP Range (0-indexed line/character)", () => {
        // Mirrors how the worker hands the unified unquoted-attribute
        // error back through `dastResult.diagnostics` (#1197): the DAST
        // position has 1-indexed line/column, but LSP `Range` expects
        // 0-indexed line/character.  Without conversion the LSP-side
        // `dedupeLspDiagnostics` would see `start.character ===
        // undefined` for the worker echo and the editor hover would
        // render the same message twice.
        const dastDiagnostic: ErrorRecord = {
            type: "error",
            message:
                'Attribute values must be enclosed in quotes: `name="foo"`',
            position: dastPos(1, 15, 1, 18, 14, 17),
        };
        const [lsp] = toAdditionalDiagnosticsForLsp({
            diagnostics: [dastDiagnostic],
            showInfoAnnotations: false,
        });
        expect(lsp.range).toEqual({
            start: { line: 0, character: 14 },
            end: { line: 0, character: 17 },
        });
        expect(lsp.severity).toBe(DiagnosticSeverity.Error);
        expect(lsp.message).toBe(dastDiagnostic.message);
    });

    it("converts the warning, info, and accessibility paths the same way", () => {
        const warning: WarningRecord = {
            type: "warning",
            message: "W",
            position: dastPos(2, 3, 2, 7),
        };
        const info: DiagnosticRecord = {
            type: "info",
            message: "I",
            position: dastPos(5, 10, 5, 12),
        };
        const accessibility: DiagnosticRecord = {
            type: "accessibility",
            level: 1,
            message: "A",
            position: dastPos(1, 1, 1, 2),
        };
        const out = toAdditionalDiagnosticsForLsp({
            diagnostics: [warning, info, accessibility],
            showInfoAnnotations: true,
        });
        // Each LSP `Range` is shifted by -1 on both `line` and `column`,
        // and `column` is renamed to `character`.
        expect(out[0].range).toEqual({
            start: { line: 1, character: 2 },
            end: { line: 1, character: 6 },
        });
        expect(out[1].range).toEqual({
            start: { line: 4, character: 9 },
            end: { line: 4, character: 11 },
        });
        expect(out[2].range).toEqual({
            start: { line: 0, character: 0 },
            end: { line: 0, character: 1 },
        });
    });

    it("drops diagnostics without a position", () => {
        // The filter in `toAdditionalDiagnosticsForLsp` skips
        // position-less records — `dastPositionToLspRange` would
        // otherwise crash trying to read `.start.line` on undefined.
        const positionless: ErrorRecord = {
            type: "error",
            message: "no position",
        };
        const withPos: ErrorRecord = {
            type: "error",
            message: "has position",
            position: dastPos(1, 1, 1, 2),
        };
        const out = toAdditionalDiagnosticsForLsp({
            diagnostics: [positionless, withPos],
            showInfoAnnotations: false,
        });
        expect(out).toHaveLength(1);
        expect(out[0].message).toBe("has position");
    });
});

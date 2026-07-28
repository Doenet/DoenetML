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
            showAccessibilityAnnotations: true,
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
            showAccessibilityAnnotations: true,
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

    // `code` is the LSP field a stable diagnostic name belongs in, and where a
    // `codeDescription` link will attach (#1548). Only migrated records carry
    // one (#1518), and `code` is optional in LSP, so a legacy record must come
    // out without the key at all rather than with an explicit `undefined`.
    it("passes a migrated record's stable code through to LSP", () => {
        const coded: WarningRecord = {
            type: "warning",
            message: "numDimensions mismatch in ray.",
            code: "doenet-w0006",
            position: dastPos(2, 3, 2, 7),
        };
        const legacy: WarningRecord = {
            type: "warning",
            message: "not migrated yet",
            position: dastPos(3, 1, 3, 4),
        };
        const out = toAdditionalDiagnosticsForLsp({
            diagnostics: [coded, legacy],
            showInfoAnnotations: true,
            showAccessibilityAnnotations: true,
        });
        expect(out[0].code).toBe("doenet-w0006");
        expect(out[1]).not.toHaveProperty("code");
        // A code with no blanks to fill carries no arguments, so nothing is
        // put in `data` for it either.
        expect(out[0]).not.toHaveProperty("data");
    });

    // `dedupeLspDiagnostics` keys a coded record on its code *and* its
    // arguments: one component can raise the same code twice with different
    // arguments, and every diagnostic its state variables raise is stamped
    // with the component's span, so the code alone would collapse two real
    // problems into one. `data` is where the arguments ride along.
    it("forwards a coded record's arguments in `data` so the dedupe can tell occurrences apart", () => {
        const badMaximum: WarningRecord = {
            type: "warning",
            message: "Ignoring non-numerical maximum of function.",
            code: "doenet-w0040",
            args: { type: "maximum" },
            position: dastPos(1, 8, 1, 66),
        };
        const badMinimum: WarningRecord = {
            type: "warning",
            message: "Ignoring non-numerical minimum of function.",
            code: "doenet-w0040",
            args: { type: "minimum" },
            position: dastPos(1, 8, 1, 66),
        };
        const out = toAdditionalDiagnosticsForLsp({
            diagnostics: [badMaximum, badMinimum],
            showInfoAnnotations: true,
            showAccessibilityAnnotations: true,
        });
        expect(out[0].data).toEqual({ args: { type: "maximum" } });
        expect(out[1].data).toEqual({ args: { type: "minimum" } });
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
            showAccessibilityAnnotations: true,
        });
        expect(out).toHaveLength(1);
        expect(out[0].message).toBe("has position");
    });

    it("suppresses accessibility diagnostics when the session toggle is off", () => {
        // The accessibility report tab still surfaces these records, but the
        // squiggles in the editor are silenced so the hover popup stops
        // following the mouse around the offending component.
        const warning: WarningRecord = {
            type: "warning",
            message: "W",
            position: dastPos(2, 3, 2, 7),
        };
        const accessibility: DiagnosticRecord = {
            type: "accessibility",
            level: 1,
            message: "A",
            position: dastPos(1, 1, 1, 2),
        };
        const out = toAdditionalDiagnosticsForLsp({
            diagnostics: [warning, accessibility],
            showInfoAnnotations: false,
            showAccessibilityAnnotations: false,
        });
        expect(out).toHaveLength(1);
        expect(out[0].message).toBe("W");
    });
    it("shows the accessibility heading in the reader's language, keeping the keys that classify it", () => {
        // `source` is reader-facing text, so it follows `uiLocale`. Nothing
        // may key on the English of it: `getDiagnosticHeadingClass` in
        // `@doenet/codemirror` also matches `code` and `markClass`, and those
        // are what still say which level this is once the words change.
        const accessibility: DiagnosticRecord = {
            type: "accessibility",
            level: 1,
            message: "A",
            position: dastPos(1, 1, 1, 2),
        };
        const [lsp] = toAdditionalDiagnosticsForLsp({
            diagnostics: [accessibility],
            showInfoAnnotations: false,
            showAccessibilityAnnotations: true,
            accessibilityHeadings: {
                level1: "Incumplimiento de accesibilidad WCAG AA",
                level2: "Aviso de accesibilidad",
            },
        });
        expect(lsp.source).toBe("Incumplimiento de accesibilidad WCAG AA");
        expect(lsp.code).toBe("accessibility-level-1");
        expect(lsp.markClass).toContain(
            "cm-doenet-accessibility-diagnostic-level-1",
        );
    });

    it("keeps the English headings for a caller that offers no translation", () => {
        const accessibility: DiagnosticRecord = {
            type: "accessibility",
            level: 2,
            message: "A",
            position: dastPos(1, 1, 1, 2),
        };
        const [lsp] = toAdditionalDiagnosticsForLsp({
            diagnostics: [accessibility],
            showInfoAnnotations: false,
            showAccessibilityAnnotations: true,
        });
        expect(lsp.source).toBe("Accessibility alert");
    });
});

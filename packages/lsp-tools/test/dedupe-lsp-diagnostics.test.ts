import { describe, expect, it } from "vitest";
import { DiagnosticSeverity } from "vscode-languageserver-protocol";

import { dedupeLspDiagnostics } from "../src/dedupe-lsp-diagnostics";

function mk(opts: {
    sev?: DiagnosticSeverity;
    msg: string;
    start: [number, number];
    end: [number, number];
}) {
    return {
        severity: opts.sev,
        message: opts.msg,
        range: {
            start: { line: opts.start[0], character: opts.start[1] },
            end: { line: opts.end[0], character: opts.end[1] },
        },
    };
}

describe("dedupeLspDiagnostics", () => {
    it("collapses identical entries from different merge paths", () => {
        // Models the LSP merge bug fixed by this helper: parser DAST
        // error (from `extractDastErrors`) and the worker's `_error`
        // echo (forwarded via `additionalDiagnostics`) arrive as two
        // diagnostics with identical severity/range/message.
        const fromParser = mk({
            sev: DiagnosticSeverity.Error,
            msg: 'Attribute values must be enclosed in quotes: `name="foo"`',
            start: [0, 14],
            end: [0, 17],
        });
        const fromWorker = { ...fromParser, range: { ...fromParser.range } };
        const result = dedupeLspDiagnostics([fromParser, fromWorker]);
        expect(result).toHaveLength(1);
        expect(result[0]).toBe(fromParser); // first-occurrence wins
    });

    it("keeps diagnostics that differ in any one field", () => {
        const a = mk({
            sev: DiagnosticSeverity.Error,
            msg: "X",
            start: [0, 0],
            end: [0, 1],
        });
        // Different message
        const b = mk({
            sev: DiagnosticSeverity.Error,
            msg: "Y",
            start: [0, 0],
            end: [0, 1],
        });
        // Different severity
        const c = mk({
            sev: DiagnosticSeverity.Warning,
            msg: "X",
            start: [0, 0],
            end: [0, 1],
        });
        // Different range start
        const d = mk({
            sev: DiagnosticSeverity.Error,
            msg: "X",
            start: [0, 1],
            end: [0, 1],
        });
        // Different range end
        const e = mk({
            sev: DiagnosticSeverity.Error,
            msg: "X",
            start: [0, 0],
            end: [0, 2],
        });
        expect(dedupeLspDiagnostics([a, b, c, d, e])).toHaveLength(5);
    });

    it("treats two diagnostics that both omit severity as equal", () => {
        // The optional `severity` field collapses to a stable sentinel
        // in the dedupe key so missing-severity duplicates still merge.
        const a = mk({ msg: "X", start: [0, 0], end: [0, 1] });
        const b = mk({ msg: "X", start: [0, 0], end: [0, 1] });
        expect(dedupeLspDiagnostics([a, b])).toHaveLength(1);
    });

    it("does not merge across severity when only one entry omits it", () => {
        const a = mk({ msg: "X", start: [0, 0], end: [0, 1] });
        const b = mk({
            sev: DiagnosticSeverity.Error,
            msg: "X",
            start: [0, 0],
            end: [0, 1],
        });
        expect(dedupeLspDiagnostics([a, b])).toHaveLength(2);
    });

    it("preserves order and is a no-op on an empty input", () => {
        expect(dedupeLspDiagnostics([])).toEqual([]);
        const a = mk({
            sev: DiagnosticSeverity.Error,
            msg: "A",
            start: [0, 0],
            end: [0, 1],
        });
        const b = mk({
            sev: DiagnosticSeverity.Warning,
            msg: "B",
            start: [0, 2],
            end: [0, 3],
        });
        expect(dedupeLspDiagnostics([a, b])).toEqual([a, b]);
    });
});

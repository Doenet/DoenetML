import { describe, expect, it } from "vitest";
import { Diagnostic, DiagnosticSeverity } from "vscode-languageserver-protocol";

import { dedupeLspDiagnostics } from "../src/dedupe-lsp-diagnostics";

function mk(opts: {
    sev?: DiagnosticSeverity;
    msg: string;
    start: [number, number];
    end: [number, number];
    code?: string;
    /** Mirrors what `toAdditionalDiagnosticsForLsp` puts in `data`. */
    args?: Record<string, string | number>;
}) {
    return {
        severity: opts.sev,
        message: opts.msg,
        range: {
            start: { line: opts.start[0], character: opts.start[1] },
            end: { line: opts.end[0], character: opts.end[1] },
        },
        ...(opts.code === undefined ? {} : { code: opts.code }),
        ...(opts.args === undefined ? {} : { data: { args: opts.args } }),
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

    it("fills missing optional metadata from a later duplicate", () => {
        // The two merge paths can carry different optional metadata
        // (e.g. the worker echo could add a quick-fix `data` payload
        // the parser-side copy lacks).  Without this merge the
        // first-occurrence-wins rule would silently drop it.  Identity
        // is *not* preserved when a merge happens — a fresh object is
        // returned so the caller's input isn't mutated.
        const keeper = mk({
            sev: DiagnosticSeverity.Error,
            msg: "X",
            start: [0, 0],
            end: [0, 1],
        });
        const dup: typeof keeper & { data?: unknown; source?: string } = {
            ...mk({
                sev: DiagnosticSeverity.Error,
                msg: "X",
                start: [0, 0],
                end: [0, 1],
            }),
            data: { quickFix: "rename" },
            source: "worker",
        };
        const [merged] = dedupeLspDiagnostics([
            keeper,
            dup,
        ]) as (typeof keeper & {
            data?: unknown;
            source?: string;
        })[];
        expect(merged).not.toBe(keeper);
        expect(merged.data).toEqual({ quickFix: "rename" });
        expect(merged.source).toBe("worker");
        // The originals are untouched.
        expect((keeper as { data?: unknown }).data).toBeUndefined();
    });

    it("keeps keeper's defined metadata when the duplicate also has it", () => {
        // Merge only fills *missing* fields; a defined field on the
        // keeper wins over a different value on the duplicate.
        const keeper: Diagnostic & { source: string } = {
            ...mk({
                sev: DiagnosticSeverity.Error,
                msg: "X",
                start: [0, 0],
                end: [0, 1],
            }),
            source: "parser",
        };
        const dup: Diagnostic & { source: string } = {
            ...mk({
                sev: DiagnosticSeverity.Error,
                msg: "X",
                start: [0, 0],
                end: [0, 1],
            }),
            source: "worker",
        };
        const [result] = dedupeLspDiagnostics([keeper, dup]) as (Diagnostic & {
            source: string;
        })[];
        expect(result).toBe(keeper);
        expect(result.source).toBe("parser");
    });

    it("collapses two renderings of one coded diagnostic", () => {
        // The case the message key cannot see.  A worker diagnostic that
        // has migrated to the catalogs is re-rendered in the reader's
        // `uiLocale` before `additionalDiagnostics` forwards it, while
        // `extractDastErrors` hands over whatever the parser wrote.  Same
        // problem, same span, two languages — one squiggle, so the hover
        // must not stack two messages on it.
        const fromParser = mk({
            sev: DiagnosticSeverity.Error,
            msg: "Invalid attribute `h`.",
            start: [0, 14],
            end: [0, 17],
            code: "doenet-e0042",
            args: { attribute: "h", componentType: "p" },
        });
        const fromWorker = mk({
            sev: DiagnosticSeverity.Error,
            msg: "Atributo no válido `h`.",
            start: [0, 14],
            end: [0, 17],
            code: "doenet-e0042",
            // Same arguments, written in the other order: the fingerprint
            // is over the sorted entries, so property order can't split a
            // pair that agrees on the values.
            args: { componentType: "p", attribute: "h" },
        });
        const result = dedupeLspDiagnostics([fromParser, fromWorker]);
        expect(result).toHaveLength(1);
        expect(result[0]).toBe(fromParser);
    });

    it("keeps two occurrences of one code apart when their arguments differ", () => {
        // A code names a message *template*, not an occurrence of it, and
        // every diagnostic a component's state variables raise is stamped
        // with that component's span.  `<function maxima="(a,1)"
        // minima="(b,2)" />` raises `doenet-w0040` twice at one span with
        // two different messages; both have to reach the author.
        const badMaximum = mk({
            sev: DiagnosticSeverity.Warning,
            msg: "Ignoring non-numerical maximum of function.",
            start: [0, 7],
            end: [0, 65],
            code: "doenet-w0040",
            args: { type: "maximum" },
        });
        const badMinimum = mk({
            sev: DiagnosticSeverity.Warning,
            msg: "Ignoring non-numerical minimum of function.",
            start: [0, 7],
            end: [0, 65],
            code: "doenet-w0040",
            args: { type: "minimum" },
        });
        expect(dedupeLspDiagnostics([badMaximum, badMinimum])).toHaveLength(2);
        // ...and the genuine echo of one of them still collapses.
        expect(
            dedupeLspDiagnostics([
                badMaximum,
                badMinimum,
                mk({
                    sev: DiagnosticSeverity.Warning,
                    msg: "Se ignora el máximo no numérico de la función.",
                    start: [0, 7],
                    end: [0, 65],
                    code: "doenet-w0040",
                    args: { type: "maximum" },
                }),
            ]),
        ).toHaveLength(2);
    });

    it("collapses a coded copy against a not-yet-coded one", () => {
        // What carries the migration: a diagnostic gains its code on one
        // side before the other, and while they still agree on the
        // English the message key holds them together.
        const uncoded = mk({
            sev: DiagnosticSeverity.Error,
            msg: "Invalid attribute `h`.",
            start: [0, 14],
            end: [0, 17],
        });
        const coded = mk({
            sev: DiagnosticSeverity.Error,
            msg: "Invalid attribute `h`.",
            start: [0, 14],
            end: [0, 17],
            code: "doenet-e0042",
        });
        const [merged] = dedupeLspDiagnostics([uncoded, coded]);
        // The keeper picks up the code it was missing, so a later copy
        // that has only the code still finds it.
        expect(merged.code).toBe("doenet-e0042");
        expect(
            dedupeLspDiagnostics([
                uncoded,
                coded,
                mk({
                    sev: DiagnosticSeverity.Error,
                    msg: "Atributo no válido `h`.",
                    start: [0, 14],
                    end: [0, 17],
                    code: "doenet-e0042",
                }),
            ]),
        ).toHaveLength(1);
    });

    it("leaves a key with the entry that claimed it first", () => {
        // Two records at one span can disagree about which entry they
        // belong to: `sharesMessage` matches the first on its message and
        // the second on its code, and folds into the second.  Its message
        // key is already spoken for, and must stay pointing at the record
        // that actually has that message — otherwise a later uncoded copy
        // of the first would be folded into the second instead.
        const first = mk({
            sev: DiagnosticSeverity.Error,
            msg: "Invalid attribute `h`.",
            start: [0, 14],
            end: [0, 17],
            code: "doenet-e0042",
        });
        const second = mk({
            sev: DiagnosticSeverity.Error,
            msg: "Invalid attribute `q`.",
            start: [0, 14],
            end: [0, 17],
            code: "doenet-e0043",
        });
        const sharesMessage = mk({
            sev: DiagnosticSeverity.Error,
            msg: "Invalid attribute `h`.",
            start: [0, 14],
            end: [0, 17],
            code: "doenet-e0043",
        });
        const uncodedCopyOfFirst = {
            ...mk({
                sev: DiagnosticSeverity.Error,
                msg: "Invalid attribute `h`.",
                start: [0, 14],
                end: [0, 17],
            }),
            // Something to merge, so which entry it folded into shows.
            source: "parser",
        };
        const result = dedupeLspDiagnostics([
            first,
            second,
            sharesMessage,
            uncodedCopyOfFirst,
        ]);
        expect(result).toHaveLength(2);
        expect(result[0].source).toBe("parser");
        expect(result[1].source).toBeUndefined();
    });

    it("keeps same-code diagnostics apart when they differ in span or severity", () => {
        // The code is only ever compared within a severity+range pair, so
        // one situation reported at two places stays two diagnostics.
        const first = mk({
            sev: DiagnosticSeverity.Error,
            msg: "Invalid attribute `h`.",
            start: [0, 14],
            end: [0, 17],
            code: "doenet-e0042",
        });
        const elsewhere = mk({
            sev: DiagnosticSeverity.Error,
            msg: "Invalid attribute `q`.",
            start: [3, 2],
            end: [3, 5],
            code: "doenet-e0042",
        });
        const asWarning = mk({
            sev: DiagnosticSeverity.Warning,
            msg: "Invalid attribute `h`.",
            start: [0, 14],
            end: [0, 17],
            code: "doenet-e0042",
        });
        expect(
            dedupeLspDiagnostics([first, elsewhere, asWarning]),
        ).toHaveLength(3);
    });

    it("ignores a `code` that names a category rather than a situation", () => {
        // `toAdditionalDiagnosticsForLsp` labels accessibility records
        // `accessibility-level-1`/`-2`.  That is a severity band shared by
        // every level-1 violation, not an identity, so two different
        // accessibility problems reported on one element must survive.
        const missingDescription = mk({
            sev: DiagnosticSeverity.Warning,
            msg: "Missing a short description.",
            start: [0, 0],
            end: [0, 20],
            code: "accessibility-level-1",
        });
        const lowContrast = mk({
            sev: DiagnosticSeverity.Warning,
            msg: "Title does not have sufficient contrast.",
            start: [0, 0],
            end: [0, 20],
            code: "accessibility-level-1",
        });
        expect(
            dedupeLspDiagnostics([missingDescription, lowContrast]),
        ).toHaveLength(2);
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

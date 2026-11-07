import { describe, expect, it, vi } from "vitest";
import { DiagnosticsManager } from "../../core/DiagnosticsManager";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * DIAG-7 (D38, #2463): an error is decided when the document loads, so an
 * error reported after load is a bug. `DiagnosticsManager` marks the end of
 * load; after it, an error is an assertion in development and tests (the
 * test harness fails a test that leaves one), and a warning in production.
 */
describe("An error after load (DIAG-7) @group4", () => {
    const error = {
        type: "error" as const,
        message: "Something is wrong.",
        position: {
            start: { line: 1, column: 1, offset: 0 },
            end: { line: 1, column: 5, offset: 4 },
        },
    };

    it("is reported as it is before load", () => {
        const manager = new DiagnosticsManager({
            preliminaryDiagnostics: [],
            errorsAfterLoad: "assert",
        });
        expect(manager.addDiagnostic(error)).eq(true);
        expect(manager.errorsReportedAfterLoad).eqls([]);
        expect(manager.diagnostics.map((d) => d.type)).eqls(["error"]);
    });

    it("is recorded, to fail the test, in development and tests", () => {
        const manager = new DiagnosticsManager({
            preliminaryDiagnostics: [],
            errorsAfterLoad: "assert",
        });
        manager.markLoaded();
        expect(manager.isErrorAfterLoad(error)).eq(true);
        expect(manager.addDiagnostic(error)).eq(true);
        expect(manager.errorsReportedAfterLoad).eqls([error]);
        expect(manager.diagnostics.map((d) => d.type)).eqls(["error"]);
    });

    it("is a warning in production, kept once", () => {
        const manager = new DiagnosticsManager({
            preliminaryDiagnostics: [],
            errorsAfterLoad: "warn",
        });
        manager.markLoaded();
        expect(manager.addDiagnostic(error)).eq(true);
        expect(manager.addDiagnostic(error)).eq(false);
        expect(manager.errorsReportedAfterLoad).eqls([]);
        expect(manager.diagnostics).eqls([{ ...error, type: "warning" }]);
    });

    it("given by a condition, is also an assertion or a warning", () => {
        for (const mode of ["assert", "warn"] as const) {
            const manager = new DiagnosticsManager({
                preliminaryDiagnostics: [],
                errorsAfterLoad: mode,
            });
            manager.markLoaded();
            manager.setConditionDiagnostics(1, "c", [error]);
            expect(manager.errorsReportedAfterLoad.length).eq(
                mode === "assert" ? 1 : 0,
            );
            expect(manager.diagnostics.map((d) => d.type)).eqls([
                mode === "assert" ? "error" : "warning",
            ]);
        }
    });

    it("is not one when reported at load and again later", () => {
        for (const mode of ["assert", "warn"] as const) {
            const manager = new DiagnosticsManager({
                preliminaryDiagnostics: [error],
                errorsAfterLoad: mode,
            });
            manager.markLoaded();
            expect(manager.isErrorAfterLoad(error)).eq(false);
            expect(manager.addDiagnostic(error)).eq(false);
            expect(manager.errorsReportedAfterLoad).eqls([]);
            expect(manager.diagnostics).eqls([error]);
        }
    });

    it("is not one when reported at load, after the cap has dropped it", () => {
        for (const mode of ["assert", "warn"] as const) {
            const manager = new DiagnosticsManager({
                preliminaryDiagnostics: [error],
                errorsAfterLoad: mode,
            });
            manager.markLoaded();
            for (let i = 0; i < 1000; i++) {
                manager.addDiagnostic({
                    ...error,
                    type: "warning",
                    message: `w${i}`,
                });
            }
            manager.getDiagnostics();
            expect(manager.isErrorAfterLoad(error)).eq(false);
            expect(manager.addDiagnostic(error)).eq(true);
            expect(manager.errorsReportedAfterLoad).eqls([]);
            expect(manager.diagnostics.at(-1)).eqls(error);
        }
    });

    it("warnings and infos after load are reported as they are", () => {
        const manager = new DiagnosticsManager({
            preliminaryDiagnostics: [],
            errorsAfterLoad: "assert",
        });
        manager.markLoaded();
        manager.addDiagnostic({ ...error, type: "warning" });
        manager.addDiagnostic({ ...error, type: "info", message: "i" });
        expect(manager.errorsReportedAfterLoad).eqls([]);
        expect(manager.diagnostics.map((d) => d.type)).eqls([
            "warning",
            "info",
        ]);
    });
});

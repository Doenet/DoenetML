import { describe, expect, it, vi } from "vitest";
import { DiagnosticsManager } from "../../core/DiagnosticsManager";
import { createTestCore } from "../utils/test-core";
import { getDiagnosticsByType } from "../utils/diagnostics";
import { updateMathInputValue } from "../utils/actions";

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

describe("A scalar tag made from a list the author writes (e0064) @group4", () => {
    async function setup(doenetML: string) {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
        });
        async function text(name: string) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            return stateVariables[await resolvePathToNodeIdx(name)].stateValues
                .text;
        }
        return { core, resolvePathToNodeIdx, text };
    }

    it("is missing, with an info, while a value makes the list hold more than one", async () => {
        const { core, resolvePathToNodeIdx, text } = await setup(`
<mathInput name="n" prefill="1"/>
<mathList name="ml" maxNumber="$n">1 2</mathList>
<p name="p1"><math extend="$ml"/></p>
`);
        expect(await text("p1")).eq("1");
        const d = getDiagnosticsByType(core);
        expect(d.errors).eqls([]);
        expect(d.infos.filter((i) => i.code === "doenet-e0064")).eqls([]);

        await updateMathInputValue({
            latex: "2",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        expect(await text("p1")).eq("＿");
        expect(d.errors).eqls([]);
        expect(d.infos.map((i) => i.code)).contains("doenet-e0064");

        await updateMathInputValue({
            latex: "1",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        expect(await text("p1")).eq("1");
        expect(d.infos.filter((i) => i.code === "doenet-e0064")).eqls([]);
    });

    it("is missing, with an info, when an entry is not read at load", async () => {
        // An entry with a comma, or a math, may be read as several entries,
        // which load does not decide (`listCountAtLoad.ts`), so the count is
        // not fixed by the DoenetML as far as load can tell.
        for (const list of [
            `<mathList name="ml">1,2</mathList>`,
            `<mathList name="ml"><math>1</math><math>2</math></mathList>`,
            `<textList name="ml">a, b</textList>`,
        ]) {
            const scalar = list.startsWith("<textList") ? "text" : "math";
            const { core, text } = await setup(
                `${list}<p name="p1"><${scalar} extend="$ml"/></p>`,
            );
            expect(await text("p1"), list).eq("＿");
            const d = getDiagnosticsByType(core);
            expect(d.errors, list).eqls([]);
            expect(
                d.infos.map((i) => i.code),
                list,
            ).contains("doenet-e0064");
        }
    });

    it("is an error when the list's entries are written", async () => {
        const { core, text } = await setup(`
<mathList name="ml">1 2</mathList>
<p name="p1"><math extend="$ml"/></p>
`);
        await text("p1");
        expect(getDiagnosticsByType(core).errors.map((e) => e.code)).eqls([
            "doenet-e0064",
        ]);
    });
});

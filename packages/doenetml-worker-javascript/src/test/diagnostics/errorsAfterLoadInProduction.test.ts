import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { getDiagnosticsByType } from "../utils/diagnostics";
import { updateBooleanInputValue } from "../utils/actions";
import { takeErrorsReportedAfterLoad } from "../utils/errorsAfterLoad";
import type { ErrorsAfterLoad } from "../../core/DiagnosticsManager";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

// The tag below is made from a list of maths, each of which may be a list
// of several entries, so whether the list holds one is not decided at load
// (`doenet-e0064`, `listEntryCountAtLoad.ts`). It is made only after an
// interaction, so it reports its error then: an error after load, which
// DIAG-7 forbids, standing in here for any such bug.
/**
 * In production (`errorsAfterLoad: "warn"`), an error reported after load is
 * a warning, and the component in error is missing (`＿`) rather than an
 * error box, so a reader never sees an error appear (DIAG-7,
 * `missingInPlaceOfErrorAfterLoad`). That holds also when the composite that
 * makes the `_error` reports its error first, and each time it is made.
 */
describe("An error after load in production @group4", () => {
    async function setup(errorsAfterLoad: ErrorsAfterLoad) {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            errorsAfterLoad,
            doenetML: `<booleanInput name="b"/><mathList name="ml"><math>1</math><math>2</math></mathList>
<p name="p"><conditionalContent><case condition="$b"><math extend="$ml"/></case></conditionalContent></p>`,
        });
        const bIdx = await resolvePathToNodeIdx("b");
        async function show(boolean: boolean) {
            await updateBooleanInputValue({
                boolean,
                componentIdx: bIdx,
                core,
            });
        }
        async function shown() {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const p = stateVariables[await resolvePathToNodeIdx("p")];
            return {
                types: p.activeChildren.map(
                    (child: any) =>
                        stateVariables[child.componentIdx].componentType,
                ),
                text: p.stateValues.text,
            };
        }
        return { core, show, shown };
    }

    it("is a warning, with the component missing", async () => {
        const { core, show, shown } = await setup("warn");
        expect(getDiagnosticsByType(core).errors).eqls([]);

        await show(true);
        expect(await shown()).eqls({ types: ["_missing"], text: "＿" });
        const d = getDiagnosticsByType(core);
        expect(d.errors).eqls([]);
        expect(d.warnings.map((w) => w.code)).eqls(["doenet-e0064"]);

        // made again, it is still missing, with the one warning
        await show(false);
        await show(true);
        expect(await shown()).eqls({ types: ["_missing"], text: "＿" });
        expect(getDiagnosticsByType(core).errors).eqls([]);
        expect(getDiagnosticsByType(core).warnings.map((w) => w.code)).eqls([
            "doenet-e0064",
        ]);
        expect(takeErrorsReportedAfterLoad()).eqls([]);
    });

    it("control: in development and tests, it is an error, recorded", async () => {
        const { core, show, shown } = await setup("assert");
        await show(true);
        expect((await shown()).types).eqls(["_error"]);
        expect(getDiagnosticsByType(core).errors.map((e) => e.code)).eqls([
            "doenet-e0064",
        ]);
        expect(takeErrorsReportedAfterLoad().map((e) => e.code)).eqls([
            "doenet-e0064",
        ]);
    });
});

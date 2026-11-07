import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { updateMathInputValue } from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * A diagnostic's level follows where its condition comes from (D35, DIAG-1,
 * DIAG-2, #2422): a warning when what the author wrote causes it, and an
 * info when a value that can change does, which appears and goes away with
 * the value (B33).
 */

async function setup(doenetML: string) {
    const { core, resolvePathToNodeIdx } = await createTestCore({
        doenetML,
    });

    /** The diagnostics with `code` now, as type and line. */
    function diagnostics(code: string) {
        return (core as any).core.diagnostics
            .filter((d: any) => d.code === code)
            .map((d: any) => ({
                type: d.type,
                line: d.position?.start.line,
            }));
    }

    async function setMath(name: string, latex: string) {
        await updateMathInputValue({
            latex,
            componentIdx: await resolvePathToNodeIdx(name),
            core,
        });
        // diagnostics are decided again when what shows them is
        await core.returnAllStateVariables(false, true);
    }

    return { core, diagnostics, setMath };
}

describe("Warning levels by the source of the condition", () => {
    it("w0027: a circle through a non-numerical point", async () => {
        const { diagnostics, setMath } = await setup(`
<graph>
  <circle through="(x,1) (2,3) (4,1)"/>
</graph>
<mathInput name="a"/>
<graph>
  <circle through="($a,1) (2,3) (4,1)"/>
</graph>
`);
        expect(diagnostics("doenet-w0027")).eqls([
            { type: "warning", line: 3 },
            { type: "info", line: 7 },
        ]);

        await setMath("a", "5");
        expect(diagnostics("doenet-w0027")).eqls([
            { type: "warning", line: 3 },
        ]);

        await setMath("a", "");
        expect(diagnostics("doenet-w0027")).eqls([
            { type: "warning", line: 3 },
            { type: "info", line: 7 },
        ]);
    });
});

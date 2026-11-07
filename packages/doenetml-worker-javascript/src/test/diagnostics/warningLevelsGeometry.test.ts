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
 * the value (B33). The graphical and mathematical components.
 */

async function setup(doenetML: string) {
    const { core, resolvePathToNodeIdx } = await createTestCore({
        doenetML,
    });
    await core.returnAllStateVariables(false, true);

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

/**
 * The common case: a literal on line 3 that stays a warning, and a value
 * from the input `name` on line 5 that is an info while the input holds
 * `bad`, and is gone once it holds `good`, and back with `bad`.
 */
async function checkLiteralAndInput({
    code,
    doenetML,
    name,
    good,
    bad,
}: {
    code: string;
    doenetML: string;
    name: string;
    good: string;
    bad: string;
}) {
    const { diagnostics, setMath } = await setup(doenetML);
    expect(diagnostics(code)).eqls([
        { type: "warning", line: 3 },
        { type: "info", line: 5 },
    ]);

    await setMath(name, good);
    expect(diagnostics(code)).eqls([{ type: "warning", line: 3 }]);

    await setMath(name, bad);
    expect(diagnostics(code)).eqls([
        { type: "warning", line: 3 },
        { type: "info", line: 5 },
    ]);
}

describe("Warning levels by the source of the condition: geometry and math", () => {
    it("w0003: a line through points that depend on its variables", async () => {
        await checkLiteralAndInput({
            code: "doenet-w0003",
            doenetML: `
<graph>
  <line through="(x,1) (2,3)"/>
  <mathInput name="a" prefill="x"/>
  <line through="($a,1) (2,3)"/>
</graph>
`,
            name: "a",
            good: "5",
            bad: "x",
        });
    });

    it("w0004: a line's equation that is not linear", async () => {
        await checkLiteralAndInput({
            code: "doenet-w0004",
            doenetML: `
<graph>
  <line equation="y=x^2"/>
  <mathInput name="a" prefill="x"/>
  <line equation="y=$a x"/>
</graph>
`,
            name: "a",
            good: "2",
            bad: "x",
        });
    });

    it("w0006: a ray whose dimensions don't match", async () => {
        await checkLiteralAndInput({
            code: "doenet-w0006",
            doenetML: `
<graph>
  <ray endpoint="(1,2)" direction="(1,2,3)"/>
  <mathInput name="d" prefill="(1,2,3)"/>
  <ray endpoint="(1,2)" direction="$d"/>
</graph>
`,
            name: "d",
            good: "(3,4)",
            bad: "(1,2,3)",
        });
    });

    it("w0008: a vector whose dimensions don't match", async () => {
        await checkLiteralAndInput({
            code: "doenet-w0008",
            doenetML: `
<graph>
  <vector tail="(1,2)" displacement="(1,2,3)"/>
  <mathInput name="d" prefill="(1,2,3)"/>
  <vector tail="(1,2)" displacement="$d"/>
</graph>
`,
            name: "d",
            good: "(3,4)",
            bad: "(1,2,3)",
        });
    });

    it("w0031: a circle's radius too small for its points", async () => {
        await checkLiteralAndInput({
            code: "doenet-w0031",
            doenetML: `
<graph>
  <circle through="(0,0) (10,0)" radius="1"/>
  <mathInput name="r" prefill="1"/>
  <circle through="(0,0) (10,0)" radius="$r"/>
</graph>
`,
            name: "r",
            good: "6",
            bad: "1",
        });
    });

    it("w0036: a circle with a radius through points that are not numbers", async () => {
        await checkLiteralAndInput({
            code: "doenet-w0036",
            doenetML: `
<graph>
  <circle through="(x,0) (10,0)" radius="6"/>
  <mathInput name="r"/>
  <circle through="(0,0) (10,0)" radius="$r"/>
</graph>
`,
            name: "r",
            good: "6",
            bad: "",
        });
    });

    it("w0040: a function through a point that is not numerical", async () => {
        await checkLiteralAndInput({
            code: "doenet-w0040",
            doenetML: `
<graph>
  <function through="(x,1) (2,3)"/>
  <mathInput name="a"/>
  <function through="($a,1) (2,3)"/>
</graph>
`,
            name: "a",
            good: "5",
            bad: "",
        });
    });

    it("w0042: a function through two points at the same x", async () => {
        await checkLiteralAndInput({
            code: "doenet-w0042",
            doenetML: `
<graph>
  <function through="(1,1) (1,3)"/>
  <mathInput name="a" prefill="1"/>
  <function through="($a,1) (1,3)"/>
</graph>
`,
            name: "a",
            good: "5",
            bad: "1",
        });
    });

    it("w0048: an angle through a point that is not one", async () => {
        await checkLiteralAndInput({
            code: "doenet-w0048",
            doenetML: `
<graph>
  <angle through="(0,1) (0,0), (1,5)"/>
  <mathInput name="a"/>
  <angle through="($a,1) (0,0) (1,5)"/>
</graph>
`,
            name: "a",
            good: "3",
            bad: "",
        });
    });

    it("w0056: iterating a function whose inputs and outputs don't match", async () => {
        await checkLiteralAndInput({
            code: "doenet-w0056",
            doenetML: `
<p>Iterates</p>
<functionIterates function="(x,y)" initialValue="1" numIterates="2"/>
<mathInput name="m" prefill="x"/><function name="g" variables="x y">$m</function>
<functionIterates function="$g" initialValue="(1,2)" numIterates="2"/>
`,
            name: "m",
            good: "(y,x)",
            bad: "x",
        });
    });

    it("w0117: a parameter that does not occur in the pattern", async () => {
        await checkLiteralAndInput({
            code: "doenet-w0117",
            doenetML: `
<p>
  <matchesPattern pattern="ax" parameters="a b">3x</matchesPattern>
  <mathInput name="p" prefill="b"/>
  <matchesPattern pattern="ax" parameters="$p">3x</matchesPattern>
</p>
`,
            name: "p",
            good: "a",
            bad: "b",
        });
    });

    it("w0017: a variable that is not one", async () => {
        await checkLiteralAndInput({
            code: "doenet-w0017",
            doenetML: `
<p>
  <matchesPattern pattern="ax" parameters="2 a">3x</matchesPattern>
  <mathInput name="p" prefill="2"/>
  <matchesPattern pattern="ax" parameters="$p">3x</matchesPattern>
</p>
`,
            name: "p",
            good: "a",
            bad: "2",
        });
    });
});
